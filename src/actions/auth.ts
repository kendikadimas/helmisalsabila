"use server";

import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createSession, deleteSession, getSession, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email dan password wajib diisi." };
    }

    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);

    if (!user) {
      return { success: false, error: "Email atau password salah." };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Email atau password salah." };
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan sistem saat login." };
  }
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  revalidatePath("/");
  redirect("/admin/login");
}

export async function getCurrentUser() {
  return await getSession();
}
