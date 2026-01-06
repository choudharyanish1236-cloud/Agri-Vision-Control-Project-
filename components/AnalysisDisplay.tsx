
import React, { useState } from 'react';
import { AnalysisResult, FeedbackStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  imageUrl: string;
  onFeedback: (status: FeedbackStatus, issue?: string) => void;
  existingFeedback?: { status: FeedbackStatus; issue?: string };
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, imageUrl, onFeedback, existingFeedback }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);

  const pieData = [
    { name: 'Health', value: result.health_score },
    { name: 'Deficit', value: 100 - result.health_score },
  ];

  const COLORS = [result.health_score > 70 ? '#10b981' : result.health_score > 40 ? '#f59e0b' : '#ef4444', '#f3f4f6'];

  const handleIncorrect = (issue: string) => {
    onFeedback('incorrect', issue);
    setShowIssueForm(false);
  };

  const isFeedbackGiven = existingFeedback && existingFeedback.status !== 'none';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Image with Bounding Boxes */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm relative group" ref={containerRef}>
          <img src={imageUrl} alt="Cotton analysis" className="w-full h-auto block" />
          
          {/* Overlay Regions */}
          {result.detected_regions.map((region, idx) => {
            const [ymin, xmin, ymax, xmax] = region.box_2d;
            const isAnomaly = region.is_anomaly;
            
            return (
              <div
                key={idx}
                className={`absolute border-2 transition-all duration-300 pointer-events-none flex flex-col items-start ${
                  isAnomaly 
                    ? 'border-red-500 bg-red-500/10 animate-pulse' 
                    : 'border-emerald-400 bg-emerald-400/10'
                }`}
                style={{
                  top: `${ymin / 10}%`,
                  left: `${xmin / 10}%`,
                  width: `${(xmax - xmin) / 10}%`,
                  height: `${(ymax - ymin) / 10}%`,
                  zIndex: isAnomaly ? 20 : 10
                }}
              >
                <span className={`text-white text-[10px] px-1 py-0.5 rounded-sm -mt-5 font-bold whitespace-nowrap shadow-sm ${
                  isAnomaly ? 'bg-red-600' : 'bg-emerald-500'
                }`}>
                  {isAnomaly ? '⚠️ ' : ''}{region.label}
                </span>
              </div>
            );
          })}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <p className="text-white text-sm font-medium">
              Spatial analysis: {result.detected_regions.filter(r => r.is_anomaly).length} health risk regions identified.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Metrics & Feedback */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-900">Health Score</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              result.health_score > 70 ? 'bg-emerald-100 text-emerald-700' : 
              result.health_score > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              {result.health_score > 70 ? 'Optimal' : result.health_score > 40 ? 'Monitoring' : 'Critical'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-emerald-900">{result.health_score}</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium uppercase tracking-wider">Growth Stage</span>
                  <span className="text-emerald-700 font-bold">{Math.round(result.stage_conf * 100)}% Match</span>
                </div>
                <div className="text-lg font-bold text-emerald-900 leading-tight">
                  {result.stage}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium uppercase tracking-wider">Anomaly Status</span>
                  <span className={`${result.is_anomaly ? 'text-red-600' : 'text-emerald-600'} font-bold`}>
                    {result.is_anomaly ? 'Detected' : 'Clear'}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  Risk Level: <span className="font-bold">{Math.round(result.anomaly_prob * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-emerald-900">AI Insights</h2>
            {result.is_anomaly && (
              <span className="animate-pulse bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Action Required
              </span>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed text-sm flex-grow">
            {result.description}
          </p>
          
          <div className="mt-6 pt-6 border-t border-emerald-50">
             <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Technical Summary</div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <div className="text-[10px] text-gray-400 uppercase font-bold">Class Prob</div>
                   <div className="text-lg font-bold text-emerald-800">{result.stage_conf.toFixed(3)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <div className="text-[10px] text-gray-400 uppercase font-bold">Anomaly Prob</div>
                   <div className="text-lg font-bold text-amber-800">{result.anomaly_prob.toFixed(3)}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
          {!isFeedbackGiven ? (
            <>
              {!showIssueForm ? (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-bold">Was this analysis accurate?</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => onFeedback('accurate')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.133a1.5 1.5 0 00-.8.2z" />
                      </svg>
                      Yes, correct
                    </button>
                    <button 
                      onClick={() => setShowIssueForm(true)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.867a1.5 1.5 0 00.8-.2z" />
                      </svg>
                      Report issue
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">What was incorrect?</h3>
                    <button onClick={() => setShowIssueForm(false)} className="text-white/60 hover:text-white">
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Wrong Growth Stage',
                      'Missed Anomaly',
                      'Incorrect Health Score',
                      'Poor Image Segmentation'
                    ].map((issue) => (
                      <button
                        key={issue}
                        onClick={() => handleIncorrect(issue)}
                        className="text-left bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors text-sm"
                      >
                        {issue}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 animate-in fade-in zoom-in duration-500">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-bold text-center">Thanks for your feedback!</p>
              <p className="text-white/60 text-xs mt-1">This helps refine our AgriVision model.</p>
              {existingFeedback?.issue && (
                <span className="mt-4 bg-white/10 px-3 py-1 rounded-lg text-[10px] font-mono border border-white/10 uppercase tracking-widest">
                  Issue: {existingFeedback.issue}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
