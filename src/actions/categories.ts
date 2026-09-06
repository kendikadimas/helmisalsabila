"use server";

import { db, schema } from "@/db";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function getAllCategoriesAdmin() {
  try {
    return await db.select().from(schema.categories).orderBy(asc(schema.categories.orderIndex), asc(schema.categories.name));
  } catch (error) {
    console.error("Error fetching categories for admin:", error);
    return [];
  }
}

export async function createCategory(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const name = formData.get("name") as string;
    const type = (formData.get("type") as any) || "article";
    let baseSlug = (formData.get("slug") as string) || slugify(name);
    if (!baseSlug) baseSlug = `category-${Date.now()}`;

    const id = `cat-${randomUUID().slice(0, 8)}`;

    await db.insert(schema.categories).values({
      id,
      name,
      slug: baseSlug,
      type,
      orderIndex: 0,
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/layanan");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    await db.delete(schema.categories).where(eq(schema.categories.id, id));
    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }
}
