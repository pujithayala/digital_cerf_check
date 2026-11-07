import React from 'react';
import { QrCode, Shield, FileCheck, Cloud, CheckCircle2 } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <QrCode className="w-6 h-6 text-indigo-600" />,
      title: 'Real-Time QR Verification',
      desc: 'Every certificate is generated with a unique high-resolution QR code that employers or institutions can scan to verify authenticity instantly.',
      badge: 'ZXing Matrix',
    },
    {
      icon: <Shield className="w-6 h-6 text-pink-600" />,
      title: 'Cryptographic Provenance',
      desc: 'A calculated SHA-256 digital signature binds the recipient, course, issuing authority, and issuance date into a tamper-proof audit record.',
      badge: 'SHA-256 Hash',
    },
    {
      icon: <FileCheck className="w-6 h-6 text-blue-600" />,
      title: 'Automated Vector PDF Issuance',
      desc: 'Generates official landscape certificates and full audit transcripts using vector graphics, ornate borders, and cryptographic verification seals.',
      badge: 'OpenPDF Engine',
    },
    {
      icon: <Cloud className="w-6 h-6 text-teal-600" />,
      title: 'Cloud Storage & RDS PostgreSQL',
      desc: 'Seamless dual-storage model supporting local zero-config disk storage for development, and scalable AWS S3 & PostgreSQL for cloud production.',
      badge: 'AWS S3 Ready',
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How CertiVerify Protects Credential Integrity
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Eliminate fraudulent diplomas and forged certificates with our 4-pillar trust architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, idx) => (
          <div key={idx} className="glass-card p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                {f.icon}
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {f.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

