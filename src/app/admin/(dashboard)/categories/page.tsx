import { getAllCategoriesAdmin } from "@/actions/categories";
import CategoriesClientManager from "@/components/admin/CategoriesClientManager";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return <CategoriesClientManager initialCategories={categories} />;
}
