import type { MetadataRoute } from "next";
import { getArticles } from "@/actions/articles";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://helmisalsabila.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/produk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const [articles, services, products] = await Promise.all([
      getArticles({ limit: 100 }),
      getServices({ limit: 100 }),
      getProducts({ limit: 100 }),
    ]);

    const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const serviceUrls: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${baseUrl}/layanan/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/produk/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...serviceUrls, ...productUrls, ...articleUrls];
  } catch {
    return staticRoutes;
  }
}
