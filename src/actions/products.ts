"use server";

import { db, schema } from "@/db";
import { eq, desc, asc, and, like, gt, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export interface ProductFilterOptions {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  categorySlug?: string;
  priceType?: string; // 'gratis' | 'berbayar' | 'all'
  sortBy?: string; // 'populer' | 'terbaru'
}

export async function getProducts(options: ProductFilterOptions | number = {}) {
  try {
    const opts: ProductFilterOptions = typeof options === "number" ? { limit: options } : options;
    const { limit, offset, searchQuery, categorySlug, priceType, sortBy } = opts;

    let whereConditions = [eq(schema.products.isPublished, true)];

    if (searchQuery && searchQuery.trim() !== "") {
      whereConditions.push(like(schema.products.title, `%${searchQuery.trim()}%`));
    }

    if (priceType === "gratis") {
      whereConditions.push(lte(schema.products.discountedPrice, "0"));
    } else if (priceType === "berbayar") {
      whereConditions.push(gt(schema.products.discountedPrice, "0"));
    }

    let query = db
      .select({
        id: schema.products.id,
        categoryId: schema.products.categoryId,
        title: schema.products.title,
        slug: schema.products.slug,
        thumbnailUrl: schema.products.thumbnailUrl,
        levelBadge: schema.products.levelBadge,
        originalPrice: schema.products.originalPrice,
        discountPercent: schema.products.discountPercent,
        discountedPrice: schema.products.discountedPrice,
        totalSales: schema.products.totalSales,
        aboutProduct: schema.products.aboutProduct,
        whatYouGet: schema.products.whatYouGet,
        suitableFor: schema.products.suitableFor,
        liveDemoUrl: schema.products.liveDemoUrl,
        purchaseLinkExternal: schema.products.purchaseLinkExternal,
        isFeatured: schema.products.isFeatured,
        isPublished: schema.products.isPublished,
        orderIndex: schema.products.orderIndex,
        createdAt: schema.products.createdAt,
        updatedAt: schema.products.updatedAt,
        categoryName: schema.categories.name,
        categorySlug: schema.categories.slug,
      })
      .from(schema.products)
      .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id));

    if (categorySlug && categorySlug !== "all") {
      whereConditions.push(eq(schema.categories.slug, categorySlug));
    }

    let finalQuery = query.where(and(...whereConditions));

    if (sortBy === "populer") {
      finalQuery = finalQuery.orderBy(desc(schema.products.totalSales), asc(schema.products.orderIndex)) as any;
    } else {
      finalQuery = finalQuery.orderBy(desc(schema.products.createdAt), asc(schema.products.orderIndex)) as any;
    }

    if (limit) {
      finalQuery = finalQuery.limit(limit) as any;
    }
    if (offset) {
      finalQuery = finalQuery.offset(offset) as any;
    }

    return await finalQuery;
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    return [];
  }
}

export async function getAllProductsAdmin() {
  try {
    return await db
      .select()
      .from(schema.products)
      .orderBy(asc(schema.products.orderIndex), desc(schema.products.createdAt));
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const [product] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.slug, slug))
      .limit(1);

    if (!product) return null;

    const modules = await db
      .select()
      .from(schema.productModules)
      .where(eq(schema.productModules.productId, product.id))
      .orderBy(asc(schema.productModules.orderIndex));

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await db
          .select()
          .from(schema.productLessons)
          .where(eq(schema.productLessons.moduleId, mod.id))
          .orderBy(asc(schema.productLessons.orderIndex));
        return { ...mod, lessons };
      })
    );

    const galleries = await db
      .select()
      .from(schema.productGalleries)
      .where(eq(schema.productGalleries.productId, product.id))
      .orderBy(asc(schema.productGalleries.orderIndex));

    return { ...product, modules: modulesWithLessons, galleries };
  } catch (error) {
    console.error("Error fetching product by slug from DB:", error);
    return null;
  }
}

export async function createProduct(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const levelBadge = (formData.get("levelBadge") as string) || "Semua Level";
    const originalPrice = (formData.get("originalPrice") as string) || "0";
    const discountPercent = parseInt((formData.get("discountPercent") as string) || "0", 10);
    const discountedPrice = (formData.get("discountedPrice") as string) || originalPrice;
    const totalSales = parseInt((formData.get("totalSales") as string) || "0", 10);
    const thumbnailUrl = (formData.get("thumbnailUrl") as string) || "/assets/placeholder.jpg";
    const aboutProduct = formData.get("aboutProduct") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const isPublished = formData.get("isPublished") !== "false";

    const id = `prd-${Date.now()}`;

    await db.insert(schema.products).values({
      id,
      title,
      slug,
      levelBadge,
      originalPrice,
      discountPercent,
      discountedPrice,
      totalSales,
      thumbnailUrl,
      aboutProduct,
      isFeatured,
      isPublished,
      orderIndex: 0,
    });

    revalidatePath("/");
    revalidatePath("/produk");
    revalidatePath("/admin/products");
    return { success: true, id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(schema.products).where(eq(schema.products.id, id));
    revalidatePath("/");
    revalidatePath("/produk");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
