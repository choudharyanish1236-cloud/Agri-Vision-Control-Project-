import React, { useState, useRef } from 'react';
import { DatasetUploadResponse, DatasetStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const DatasetInspector: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<DatasetUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError('Please select a .zip archive of your dataset.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming backend is running on port 8000
      const response = await fetch('http://localhost:8000/upload_dataset', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to upload dataset');
      }

      const data: DatasetUploadResponse = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection to analysis backend failed. Ensure app.py is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const getChartData = (splitStats: DatasetStats) => {
    return Object.entries(splitStats.class_counts).map(([name, count]) => ({
      name,
      count
    }));
  };

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-emerald-900 mb-4 tracking-tight">Dataset Auditor</h2>
        <p className="text-emerald-700/70 text-lg">Upload your cotton dataset (folder-per-class) to verify splits and model compatibility.</p>
      </div>

      {!results && !isUploading && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-emerald-200 p-12 text-center hover:border-emerald-400 transition-colors group cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Select Dataset Archive</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Supports .zip files containing images organized into subfolders by growth stage or health condition.</p>
          <button className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
            Upload .zip
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".zip" 
            onChange={handleFileSelect} 
          />
        </div>
      )}

      {isUploading && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-black text-emerald-900 mb-2">Extracting & Splitting...</h3>
          <p className="text-emerald-700/60 max-w-md mx-auto">Our backend is currently stratifying your data into Train, Val, and Test splits while running a pipeline sanity check.</p>
          <div className="mt-8 w-full max-w-xs mx-auto bg-emerald-50 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in shake duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold">Dismiss</button>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          {/* Main Dashboard Panel */}
          <div className="lg:col-span-8 space-y-8">
            {/* Sanity Check Success Card */}
            <div className={`p-8 rounded-3xl border shadow-sm flex items-center gap-6 ${results.pipeline_sanity_check ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${results.pipeline_sanity_check ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {results.pipeline_sanity_check ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className={`text-2xl font-black ${results.pipeline_sanity_check ? 'text-emerald-900' : 'text-red-900'}`}>
                  {results.pipeline_sanity_check ? 'Pipeline Ready' : 'Pipeline Fault Detected'}
                </h3>
                <p className={`${results.pipeline_sanity_check ? 'text-emerald-700/70' : 'text-red-700/70'}`}>
                  {results.pipeline_sanity_check 
                    ? `Dataset successfully parsed. Tensors verified: [${results.sample_run.batch_shape?.join(', ')}]` 
                    : `Error: ${results.sample_run.error}`}
                </p>
              </div>
              <button onClick={() => setResults(null)} className="ml-auto text-emerald-600 font-bold hover:underline">New Upload</button>
            </div>

            {/* Split Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* FIX: Explicitly cast Object.entries to [string, DatasetStats][] to ensure proper type inference of 'stats' as DatasetStats */}
              {(Object.entries(results.stats) as [string, DatasetStats][]).map(([split, stats]) => (
                <div key={split} className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">{split}</h4>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {stats.num_samples} imgs
                    </span>
                  </div>
                  <div className="h-40 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData(stats)}>
                        <XAxis dataKey="name" hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#064e3b', borderRadius: '12px', border: 'none', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="count">
                          {getChartData(stats).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-50">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Class Balancer</div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.keys(stats.class_counts).map((cls, idx) => (
                        <span key={cls} className="text-[9px] font-bold px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md border border-gray-100">
                          {cls}: {stats.class_counts[cls]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Metadata */}
            <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-xl">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Pipeline Trace & Output Tensors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 font-black block mb-1">Input Batch Size:</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 block">
                      {results.sample_run.batch_shape?.join(' × ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-black block mb-1">Backbone Output:</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 block">
                      {results.sample_run.output_shape?.join(' × ')}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 font-black block mb-1">Working Directory:</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 block truncate">
                      {results.work_dir}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-black block mb-1">Upload Token:</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 block">
                      {results.upload_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Samples */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm h-full">
              <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-4 border-b border-emerald-50 pb-4">
                Processed Sample Manifest
              </h4>
              <div className="space-y-3">
                {results.sample_run.sample_paths?.map((path, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                    <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center text-emerald-700 font-black text-xs">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-emerald-900 truncate">{path}</div>
                      <div className="text-[9px] text-emerald-600/60 font-medium">Verified Tensor Mapping</div>
                    </div>
                  </div>
                ))}
                {(!results.sample_run.sample_paths || results.sample_run.sample_paths.length === 0) && (
                  <p className="text-xs text-gray-400 italic text-center py-10">No sample manifest available for this run.</p>
                )}
              </div>
              <div className="mt-8 p-6 bg-emerald-600 rounded-2xl text-white">
                <h5 className="font-bold text-sm mb-2">Model Training Ready?</h5>
                <p className="text-[11px] opacity-80 leading-relaxed mb-4">
                  These splits are now ready for a stratified K-fold training loop. Use the generated `processed/` directory path in your training script.
                </p>
                <button className="w-full bg-white text-emerald-600 font-black text-xs py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                  Copy Processed Path
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};