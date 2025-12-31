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
    <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {topic}
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Generated: {formatDate(generatedAt)}
            </p>
          </div>
          {onPrint && (
            <button
              onClick={onPrint}
              disabled={isDownloadingPdf}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
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
        <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {brief.executiveSummary}
          </p>
        </section>

        {brief.keyDevelopments.length > 0 && (
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📰</span> Key Developments
            </h2>
            <ul className="space-y-3">
              {brief.keyDevelopments.map((dev, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-700 font-bold mt-0.5">•</span>
                  <span className="text-gray-700">{dev}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {brief.keyPeople.length > 0 && (
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">👥</span> Key People
            </h2>
            <div className="flex flex-wrap gap-2">
              {brief.keyPeople.map((person, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold border border-gray-300"
                >
                  {person}
                </span>
              ))}
            </div>
          </section>
        )}

        {brief.importantDates.length > 0 && (
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📅</span> Important Dates
            </h2>
            <ul className="space-y-3">
              {brief.importantDates.map((date, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-700 font-bold mt-0.5">•</span>
                  <span className="text-gray-700">{date}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {brief.talkingPoints.length > 0 && (
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span> Talking Points
            </h2>
            <ul className="space-y-3">
              {brief.talkingPoints.map((point, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-700 font-bold mt-0.5">•</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sources.length > 0 && (
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔗</span> Sources
            </h2>
            <div className="space-y-3">
              {sources.slice(0, 8).map((source, idx) => (
                <div key={idx} className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 rounded-r-md">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#de5833] hover:text-[#c74d2c] hover:underline font-semibold"
                  >
                    {source.title}
                  </a>
                  {source.publishedDate && (
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {new Date(source.publishedDate).toLocaleDateString()}
                    </p>
                  )}
                  {source.snippet && (
                    <p className="text-sm text-gray-600 mt-1">
                      {source.snippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
