"use client";

import { useCallback } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { IProduct } from "@/models/product.model";
import { ItemProps } from "@/app/(root)/cart/_component/CheckoutBox";

export const useAnalytics = () => {
  
  // Track Product Clicks or Views
  const trackViewItem = useCallback((product: IProduct) => {
    sendGAEvent("view_item", {
      currency: "MAD",
      value: product.basePrice,
      items: [{
        item_id: product._id,
        item_name: product.name,
        price: product.basePrice,
        item_category: product.category,
      }]
    });
  }, []);

  // Track Add to Cart
  const trackAddToCart = useCallback((product: IProduct, quantity = 1) => {
    sendGAEvent("add_to_cart", {
      currency: "MAD",
      value: product.basePrice * quantity,
      items: [{
        item_id: product._id,
        item_name: product.name,
        price: product.basePrice,
        quantity: quantity
      }]
    });
  }, []);

  // Track WhatsApp Clicks (Custom Event)
  const trackWhatsAppClick = useCallback((productName: string) => {
    sendGAEvent("contact_click", {
      method: "whatsapp",
      product_context: productName,
      debug_mode: true // Useful for testing custom parameters
    });
  }, []);

  // Track what users search for
const trackSearch = useCallback((term: string) => {
    if (!term) return;
    
    sendGAEvent("search", {
      search_term: term,
    });
  }, []);

  const trackBeginCheckout = useCallback((orderData: { total: number, items: ItemProps[] }) => {
    sendGAEvent("begin_checkout", {
      currency: "MAD",
      value: Number(orderData.total),
      items: orderData.items.map((item) => ({
        item_id: String(item.productId._id),
        item_name: item.productId.name,
        price: Number(item.productId.basePrice),
        quantity: item.quantity,
      })),
    });
  }, []);
  const trackAddToWishlist = useCallback((product: IProduct) => {
  sendGAEvent("add_to_wishlist", {
    currency: "MAD",
    value: product.basePrice,
    items: [{
      item_id: product._id,
      item_name: product.name,
      price: product.basePrice,
      item_category: product.category,
    }]
  });
}, []);
  return { trackViewItem, trackAddToWishlist, trackAddToCart, trackBeginCheckout, trackSearch, trackWhatsAppClick };
};