"use client";

import { useConfirmStore } from "@/lib/store/confirm.store";



export default function ConfirmModal() {
  const { state, close } = useConfirmStore();

  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => close(false)}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
        <h2 className="text-lg font-semibold text-gray-900">
          {state.title}
        </h2>

        {state.description && (
          <p className="mt-2 text-sm text-gray-600">
            {state.description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => close(false)}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            {state.cancelText}
          </button>

          <button
            onClick={() => close(true)}
            className={`px-4 py-2 text-sm rounded-md text-white transition
              ${
                state.destructive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {state.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
