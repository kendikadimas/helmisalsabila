"use server";

import { db, schema } from "@/db";
import { eq, desc, asc, and, like, gt, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export interface ServiceFilterOptions {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  categorySlug?: string;
  priceType?: string; // 'gratis' | 'berbayar' | 'all'
  sortBy?: string; // 'populer' | 'terbaru'
}

export async function getServices(options: ServiceFilterOptions | number = {}) {
  try {
    const opts: ServiceFilterOptions = typeof options === "number" ? { limit: options } : options;
    const { limit, offset, searchQuery, categorySlug, priceType, sortBy } = opts;

    let whereConditions = [eq(schema.services.isActive, true)];

    if (searchQuery && searchQuery.trim() !== "") {
      whereConditions.push(like(schema.services.title, `%${searchQuery.trim()}%`));
    }

    if (priceType === "gratis") {
      whereConditions.push(lte(schema.services.priceStartingAt, "0"));
    } else if (priceType === "berbayar") {
      whereConditions.push(gt(schema.services.priceStartingAt, "0"));
    }

    let query = db
      .select({
        id: schema.services.id,
        categoryId: schema.services.categoryId,
        title: schema.services.title,
        slug: schema.services.slug,
        thumbnailUrl: schema.services.thumbnailUrl,
        iconName: schema.services.iconName,
        shortDescription: schema.services.shortDescription,
        fullDescription: schema.services.fullDescription,
        features: schema.services.features,
        toolsUsed: schema.services.toolsUsed,
        outputsReceived: schema.services.outputsReceived,
        targetAudience: schema.services.targetAudience,
        priceStartingAt: schema.services.priceStartingAt,
        isFeatured: schema.services.isFeatured,
        isActive: schema.services.isActive,
        orderIndex: schema.services.orderIndex,
        viewsCount: schema.services.viewsCount,
        createdAt: schema.services.createdAt,
        updatedAt: schema.services.updatedAt,
        categoryName: schema.categories.name,
        categorySlug: schema.categories.slug,
      })
      .from(schema.services)
      .leftJoin(schema.categories, eq(schema.services.categoryId, schema.categories.id));

    if (categorySlug && categorySlug !== "all") {
      whereConditions.push(eq(schema.categories.slug, categorySlug));
    }

    let finalQuery = query.where(and(...whereConditions));

    if (sortBy === "populer") {
      finalQuery = finalQuery.orderBy(desc(schema.services.viewsCount), asc(schema.services.orderIndex)) as any;
    } else {
      finalQuery = finalQuery.orderBy(desc(schema.services.createdAt), asc(schema.services.orderIndex)) as any;
    }

    if (limit) {
      finalQuery = finalQuery.limit(limit) as any;
    }
    if (offset) {
      finalQuery = finalQuery.offset(offset) as any;
    }

    return await finalQuery;
  } catch (error) {
    console.error("Error fetching services from DB:", error);
    return [];
  }
}

export async function getAllServicesAdmin() {
  try {
    return await db
      .select()
      .from(schema.services)
      .orderBy(asc(schema.services.orderIndex), desc(schema.services.createdAt));
  } catch (error) {
    console.error("Error fetching admin services:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const [service] = await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.slug, slug))
      .limit(1);

    if (!service) return null;

    // Increment view count dynamically in database
    await db
      .update(schema.services)
      .set({ viewsCount: (service.viewsCount || 0) + 1 })
      .where(eq(schema.services.id, service.id));

    const galleries = await db
      .select()
      .from(schema.serviceGalleries)
      .where(eq(schema.serviceGalleries.serviceId, service.id))
      .orderBy(asc(schema.serviceGalleries.orderIndex));

    return { ...service, galleries };
  } catch (error) {
    console.error("Error fetching service by slug from DB:", error);
    return null;
  }
}

export async function createService(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const shortDescription = formData.get("shortDescription") as string;
    const fullDescription = formData.get("fullDescription") as string;
    const thumbnailUrl = (formData.get("thumbnailUrl") as string) || "/assets/placeholder.jpg";
    const categoryId = (formData.get("categoryId") as string) || null;
    const priceStartingAt = formData.get("priceStartingAt") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const isActive = formData.get("isActive") !== "false";

    const id = `srv-${Date.now()}`;

    await db.insert(schema.services).values({
      id,
      title,
      slug,
      shortDescription,
      fullDescription,
      thumbnailUrl,
      categoryId,
      priceStartingAt: priceStartingAt ? priceStartingAt : null,
      isFeatured,
      isActive,
      orderIndex: 0,
      viewsCount: 0,
    });

    revalidatePath("/");
    revalidatePath("/layanan");
    revalidatePath("/admin/services");
    return { success: true, id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const fullDescription = formData.get("fullDescription") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const priceStartingAt = formData.get("priceStartingAt") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const isActive = formData.get("isActive") !== "false";

    await db
      .update(schema.services)
      .set({
        title,
        slug,
        shortDescription,
        fullDescription,
        thumbnailUrl,
        priceStartingAt: priceStartingAt ? priceStartingAt : null,
        isFeatured,
        isActive,
      })
      .where(eq(schema.services.id, id));

    revalidatePath("/");
    revalidatePath("/layanan");
    revalidatePath(`/layanan/${slug}`);
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteService(id: string) {
  try {
    await db.delete(schema.services).where(eq(schema.services.id, id));
    revalidatePath("/");
    revalidatePath("/layanan");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
