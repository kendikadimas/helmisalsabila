// Promo Code / Discount Voucher Engine

export interface PromoResult {
  valid: boolean;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  message: string;
}

const ACTIVE_PROMO_CODES: Record<
  string,
  { type: "percent" | "fixed"; value: number; label: string }
> = {
  DISKON10: { type: "percent", value: 10, label: "Diskon 10%" },
  HELMI20: { type: "percent", value: 20, label: "Diskon Spesial 20%" },
  FLASH30: { type: "percent", value: 30, label: "Flash Sale 30%" },
  HEMAT50: { type: "percent", value: 50, label: "Diskon 50%" },
  GRATISONGKIR: { type: "percent", value: 10, label: "Potongan 10%" },
};

export function validatePromoCode(rawCode: string, originalAmount: number): PromoResult {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) {
    return { valid: false, code: "", message: "Kode promo tidak boleh kosong." };
  }

  const promo = ACTIVE_PROMO_CODES[code];
  if (!promo) {
    return {
      valid: false,
      code,
      message: "Kode promo tidak ditemukan atau sudah tidak berlaku.",
    };
  }

  let discountAmount = 0;
  if (promo.type === "percent") {
    discountAmount = Math.round((originalAmount * promo.value) / 100);
  } else {
    discountAmount = Math.min(promo.value, originalAmount);
  }

  const finalAmount = Math.max(1000, originalAmount - discountAmount); // Minimum Rp1.000 for DOKU transaction

  return {
    valid: true,
    code,
    discountAmount,
    discountPercent: promo.type === "percent" ? promo.value : undefined,
    finalAmount,
    message: `Kupon ${code} aktif: Hemat ${promo.label}!`,
  };
}
