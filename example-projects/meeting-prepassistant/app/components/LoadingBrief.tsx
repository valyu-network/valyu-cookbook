"use client";

import { useEffect, useState } from "react";

interface LoadingBriefProps {
  topic: string;
}

const reasoningSteps = [
  {
    icon: "🔍",
    text: "Searching latest news and developments",
    duration: 2000,
  },
  {
    icon: "📊",
    text: "Analyzing key information and trends",
    duration: 2500,
  },
  {
    icon: "👥",
    text: "Identifying key people and players",
    duration: 1800,
  },
  {
    icon: "📅",
    text: "Extracting important dates and events",
    duration: 2200,
  },
  {
    icon: "💬",
    text: "Preparing talking points",
    duration: 2000,
  },
  {
    icon: "✨",
    text: "Finalizing your brief",
    duration: 1500,
  },
];

export default function LoadingBrief({ topic }: LoadingBriefProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep < reasoningSteps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setCurrentStep((prev) => prev + 1);
      }, reasoningSteps[currentStep].duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 sm:p-6 max-w-2xl mx-auto shadow-notion-sm">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--muted)] rounded-full mb-3">
          <svg
            className="w-7 h-7 text-[var(--muted-foreground)] animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-2">
          Preparing Your Brief
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate px-4">
          <span className="font-semibold text-[var(--foreground)]">{topic}</span>
        </p>
      </div>

      <div className="space-y-2">
        {reasoningSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isPending = index > currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md transition-all duration-500 ${
                isCompleted
                  ? "bg-[var(--accent-green-bg)] border border-[var(--accent-green)]/20"
                  : isCurrent
                  ? "bg-[var(--muted)] border border-[var(--border)]"
                  : "bg-[var(--card)] border border-[var(--border)] opacity-60"
              }`}
            >
              <div
                className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-base sm:text-lg transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--accent-green)]"
                    : isCurrent
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--muted)]"
                }`}
              >
                {isCompleted ? (
                  <span className="text-white text-sm font-bold">✓</span>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-semibold transition-colors truncate ${
                    isCompleted
                      ? "text-[var(--accent-green)]"
                      : isCurrent
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {step.text}
                </p>
                {isCurrent && (
                  <div className="mt-1 h-1 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] animate-loading-bar"></div>
                  </div>
                )}
              </div>

              {isCurrent && (
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-4 py-2 rounded-full inline-block border border-[var(--border)]">
          Usually takes 10-15 seconds
        </p>
      </div>
    </div>
  );
}
