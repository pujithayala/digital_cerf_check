import React from 'react';
import { Search, Camera, RefreshCw, ShieldCheck } from 'lucide-react';

export function VerifySearch({
  certInputId,
  setCertInputId,
  loadingVerify,
  onVerify,
  onOpenScanner,
}) {
  const sampleCredentials = [
    { id: 'CV-2026-CLOUD01', label: 'Sarah Jenkins', tag: 'Verified', color: 'emerald' },
    { id: 'CV-2026-AI8899', label: 'Alexander Zhao', tag: 'Distinction', color: 'blue' },
    { id: 'CV-2025-REVOKED9', label: 'Marcus Vance', tag: 'Revoked', color: 'red' },
    { id: 'CV-2024-EXP404', label: 'Elena Rostova', tag: 'Expired', color: 'amber' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certInputId.trim()) {
      onVerify(certInputId.trim());
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={certInputId}
            onChange={(e) => setCertInputId(e.target.value.toUpperCase())}
            placeholder="e.g. CV-2026-CLOUD01"
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-300 bg-white/95 text-slate-900 placeholder-slate-400 font-mono text-base tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
          />
          <button
            type="button"
            onClick={onOpenScanner}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title="Scan QR Code from Camera or File"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={loadingVerify || !certInputId.trim()}
          className="gradient-btn-primary px-7 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
        >
          {loadingVerify ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Verify Authenticity</span>
            </>
          )}
        </button>
      </form>

      {/* Quick-fill Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Quick Test Credentials:</span>
        {sampleCredentials.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCertInputId(c.id);
              onVerify(c.id);
            }}
            className={`px-2.5 py-1 rounded-lg font-mono transition-colors border ${
              c.color === 'emerald'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : c.color === 'blue'
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : c.color === 'red'
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {c.id} ({c.tag})
          </button>
        ))}
      </div>
    </div>
  );
}

