import React from 'react';
import { ShieldCheck, Database, FileText, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              CV
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">CertiVerify Cloud System</span>
              <span className="text-slate-500 text-[11px]">
                Cryptographic Digital Certificate Verification & Audit Authority
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-slate-600">
            <span className="inline-flex items-center space-x-1">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>PostgreSQL & AWS S3</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-pink-500" />
              <span>SHA-256 Tamper Proof</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>OpenPDF & ZXing 2D Matrix</span>
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} CertiVerify. Designed with high-performance modern web architecture.</p>
          <div className="flex items-center space-x-3">
            <span>Spring Boot 3</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

