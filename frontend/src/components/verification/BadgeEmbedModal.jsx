import React, { useState } from 'react';
import { FileCheck2, Copy, Check } from 'lucide-react';
import { api } from '../../services/api';

export function BadgeEmbedModal({ cert, onClose }) {
  const [copiedType, setCopiedType] = useState('');

  if (!cert) return null;

  const badgeUrl = `${window.location.origin}${api.getBadgeSvgUrl(cert.certificateId)}`;
  const verifyLink = `${window.location.origin}#${cert.certificateId}`;

  const htmlCode = `<a href="${verifyLink}" target="_blank"><img src="${badgeUrl}" alt="CertiVerify Verified" /></a>`;
  const markdownCode = `[![CertiVerify Badge](${badgeUrl})](${verifyLink})`;

  const handleCopy = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <span>Embed Dynamic Verification Badge</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-center">
          <img src={badgeUrl} alt="Verification Badge" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              HTML Snippet (for Websites & Portfolios)
            </label>
            <button
              onClick={() => handleCopy(htmlCode, 'html')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'html' ? 'Copied HTML' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows="2"
            value={htmlCode}
            className="w-full p-2.5 font-mono text-xs bg-slate-100 rounded-xl border border-slate-300 select-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Markdown Snippet (for GitHub READMEs)
            </label>
            <button
              onClick={() => handleCopy(markdownCode, 'markdown')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'markdown' ? 'Copied Markdown' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows="2"
            value={markdownCode}
            className="w-full p-2.5 font-mono text-xs bg-slate-100 rounded-xl border border-slate-300 select-all"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="gradient-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

