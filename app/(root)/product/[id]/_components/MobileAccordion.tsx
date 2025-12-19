"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const MobileAccordionSection = ({
  title,
  children,
  defaultOpen = false,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-gray-200">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex w-full items-center justify-between
          py-4 text-left
          sm:cursor-default
        "
      >
       <h2 className=" text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

        {/* Chevron (mobile only) */}
        <ChevronDown
          className={clsx(
            "h-5 w-5 text-gray-600 transition-transform sm:hidden",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Content */}
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
          "sm:max-h-none sm:opacity-100"
        )}
      >
        <div className="pb-4">{children}</div>
      </div>
    </section>
  );
};

export default MobileAccordionSection;
