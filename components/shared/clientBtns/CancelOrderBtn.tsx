
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IOrder, IOrderItem } from "@/models/order.model";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  onClose?: () => void;
  setOpen: (v: boolean) => void;
  open: boolean;
  // optional hook for parent to react to cancellation
  onConfirmCancel?: (opts: { orderId: string; reason: string; note?: string; refundMethod?: string }) => Promise<void> | void;
};



export default function CancelOrderUI({ setOpen, orderId, open, onClose, onConfirmCancel }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter()
  const [selectedReason, setSelectedReason] = useState<string>("change_of_mind");
  const [customNote, setCustomNote] = useState("");
  const [refundMethod, setRefundMethod] = useState<string>("original_payment");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reasons = [
    { id: "change_of_mind", label: "Changed my mind" },
    { id: "ordered_by_mistake", label: "Ordered by mistake" },
    { id: "found_cheaper", label: "Found a cheaper price elsewhere" },
    { id: "delivery_too_slow", label: "Delivery/cutoff time is too slow" },
    { id: "product_unavailable", label: "Product is unavailable" },
    { id: "other", label: "Other (explain)" },
  ];

  // fetch order details from your API route
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/order/${orderId}`, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to fetch order: ${res.status}`);
      }
      const json = await res.json();
      // your GET route returns { success: true, data: order }
      const fetched = json?.data ?? json?.order ?? null;
      setOrder(fetched);
    } catch (err: any) {
      console.error("Order fetch error:", err);
      setError(err?.message ?? "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (open) fetchOrder();
  }, [open, fetchOrder]);

  const orderSummary = useMemo(() => {
    return {
      items: order?.items ?? [],
      total: order?.total ?? 0,
    };
  }, [order]);

  function close() {
    setOpen(false);
    onClose?.();
  }

  async function handleContinueStep1() {
    setError(null);
    if (!selectedReason) {
      setError("Please choose a reason for cancelling.");
      return;
    }
    if (selectedReason === "other" && customNote.trim().length < 5) {
      setError("Please provide a short explanation (at least 5 characters).");
      return;
    }
    if (!agreePolicy) {
      setError("Please confirm you understand the cancellation policy.");
      return;
    }

    setStep(2);
  }

  // Perform cancellation by calling POST /api/orders/cancel
  const performCancel = async () => {
    if (!orderId) return;
    setError(null);
    setLoading(true);
    try {
      const body = {
        orderId,
        reason: selectedReason,
        // note: customNote?.trim() || undefined,
        // refundMethod,
      };
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        const msg = json?.error?.message ?? json?.error ?? "Failed to cancel order";
        throw new Error(msg);
      }

      setSuccessMessage(
        json?.message ??
          "Your order has been cancelled. A confirmation email will be sent shortly."
      );

      // allow parent to react (optional)
      try {
        await onConfirmCancel?.({ orderId, reason: selectedReason, note: customNote, refundMethod });
      } catch (e) {
        console.warn("onConfirmCancel hook error", e);
      }

      toast.success?.("Order cancelled");
      router.refresh()
    } catch (err: any) {
      console.error("Cancel error:", err);
      setError(err?.message ?? "Failed to cancel order");
      toast.error?.(err?.message ?? "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  // If cancelled successfully, show final success panel
  const renderFinalSuccess = () => (
    <section className="space-y-4 text-center py-8">
      <div className="text-2xl font-semibold text-green-600">Cancelled</div>
      <p className="text-sm text-gray-700">{successMessage}</p>
      <div className="mt-4 flex justify-center gap-3">
        <button onClick={close} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
          Close
        </button>
        <button
          onClick={() => {
            // optionally go to orders page — parent can handle if needed
            setOpen(false);
          }}
          className="px-4 py-2 border rounded-md"
        >
          View orders
        </button>
      </div>
    </section>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? "" : "hidden pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Cancel Order</h3>
            <p className="text-xs text-gray-500">
              Order #{order?._id ?? orderId} • Placed{" "}
              {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Close" onClick={close} className="text-sm text-gray-600 hover:text-gray-900 rounded-md px-2 py-1">
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Steps & Form */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1 rounded-md ${step === 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>1</div>
              <div className={`px-3 py-1 rounded-md ${step === 2 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>2</div>
              <div className="ml-3 text-sm text-gray-500">{step === 1 ? "Choose reason" : "Review & confirm"}</div>
            </div>

            {step === 1 && !successMessage && (
              <section aria-labelledby="reason-heading" className="space-y-4">
                <h4 id="reason-heading" className="text-sm font-semibold">Why are you cancelling this order?</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reasons.map((r) => (
                    <label
                      key={r.id}
                      className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 ${
                        selectedReason === r.id ? "border-indigo-600 ring-1 ring-indigo-100 bg-indigo-50" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancel-reason"
                        value={r.id}
                        checked={selectedReason === r.id}
                        onChange={() => setSelectedReason(r.id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <div className="font-medium">{r.label}</div>
                        {r.id === "found_cheaper" && <div className="text-xs text-gray-500">We may match price in some cases.</div>}
                      </div>
                    </label>
                  ))}
                </div>

                {selectedReason === "other" && (
                  <div>
                    <label className="text-xs text-gray-700">Tell us more (optional)</label>
                    <textarea
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      rows={3}
                      className="mt-2 w-full border rounded-md p-2 text-sm"
                      placeholder="Short note (why you're cancelling)"
                    />
                  </div>
                )}

                <div className="mt-2 p-3 border rounded-md bg-gray-50 text-xs text-gray-700">
                  <div className="font-semibold">Cancellation policy</div>
                  <div className="text-sm text-gray-600 mt-1">Cancellations may require contacting support depending on order status and fulfillment stage.</div>
                  <div className="text-xs text-gray-500 mt-2">If cancellation is accepted we will refund using the selected method; in some cases restocking fees may apply.</div>
                </div>

                <div className="flex items-start gap-3 mt-3">
                  <input id="agree" type="checkbox" checked={agreePolicy} onChange={(e) => setAgreePolicy(e.target.checked)} />
                  <label htmlFor="agree" className="text-sm text-gray-700">I have read and accept the cancellation policy.</label>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex items-center gap-3 mt-4">
                  <button onClick={handleContinueStep1} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60" disabled={loading}>
                    Continue
                  </button>
                  <button onClick={close} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                </div>
              </section>
            )}

            {step === 2 && !successMessage && (
              <section className="space-y-4">
                <h4 className="text-sm font-semibold">Review & Confirm Cancellation</h4>

                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="text-sm text-gray-600">Order</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Order #{order?._id ?? orderId}</div>
                      <div className="text-xs text-gray-500">Placed {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</div>
                    </div>
                    <div className="font-semibold">${(order?.total ?? 0).toFixed(2)}</div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div className="font-medium">Reason</div>
                    <div className="text-gray-700 mt-1">{reasons.find((r) => r.id === selectedReason)?.label ?? selectedReason}</div>
                    {customNote && <div className="text-xs text-gray-500 mt-2">Note: {customNote}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium">Refund method</label>
                    <div className="mt-2 flex gap-2">
                      <label className={`px-3 py-1 border rounded ${refundMethod === "original_payment" ? "bg-indigo-600 text-white" : "bg-white"}`}>
                        <input type="radio" name="refund" value="original_payment" checked={refundMethod === "original_payment"} onChange={() => setRefundMethod("original_payment")} className="hidden" />
                        <span className="text-sm">Original payment method</span>
                      </label>
                      <label className={`px-3 py-1 border rounded ${refundMethod === "store_credit" ? "bg-indigo-600 text-white" : "bg-white"}`}>
                        <input type="radio" name="refund" value="store_credit" checked={refundMethod === "store_credit"} onChange={() => setRefundMethod("store_credit")} className="hidden" />
                        <span className="text-sm">Store credit</span>
                      </label>
                    </div>
                  </div>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex items-center gap-3 mt-4">
                  <button onClick={performCancel} className="px-4 py-2 bg-red-600 text-white rounded-md" disabled={loading}>
                    {loading ? "Cancelling..." : "Confirm cancellation"}
                  </button>
                  <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-md">Back</button>
                </div>
              </section>
            )}

            {successMessage && renderFinalSuccess()}
          </div>

          {/* Right column: quick order summary */}
          <aside className="lg:col-span-1 border rounded-lg p-4 bg-gray-50">
            <div className="text-sm font-medium">Order summary</div>
            <div className="mt-3">
              <div className="text-xs text-gray-600">Items</div>
              <ul className="mt-2 space-y-2">
                {orderSummary.items.slice(0, 3).map((it:IOrderItem, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <img src={it.thumbnail ?? ""} alt={it.name} className="w-10 h-10 object-contain rounded" />
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                      </div>
                    </div>
                    <div className="font-medium">${((it.unitPrice ?? 0) * (it.quantity ?? 1)).toFixed(2)}</div>
                  </li>
                ))}
              </ul>

              {orderSummary.items.length > 3 && <div className="text-xs text-gray-500 mt-2">+{orderSummary.items.length - 3} more items</div>}

              <div className="mt-4 border-t pt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="font-semibold">${(orderSummary.total ?? 0).toFixed(2)}</div>
              </div>

              <div className="mt-3 text-xs text-gray-600">
                {order?.status === "SHIPPED" || order?.status === "DELIVERED" ? (
                  <div className="text-red-600">This order may be shipped — cancellation might not be possible.</div>
                ) : (
                  <div>Cancellation is subject to review and fulfillment stage.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
