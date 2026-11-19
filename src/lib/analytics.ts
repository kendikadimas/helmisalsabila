// GA4 E-commerce event helper

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackBeginCheckout(params: {
  itemId: string;
  itemTitle: string;
  itemType: "product" | "service";
  amount: number;
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      currency: "IDR",
      value: params.amount,
      items: [
        {
          item_id: params.itemId,
          item_name: params.itemTitle,
          item_category: params.itemType,
          price: params.amount,
          quantity: 1,
        },
      ],
    });
  }
}

export function trackPurchase(params: {
  invoiceNumber: string;
  itemId: string;
  itemTitle: string;
  itemType: "product" | "service";
  amount: number;
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "purchase", {
      transaction_id: params.invoiceNumber,
      value: params.amount,
      currency: "IDR",
      items: [
        {
          item_id: params.itemId,
          item_name: params.itemTitle,
          item_category: params.itemType,
          price: params.amount,
          quantity: 1,
        },
      ],
    });
  }
}

