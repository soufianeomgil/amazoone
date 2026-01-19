"use client";

import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  FacebookIcon,
  EmailIcon,
} from "react-share";
import { X, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ShareItem from "./ShareItem";
import { toast } from "sonner";

interface Props {
  url: string;
  title: string;
  onClose: () => void;
}

const ShareSheet = ({ url, title, onClose }: Props) => {
  const [mounted, setMounted] = useState(false);

  // ✅ mount + lock scroll (works with portal)
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link has been copied")
      onClose()
      return
    } catch (e) {
      console.error("Copy failed:", e);
      onClose();
    }
  };

  // ✅ close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const content = useMemo(() => {
    return (
      <>
        {/* ✅ Overlay (ALWAYS ABOVE EVERYTHING) */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        />

        {/* ✅ DESKTOP: dropdown */}
        <div
          className="
            hidden md:block fixed z-[9999] right-6 top-20 w-[280px]
            rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden
          "
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900">Share this product</h4>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            <WhatsappShareButton url={url} title={title} className="w-full">
              <ShareItem icon={<WhatsappIcon />} label="WhatsApp" />
            </WhatsappShareButton>

            <FacebookShareButton
              url={url}
              // @ts-expect-error react-share types
              quote={title}
              className="w-full"
            >
              <ShareItem icon={<FacebookIcon />} label="Facebook" />
            </FacebookShareButton>

            <EmailShareButton url={url} subject={title} className="w-full">
              <ShareItem icon={<EmailIcon />} label="Email" />
            </EmailShareButton>

            <button onClick={copyLink} className="w-full">
              <ShareItem label="Copy link" icon={<Copy size={16} />} />
            </button>
          </div>
        </div>

        {/* ✅ MOBILE: bottom sheet (Noon-style) */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-[9999]">
          {/* drag handle */}
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/70" />

          <div
            className="
              rounded-t-3xl bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.18)]
              border-t border-gray-100
              px-4 pt-4 pb-6
              animate-in slide-in-from-bottom duration-200
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-gray-900">Share</h4>
                <p className="text-xs text-gray-500 mt-0.5">Send this product to someone</p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <WhatsappShareButton url={url} title={title} className="w-full">
                <ShareItem
                  icon={<WhatsappIcon size={28} className="rounded-full" />}
                  label="WhatsApp"
                />
              </WhatsappShareButton>

              <FacebookShareButton
                url={url}
                // @ts-ignore
                quote={title}
                className="w-full"
              >
                <ShareItem
                  icon={<FacebookIcon size={28} className="rounded-full" />}
                  label="Facebook"
                />
              </FacebookShareButton>

              <EmailShareButton url={url} subject={title} className="w-full">
                <ShareItem
                  icon={<EmailIcon size={28} className="rounded-full" />}
                  label="Email"
                />
              </EmailShareButton>

              <button onClick={copyLink} className="w-full">
                <ShareItem label="Copy link" icon={<Copy size={16} />} />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }, [copyLink, onClose, title, url]);

  if (!mounted) return null;

  // ✅ Portal fixes z-index + stacking-context issues permanently
  return createPortal(content, document.body);
};

export default ShareSheet;
