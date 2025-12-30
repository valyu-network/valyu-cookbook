'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CompetitorAnalysisForm from './components/CompetitorAnalysisForm';
import ResearchResults from './components/ResearchResults';
import Sidebar from './components/Sidebar';
import SignInModal from './components/SignInModal';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

function HomeContent() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDiscordBanner, setShowDiscordBanner] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showAuthSuccess, setShowAuthSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('valyu_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('valyu_user');
      }
    }

    // Check if user just completed authentication
    const authStatus = searchParams.get('auth');
    if (authStatus === 'success') {
      setShowAuthSuccess(true);
      // Reload user from localStorage after successful auth
      const newUser = localStorage.getItem('valyu_user');
      if (newUser) {
        try {
          setUser(JSON.parse(newUser));
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
      // Hide success message after 5 seconds
      setTimeout(() => setShowAuthSuccess(false), 5000);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

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
      {/* Sidebar */}
      <Sidebar onSignInClick={() => setShowSignInModal(true)} user={user} />

      {/* Sign In Modal */}
      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />

      {/* Authentication Success Notification */}
      {showAuthSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl px-6 py-4 shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-green-900 dark:text-green-100">
                Successfully signed in!
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Welcome to Valyu Competitor Analysis
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discord Banner - Top Left */}
      {showDiscordBanner && (
        <div className="fixed top-4 left-4 z-50">
          <a
            href="https://discord.gg/BhUWrFbHRa"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm"
          >
            {/* Discord Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Join the Valyu Discord</span>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDiscordBanner(false);
              }}
              className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </a>
        </div>
      )}

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
                user={user}
                onSignInClick={() => setShowSignInModal(true)}
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
                user={user}
                onSignInClick={() => setShowSignInModal(true)}
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
