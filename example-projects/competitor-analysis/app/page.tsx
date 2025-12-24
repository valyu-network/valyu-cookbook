'use client';

import { useState } from 'react';
import CompetitorAnalysisForm from './components/CompetitorAnalysisForm';
import ResearchResults from './components/ResearchResults';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-float delay-150"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float delay-75"></div>
      </div>

      <main className="max-w-7xl mx-auto relative z-10">
        {/* Main Content */}
        {!isAnalyzing && !analysisResult ? (
          // Centered layout before analysis starts
          <>
            {/* Header - Centered */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-effect shadow-lg mb-8 transition-smooth hover:shadow-xl">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Powered by Valyu Deep Research
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
                Competitor Analysis
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Get comprehensive insights about any competitor with AI-powered deep research.
                Analyzes multiple sources to provide detailed reports on products, market positioning, and strategy.
              </p>
            </div>

            {/* Centered form */}
            <div className="flex justify-center">
              <CompetitorAnalysisForm
                onAnalysisStart={handleAnalysisStart}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          </>
        ) : (
          // Side by Side Layout after analysis starts
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - Header + Form */}
            <div className="w-full space-y-6 lg:col-span-4">
              {/* Header - Left aligned */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect shadow-md mb-5 transition-smooth hover:shadow-lg">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Powered by Valyu Deep Research
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
                  Competitor Analysis
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Get comprehensive insights about any competitor with AI-powered deep research.
                  Analyzes multiple sources to provide detailed reports on products, market positioning, and strategy.
                </p>
              </div>

              {/* Form */}
              <CompetitorAnalysisForm
                onAnalysisStart={handleAnalysisStart}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>

            {/* Right Column - Results */}
            <div className="w-full lg:col-span-8">
              <ResearchResults
                result={analysisResult}
                isLoading={isAnalyzing && !analysisResult}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

      
      </main>
    </div>
  );
}
