import React from 'react';
import { Award, CheckCircle, Layers } from 'lucide-react';

export function StatsCounters({ stats }) {
  const { totalCertificates = 0, verifiedCertificates = 0, totalVerifications = 0 } = stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-card p-5 text-center">
        <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
          <Award className="w-5 h-5" />
        </div>
        <div className="text-2xl font-extrabold text-slate-800">{totalCertificates}</div>
        <div className="text-xs text-slate-500 font-medium">Registered Cloud Certificates</div>
      </div>

      <div className="glass-card p-5 text-center">
        <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div className="text-2xl font-extrabold text-emerald-700">{verifiedCertificates}</div>
        <div className="text-xs text-slate-500 font-medium">Active & Valid Records</div>
      </div>

      <div className="glass-card p-5 text-center">
        <div className="w-10 h-10 mx-auto rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-2">
          <Layers className="w-5 h-5" />
        </div>
        <div className="text-2xl font-extrabold text-pink-700">{totalVerifications}</div>
        <div className="text-xs text-slate-500 font-medium">Real-Time Verification Checks</div>
      </div>
    </div>
  );
}

