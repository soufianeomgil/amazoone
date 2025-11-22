"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface EmptyCartProps {
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  message = "Your cart is empty",
  actionLabel = "Continue Shopping",
  actionHref = "/",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
        <ShoppingCart className="w-10 h-10 text-yellow-600" />
      </div>

      {/* Message */}
      <h2 className="text-2xl font-semibold text-gray-700">{message}</h2>
      <p className="text-gray-500 max-w-xs">
        Looks like you haven't added any items to your cart yet.
      </p>

      {/* Action Button */}
      <Link href={actionHref}>
        <button className="bg-yellow-500 text-white font-medium px-6 cursor-pointer py-2 rounded-lg shadow hover:bg-yellow-600 transition">
          {actionLabel}
        </button>
      </Link>
    </div>
  );
};

export default EmptyCart;
