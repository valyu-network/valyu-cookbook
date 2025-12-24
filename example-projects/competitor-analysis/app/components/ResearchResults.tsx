'use client';

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
}

export default function ResearchResults({ result, isLoading, onReset }: ResearchResultsProps) {
  // Get status message
  const getStatusMessage = () => {
    if (!result) return 'Initializing...';

    const statusMap: Record<string, string> = {
      'queued': 'Task queued, waiting to start...',
      'running': 'Research in progress, analyzing sources...',
      'completed': 'Research completed!',
      'failed': 'Research failed'
    };
    return statusMap[result.status] || 'Processing...';
  };

  // Show loading state
  if (isLoading || !result || !result.output) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-3">
            Research in Progress
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Deep research is running. This typically takes 5-10 minutes.
          </p>
        </div>

        {/* Status Card */}
        <div className="p-8 rounded-2xl glass-effect shadow-premium border-2 border-blue-200/50 dark:border-blue-800/50 mb-6 animate-glow">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {getStatusMessage()}
              </h3>

              {result?.progress && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Step {result.progress.current_step} of {result.progress.total_steps}
                    </span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {Math.round((result.progress.current_step / result.progress.total_steps) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${(result.progress.current_step / result.progress.total_steps) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                  <span className="font-medium">Searching multiple sources across the web</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse delay-75 shadow-lg shadow-indigo-500/50"></div>
                  <span className="font-medium">Analyzing content and extracting insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse delay-150 shadow-lg shadow-purple-500/50"></div>
                  <span className="font-medium">Generating comprehensive report</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="p-6 rounded-xl glass-effect shadow-lg border-2 border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">💡</div>
            <h4 className="text-base font-bold text-blue-900 dark:text-blue-100 pt-1">
              What's happening?
            </h4>
          </div>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2.5 ml-11">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span className="font-medium">Valyu is researching from multiple trusted sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span className="font-medium">Analyzing competitor's products, strategy, and positioning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span className="font-medium">Generating detailed insights with citations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span className="font-medium">Creating a downloadable PDF report</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
          Research Results
        </h2>
        <div className="flex gap-3">
          {result.pdf_url ? (
            <a
              href={result.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold transition-smooth flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </a>
          ) : (
            <div className="px-5 py-2.5 rounded-xl glass-effect border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2 shadow-md">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              PDF Generating...
            </div>
          )}
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl glass-effect hover:shadow-lg text-slate-900 dark:text-slate-100 font-semibold transition-smooth border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Main research output - Combined scrollable container */}
      <div className="rounded-2xl glass-effect border-2 border-slate-200/50 dark:border-slate-800/50 shadow-premium max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Markdown Report */}
        <div className="p-8">
          <div className="prose prose-zinc dark:prose-invert max-w-none
            prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h1:first:mt-0
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-strong:font-semibold
            prose-ul:my-4 prose-ul:space-y-2
            prose-ol:my-4 prose-ol:space-y-2
            prose-li:text-zinc-700 dark:prose-li:text-zinc-300
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-zinc-900 dark:prose-code:text-zinc-100 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-700
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-1 prose-blockquote:px-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.output}
            </ReactMarkdown>
          </div>
        </div>

        {/* Interactive Sources Section */}
        {result.sources && result.sources.length > 0 && (
          <div className="px-8 py-8 border-t-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/30 dark:to-transparent">
            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              Research Sources ({result.sources.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-xl glass-effect border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-smooth group transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-snug">
                        {source.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {new URL(source.url).hostname}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Usage Metrics Section */}
        {result.usage && (
          <div className="p-8 border-t-2 border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-slate-50/30 to-transparent dark:from-slate-900/20 dark:to-transparent">
            <h3 className="text-base font-bold mb-5 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Usage Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {result.usage.search_cost !== undefined && (
                <div className="p-5 rounded-xl glass-effect border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-smooth">
                  <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">Search</p>
                  <p className="font-bold text-lg text-slate-900 dark:text-slate-100">${result.usage.search_cost.toFixed(4)}</p>
                </div>
              )}
              {result.usage.ai_cost !== undefined && (
                <div className="p-5 rounded-xl glass-effect border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-smooth">
                  <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">AI</p>
                  <p className="font-bold text-lg text-slate-900 dark:text-slate-100">${result.usage.ai_cost.toFixed(4)}</p>
                </div>
              )}
              {result.usage.compute_cost !== undefined && (
                <div className="p-5 rounded-xl glass-effect border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-smooth">
                  <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">Compute</p>
                  <p className="font-bold text-lg text-slate-900 dark:text-slate-100">${result.usage.compute_cost.toFixed(4)}</p>
                </div>
              )}
              {result.usage.total_cost !== undefined && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 border-2 border-blue-400 dark:border-indigo-400 shadow-lg hover:shadow-xl transition-smooth">
                  <p className="text-blue-100 dark:text-indigo-100 mb-2 font-semibold">Total</p>
                  <p className="font-bold text-xl text-white">${result.usage.total_cost.toFixed(4)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
