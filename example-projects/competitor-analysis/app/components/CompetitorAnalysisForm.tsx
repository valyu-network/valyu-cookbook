'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

interface CompetitorAnalysisFormProps {
  onTaskCreated: (taskId: string) => void;
  user: User | null;
  onSignInClick: () => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  summaryText: string;
  setSummaryText: (text: string) => void;
  isAnalyzing?: boolean;
}

export default function CompetitorAnalysisForm({
  onTaskCreated,
  user,
  onSignInClick,
  websiteUrl,
  setWebsiteUrl,
  summaryText,
  setSummaryText,
  isAnalyzing
}: CompetitorAnalysisFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset loading when isAnalyzing becomes false (e.g., when cancelled)
  useEffect(() => {
    if (isAnalyzing === false) {
      setLoading(false);
    }
  }, [isAnalyzing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if user is logged in
    if (!user) {
      onSignInClick();
      return;
    }

    setLoading(true);

    try {
      // Create the research task
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteurl: websiteUrl,
          summaryText: summaryText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform analysis');
      }

      // Pass the task ID to parent, which handles polling
      const taskId = data.deepresearch_id;
      onTaskCreated(taskId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] shadow-notion-sm">
        <div className="space-y-2">
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-[var(--foreground)]">
            Competitor Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="example.com"
            required
            className="w-full px-3 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--border-color-strong)] transition-notion text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="summaryText" className="block text-sm font-medium text-[var(--foreground)]">
            Initial Summary or Context
          </label>
          <textarea
            id="summaryText"
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="Briefly describe what you know about this competitor or what you'd like to research..."
            required
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--border-color-strong)] transition-notion resize-none text-sm"
          />
        </div>

        {error && (
          <div className="p-3 rounded-md bg-[#FDEBEC] border border-[#EB5757]/20">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#EB5757] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[#EB5757]">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-md bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 disabled:bg-[var(--foreground-tertiary)] text-[var(--background)] font-medium transition-notion disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Researching...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Start Deep Research</span>
            </>
          )}
        </button>

        {!loading && (
          <p className="text-xs text-[var(--foreground-tertiary)] text-center mt-3">
            Takes 5-10 min · Analyzes 100+ sources · Downloadable PDF report
          </p>
        )}
      </form>

      {loading && (
        <div className="mt-4 p-4 rounded-md bg-[var(--background-secondary)] border border-[var(--border-color)]">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="animate-spin h-4 w-4 text-[var(--foreground-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Deep research in progress
              </p>
              <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                Analyzing 100+ sources. This takes 5-10 minutes — grab a coffee!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
