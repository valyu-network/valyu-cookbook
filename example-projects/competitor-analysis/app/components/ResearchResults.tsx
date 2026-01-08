'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Source {
  title: string;
  url: string;
}

interface Usage {
  search_cost?: number;
  ai_cost?: number;
  compute_cost?: number;
  total_cost?: number;
}

interface Progress {
  current_step: number;
  total_steps: number;
}

interface ResearchResult {
  success: boolean;
  deepresearch_id: string;
  status: string;
  output?: string;
  sources?: Source[];
  usage?: Usage;
  pdf_url?: string;
  progress?: Progress;
}

interface ResearchResultsProps {
  result: ResearchResult | null;
  isLoading: boolean;
  onReset: () => void;
  onCancel?: () => void;
  isCancelling?: boolean;
}

export default function ResearchResults({ result, isLoading, onReset, onCancel, isCancelling }: ResearchResultsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!result?.pdf_url) return;

    setIsDownloading(true);
    try {
      const response = await fetch(result.pdf_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `competitor-analysis-${result.deepresearch_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(result.pdf_url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Get status message
  const getStatusMessage = () => {
    if (!result) return 'Initializing...';

    const statusMap: Record<string, string> = {
      'queued': 'Task queued, waiting to start...',
      'running': 'Research in progress...',
      'completed': 'Research completed',
      'failed': 'Research failed'
    };
    return statusMap[result.status] || 'Processing...';
  };

  // Show loading state
  if (isLoading || !result || !result.output) {
    return (
      <div className="w-full">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Research in Progress
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Deep research is running. This typically takes 5-10 minutes.
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className="px-3 py-1.5 rounded-md text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-notion flex items-center gap-1.5"
            >
              {isCancelling ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>

        {/* Status Card */}
        <div className="p-6 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] shadow-notion-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-[var(--foreground-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-[var(--foreground)] mb-3">
                {getStatusMessage()}
              </h3>

              {result?.progress && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--foreground-secondary)]">
                      Step {result.progress.current_step} of {result.progress.total_steps}
                    </span>
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      {Math.round((result.progress.current_step / result.progress.total_steps) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--background-secondary)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(result.progress.current_step / result.progress.total_steps) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm text-[var(--foreground-secondary)]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full"></div>
                  <span>Searching multiple sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--accent-orange)] rounded-full"></div>
                  <span>Analyzing content</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--accent-amber)] rounded-full"></div>
                  <span>Extracting key insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--accent-gray)] rounded-full"></div>
                  <span>Generating report</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Tips - separate card */}
        <div className="mt-8 p-6 rounded-lg bg-[var(--background-secondary)] border border-[var(--border-color)]">
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
            What's happening?
          </h4>
          <ul className="text-xs text-[var(--foreground-secondary)] space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-[var(--foreground-tertiary)]">•</span>
              <span>Researching from multiple trusted sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--foreground-tertiary)]">•</span>
              <span>Analyzing products, strategy, and positioning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--foreground-tertiary)]">•</span>
              <span>Generating insights with citations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--foreground-tertiary)]">•</span>
              <span>Creating a downloadable PDF report</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Research Results
        </h2>
        <div className="flex gap-2">
          {result.pdf_url ? (
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-md bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:bg-[var(--foreground-tertiary)] text-[var(--primary-foreground)] text-sm font-medium transition-notion flex items-center gap-2 disabled:cursor-wait"
            >
              {isDownloading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-md bg-[var(--background-secondary)] border border-[var(--border-color)] text-[var(--foreground-secondary)] text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              PDF Generating...
            </div>
          )}
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-md bg-[var(--background)] hover:bg-[var(--hover-bg)] text-[var(--foreground)] text-sm font-medium transition-notion border border-[var(--border-color)]"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Main research output */}
      <div className="rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] shadow-notion-sm max-h-[calc(100vh-160px)] overflow-y-auto">
        {/* Markdown Report */}
        <div className="p-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:text-[var(--foreground)] prose-headings:font-semibold
            prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6 prose-h1:first:mt-0
            prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
            prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-[var(--foreground-secondary)] prose-p:leading-relaxed prose-p:mb-3 prose-p:text-sm
            prose-strong:text-[var(--foreground)] prose-strong:font-medium
            prose-ul:my-3 prose-ul:space-y-1
            prose-ol:my-3 prose-ol:space-y-1
            prose-li:text-[var(--foreground-secondary)] prose-li:text-sm
            prose-a:text-[var(--foreground)] prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[var(--foreground-secondary)]
            prose-code:text-[var(--foreground)] prose-code:bg-[var(--background-secondary)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-normal
            prose-pre:bg-[var(--background-secondary)] prose-pre:border prose-pre:border-[var(--border-color)] prose-pre:text-sm
            prose-blockquote:border-l-[var(--border-color-strong)] prose-blockquote:bg-[var(--background-secondary)] prose-blockquote:py-0.5 prose-blockquote:px-4 prose-blockquote:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.output}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sources Section */}
        {result.sources && result.sources.length > 0 && (
          <div className="px-8 py-6 border-t border-[var(--border-color)] bg-[var(--background-secondary)]">
            <h3 className="text-sm font-medium mb-4 text-[var(--foreground)] flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--foreground-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Sources ({result.sources.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.sources.map((source, index) => {
                const domain = (() => {
                  try {
                    return new URL(source.url).hostname;
                  } catch {
                    return '';
                  }
                })();
                return (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-md bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--border-color-strong)] hover:shadow-notion-sm transition-notion group"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                        alt=""
                        className="w-5 h-5 mt-0.5 flex-shrink-0 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--foreground)] group-hover:underline line-clamp-2 leading-snug">
                          {source.title}
                        </p>
                        <p className="text-xs text-[var(--foreground-tertiary)] truncate mt-1">
                          {domain}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Usage Metrics Section */}
        {result.usage && (
          <div className="p-6 border-t border-[var(--border-color)]">
            <h3 className="text-sm font-medium mb-4 text-[var(--foreground)] flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--foreground-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Usage
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {result.usage.search_cost !== undefined && (
                <div className="p-3 rounded-md bg-[var(--background-secondary)] border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--foreground-tertiary)] mb-1">Search</p>
                  <p className="font-medium text-[var(--foreground)]">${result.usage.search_cost.toFixed(4)}</p>
                </div>
              )}
              {result.usage.ai_cost !== undefined && (
                <div className="p-3 rounded-md bg-[var(--background-secondary)] border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--foreground-tertiary)] mb-1">AI</p>
                  <p className="font-medium text-[var(--foreground)]">${result.usage.ai_cost.toFixed(4)}</p>
                </div>
              )}
              {result.usage.compute_cost !== undefined && (
                <div className="p-3 rounded-md bg-[var(--background-secondary)] border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--foreground-tertiary)] mb-1">Compute</p>
                  <p className="font-medium text-[var(--foreground)]">${result.usage.compute_cost.toFixed(4)}</p>
                </div>
              )}
              {result.usage.total_cost !== undefined && (
                <div className="p-3 rounded-md bg-[var(--primary)] border border-[var(--primary)]">
                  <p className="text-xs text-[var(--background)]/70 mb-1">Total</p>
                  <p className="font-medium text-[var(--background)]">${result.usage.total_cost.toFixed(4)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
