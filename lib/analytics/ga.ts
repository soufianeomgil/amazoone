// // lib/analytics/ga.ts
// export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// type GtagEventParams = Record<string, any>;

// export function gaEvent(action: string, params: GtagEventParams = {}) {
//   if (!GA_ID) return;
//   if (typeof window === "undefined") return;

//   // @ts-ignore
//   window.gtag?.("event", action, params);
// }
// lib/analytics/ga.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// This fixes the TypeScript error without using @ts-ignore
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type GtagEventParams = Record<string, any>;

export function gaEvent(action: string, params: GtagEventParams = {}) {
  if (!GA_ID || typeof window === "undefined") return;

  window.gtag?.("event", action, {
    ...params,
    // It is good practice to send the currency at the top level for e-com events
    currency: params.currency || "MAD", 
  });
}

// // --- Usage for View Item ---
// gaEvent("view_item", {
//   currency: "MAD",
//   value: Number(product.basePrice), // Ensure this is a number
//   items: [
//     {
//       item_id: String(product._id),
//       item_name: product.name,
//       item_brand: product.brand,
//       price: Number(product.basePrice),
//       // GA4 uses 'item_list_name' or 'item_category' instead of 'image'
//       item_category: product.category || "General", 
//     },
//   ],
// });


// TODO: HAMAM;
// TODO: WORKOUT LEGS;
// TODO: CODE;
// TODO: FB ADS  and MARKETING channels
// MONEY