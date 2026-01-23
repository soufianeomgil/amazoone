"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { IProduct } from "@/models/product.model";

export default function ViewItemTracker({ product }: { product: IProduct }) {
  const { trackViewItem } = useAnalytics();

  useEffect(() => {
    trackViewItem(product);
  }, [product, trackViewItem]);

  return null;
}