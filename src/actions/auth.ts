"use server";

import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createSession, deleteSession, getSession, verifyPassword, hashPassword } from "@/lib/auth";
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

export async function changePasswordAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login kembali." };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Semua kolom password wajib diisi." };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Password baru minimal 6 karakter." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi password baru tidak cocok." };
    }

    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, session.id)).limit(1);
    if (!user) {
      return { success: false, error: "User tidak ditemukan." };
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Password saat ini salah." };
    }

    const newHash = await hashPassword(newPassword);
    await db.update(schema.users).set({ passwordHash: newHash }).where(eq(schema.users.id, user.id));

    revalidatePath("/admin/settings");
    return { success: true, message: "Password berhasil diperbarui!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengubah password." };
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
