import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Database, AlertTriangle } from 'lucide-react';
import { VerifySearch } from '../components/verification/VerifySearch';
import { VerificationResultCard } from '../components/verification/VerificationResultCard';
import { StatsCounters } from '../components/home/StatsCounters';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { api } from '../services/api';

export function HomePage({
  onOpenScanner,
  onOpenPreview,
  onOpenBadge,
  directVerifyId,
}) {
  const [certInputId, setCertInputId] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [publicStats, setPublicStats] = useState({
    totalCertificates: 4,
    verifiedCertificates: 2,
    totalVerifications: 12,
  });

  const loadPublicStats = async () => {
    try {
      const data = await api.getPublicStats();
      if (data) setPublicStats(data);
    } catch (e) {
      console.warn('Failed to load public stats', e);
    }
  };

  const handleVerify = async (idToVerify) => {
    const targetId = (idToVerify || certInputId).trim();
    if (!targetId) return;

    setLoadingVerify(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const data = await api.verifyCertificate(targetId);
      setVerifyResult(data);
      if (data && data.valid) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#ec4899', '#38bdf8', '#10b981'],
        });
      }
      loadPublicStats();
    } catch (err) {
      setVerifyError(err.message || 'Unable to connect to verification server');
    } finally {
      setLoadingVerify(false);
    }
  };

  useEffect(() => {
    loadPublicStats();
    if (directVerifyId) {
      setCertInputId(directVerifyId);
      handleVerify(directVerifyId);
    }
  }, [directVerifyId]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="glass-panel p-8 sm:p-12 relative overflow-hidden text-center border-indigo-100">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold tracking-wide uppercase">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Powered by AWS S3 & PostgreSQL Cloud Storage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Verify Any Academic & Professional <br className="hidden sm:block" />
            <span className="gradient-text">Digital Certificate</span> Instantly
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Validate cryptographic authenticity, verify current accreditation status, and download authenticated transcripts with instant SHA-256 integrity checks.
          </p>

          <VerifySearch
            certInputId={certInputId}
            setCertInputId={setCertInputId}
            loadingVerify={loadingVerify}
            onVerify={handleVerify}
            onOpenScanner={onOpenScanner}
          />
        </div>
      </div>

      {/* KPI Counters */}
      <StatsCounters stats={publicStats} />

      {/* Verification Result Card */}
      {verifyResult && (
        <VerificationResultCard
          verifyResult={verifyResult}
          onOpenPreview={onOpenPreview}
          onOpenBadge={onOpenBadge}
        />
      )}

      {/* Error Box */}
      {verifyError && (
        <div className="glass-panel p-6 border-red-200 bg-red-50/50 flex items-start space-x-3 text-red-800 animate-fadeIn">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <h3 className="font-bold text-base">Verification Not Successful</h3>
            <p className="text-sm mt-1">{verifyError}</p>
          </div>
        </div>
      )}

      {/* 4 Pillars Features Section */}
      <FeaturesSection />
    </div>
  );
}

