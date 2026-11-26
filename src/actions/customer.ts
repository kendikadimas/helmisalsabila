"use server";

import { db, schema } from "@/db";
import { eq, and, or, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  createCustomerSession,
  deleteCustomerSession,
  getCustomerSession,
} from "@/lib/customer-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function customerLoginAction(formData: FormData) {
  try {
    const email = ((formData.get("email") as string) || "").trim();
    const invoiceNumber = ((formData.get("invoiceNumber") as string) || "").trim().toUpperCase();

    if (!email || !invoiceNumber) {
      return {
        success: false,
        error: "Email dan Nomor Invoice wajib diisi.",
      };
    }

    const rateLimit = checkRateLimit(`customer-login:${email.toLowerCase()}`, {
      maxRequests: 10,
      windowSeconds: 15 * 60,
    });
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${Math.ceil(rateLimit.resetInSeconds / 60)} menit.`,
      };
    }

    const [matchedOrder] = await db
      .select()
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.invoiceNumber, invoiceNumber),
          or(
            eq(schema.orders.customerEmail, email),
            eq(schema.orders.customerEmail, email.toLowerCase())
          )
        )
      )
      .limit(1);

    if (!matchedOrder) {
      return {
        success: false,
        error: "Kombinasi Email dan Nomor Invoice tidak ditemukan. Pastikan data sesuai saat checkout.",
      };
    }

    await createCustomerSession({
      email: matchedOrder.customerEmail.toLowerCase(),
      name: matchedOrder.customerName,
      verifiedPaid: matchedOrder.status === "PAID",
      verifiedInvoice: matchedOrder.invoiceNumber,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Terjadi kesalahan saat masuk ke dashboard.",
    };
  }
}

export async function customerLogoutAction() {
  await deleteCustomerSession();
  revalidatePath("/dashboard");
  return { success: true };
}

export interface CustomerOwnedOrder {
  id: string;
  invoiceNumber: string;
  itemType: "product" | "service";
  itemId: string;
  itemTitle: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  paymentUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  slug: string | null;
  thumbnailUrl: string | null;
  digitalAccessUrl: string | null;
  modules: {
    id: string;
    moduleNumber: string;
    title: string;
    lessons: { id: string; title: string }[];
  }[];
}

export async function getCustomerDashboardData() {
  const session = await getCustomerSession();
  if (!session) {
    return { session: null, orders: [] as CustomerOwnedOrder[] };
  }

  // Security: If user logged in using an unpaid/pending invoice, ONLY return that specific invoice
  // to prevent an attacker from creating a free PENDING order with someone else's email to view their PAID products.
  const rawOrders = session.verifiedPaid
    ? await db
        .select()
        .from(schema.orders)
        .where(
          or(
            eq(schema.orders.customerEmail, session.email),
            eq(schema.orders.customerEmail, session.email.toLowerCase())
          )
        )
        .orderBy(desc(schema.orders.createdAt))
    : await db
        .select()
        .from(schema.orders)
        .where(
          and(
            eq(schema.orders.invoiceNumber, session.verifiedInvoice),
            or(
              eq(schema.orders.customerEmail, session.email),
              eq(schema.orders.customerEmail, session.email.toLowerCase())
            )
          )
        )
        .limit(1);

  const enriched: CustomerOwnedOrder[] = [];

  for (const ord of rawOrders) {
    let slug: string | null = null;
    let thumbnailUrl: string | null = null;
    let digitalAccessUrl: string | null = null;
    let modules: CustomerOwnedOrder["modules"] = [];

    if (ord.itemType === "product") {
      const [prod] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, ord.itemId))
        .limit(1);

      if (prod) {
        slug = prod.slug;
        const rawThumb = prod.thumbnailUrl || "";
        thumbnailUrl =
          !rawThumb || rawThumb.includes("placeholder")
            ? "/assets/product.png"
            : rawThumb.includes("product-branding-builder")
              ? "/assets/product.png"
              : rawThumb.includes("product-150-ideas")
                ? "/assets/product2.png"
                : rawThumb.includes("product-digital-ideas")
                  ? "/assets/product3.png"
                  : rawThumb;

        if (ord.status === "PAID") {
          digitalAccessUrl = prod.digitalAccessUrl || prod.purchaseLinkExternal || prod.liveDemoUrl || null;

          const mods = await db
            .select()
            .from(schema.productModules)
            .where(eq(schema.productModules.productId, prod.id))
            .orderBy(asc(schema.productModules.orderIndex));

          modules = await Promise.all(
            mods.map(async (m) => {
              const lsns = await db
                .select({ id: schema.productLessons.id, title: schema.productLessons.title })
                .from(schema.productLessons)
                .where(eq(schema.productLessons.moduleId, m.id))
                .orderBy(asc(schema.productLessons.orderIndex));
              return {
                id: m.id,
                moduleNumber: m.moduleNumber,
                title: m.title,
                lessons: lsns,
              };
            })
          );
        }
      }
    } else {
      const [srv] = await db
        .select({ slug: schema.services.slug, thumbnailUrl: schema.services.thumbnailUrl })
        .from(schema.services)
        .where(eq(schema.services.id, ord.itemId))
        .limit(1);
      if (srv) {
        slug = srv.slug;
        thumbnailUrl = srv.thumbnailUrl;
      }
    }

    enriched.push({
      id: ord.id,
      invoiceNumber: ord.invoiceNumber,
      itemType: ord.itemType as "product" | "service",
      itemId: ord.itemId,
      itemTitle: ord.itemTitle,
      amount: parseFloat(String(ord.amount || 0)),
      status: ord.status as "PENDING" | "PAID" | "FAILED" | "EXPIRED",
      paymentUrl: ord.paymentUrl,
      createdAt: ord.createdAt ? new Date(ord.createdAt).toISOString() : new Date().toISOString(),
      paidAt: ord.paidAt ? new Date(ord.paidAt).toISOString() : null,
      slug,
      thumbnailUrl,
      digitalAccessUrl,
      modules,
    });
  }

  return { session, orders: enriched };
}
