// components/shared/CancelOrderModal.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  loading?: boolean;
  orderId?: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const reasons = [
  "Changed my mind",
  "Found cheaper elsewhere",
  "Order placed by mistake",
  "Delivery will be late",
  "Other",
];

export default function CancelOrderModal({ open, loading, orderId, onClose, onConfirm }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>(reasons[0]);
  const [otherText, setOtherText] = useState("");

  if (!open) return null;

  const submit = () => {
    const reason = selectedReason === "Other" ? otherText.trim() : selectedReason;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6 z-10">
        <h3 className="text-lg font-semibold mb-2">Cancel Order</h3>
        <p className="text-sm text-gray-600 mb-4">Select a reason for cancelling order {orderId}</p>

        <div className="space-y-2 mb-4">
          {reasons.map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="cancelReason"
                checked={selectedReason === r}
                onChange={() => setSelectedReason(r)}
                className="accent-indigo-600"
              />
              <span className="text-sm">{r}</span>
            </label>
          ))}

          {selectedReason === "Other" && (
            <textarea
              placeholder="Please tell us why..."
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="w-full border rounded p-2 mt-2"
              rows={3}
            />
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Close</Button>
          <Button onClick={submit} disabled={loading} className="bg-red-600 text-white">
            {loading ? "Cancelling..." : "Confirm cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
