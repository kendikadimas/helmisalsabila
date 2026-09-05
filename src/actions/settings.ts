"use server";

import { db, schema } from "@/db";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getSiteSettings() {
  try {
    const [settings] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 1)).limit(1);
    return settings || null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function getTestimonials() {
  try {
    return await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.isActive, true))
      .orderBy(asc(schema.testimonials.orderIndex));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function getWorkSteps() {
  try {
    return await db.select().from(schema.workSteps).orderBy(asc(schema.workSteps.orderIndex));
  } catch (error) {
    console.error("Error fetching work steps:", error);
    return [];
  }
}

export async function getValuePropositions() {
  try {
    return await db.select().from(schema.valuePropositions).orderBy(asc(schema.valuePropositions.orderIndex));
  } catch (error) {
    console.error("Error fetching value propositions:", error);
    return [];
  }
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactAddress = formData.get("contactAddress") as string;
    const saweriaUrl = formData.get("saweriaUrl") as string;

    await db
      .update(schema.siteSettings)
      .set({
        heroTitle,
        heroSubtitle,
        contactPhone,
        contactAddress,
        saweriaUrl,
      })
      .where(eq(schema.siteSettings.id, 1));

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
