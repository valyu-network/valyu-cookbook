"use client";

import { useState } from "react";
import { MeetingPrepResult } from "@/app/types/meeting-prep";
import MeetingBriefCard from "./MeetingBriefCard";
import LoadingBrief from "./LoadingBrief";
import DiscordBanner from "./DiscordBanner";
import Sidebar from "./Sidebar";

export default function MeetingPrepAssistant() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<MeetingPrepResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a meeting topic");
      return;
    }

    await generateBrief();
  };

  const generateBrief = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/meeting-prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate meeting brief");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!result) return;

    setIsDownloadingPdf(true);

    try {
      const filename = `${topic.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase()}_meeting_brief.pdf`;

      // Generate PDF on client side using react-pdf
      const { pdf } = await import('@react-pdf/renderer');
      const MeetingBriefDocument = (await import('./MeetingBriefDocument')).default;

      const blob = await pdf(<MeetingBriefDocument result={result} />).toBlob();

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setTopic("");
    setError(null);
  };

  return (
    <>
      <DiscordBanner />
      <Sidebar />
      <div className="min-h-screen flex flex-col py-12 px-6 sm:px-8 lg:px-12 bg-[var(--background)]">
        <div className={`${result ? 'max-w-4xl' : 'max-w-2xl'} mx-auto flex-grow flex flex-col w-full`}>
        {!isLoading && (
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
              Intel Espresso
            </h1>
            <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
              Get instant, AI-powered briefings on any topic before your meeting.
            </p>
          </div>
        )}

        {isLoading && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                Intel Espresso
              </h1>
            </div>
            <LoadingBrief topic={topic} />
          </>
        )}

        {!result && !isLoading && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 shadow-notion-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Meeting Topic or Company Name
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Tesla Q4 earnings, OpenAI latest developments"
                  className="w-full px-3 py-2 border border-[var(--input)] rounded-md focus:outline-none focus:border-[var(--foreground)] focus:ring-2 focus:ring-[var(--ring)]/10 text-sm bg-[var(--background)] placeholder-[var(--muted-foreground)]"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3 bg-[var(--accent-red-bg)] border border-[var(--accent-red)]/20 rounded-md">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[var(--accent-red)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-[var(--accent-red)]">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-notion disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Brief</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-[var(--border)]">
              <h3 className="font-medium text-[var(--foreground)] mb-3 text-sm">
                What you'll get:
              </h3>
              <ul className="grid grid-cols-3 gap-2 mb-4">
                <li className="flex items-center gap-2 p-2 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)] text-xs">✓</span>
                  <span className="text-xs text-[var(--muted-foreground)]">Executive summary</span>
                </li>
                <li className="flex items-center gap-2 p-2 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)] text-xs">✓</span>
                  <span className="text-xs text-[var(--muted-foreground)]">Talking points</span>
                </li>
                <li className="flex items-center gap-2 p-2 bg-[var(--muted)] rounded-md border border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)] text-xs">✓</span>
                  <span className="text-xs text-[var(--muted-foreground)]">News sources</span>
                </li>
              </ul>

              <div className="p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">
                  <span className="font-medium">Want to build your own?</span> Get started with Valyu's powerful search API.
                </p>
                <a
                  href="https://platform.valyu.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--foreground)] hover:opacity-80 transition-notion"
                >
                  Sign up for free
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)] transition-notion"
              >
                ← Prepare Another Meeting
              </button>
            </div>
            <MeetingBriefCard result={result} onPrint={handlePrint} isDownloadingPdf={isDownloadingPdf} />
          </div>
        )}

        <footer className="mt-auto pt-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-[var(--muted-foreground)]">
              <span>Built with Valyu API · </span>
              <a
                href="https://platform.valyu.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)] hover:opacity-80 font-medium"
              >
                Get your API key
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/Valyuofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-notion"
                aria-label="Valyu on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/valyu-network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-notion"
                aria-label="Valyu on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com/valyu-network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-notion"
                aria-label="Valyu on GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
}
