import { getAllVouchersAdmin } from "@/actions/vouchers";
import VouchersClientManager from "@/components/admin/VouchersClientManager";

export default async function AdminVouchersPage() {
  const vouchers = await getAllVouchersAdmin();
  return <VouchersClientManager initialVouchers={vouchers} />;
}
