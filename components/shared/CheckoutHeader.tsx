"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface Props {
  currentStep: number;
  steps?: Step[];
  /**
   * Called when a step is clicked. The component will only call this
   * for completed steps and the current step (future steps are disabled).
   */
  onStepClick?: (stepId: number) => void;
  className?: string;
}

const defaultSteps: Step[] = [
  { id: 1, title: "Sign in" },
  { id: 2, title: "Shipping" },
  { id: 3, title: "Payment" },
  { id: 4, title: "Review items" },
  { id: 5, title: "Place order" },
];

const CheckoutHeader: React.FC<Props> = ({
  currentStep,
  steps = defaultSteps,
  onStepClick,
  className = "",
}) => {
  const total = Math.max(1, steps.length);
  // progress percent between steps (0% when at step 1)
  const percent = ((Math.max(1, Math.min(currentStep, total)) - 1) / (total - 1)) * 100;

  return (
    <header className={`w-full bg-[#131921] text-white border-b border-gray-800 py-3 ${className}`} role="navigation" aria-label="Checkout progress">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-6">
        {/* optional slot for a logo - replace src with your logo */}
        

        <div className="flex-1 relative">
          {/* background line */}
          <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-gray-700 -z-10 rounded" />

          {/* filled progress */}
          <div
            className="absolute left-0 top-1/2 h-[3px] bg-green-500 -z-10 rounded transition-all duration-300"
            style={{ width: `${percent}%` }}
            aria-hidden
          />

          <div className="grid grid-cols-5 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-0">
            {steps.map((step, i) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const canClick = isCompleted || isActive;

              // Colors adapted for dark background:
              // completed: green filled / white icon
              // active: yellow border/filled to stand out
              // upcoming: gray border/text
              return (
                <div key={step.id} className="flex flex-col items-center text-center px-2">
                  <button
                    onClick={() => canClick && onStepClick?.(step.id)}
                    disabled={!canClick}
                    title={!canClick ? "Complete previous steps first" : `Go to ${step.title}`}
                    aria-disabled={!canClick}
                    aria-current={isActive ? "step" : undefined}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full border-2 z-10
                      transition-colors duration-150
                      ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                      ${isActive && !isCompleted ? "bg-yellow-400 border-yellow-400 text-black font-semibold" : ""}
                      ${!isActive && !isCompleted ? "bg-transparent border-gray-500 text-gray-300" : ""}
                      ${!canClick ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
                    `}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-sm">{step.id}</span>}
                  </button>

                  <span
                    className={`mt-1 text-[11px] sm:text-xs w-24 block truncate
                      ${isCompleted ? "text-green-300" : ""}
                      ${isActive ? "text-white font-semibold" : ""}
                      ${!isActive && !isCompleted ? "text-gray-400" : ""}
                    `}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
