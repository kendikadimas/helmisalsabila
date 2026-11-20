import { getAllOrdersAdmin } from "@/actions/orders";
import OrdersClientManager from "@/components/admin/OrdersClientManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  return <OrdersClientManager initialOrders={orders as any} />;
}
