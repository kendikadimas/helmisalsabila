import { getAllServicesAdmin } from "@/actions/services";
import ServicesClientManager from "@/components/admin/ServicesClientManager";

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin();

  return <ServicesClientManager initialServices={services} />;
}
