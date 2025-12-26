"use client";

import { useEffect, useState } from "react";

export default function CODBadge() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 5000); // stop after 3s

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative inline-flex mt-1.5 items-center gap-1.5 px-2.5 py-1 text-[10px] whitespace-nowrap sm:text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full">
      {animate && (
        <>
          <span className="absolute -left-1.5 -top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
          <span className="absolute -left-1.5 -top-1.5 w-2.5 h-2.5 rounded-full bg-green-500" />
        </>
      )}
      🚚 Paiement à la livraison
    </div>
  );
}
