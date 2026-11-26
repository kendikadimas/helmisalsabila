import type { Metadata } from "next";
import { getCustomerDashboardData } from "@/actions/customer";
import { getSiteSettings } from "@/actions/settings";
import CustomerDashboardClient from "@/components/CustomerDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Produk Saya",
  description: "Akses seluruh produk digital, materi kurikulum, dan riwayat transaksi Anda.",
};

export default async function CustomerDashboardPage() {
  const [{ session, orders }, settings] = await Promise.all([
    getCustomerDashboardData(),
    getSiteSettings(),
  ]);

  const contactPhone = settings?.contactPhone || "+6269233221";

  return (
    <CustomerDashboardClient
      session={session}
      orders={orders}
      contactPhone={contactPhone}
    />
  );
}
