import { getAllValuePropsAdmin } from "@/actions/worksteps";
import ValuePropsClientManager from "@/components/admin/ValuePropsClientManager";

export default async function AdminValuePropsPage() {
  const items = await getAllValuePropsAdmin();

  return <ValuePropsClientManager initialItems={items} />;
}
