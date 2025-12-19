"use client";

import { Share } from "lucide-react";
import { useState } from "react";
import ShareSheet from "./ShareSheet";


const ShareTrigger = ({ url, title }: { url: string; title: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex cursor-pointer rounded-full bg-gray-100 w-[45px] h-[45px] items-center justify-center hover:bg-gray-200"
      >
        <Share size={20} />
      </div>

      {open && <ShareSheet url={url} title={title} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ShareTrigger;
