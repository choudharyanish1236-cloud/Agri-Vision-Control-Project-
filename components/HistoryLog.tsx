
import React from 'react';
import { AnalysisHistoryItem } from '../types';

interface HistoryLogProps {
  items: AnalysisHistoryItem[];
  currentItemId?: string;
  onSelect: (item: AnalysisHistoryItem) => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ items, currentItemId, onSelect }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col h-full lg:max-h-[calc(100vh-160px)]">
      {/* Header - Sticky */}
      <div className="p-4 border-b border-emerald-50 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-between">
        <h3 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Field Log
        </h3>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {items.length} Samples
        </span>
      </div>
      
      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent">
        <div className="divide-y divide-emerald-50/50">
          {items.map((item) => {
            const isActive = currentItemId === item.id;
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            return (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`w-full flex items-start gap-3 p-3.5 text-left transition-all hover:bg-emerald-50/50 group relative ${
                  isActive ? 'bg-emerald-50/80 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border transition-all duration-300 ${
                    isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-100'
                  }`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.stage} 
                      className={`w-full h-full object-cover transition-all duration-500 ${!isActive ? 'grayscale-[0.5] group-hover:grayscale-0' : ''}`} 
                    />
                    {/* Scanning Line Effect on Hover */}
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400/50 animate-[scan_2s_linear_infinite]" />
                    </div>
                  </div>
                  {item.is_anomaly && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                       <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      item.is_anomaly ? 'text-red-500' : 'text-emerald-600'
                    }`}>
                      {item.is_anomaly ? 'Anomaly' : 'Healthy'}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <h4 className={`text-xs font-bold truncate transition-colors ${isActive ? 'text-emerald-900' : 'text-gray-700'}`}>
                    {item.stage.replace('Phase ', 'P')}
                  </h4>
                  
                  <div className="flex items-center gap-2.5 mt-1">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formattedTime}
                    </div>
                    <div className="text-[10px] text-emerald-600/70 flex items-center gap-1 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.health_score}%
                    </div>
                  </div>
                </div>

                {/* Selected Indicator */}
                {isActive && (
                  <div className="self-center absolute right-2 opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-3 bg-emerald-50/30 text-center border-t border-emerald-50">
        <p className="text-[9px] text-emerald-600/50 font-black uppercase tracking-widest">
          Cloud Sync Enabled
        </p>
      </div>

      <style>{`
        @keyframes scan {
          from { top: 0%; }
          to { top: 100%; }
        }
      `}</style>
    </div>
  );
};
