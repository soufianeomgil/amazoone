"use client"; // This is the key!

import { useEffect } from "react";
import { gaEvent } from "@/lib/analytics/ga";

export default function PurchaseTracker({ order }: { order: any }) {
  useEffect(() => {
    if (!order) return;

    gaEvent("purchase", {
      debug_mode: true, // Forces it to show in DebugView
      transaction_id: order.id,
      value: Number(order.total),
      currency: "MAD",
      items: order.items.map((i: any) => ({
        item_id: String(i.productId._id || i.productId),
        item_name: i.name,
        price: Number(i.unitPrice),
        quantity: i.quantity,
      })),
    });
  }, [order]);

  return null; // This component doesn't render anything visible
}