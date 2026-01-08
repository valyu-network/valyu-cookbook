"use client";

import { MeetingPrepResult } from "@/app/types/meeting-prep";

interface MeetingBriefCardProps {
  result: MeetingPrepResult;
  onPrint?: () => void;
  isDownloadingPdf?: boolean;
}

export default function MeetingBriefCard({
  result,
  onPrint,
  isDownloadingPdf = false,
}: MeetingBriefCardProps) {
  const { topic, generatedAt, brief, sources } = result;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 sm:p-8 max-w-4xl mx-auto shadow-notion-sm">
      <div className="border-b border-[var(--border)] pb-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
              {topic}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] font-medium">
              Generated: {formatDate(generatedAt)}
            </p>
          </div>
          {onPrint && (
            <button
              onClick={onPrint}
              disabled={isDownloadingPdf}
              className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)] transition-notion disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
            >
              {isDownloadingPdf ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Generating PDF...
                </span>
              ) : (
                "Save as PDF"
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-[var(--muted)] rounded-lg p-6 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> Executive Summary
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {brief.executiveSummary}
          </p>
        </section>

        {brief.keyDevelopments.length > 0 && (
          <section className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="text-2xl">📰</span> Key Developments
            </h2>
            <ul className="space-y-3">
              {brief.keyDevelopments.map((dev, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)] font-bold mt-0.5">•</span>
                  <span className="text-[var(--muted-foreground)]">{dev}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {brief.keyPeople.length > 0 && (
          <section className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="text-2xl">👥</span> Key People
            </h2>
            <div className="flex flex-wrap gap-2">
              {brief.keyPeople.map((person, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-[var(--muted)] text-[var(--secondary-foreground)] rounded-full text-sm font-semibold border border-[var(--border)]"
                >
                  {person}
                </span>
              ))}
            </div>
          </section>
        )}

        {brief.importantDates.length > 0 && (
          <section className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="text-2xl">📅</span> Important Dates
            </h2>
            <ul className="space-y-3">
              {brief.importantDates.map((date, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)] font-bold mt-0.5">•</span>
                  <span className="text-[var(--muted-foreground)]">{date}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {brief.talkingPoints.length > 0 && (
          <section className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span> Talking Points
            </h2>
            <ul className="space-y-3">
              {brief.talkingPoints.map((point, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)] font-bold mt-0.5">•</span>
                  <span className="text-[var(--muted-foreground)]">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sources.length > 0 && (
          <section className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="text-2xl">🔗</span> Sources
            </h2>
            <div className="space-y-3">
              {sources.slice(0, 8).map((source, idx) => {
                const domain = (() => {
                  try {
                    return new URL(source.url).hostname;
                  } catch {
                    return '';
                  }
                })();
                return (
                  <div key={idx} className="p-3 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 group"
                    >
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                        alt=""
                        className="w-4 h-4 mt-0.5 flex-shrink-0 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-[var(--foreground)] group-hover:underline font-medium line-clamp-2">
                          {source.title}
                        </span>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
                          {domain}
                          {source.publishedDate && (
                            <span> · {new Date(source.publishedDate).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
