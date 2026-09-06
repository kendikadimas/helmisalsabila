"use server";

import { db, schema } from "@/db";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

// --- WORK STEPS ACTIONS ---
export async function getAllWorkStepsAdmin() {
  try {
    return await db.select().from(schema.workSteps).orderBy(asc(schema.workSteps.orderIndex));
  } catch (error) {
    console.error("Error fetching work steps:", error);
    return [];
  }
}

export async function createWorkStep(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const stepNumber = (formData.get("stepNumber") as string) || "01";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const orderIndex = parseInt((formData.get("orderIndex") as string) || "0", 10);

    const id = `stp-${randomUUID().slice(0, 8)}`;

    await db.insert(schema.workSteps).values({
      id,
      stepNumber,
      title,
      description,
      orderIndex,
    });

    revalidatePath("/");
    revalidatePath("/admin/work-steps");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWorkStep(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const stepNumber = formData.get("stepNumber") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await db
      .update(schema.workSteps)
      .set({ stepNumber, title, description })
      .where(eq(schema.workSteps.id, id));

    revalidatePath("/");
    revalidatePath("/admin/work-steps");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWorkStep(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    await db.delete(schema.workSteps).where(eq(schema.workSteps.id, id));
    revalidatePath("/");
    revalidatePath("/admin/work-steps");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- VALUE PROPOSITIONS ACTIONS ---
export async function getAllValuePropsAdmin() {
  try {
    return await db.select().from(schema.valuePropositions).orderBy(asc(schema.valuePropositions.orderIndex));
  } catch (error) {
    console.error("Error fetching value props:", error);
    return [];
  }
}

export async function createValueProp(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon3dName = (formData.get("icon3dName") as string) || "money-bag";

    const id = `val-${randomUUID().slice(0, 8)}`;

    await db.insert(schema.valuePropositions).values({
      id,
      title,
      description,
      icon3dName,
      orderIndex: 0,
    });

    revalidatePath("/");
    revalidatePath("/admin/value-props");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateValueProp(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon3dName = formData.get("icon3dName") as string;

    await db
      .update(schema.valuePropositions)
      .set({ title, description, icon3dName })
      .where(eq(schema.valuePropositions.id, id));

    revalidatePath("/");
    revalidatePath("/admin/value-props");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteValueProp(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    await db.delete(schema.valuePropositions).where(eq(schema.valuePropositions.id, id));
    revalidatePath("/");
    revalidatePath("/admin/value-props");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
