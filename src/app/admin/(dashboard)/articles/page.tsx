import { getArticles, getAllCategories } from "@/actions/articles";
import ArticlesClientManager from "@/components/admin/ArticlesClientManager";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getAllCategories(),
  ]);

  return <ArticlesClientManager initialArticles={articles} categories={categories} />;
}
