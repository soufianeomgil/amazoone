
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



