
import React from 'react';

export const DocsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-emerald-900 mb-4 tracking-tight">AI Documentation</h2>
        <p className="text-emerald-700/70 text-lg">Understanding the AgriVision Cotton analysis engine and phenology metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Growth Stages */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">01</span>
            Growth Phases
          </h3>
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-bold text-emerald-800 text-sm uppercase">Phase 1: Seedling</h4>
              <p className="text-xs text-gray-600 mt-1">Identified by the appearance of the first true leaves. Critical stage for moisture monitoring.</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-bold text-emerald-800 text-sm uppercase">Phase 2: Squareing</h4>
              <p className="text-xs text-gray-600 mt-1">First appearance of floral buds (squares). Primary stage for pest intervention.</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-bold text-emerald-800 text-sm uppercase">Phase 3: Bloom</h4>
              <p className="text-xs text-gray-600 mt-1">Active flowering (white/pink). High nutrient demand period detected by spectral variance.</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-bold text-emerald-800 text-sm uppercase">Phase 4: Boll Development</h4>
              <p className="text-xs text-gray-600 mt-1">Green pod formation and lint emergence. Final monitoring before harvest preparation.</p>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">02</span>
            Scoring Algorithm
          </h3>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6">
            <code className="text-emerald-800 font-mono text-sm block text-center">
              Score = 100 × (Conf<sub>stage</sub> × (1 - Prob<sub>anomaly</sub>))
            </code>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-emerald-900 text-sm mb-1">Anomaly Detection</h4>
              <p className="text-xs text-gray-600">Our model localizes 12+ types of anomalies including Aphids, Whiteflies, Bacterial Blight, and Potassium deficiency.</p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm mb-1">Confidence vs. Severity</h4>
              <p className="text-xs text-gray-600">The percentage gauge reflects a hybrid of detection confidence and observed severity of the health issue.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-emerald-900 rounded-3xl p-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Need Field Support?</h3>
        <p className="text-emerald-100/70 mb-8 max-w-xl mx-auto">Access our full developer API documentation or contact our agronomist support team for custom enterprise integrations.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors">Developer API</button>
          <button className="bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl border border-emerald-700 hover:bg-emerald-700 transition-colors">Contact Support</button>
        </div>
      </div>
    </div>
  );
};
