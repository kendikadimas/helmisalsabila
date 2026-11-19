"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

export default function PaymentStatusAnalytics({
  invoiceNumber,
  itemId,
  itemTitle,
  itemType,
  amount,
  status,
}: {
  invoiceNumber: string;
  itemId: string;
  itemTitle: string;
  itemType: "product" | "service";
  amount: number;
  status: string;
}) {
  useEffect(() => {
    if (status === "PAID" && invoiceNumber) {
      trackPurchase({
        invoiceNumber,
        itemId,
        itemTitle,
        itemType,
        amount,
      });
    }
  }, [status, invoiceNumber, itemId, itemTitle, itemType, amount]);

  return null;
}

