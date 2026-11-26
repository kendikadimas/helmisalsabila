import { getAllProductsAdmin } from "@/actions/products";
import { getAllCategories } from "@/actions/articles";
import ProductsClientManager from "@/components/admin/ProductsClientManager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategories(),
  ]);

  return <ProductsClientManager initialProducts={products} categories={categories} />;
}
