'use client';

import { useState, useRef, useEffect } from 'react';

interface CompetitorAnalysisFormProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: any) => void;
}

export default function CompetitorAnalysisForm({ onAnalysisStart, onAnalysisComplete }: CompetitorAnalysisFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const pollStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/competitor-analysis/status?taskId=${taskId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check status');
      }

      // Pass status updates to parent via the result
      onAnalysisComplete(data);

      // If completed, stop polling
      if (data.status === 'completed') {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setLoading(false);
      } else if (data.status === 'failed') {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setLoading(false);
        setError('Research task failed. Please try again.');
      }
    } catch (err) {
      console.error('Polling error:', err);
      // Don't stop polling on temporary errors, just log them
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      // Notify parent that analysis has started
      onAnalysisStart();

      // Start polling for status
      const taskId = data.deepresearch_id;

      // Poll immediately once
      await pollStatus(taskId);

      // Then poll every 10 seconds
      pollIntervalRef.current = setInterval(() => {
        pollStatus(taskId);
      }, 10000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-7 p-8 rounded-2xl glass-effect shadow-premium transition-smooth hover:shadow-xl">
        <div className="space-y-3">
          <label htmlFor="websiteUrl" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Competitor Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-smooth shadow-sm hover:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="summaryText" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Initial Summary or Context
          </label>
          <textarea
            id="summaryText"
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="Briefly describe what you know about this competitor or what you'd like to research..."
            required
            rows={4}
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-smooth resize-none shadow-sm hover:shadow-md"
          />
        </div>

        {error && (
          <div className="p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:disabled:from-blue-800 dark:disabled:to-indigo-800 text-white font-semibold transition-smooth disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing (this may take 10-20 minutes)...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span>Start Competitor Research</span>
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-6 p-6 rounded-xl glass-effect shadow-lg border-2 border-blue-200/50 dark:border-blue-800/50 animate-glow">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Research in progress...
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                Deep research typically takes 5-10 minutes. View real-time progress in the panel on the right.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
