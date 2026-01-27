
import React, { useState, useRef, useCallback } from 'react';
import { Layout } from './components/Layout';
import { analyzeCottonImage } from './geminiService';
import { AnalysisResult, AnalysisHistoryItem, FeedbackStatus } from './types';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { HistoryLog } from './components/HistoryLog';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisHistoryItem | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setCurrentImageUrl(base64);
        
        try {
          const result = await analyzeCottonImage(base64);
          
          const historyItem: AnalysisHistoryItem = {
            ...result,
            id: Date.now().toString(),
            timestamp: Date.now(),
            imageUrl: base64,
            feedback: { status: 'none' }
          };
          
          setCurrentResult(historyItem);
          setHistory(prev => [historyItem, ...prev].slice(0, 20)); // Keep up to 20 items
        } catch (err) {
          setError("Failed to analyze image. Please try again.");
          console.error(err);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read file.");
      setIsAnalyzing(false);
    }
  };

  const handleFeedback = useCallback((status: FeedbackStatus, issue?: string) => {
    if (!currentResult) return;

    const updatedFeedback = { status, issue };
    
    setCurrentResult(prev => prev ? { ...prev, feedback: updatedFeedback } : null);
    setHistory(prev => prev.map(item => 
      item.id === currentResult.id ? { ...item, feedback: updatedFeedback } : item
    ));
    
    console.debug('Feedback submitted:', { id: currentResult.id, status, issue });
  }, [currentResult]);

  const reset = () => {
    setCurrentResult(null);
    setCurrentImageUrl(null);
    setError(null);
  };

  const selectHistoryItem = (item: AnalysisHistoryItem) => {
    setCurrentResult(item);
    setCurrentImageUrl(item.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      {!currentResult && !isAnalyzing ? (
        <div className="max-w-4xl mx-auto flex flex-col gap-12 py-12 px-4 sm:py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-emerald-900 mb-4 tracking-tight">
              Monitor Your Cotton Crops with AI
            </h1>
            <p className="text-emerald-700/80 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Upload a clear photo of your cotton plant to detect growth stages, evaluate health scores, and identify pests or diseases instantly.
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-emerald-600 rounded-2xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-xl shadow-emerald-500/20"
            >
              Analyze Cotton Plant
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          {history.length > 0 && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <HistoryLog 
                items={history} 
                onSelect={selectHistoryItem} 
               />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">98%</div>
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">&lt;3s</div>
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">10+</div>
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Anomalies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">4</div>
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Phases</div>
            </div>
          </div>
        </div>
      ) : isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-500">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 bg-emerald-100 rounded-full flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Analyzing Field Sample...</h2>
          <p className="text-emerald-700/70 max-w-xs text-center">
            Our agri-vision model is segmenting leaf structures and calculating phenology metrics.
          </p>
          {currentImageUrl && (
            <div className="mt-8 rounded-2xl overflow-hidden border-2 border-emerald-100 opacity-50 grayscale max-w-xs transition-all">
              <img src={currentImageUrl} alt="Preview" className="w-full h-auto" />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={reset}
                className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                New Analysis
              </button>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest hidden sm:block">
                Gemini 3 Visual Reasoning Active
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {currentResult && currentImageUrl && (
              <AnalysisDisplay 
                result={currentResult} 
                imageUrl={currentImageUrl} 
                onFeedback={handleFeedback}
                existingFeedback={currentResult.feedback}
              />
            )}
          </div>

          {/* Detailed Sidebar History Log */}
          <div className="lg:col-span-3">
             <div className="sticky top-24">
                <HistoryLog 
                  items={history} 
                  currentItemId={currentResult?.id} 
                  onSelect={selectHistoryItem} 
                />
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
