import { getArticles, getAllCategories } from "@/actions/articles";
import ArticlesClientManager from "@/components/admin/ArticlesClientManager";

export default async function AdminArticlesPage() {
  const articles = await getArticles();
  const categories = await getAllCategories("article");

  return <ArticlesClientManager initialArticles={articles} categories={categories} />;
}
