
import React from 'react';
import { AnalysisResult, DetectedRegion } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  imageUrl: string;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, imageUrl }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const pieData = [
    { name: 'Health', value: result.health_score },
    { name: 'Deficit', value: 100 - result.health_score },
  ];

  const COLORS = [result.health_score > 70 ? '#10b981' : result.health_score > 40 ? '#f59e0b' : '#ef4444', '#f3f4f6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Image with Bounding Boxes */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm relative group" ref={containerRef}>
          <img src={imageUrl} alt="Cotton analysis" className="w-full h-auto block" />
          
          {/* Overlay Regions */}
          {result.detected_regions.map((region, idx) => {
            const [ymin, xmin, ymax, xmax] = region.box_2d;
            return (
              <div
                key={idx}
                className="absolute border-2 border-emerald-400 bg-emerald-400/10 pointer-events-none flex flex-col items-start"
                style={{
                  top: `${ymin / 10}%`,
                  left: `${xmin / 10}%`,
                  width: `${(xmax - xmin) / 10}%`,
                  height: `${(ymax - ymin) / 10}%`,
                }}
              >
                <span className="bg-emerald-500 text-white text-[10px] px-1 py-0.5 rounded-sm -mt-5 font-bold whitespace-nowrap">
                  {region.label}
                </span>
              </div>
            );
          })}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <p className="text-white text-sm font-medium">Vision-enabled segmentation of cotton structures.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Metrics */}
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
            <div className="w-32 h-32">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-4 lg:-mt-10 lg:ml-2">
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

        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex-1">
          <h2 className="text-lg font-bold text-emerald-900 mb-2">AI Insights</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
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
                   <div className="text-[10px] text-gray-400 uppercase font-bold">Anomaly Logit</div>
                   <div className="text-lg font-bold text-amber-800">{result.anomaly_prob.toFixed(3)}</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
