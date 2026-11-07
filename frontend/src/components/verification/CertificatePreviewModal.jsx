import React from 'react';
import { Download } from 'lucide-react';
import { api } from '../../services/api';

export function CertificatePreviewModal({ cert, onClose }) {
  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border-4 border-indigo-200 relative overflow-hidden animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
        >
          ✕
        </button>

        {/* Certificate Header */}
        <div className="text-center space-y-1 border-b pb-4">
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">
            {cert.organisation}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CERTIFICATE OF COMPLETION
          </h2>
          <p className="text-xs text-slate-500 italic">
            Proudly presented in recognition of high academic & project performance to
          </p>
        </div>

        {/* Recipient Name */}
        <div className="text-center py-2">
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {cert.studentName}
          </div>
          <div className="h-0.5 w-32 bg-indigo-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Course Title */}
        <div className="text-center space-y-1">
          <p className="text-xs text-slate-500">for fulfilling all requirements for the professional credential</p>
          <h3 className="text-lg font-extrabold text-indigo-700">
            {cert.courseName}
          </h3>
          {cert.grade && (
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold">
              {cert.grade}
            </span>
          )}
        </div>

        {/* Certificate Footer Details */}
        <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-200 text-xs items-end">
          <div>
            <span className="font-bold text-slate-700 block">Certificate ID:</span>
            <span className="font-mono text-indigo-700">{cert.certificateId}</span>
            <span className="font-bold text-slate-700 block mt-1">Issue Date:</span>
            <span className="text-slate-600">{cert.issueDate}</span>
          </div>

          <div className="text-center">
            <img
              src={api.getBadgeSvgUrl(cert.certificateId)}
              alt="Badge"
              className="mx-auto max-h-12"
            />
            <span className="text-[10px] text-slate-400 block mt-1">CertiVerify Cloud Authenticated</span>
          </div>

          <div className="text-right">
            <div className="w-24 h-0.5 bg-slate-400 ml-auto mb-1" />
            <span className="font-bold text-slate-700 block">Authorized Signatory</span>
            <span className="text-[11px] text-slate-500">{cert.organisation}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <a
            href={api.getPdfDownloadUrl(cert.certificateId)}
            target="_blank"
            rel="noreferrer"
            className="gradient-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Resolution PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}

