"use server";

import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { countVoucherUsage } from "@/lib/promo";

export interface VoucherItem {
  id: string;
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  quota: number | null;
  used: number;
  startsAt: string; // YYYY-MM-DD (WIB) atau ""
  expiresAt: string;
  isActive: boolean;
}

const toWibDate = (d: Date | null) => (d ? d.toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" }) : "");

type ParsedVoucher = {
  code: string;
  description: string | null;
  type: "percent" | "fixed";
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  quota: number | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
};

function parseForm(formData: FormData): { data?: ParsedVoucher; error?: string } {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,30}$/.test(code)) {
    return { error: "Kode 3-30 karakter: huruf, angka, strip (-) atau underscore (_)." };
  }

  const type = formData.get("type") === "fixed" ? "fixed" : "percent";
  const value = parseInt(String(formData.get("value") || ""), 10);
  if (!Number.isFinite(value) || value <= 0) return { error: "Nilai diskon harus lebih dari 0." };
  if (type === "percent" && value > 100) return { error: "Diskon persen maksimal 100." };

  const optInt = (key: string) => {
    const raw = String(formData.get(key) || "").trim();
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : NaN;
  };
  const minPurchase = optInt("minPurchase") ?? 0;
  const maxDiscount = optInt("maxDiscount");
  const quota = optInt("quota");
  if ([minPurchase, maxDiscount, quota].some((n) => typeof n === "number" && Number.isNaN(n))) {
    return { error: "Minimal belanja, maksimal diskon, dan kuota harus berupa angka positif." };
  }

  const startRaw = String(formData.get("startsAt") || "").trim();
  const endRaw = String(formData.get("expiresAt") || "").trim();
  const startsAt = startRaw ? new Date(`${startRaw}T00:00:00+07:00`) : null;
  const expiresAt = endRaw ? new Date(`${endRaw}T23:59:59+07:00`) : null;
  if ((startsAt && isNaN(startsAt.getTime())) || (expiresAt && isNaN(expiresAt.getTime()))) {
    return { error: "Format tanggal tidak valid." };
  }
  if (startsAt && expiresAt && startsAt > expiresAt) {
    return { error: "Tanggal berakhir harus setelah tanggal mulai." };
  }

  return {
    data: {
      code,
      description: String(formData.get("description") || "").trim().slice(0, 255) || null,
      type,
      value,
      minPurchase: minPurchase as number,
      maxDiscount: type === "percent" ? maxDiscount : null,
      quota,
      startsAt,
      expiresAt,
      isActive: formData.get("isActive") === "on",
    },
  };
}

function revalidate() {
  revalidatePath("/admin/vouchers");
}

export async function getAllVouchersAdmin(): Promise<VoucherItem[]> {
  try {
    const session = await getSession();
    if (!session) return [];
    const rows = await db.select().from(schema.vouchers).orderBy(desc(schema.vouchers.createdAt));
    return await Promise.all(
      rows.map(async (v) => ({
        id: v.id,
        code: v.code,
        description: v.description || "",
        type: v.type,
        value: v.value,
        minPurchase: v.minPurchase,
        maxDiscount: v.maxDiscount,
        quota: v.quota,
        used: await countVoucherUsage(v.code),
        startsAt: toWibDate(v.startsAt),
        expiresAt: toWibDate(v.expiresAt),
        isActive: v.isActive,
      }))
    );
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
}

export async function createVoucher(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const { data, error } = parseForm(formData);
    if (!data) return { success: false, error };

    const [exists] = await db.select({ id: schema.vouchers.id }).from(schema.vouchers).where(eq(schema.vouchers.code, data.code)).limit(1);
    if (exists) return { success: false, error: `Kode ${data.code} sudah dipakai.` };

    await db.insert(schema.vouchers).values({ id: randomUUID(), ...data });
    revalidate();
    return { success: true };
  } catch (error: any) {
    console.error("Error creating voucher:", error);
    return { success: false, error: "Gagal menyimpan voucher. Pastikan SQL patch voucher sudah dijalankan." };
  }
}

export async function updateVoucher(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const { data, error } = parseForm(formData);
    if (!data) return { success: false, error };

    const [dupe] = await db.select({ id: schema.vouchers.id }).from(schema.vouchers).where(eq(schema.vouchers.code, data.code)).limit(1);
    if (dupe && dupe.id !== id) return { success: false, error: `Kode ${data.code} sudah dipakai.` };

    await db.update(schema.vouchers).set(data).where(eq(schema.vouchers.id, id));
    revalidate();
    return { success: true };
  } catch (error: any) {
    console.error("Error updating voucher:", error);
    return { success: false, error: "Gagal memperbarui voucher." };
  }
}

export async function toggleVoucher(id: string, isActive: boolean) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };
    await db.update(schema.vouchers).set({ isActive }).where(eq(schema.vouchers.id, id));
    revalidate();
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling voucher:", error);
    return { success: false, error: "Gagal mengubah status voucher." };
  }
}

export async function deleteVoucher(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };
    await db.delete(schema.vouchers).where(eq(schema.vouchers.id, id));
    revalidate();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting voucher:", error);
    return { success: false, error: "Gagal menghapus voucher." };
  }
}
