import nodemailer from "nodemailer";
import { formatRupiah } from "@/lib/utils";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site-config";

interface OrderEmailData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  itemTitle: string;
  itemType: "product" | "service";
  amount: number;
  paidAt?: Date | null;
  digitalAccessUrl?: string | null;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendOrderPaidEmail(data: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      `[Email Service] SMTP not configured in .env. Skipping email delivery for invoice ${data.invoiceNumber}.`
    );
    return false;
  }

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || CONTACT_EMAIL;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Helmi Salsabila";
  const formattedAmount = formatRupiah(data.amount);

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8; }
    .header p { margin: 8px 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 32px 24px; }
    .status-badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #15803d; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 20px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    .detail-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .detail-table td:last-child { text-align: right; font-weight: 600; color: #0f172a; }
    .total-row td { border-bottom: none; font-size: 15px; font-weight: 700; color: #0f172a; padding-top: 16px; }
    .btn { display: inline-block; padding: 12px 24px; background: #0284c7; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 13px; margin-top: 24px; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${siteName}</h1>
      <p>Konfirmasi Pembayaran Berhasil</p>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="status-badge">LUNAS / BERHASIL</span>
      </div>
      <p style="margin: 0 0 16px; font-size: 14px;">Halo <strong>${data.customerName}</strong>,</p>
      <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.6; color: #475569;">
        Terima kasih atas pesanan Anda. Pembayaran transaksi DOKU Anda telah kami terima dan diverifikasi. Berikut rincian transaksi:
      </p>

      <table class="detail-table">
        <tr>
          <td style="color: #64748b;">No. Invoice</td>
          <td style="font-family: monospace;">${data.invoiceNumber}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">Item</td>
          <td>${data.itemTitle}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">Kategori</td>
          <td>${data.itemType === "product" ? "Produk Digital" : "Layanan Konsultasi"}</td>
        </tr>
        <tr class="total-row">
          <td>Total Pembayaran</td>
          <td style="color: #059669;">${formattedAmount}</td>
        </tr>
      </table>

      ${
        data.digitalAccessUrl
          ? `
      <div style="text-align: center; margin-top: 28px;">
        <a href="${data.digitalAccessUrl}" class="btn">Akses / Unduh Produk</a>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">Atau copy link: ${data.digitalAccessUrl}</p>
      </div>`
          : ""
      }
      <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 12px; color: #475569; margin: 0 0 8px;">
          Anda dapat mengakses seluruh produk yang dimiliki kapan saja melalui Dashboard Produk Saya:
        </p>
        <a href="${SITE_URL}/dashboard" style="color: #0284c7; font-weight: 600; font-size: 12px;">
          Buka Dashboard Produk Saya (${SITE_URL}/dashboard)
        </a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">Email ini dikirim otomatis oleh sistem ${siteName}. Jika ada pertanyaan, hubungi via WhatsApp resmi kami.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"${siteName}" <${fromEmail}>`,
      to: data.customerEmail,
      subject: `[LUNAS] Konfirmasi Pembayaran ${data.invoiceNumber} - ${data.itemTitle}`,
      html,
    });
    console.log(`[Email Service] Confirmation email sent successfully to ${data.customerEmail}`);
    return true;
  } catch (error: any) {
    console.error("[Email Service] Failed to send email:", error.message);
    return false;
  }
}

export async function sendAdminNewOrderNotification(data: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || CONTACT_EMAIL;
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || CONTACT_EMAIL;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Helmi Salsabila";
  const formattedAmount = formatRupiah(data.amount);

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; }
    .header { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .amount { font-size: 24px; font-weight: 800; color: #059669; margin: 12px 0; }
    .table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">💰 Pesanan Baru Berhasil Lunas!</div>
    <div class="amount">${formattedAmount}</div>
    <table class="table">
      <tr><td>No. Invoice</td><td><strong>${data.invoiceNumber}</strong></td></tr>
      <tr><td>Item</td><td>${data.itemTitle} (${data.itemType})</td></tr>
      <tr><td>Pembeli</td><td>${data.customerName}</td></tr>
      <tr><td>Email</td><td>${data.customerEmail}</td></tr>
      <tr><td>Waktu</td><td>${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</td></tr>
    </table>
    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      Buka panel admin untuk detail: <a href="${SITE_URL}/admin/orders">Dashboard Orders</a>
    </p>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"${siteName} System" <${fromEmail}>`,
      to: adminEmail,
      subject: `[PENJUALAN BARU] ${data.itemTitle} - ${formattedAmount} (${data.invoiceNumber})`,
      html,
    });
    return true;
  } catch (error: any) {
    console.error("[Email Service] Failed to notify admin:", error.message);
    return false;
  }
}


