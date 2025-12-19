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
import { useEffect } from "react";
import ShareItem from "./ShareItem";

interface Props {
  url: string;
  title: string;
  onClose: () => void;
}

const ShareSheet = ({ url, title, onClose }: Props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30"
      />

      {/* Desktop Dropdown */}
      <div
        className="hidden md:block fixed z-50 right-6 top-20 w-[260px]
        rounded-lg bg-white shadow-lg border p-4"
      >
        <h4 className="text-sm font-semibold mb-3">Share this product</h4>

        <div className="space-y-2">
          <WhatsappShareButton url={url} title={title} className="w-full">
            <ShareItem icon={<WhatsappIcon />} label="WhatsApp" />
          </WhatsappShareButton>

          <FacebookShareButton url={url} quote={title} className="w-full">
            <ShareItem icon={<FacebookIcon />} label="Facebook" />
          </FacebookShareButton>

          <EmailShareButton url={url} subject={title} className="w-full">
            <ShareItem icon={<EmailIcon />} label="Email" />
          </EmailShareButton>

          <button onClick={copyLink} className="w-full">
            <ShareItem  label="Copy link" icon={<Copy size={16} />} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className="md:hidden fixed z-50 bottom-0 left-0 right-0
        rounded-t-2xl bg-white p-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Share</h4>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-3">
          <WhatsappShareButton url={url} title={title}>
            <ShareItem icon={<WhatsappIcon size={26} className="rounded-full" />} label="WhatsApp" />
          </WhatsappShareButton>

          <FacebookShareButton url={url} quote={title}>
            <ShareItem icon={<FacebookIcon size={26} className="rounded-full" />} label="Facebook" />
          </FacebookShareButton>

          <EmailShareButton url={url} subject={title}>
            <ShareItem icon={<EmailIcon size={26} className="rounded-full" />} label="Email" />
          </EmailShareButton>

          <button onClick={copyLink}>
            <ShareItem label="Copy link" icon={<Copy size={16} />} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareSheet;
