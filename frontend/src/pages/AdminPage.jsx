import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export function AdminPage({
  onOpenIssueModal,
  onOpenBulkModal,
  onOpenRevokeModal,
  onOpenPreview,
  onVerifyDirect,
}) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fadeIn">
      {!isAuthenticated ? (
        <AdminLogin />
      ) : (
        <AdminDashboard
          onOpenIssueModal={onOpenIssueModal}
          onOpenBulkModal={onOpenBulkModal}
          onOpenRevokeModal={onOpenRevokeModal}
          onOpenPreview={onOpenPreview}
          onVerifyDirect={onVerifyDirect}
        />
      )}
    </div>
  );
}

