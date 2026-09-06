"use server";

import { db, schema } from "@/db";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function getAllTestimonialsAdmin() {
  try {
    return await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.orderIndex), desc(schema.testimonials.createdAt));
  } catch (error) {
    console.error("Error fetching testimonials for admin:", error);
    return [];
  }
}

export async function createTestimonial(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const clientName = formData.get("clientName") as string;
    const clientCompany = formData.get("clientCompany") as string;
    const quote = formData.get("quote") as string;
    const avatarUrl = (formData.get("avatarUrl") as string) || null;
    const companyLogoUrl = (formData.get("companyLogoUrl") as string) || null;
    const rating = parseInt((formData.get("rating") as string) || "5", 10);
    const orderIndex = parseInt((formData.get("orderIndex") as string) || "0", 10);

    const id = `tst-${randomUUID().slice(0, 8)}`;

    await db.insert(schema.testimonials).values({
      id,
      clientName,
      clientCompany: clientCompany || "FOOM",
      avatarUrl: avatarUrl || "/profile-talent.png",
      companyLogoUrl,
      quote,
      rating,
      isActive: true,
      orderIndex,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTestimonial(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const id = formData.get("id") as string;
    const clientName = formData.get("clientName") as string;
    const clientCompany = formData.get("clientCompany") as string;
    const quote = formData.get("quote") as string;
    const avatarUrl = (formData.get("avatarUrl") as string) || null;
    const companyLogoUrl = (formData.get("companyLogoUrl") as string) || null;
    const rating = parseInt((formData.get("rating") as string) || "5", 10);
    const orderIndex = parseInt((formData.get("orderIndex") as string) || "0", 10);

    await db
      .update(schema.testimonials)
      .set({
        clientName,
        clientCompany: clientCompany || "FOOM",
        avatarUrl,
        companyLogoUrl,
        quote,
        rating,
        orderIndex,
      })
      .where(eq(schema.testimonials.id, id));

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: error.message };
  }
}
