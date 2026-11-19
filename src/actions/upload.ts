"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getSession } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadFileAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file || typeof file === "string") {
      return { success: false, error: "Tidak ada file yang dipilih." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file maksimal 5MB." };
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Gagal mengunggah file." };
  }
}
