import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resolveItemPrice, validatePromoCode } from "@/lib/promo";

const Schema = z.object({
  code: z.string().trim().min(1).max(50),
  itemType: z.enum(["product", "service"]),
  itemId: z.string().min(1).max(36),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = checkRateLimit(`promo:${ip}`, { maxRequests: 15, windowSeconds: 60 });
  if (!limit.allowed) {
    return NextResponse.json(
      { valid: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${limit.resetInSeconds} detik.` },
      { status: 429 }
    );
  }

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ valid: false, message: "Permintaan tidak valid." }, { status: 400 });
  }

  // Harga selalu dihitung dari database, bukan dari klien.
  const item = await resolveItemPrice(parsed.data.itemType, parsed.data.itemId);
  if (!item || item.amount <= 0) {
    return NextResponse.json({ valid: false, message: "Item tidak ditemukan." }, { status: 404 });
  }

  const result = await validatePromoCode(parsed.data.code, item.amount);
  return NextResponse.json(result);
}
