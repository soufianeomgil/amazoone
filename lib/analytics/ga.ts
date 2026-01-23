// lib/analytics/ga.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GtagEventParams = Record<string, any>;

export function gaEvent(action: string, params: GtagEventParams = {}) {
  if (!GA_ID) return;
  if (typeof window === "undefined") return;

  // @ts-ignore
  window.gtag?.("event", action, params);
}
