"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * uses /api/checkout/validate to check pre-reqs for a specific step
 * returns { allowed, loading, details }
 */
export default function useCheckoutGuard(step: number) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch("/api/checkout/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step }),
        }).then((r) => r.json());

        if (!mounted) return;

        if (resp?.success && resp?.data) {
          setAllowed(resp.data.allowed);
          setDetails(resp.data.details);
          // redirect if not allowed — pick redirect based on reason
          if (!resp.data.allowed) {
            const reason = resp?.data?.reason;
            if (reason === "NOT_AUTHENTICATED") {
              // redirect to sign in (NextAuth)
              router.replace(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
            } else if (reason === "NO_ADDRESS") {
              router.replace("/checkout/address");
            } else if (reason === "CART_EMPTY") {
              router.replace("/cart");
            } else if (reason === "OUT_OF_STOCK") {
              router.replace("/cart");
            }
          }
        } else {
          setAllowed(false);
        }
      } catch (err) {
        console.error("Checkout guard failed", err);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [step]);

  return { loading, allowed, details };
}
