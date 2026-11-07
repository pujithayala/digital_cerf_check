import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { QrScannerModal } from './components/verification/QrScannerModal';
import { CertificatePreviewModal } from './components/verification/CertificatePreviewModal';
import { BadgeEmbedModal } from './components/verification/BadgeEmbedModal';
import { IssueCertificateModal } from './components/admin/IssueCertificateModal';
import { BulkUploadModal } from './components/admin/BulkUploadModal';
import { RevokeModal } from './components/admin/RevokeModal';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'admin'
  const [directVerifyId, setDirectVerifyId] = useState('');

  // Modals state
  const [showScanner, setShowScanner] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [badgeCert, setBadgeCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [revokeCert, setRevokeCert] = useState(null);

  useEffect(() => {
    // Detect URL hash or path parameters on launch
    const path = window.location.pathname;
    if (path.startsWith('/verify/')) {
      const id = path.replace('/verify/', '').trim();
      if (id) {
        setDirectVerifyId(id);
        setActivePage('home');
      }
    } else if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '').trim();
      if (hashId) {
        setDirectVerifyId(hashId);
        setActivePage('home');
      }
    }
  }, []);

  const handleVerifyDirect = (certId) => {
    setDirectVerifyId(certId);
    setActivePage('home');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500" />

        {/* Global Navigation */}
        <Navbar activePage={activePage} setActivePage={setActivePage} />

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activePage === 'home' && (
            <HomePage
              onOpenScanner={() => setShowScanner(true)}
              onOpenPreview={(c) => setPreviewCert(c)}
              onOpenBadge={(c) => setBadgeCert(c)}
              directVerifyId={directVerifyId}
            />
          )}

          {activePage === 'admin' && (
            <AdminPage
              onOpenIssueModal={() => setShowIssueModal(true)}
              onOpenBulkModal={() => setShowBulkModal(true)}
              onOpenRevokeModal={(c) => setRevokeCert(c)}
              onOpenPreview={(c) => setPreviewCert(c)}
              onVerifyDirect={handleVerifyDirect}
            />
          )}
        </main>

        {/* Modals */}
        <QrScannerModal
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScanSuccess={(scannedId) => handleVerifyDirect(scannedId)}
        />

        <CertificatePreviewModal
          cert={previewCert}
          onClose={() => setPreviewCert(null)}
        />

        <BadgeEmbedModal
          cert={badgeCert}
          onClose={() => setBadgeCert(null)}
        />

        <IssueCertificateModal
          isOpen={showIssueModal}
          onClose={() => setShowIssueModal(false)}
          onSuccess={(newCert) => handleVerifyDirect(newCert.certificateId)}
        />

        <BulkUploadModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {}}
        />

        <RevokeModal
          cert={revokeCert}
          onClose={() => setRevokeCert(null)}
          onSuccess={() => {}}
        />

        {/* Global Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
