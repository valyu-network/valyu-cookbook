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
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 sm:p-5 shadow-notion-sm">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-[var(--muted)] rounded-full mb-3">
          <svg className="w-5 h-5 text-[var(--muted-foreground)] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-base font-bold text-[var(--foreground)] mb-1">
          Preparing Your Brief
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] truncate px-4">
          <span className="font-medium text-[var(--foreground)]">{topic}</span>
        </p>
      </div>

      <div className="space-y-1.5">
        {reasoningSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isPending = index > currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 rounded-md transition-all duration-500 ${
                isCompleted
                  ? "bg-[var(--accent-green-bg)] border border-[var(--accent-green)]/20"
                  : isCurrent
                  ? "bg-[var(--muted)] border border-[var(--border)]"
                  : "bg-[var(--card)] border border-[var(--border)] opacity-60"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--accent-green)]"
                    : isCurrent
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--muted)]"
                }`}
              >
                {isCompleted ? (
                  <span className="text-white text-xs font-bold">✓</span>
                ) : (
                  <span className="text-xs">{step.icon}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium transition-colors truncate ${
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
                  <div className="mt-1 h-0.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] animate-loading-bar"></div>
                  </div>
                )}
              </div>

              {isCurrent && (
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse"></div>
                    <div
                      className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1.5 rounded-full inline-block border border-[var(--border)]">
          Usually takes 10-15 seconds
        </p>
      </div>
    </div>
  );
}
