import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function RevokeModal({ cert, onClose, onSuccess }) {
  const { token } = useAuth();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!cert) return null;

  const handleRevoke = async () => {
    setLoading(true);
    try {
      await api.revokeCertificate(token, cert.certificateId, reason || 'Administrative revocation');
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message || 'Revocation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-extrabold text-lg">Revoke Certificate</h3>
        </div>

        <p className="text-xs text-slate-600">
          Are you sure you want to revoke credential{' '}
          <strong className="font-mono text-slate-900">{cert.certificateId}</strong> issued to{' '}
          <strong>{cert.studentName}</strong>?
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Audit Reason for Revocation
          </label>
          <input
            type="text"
            placeholder="e.g. Academic integrity investigation, administrative error"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1"
          >
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>Confirm Revocation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

