"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200">
        {/* handle */}
        <div className="pt-3 flex justify-center">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">
            {title ?? "More"}
          </p>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* content */}
        <div className="px-2 pb-3">{children}</div>
      </div>
    </div>
  );
}
