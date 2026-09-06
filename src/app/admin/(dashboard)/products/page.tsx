import { getAllProductsAdmin } from "@/actions/products";
import ProductsClientManager from "@/components/admin/ProductsClientManager";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return <ProductsClientManager initialProducts={products} />;
}
