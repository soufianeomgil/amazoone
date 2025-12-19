"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  collapsedHeight?: number;
}

const ProductDescriptionClient = ({
  children,
  collapsedHeight = 220,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    setOverflow(ref.current.scrollHeight > collapsedHeight);
  }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="transition-all duration-300 overflow-hidden"
        style={!expanded ? { maxHeight: collapsedHeight } : undefined}
      >
        {children}
      </div>

      {!expanded && overflow && (
        <div className="pointer-events-none absolute bottom-8 left-0
         right-0 h-15
          bg-linear-to-t from-gray-100  to-transparent" />
       )}

      {overflow && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2.5 text-sm font-medium cursor-pointer hover:underline text-orange-500 hover:text-orange-600"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default ProductDescriptionClient;
