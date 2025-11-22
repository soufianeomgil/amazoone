
"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, StarIcon } from "./icons";
import { IProduct } from "@/models/product.model";



interface QuickViewModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalInner: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  // lock body scroll when modal open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* panel */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn .18s ease" }}
      >
        <button
          aria-label="Close quick view"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full p-1 text-gray-600 hover:text-gray-900"
        >
          <CloseIcon />
        </button>

        <div className="md:flex h-full">
          {/* Image */}
          <div className="w-full md:w-1/2 p-6 bg-gray-100 flex items-center justify-center">
            <img
              src={product.thumbnail.preview}
              alt={product.name}
              className="max-h-[70vh] md:max-h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-4">
               {product.brand}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(20 reviews)</span>
            </div>

            <p className="text-gray-700 line-clamp-5 mb-6">{product.description}</p>

            <div className="mb-6">
              <span className="text-3xl font-bold text-red-600 mr-3">{product.basePrice}</span>
              {product.basePrice && <span className="text-lg text-gray-500 line-through">{product.basePrice}</span>}
            </div>

            <div className="mt-auto">
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-md transition-colors duration-200">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: translateY(6px) scale(.99); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const QuickViewModal: React.FC<QuickViewModalProps> = (props) => {
  // use portal to prevent stacking-context issues
  const portalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") ?? document.body : null;
  if (!portalRoot) return null;

  return createPortal(<ModalInner {...props} />, portalRoot);
};

export default QuickViewModal;
