"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useRef, useState } from "react";

type ReviewPayload = {
  productId: string;
  rating: number;
  title: string;
  body: string;
  recommend: boolean;
  images?: File[];
};

type Props = {
  productId: string;
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: ReviewPayload) => Promise<{ success: boolean; message?: string }>;
  onSuccess?: (response?: any) => void;
  verifiedPurchase?: boolean;
};

const MAX_IMAGES = 5;
const MIN_BODY_LENGTH = 20;
const MIN_TITLE_LENGTH = 3;
const MAX_BODY_LENGTH = 2000;

/**
 * AddReviewModal
 * - Header and footer are fixed.
 * - Middle content is scrollable with a safe maxHeight so it never overflows the viewport.
 * - Focus trap, ESC to close, backdrop click to close (unless submitting).
 * - Keeps same API: open, onClose, onSubmit, onSuccess, verifiedPurchase.
 */
export default function AddReviewModal({
  productId,
  open,
  onClose,
  onSubmit,
  onSuccess,
  verifiedPurchase = false,
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setRating(0);
      setHoverRating(null);
      setTitle("");
      setBody("");
      setRecommend(null);
      setImages([]);
      setPreviews([]);
      setError(null);
      setSuccessMessage(null);
      // focus first input shortly after opening
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus trap: keep Tab within modal
  useEffect(() => {
    if (!open) return;
    const node = modalRef.current;
    if (!node) return;
    const focusable = node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Clean up preview URLs on unmount / change
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  }, [previews]);

  const handleDrop = (files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files).slice(0, MAX_IMAGES - images.length);
    setImages((prev) => [...prev, ...allowed]);
    const next = allowed.map((f) => URL.createObjectURL(f));
    setPreviews((p) => [...p, ...next]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => {
      const url = prev[i];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const validate = () => {
    if (rating < 1 || rating > 5) {
      setError("Please select a star rating (1–5).");
      return false;
    }
    if (title.trim().length < MIN_TITLE_LENGTH) {
      setError(`Title should be at least ${MIN_TITLE_LENGTH} characters.`);
      return false;
    }
    if (body.trim().length < MIN_BODY_LENGTH) {
      setError(`Review should be at least ${MIN_BODY_LENGTH} characters.`);
      return false;
    }
    if (recommend === null) {
      setError("Please indicate whether you recommend this product.");
      return false;
    }
    setError(null);
    return true;
  };

  const submit = async () => {
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    const payload: ReviewPayload = {
      productId,
      rating,
      title: title.trim(),
      body: body.trim(),
      recommend: !!recommend,
      images,
    };

    try {
      let resp;
      if (onSubmit) {
        resp = await onSubmit(payload);
      } else {
        // fallback: post to /api/reviews (replace with your server action)
        const form = new FormData();
        form.append("productId", payload.productId);
        form.append("rating", String(payload.rating));
        form.append("title", payload.title);
        form.append("body", payload.body);
        form.append("recommend", String(payload.recommend));
        images.forEach((img) => form.append("images", img));
        const r = await fetch("/api/reviews", { method: "POST", body: form });
        if (!r.ok) throw new Error("Failed to submit review");
        resp = await r.json();
      }

      if (!resp || !resp.success) throw new Error(resp?.message || "Submission failed");
      setSuccessMessage(resp.message ?? "Review submitted — thanks!");
      onSuccess?.(resp);

      // short delay so user sees success state
      setTimeout(() => {
        setSubmitting(false);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Something went wrong while submitting the review.");
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => {
          if (submitting) return;
          onClose();
        }}
      />

      {/* modal container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-review-title"
        className="relative z-60 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
      >
        {/* Header (fixed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-white">
          <div>
            <h2 id="add-review-title" className="text-lg font-semibold text-gray-900">
              Write a customer review
            </h2>
            <p className="text-sm text-gray-500">Your honest feedback helps other customers — be specific.</p>
          </div>

          <div className="flex items-center gap-3">
            {verifiedPurchase && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified purchase
              </span>
            )}

            <button
              onClick={() => {
                if (submitting) return;
                onClose();
              }}
              aria-label="Close"
              className="p-2 rounded hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body (keeps header & footer visible) */}
        <div
          className="px-6 py-4 overflow-auto"
          style={{
            maxHeight: "calc(100vh - 180px)", // keeps header/footer visible
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column: rating & tips */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Overall rating</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((v) => {
                    const active = hoverRating !== null ? v <= hoverRating : v <= rating;
                    return (
                      <button
                        key={v}
                        onClick={() => setRating(v)}
                        onMouseEnter={() => setHoverRating(v)}
                        onMouseLeave={() => setHoverRating(null)}
                        aria-label={`${v} star`}
                        className={`w-10 h-10 rounded-md flex items-center justify-center transition ${active ? "bg-yellow-400 text-white shadow" : "bg-gray-100 text-yellow-500 hover:bg-gray-200"}`}
                        type="button"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" aria-hidden>
                          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.172L12 18.896l-7.336 3.86 1.402-8.172L.132 9.21l8.2-1.192z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2">{rating ? `${rating} of 5` : "Tap a star to rate"}</div>
              </div>

              <div className="text-xs text-gray-500">
                <strong>Tips:</strong>
                <ul className="mt-2 list-disc ml-4 space-y-1">
                  <li>Give specifics — what you liked or didn't.</li>
                  <li>Mention how you used the product.</li>
                  <li>Keep it respectful and helpful.</li>
                </ul>
              </div>
            </div>

            {/* Right column: form */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <label htmlFor="review-title" className="block text-sm font-medium text-gray-700">Add a headline</label>
                <Input
                  id="review-title"
                  ref={firstInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: Great value — works as advertised"
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  maxLength={120}
                  disabled={submitting}
                />
                <div className="text-xs text-gray-400 mt-1">{title.length}/120</div>
              </div>

              <div className="mb-4">
                <label htmlFor="review-body" className="block text-sm font-medium text-gray-700">Your review</label>
                <Textarea
                  id="review-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  placeholder="What did you like or dislike? Be specific and helpful to other customers."
                  className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={submitting}
                  maxLength={MAX_BODY_LENGTH}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <div>{body.length >= MIN_BODY_LENGTH ? "Ready to submit" : `Minimum ${MIN_BODY_LENGTH} characters`}</div>
                  <div>{body.length}/{MAX_BODY_LENGTH}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Do you recommend this product?</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRecommend(true)}
                    className={`px-4 py-2 rounded-lg ${recommend === true ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    disabled={submitting}
                    type="button"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setRecommend(false)}
                    className={`px-4 py-2 rounded-lg ${recommend === false ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    disabled={submitting}
                    type="button"
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">Add photos (optional)</div>
                  <div className="text-xs text-gray-400">Up to {MAX_IMAGES}</div>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(e.dataTransfer.files);
                  }}
                  className="relative rounded-lg border border-dashed border-gray-200 p-4 flex items-center gap-4"
                  style={{ minHeight: 84 }}
                >
                  <div className="flex-1 text-sm text-gray-500">
                    <div>Drag & drop photos here, or</div>
                    <div className="mt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border text-sm hover:bg-gray-50"
                        disabled={submitting || images.length >= MAX_IMAGES}
                        type="button"
                      >
                        Upload photos
                      </button>
                      <span className="ml-2 text-xs text-gray-400">JPEG, PNG. We'll resize automatically.</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleDrop(e.target.files)}
                    disabled={submitting || images.length >= MAX_IMAGES}
                  />

                  <div className="flex gap-2 overflow-x-auto">
                    {previews.length === 0 ? (
                      <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">No images</div>
                    ) : (
                      previews.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                          <img src={p} alt={`preview-${i}`} className="w-full h-full object-cover" />
                          <button
                            aria-label="Remove image"
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-xs"
                            type="button"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
              {successMessage && <div className="text-sm text-green-700 mb-2">{successMessage}</div>}
            </div>
          </div>
        </div>

        {/* Footer (fixed) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-300 bg-white">
          <Button
            onClick={() => {
              if (submitting) return;
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-white border-2 border-orange-400 text-sm"
            disabled={submitting}
            type="button"
          >
            Cancel
          </Button>

          <Button
            onClick={submit}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold shadow hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            type="button"
          >
            {submitting ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="80" strokeDashoffset="60" fill="none" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M12 5v14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Submit review
          </Button>
        </div>
      </div>
    </div>
  );
}
