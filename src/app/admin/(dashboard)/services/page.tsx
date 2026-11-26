import { getAllServicesAdmin } from "@/actions/services";
import { getAllCategories } from "@/actions/articles";
import ServicesClientManager from "@/components/admin/ServicesClientManager";

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    getAllServicesAdmin(),
    getAllCategories(),
  ]);

  return <ServicesClientManager initialServices={services} categories={categories} />;
}
