"use client";

import { useState, useRef } from "react";
import { Upload, Check, Loader2, Image as ImageIcon, X } from "lucide-react";
import { uploadFileAction } from "@/actions/upload";

interface ImageUploaderProps {
  name: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
}

export default function ImageUploader({
  name,
  label,
  defaultValue = "",
  placeholder = "https://... atau pilih upload file",
}: ImageUploaderProps) {
  const [url, setUrl] = useState<string>(defaultValue || "");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadFileAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setUrl(res.url);
    } else {
      setError(res.error || "Gagal mengunggah file.");
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-slate-700 font-medium text-xs sm:text-sm block">{label}</label>}

      <div className="flex gap-2 items-center">
        <input
          type="text"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-xs sm:text-sm transition-colors"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Upload</span>
            </>
          )}
        </button>

        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="p-2.5 sm:p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
            title="Hapus gambar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      {url && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-mono text-slate-500 truncate block">{url}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Gambar terpasang
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
