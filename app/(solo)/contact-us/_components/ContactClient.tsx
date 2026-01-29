// app/(root)/contact/_components/ContactClient.tsx
"use client";

import { useMemo } from "react";

export default function ContactClient({ primaryCta }: { primaryCta?: boolean }) {
  // ✅ Replace with your real WhatsApp number in international format (no +)
  // Morocco example: +2126xxxxxxxx -> "2126xxxxxxxx"
  const WHATSAPP_NUMBER = "212715120495";

  const waLink = useMemo(() => {
    const message =
      "Salam OMGIL 👋 I need help with: (order / delivery / product question)";
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }, []);

  return (
    <>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition
          ${primaryCta ? "bg-[hsl(178,100%,34%)] hover:opacity-95" : "bg-[hsl(178,100%,34%)] hover:opacity-95 w-full"}
        `}
      >
        WhatsApp us
        <span aria-hidden className="text-white/90">→</span>
      </a>

      {primaryCta && (
        <a
          href="#email"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 border border-gray-200 bg-white hover:bg-gray-50"
        >
          Email
        </a>
      )}
    </>
  );
}
