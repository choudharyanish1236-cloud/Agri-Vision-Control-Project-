
import React from 'react';

export type NavView = 'dashboard' | 'docs' | 'dataset';

interface LayoutProps {
  children: React.ReactNode;
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  onScrollToLog?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, onScrollToLog }) => {
  return (
    <div className="min-h-screen bg-emerald-50/30 transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <span className="text-white font-bold text-xl leading-none">A</span>
            </div>
            <h1 className="text-xl font-bold text-emerald-900 tracking-tight">
              AgriVision <span className="text-emerald-600">Cotton</span>
            </h1>
          </button>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`relative py-2 transition-colors ${
                activeView === 'dashboard' ? 'text-emerald-600' : 'text-emerald-800/60 hover:text-emerald-600'
              }`}
            >
              Real-time AI
              {activeView === 'dashboard' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
            
            <button 
              onClick={() => onNavigate('dataset')}
              className={`relative py-2 transition-colors ${
                activeView === 'dataset' ? 'text-emerald-600' : 'text-emerald-800/60 hover:text-emerald-600'
              }`}
            >
              Dataset Audit
              {activeView === 'dataset' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>

            <button 
              onClick={() => {
                onNavigate('dashboard');
                setTimeout(() => onScrollToLog?.(), 100);
              }}
              className="text-emerald-800/60 hover:text-emerald-600 transition-colors py-2"
            >
              Field Log
            </button>
            
            <button 
              onClick={() => onNavigate('docs')}
              className={`relative py-2 transition-colors ${
                activeView === 'docs' ? 'text-emerald-600' : 'text-emerald-800/60 hover:text-emerald-600'
              }`}
            >
              AI Docs
              {activeView === 'docs' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">System Status</span>
              <span className="text-[10px] font-bold text-emerald-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Analysis
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8">
        {children}
      </main>
    </div>
  );
};
