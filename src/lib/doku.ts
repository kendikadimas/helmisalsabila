import crypto from "crypto";

export function getDokuConfig() {
  const clientId = process.env.DOKU_CLIENT_ID?.trim() || "";
  const secretKey = process.env.DOKU_SECRET_KEY?.trim() || "";
  const isProduction = process.env.DOKU_IS_PRODUCTION === "true";
  const baseUrl = isProduction
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";

  return { clientId, secretKey, isProduction, baseUrl };
}

export function generateDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  requestBody,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  requestBody: string;
  secretKey: string;
}): string {
  const digest = crypto
    .createHash("sha256")
    .update(requestBody, "utf8")
    .digest("base64");

  const componentString = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:${requestTarget}`,
    `Digest:${digest}`,
  ].join("\n");

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(componentString, "utf8")
    .digest("base64");

  return `HMACSHA256=${hmac}`;
}

export function verifyDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  requestBody,
  secretKey,
  receivedSignature,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  requestBody: string;
  secretKey: string;
  receivedSignature: string;
}): boolean {
  if (!receivedSignature || !secretKey) return false;

  const expected = generateDokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    requestBody,
    secretKey,
  });

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(receivedSignature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export interface DokuCheckoutParams {
  invoiceNumber: string;
  amount: number;
  itemId: string;
  itemName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  callbackUrl: string;
  callbackUrlCancel: string;
}

export async function createDokuCheckoutPayment(params: DokuCheckoutParams) {
  const { clientId, secretKey, baseUrl } = getDokuConfig();
  if (!clientId || !secretKey) {
    throw new Error(
      "Konfigurasi DOKU (DOKU_CLIENT_ID / DOKU_SECRET_KEY) belum diatur di environment."
    );
  }

  const requestTarget = "/checkout/v1/payment";
  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const payload = {
    order: {
      amount: Math.round(params.amount),
      invoice_number: params.invoiceNumber,
      currency: "IDR",
      callback_url: params.callbackUrl,
      callback_url_cancel: params.callbackUrlCancel,
      callback_url_result: params.callbackUrl,
      language: "ID",
      auto_redirect: true,
      line_items: [
        {
          id: params.itemId.slice(0, 50),
          name: params.itemName.slice(0, 100),
          price: Math.round(params.amount),
          quantity: 1,
        },
      ],
    },
    payment: {
      payment_due_date: 60,
    },
    customer: {
      id: params.customerId,
      name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
      country: "ID",
    },
  };

  const requestBody = JSON.stringify(payload);
  const signature = generateDokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    requestBody,
    secretKey,
  });

  const response = await fetch(`${baseUrl}${requestTarget}`, {
    method: "POST",
    headers: {
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": requestTimestamp,
      Signature: signature,
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errMsg =
      data?.error?.message ||
      (Array.isArray(data?.message) ? data.message.join(", ") : data?.message) ||
      `DOKU API error (${response.status})`;
    throw new Error(errMsg);
  }

  const paymentUrl = data?.response?.payment?.url;
  if (!paymentUrl) {
    throw new Error("DOKU tidak mengembalikan URL pembayaran.");
  }

  return {
    paymentUrl: paymentUrl as string,
    tokenId: (data?.response?.payment?.token_id as string) || null,
    raw: data,
  };
}

