
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
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-emerald-50 bg-emerald-50/30 flex items-center justify-between">
        <h3 className="font-bold text-emerald-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Field Log History
        </h3>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {items.length} Samples
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[500px] lg:max-h-[600px] scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
        <div className="divide-y divide-emerald-50">
          {items.map((item) => {
            const isActive = currentItemId === item.id;
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            return (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`w-full flex items-start gap-4 p-4 text-left transition-all hover:bg-emerald-50/50 group ${
                  isActive ? 'bg-emerald-50 ring-1 ring-inset ring-emerald-200' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    isActive ? 'border-emerald-500 scale-105 shadow-md' : 'border-emerald-100'
                  }`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.stage} 
                      className={`w-full h-full object-cover transition-all ${!isActive && 'grayscale group-hover:grayscale-0'}`} 
                    />
                  </div>
                  {item.is_anomaly && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      item.is_anomaly ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {item.is_anomaly ? 'Anomaly Detected' : 'Healthy'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <h4 className={`text-sm font-bold truncate ${isActive ? 'text-emerald-900' : 'text-gray-700'}`}>
                    {item.stage.replace('Phase ', 'P')}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formattedTime}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.health_score}%
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {items.length > 5 && (
        <div className="p-3 bg-emerald-50/50 text-center">
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter opacity-60">
            Scroll for more results
          </p>
        </div>
      )}
    </div>
  );
};
