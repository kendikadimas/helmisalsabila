"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  label?: string;
  className?: string;
  iconType?: "share" | "copy";
  copiedMessage?: string;
}

export default function ShareButton({
  label = "Bagikan",
  className = "",
  iconType = "share",
  copiedMessage = "Link berhasil disalin!",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      title={copied ? copiedMessage : label}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-bold">{copiedMessage}</span>
        </>
      ) : (
        <>
          {iconType === "share" ? (
            <Share2 className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
