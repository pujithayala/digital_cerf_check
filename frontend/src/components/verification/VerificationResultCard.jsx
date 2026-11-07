import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  User,
  Hash,
  Award,
  Building,
  Calendar,
  Lock,
  Download,
  FileText,
  Share2,
  FileCheck2,
  Check,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';

export function VerificationResultCard({
  verifyResult,
  onOpenPreview,
  onOpenBadge,
}) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!verifyResult) return null;

  const { valid, status, message, certificate, digitalSignatureHash, totalVerifications } = verifyResult;

  const handleCopyLink = () => {
    if (!certificate) return;
    const url = `${window.location.origin}#${certificate.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6 border-2 border-indigo-200/80 shadow-xl transition-all animate-fadeIn">
      {/* Result Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
              valid
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-200'
                : status === 'REVOKED'
                ? 'bg-gradient-to-tr from-rose-600 to-red-400 shadow-rose-200'
                : status === 'EXPIRED'
                ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 shadow-amber-200'
                : 'bg-gradient-to-tr from-slate-600 to-slate-400'
            }`}
          >
            {valid ? (
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            ) : status === 'REVOKED' ? (
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            ) : status === 'EXPIRED' ? (
              <Clock className="w-8 h-8 stroke-[2.2]" />
            ) : (
              <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {valid
                  ? 'Official Verified Credential'
                  : status === 'REVOKED'
                  ? 'Revoked Certificate'
                  : status === 'EXPIRED'
                  ? 'Expired Certificate'
                  : 'Invalid Certificate'}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  valid
                    ? 'badge-verified'
                    : status === 'REVOKED'
                    ? 'badge-revoked'
                    : status === 'EXPIRED'
                    ? 'badge-expired'
                    : 'badge-invalid'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">{message}</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        {certificate && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenPreview(certificate)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 flex items-center space-x-1.5 transition-all text-slate-700"
              title="Interactive Visual Preview"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Preview</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 flex items-center space-x-1.5 transition-all text-slate-700"
              title="Copy direct verification link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied URL!' : 'Share Link'}</span>
            </button>

            <button
              onClick={() => onOpenBadge(certificate)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 flex items-center space-x-1.5 transition-all"
              title="Embed badge on LinkedIn or Portfolio"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Embed Badge</span>
            </button>
          </div>
        )}
      </div>

      {/* Details Grid */}
      {certificate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Columns: Credentials Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Student / Recipient</span>
                </span>
                <p className="text-lg font-bold text-slate-900 mt-1">{certificate.studentName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Certificate ID</span>
                </span>
                <p className="text-lg font-mono font-bold text-indigo-700 mt-1">{certificate.certificateId}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Program / Certified Course</span>
                </span>
                <p className="text-base font-bold text-slate-900 mt-1">{certificate.courseName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>Issuing Organisation</span>
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-1">{certificate.organisation}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Issue & Expiry Dates</span>
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  Issued: {certificate.issueDate}
                  {certificate.expiryDate ? ` • Expires: ${certificate.expiryDate}` : ' • Lifetime'}
                </p>
              </div>

              {certificate.grade && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Distinction / Academic Grade
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{certificate.grade}</p>
                </div>
              )}
            </div>

            {/* Cryptographic SHA-256 Fingerprint */}
            <div className="p-3 rounded-xl bg-indigo-950 text-indigo-200 border border-indigo-900 text-xs font-mono break-all flex items-start space-x-2">
              <Lock className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-indigo-400 font-bold block text-[10px] tracking-wider uppercase font-sans">
                  Cryptographic SHA-256 Provenance Fingerprint
                </span>
                <span>{digitalSignatureHash}</span>
              </div>
            </div>
          </div>

          {/* Right Column: QR Badge & Official PDF Downloads */}
          <div className="glass-card p-5 flex flex-col items-center justify-between text-center space-y-4 border-slate-200 bg-white">
            <div className="space-y-2 w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Official Verification Seal
              </span>
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-inner flex items-center justify-center">
                <img
                  src={api.getBadgeSvgUrl(certificate.certificateId)}
                  alt="Verification Badge"
                  className="w-full max-w-[240px]"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Total Audit Verifications: <strong className="text-slate-800">{totalVerifications || 1}</strong>
              </p>
            </div>

            {/* Download Buttons */}
            <div className="w-full space-y-2">
              <a
                href={api.getPdfDownloadUrl(certificate.certificateId)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Certificate (PDF)</span>
              </a>

              <a
                href={api.getReportDownloadUrl(certificate.certificateId)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Audit Transcript Report (PDF)</span>
              </a>

              {certificate.qrCodeUrl && (
                <a
                  href={certificate.qrCodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`qr-${certificate.certificateId}.png`}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code (PNG)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

