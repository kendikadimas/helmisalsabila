"use server";

import { db, schema } from "@/db";
import { eq, desc, asc, and, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calculateReadingTime, slugify } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export interface ArticleFilterOptions {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  categorySlug?: string;
  tagSlug?: string;
}

export async function getArticles(options: ArticleFilterOptions | number = {}) {
  try {
    const opts: ArticleFilterOptions = typeof options === "number" ? { limit: options } : options;
    const { limit, offset, searchQuery, categorySlug } = opts;

    let whereConditions = [eq(schema.articles.isPublished, true)];

    if (searchQuery && searchQuery.trim() !== "") {
      whereConditions.push(like(schema.articles.title, `%${searchQuery.trim()}%`));
    }

    let query = db
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        slug: schema.articles.slug,
        excerpt: schema.articles.excerpt,
        featuredImage: schema.articles.featuredImage,
        readingTimeMin: schema.articles.readingTimeMin,
        viewsCount: schema.articles.viewsCount,
        isPopular: schema.articles.isPopular,
        isTrending: schema.articles.isTrending,
        trendingRank: schema.articles.trendingRank,
        publishedAt: schema.articles.publishedAt,
        category: schema.categories.name,
        categorySlug: schema.categories.slug,
      })
      .from(schema.articles)
      .leftJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id));

    if (categorySlug && categorySlug !== "all") {
      whereConditions.push(eq(schema.categories.slug, categorySlug));
    }

    let finalQuery = query.where(and(...whereConditions)).orderBy(desc(schema.articles.publishedAt));

    if (limit) {
      finalQuery = finalQuery.limit(limit) as any;
    }
    if (offset) {
      finalQuery = finalQuery.offset(offset) as any;
    }

    return await finalQuery;
  } catch (error) {
    console.error("Error fetching articles from DB:", error);
    return [];
  }
}

export async function getPopularArticles() {
  try {
    return await db
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        slug: schema.articles.slug,
        excerpt: schema.articles.excerpt,
        featuredImage: schema.articles.featuredImage,
        publishedAt: schema.articles.publishedAt,
      })
      .from(schema.articles)
      .where(and(eq(schema.articles.isPublished, true), eq(schema.articles.isPopular, true)))
      .limit(2);
  } catch (error) {
    console.error("Error fetching popular articles:", error);
    return [];
  }
}

export async function getTrendingArticles() {
  try {
    return await db
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        slug: schema.articles.slug,
        trendingRank: schema.articles.trendingRank,
        publishedAt: schema.articles.publishedAt,
      })
      .from(schema.articles)
      .where(and(eq(schema.articles.isPublished, true), eq(schema.articles.isTrending, true)))
      .orderBy(asc(schema.articles.trendingRank))
      .limit(5);
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const [article] = await db
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        slug: schema.articles.slug,
        excerpt: schema.articles.excerpt,
        content: schema.articles.content,
        featuredImage: schema.articles.featuredImage,
        readingTimeMin: schema.articles.readingTimeMin,
        viewsCount: schema.articles.viewsCount,
        publishedAt: schema.articles.publishedAt,
        authorName: schema.users.name,
        authorAvatar: schema.users.avatarUrl,
      })
      .from(schema.articles)
      .leftJoin(schema.users, eq(schema.articles.authorId, schema.users.id))
      .where(eq(schema.articles.slug, slug))
      .limit(1);

    if (!article) return null;

    // Increment view count dynamically in database
    await db
      .update(schema.articles)
      .set({ viewsCount: (article.viewsCount || 0) + 1 })
      .where(eq(schema.articles.id, article.id));

    return article;
  } catch (error) {
    console.error("Error fetching article by slug from DB:", error);
    return null;
  }
}

export async function getAllTags() {
  try {
    return await db.select().from(schema.tags).orderBy(asc(schema.tags.name));
  } catch (error) {
    console.error("Error fetching tags from DB:", error);
    return [];
  }
}

export async function getAllCategories(type?: "service" | "product" | "article" | "general") {
  try {
    let query = db.select().from(schema.categories);
    if (type) {
      query = query.where(eq(schema.categories.type, type)) as any;
    }
    return await query.orderBy(asc(schema.categories.orderIndex));
  } catch (error) {
    console.error("Error fetching categories from DB:", error);
    return [];
  }
}

export async function createArticle(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const featuredImage = (formData.get("featuredImage") as string) || "/assets/placeholder.jpg";
    const categoryId = (formData.get("categoryId") as string) || null;
    const isPublished = formData.get("isPublished") === "true";
    const isPopular = formData.get("isPopular") === "true";
    const isTrending = formData.get("isTrending") === "true";
    const trendingRank = formData.get("trendingRank") ? parseInt(formData.get("trendingRank") as string, 10) : null;

    const readingTimeMin = calculateReadingTime(content);
    const id = `art-${Date.now()}`;

    await db.insert(schema.articles).values({
      id,
      authorId: session.id,
      categoryId,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      readingTimeMin,
      viewsCount: 0,
      isPopular,
      isTrending,
      trendingRank,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/articles");
    return { success: true, id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.delete(schema.articles).where(eq(schema.articles.id, id));
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/articles");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
