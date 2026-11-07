import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Globe, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function AuditLogsTable({ onVerifyDirect }) {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs(token);
      setLogs(data || []);
    } catch (e) {
      console.warn('Failed to load audit logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
  }, [token]);

  return (
    <div className="glass-panel overflow-hidden space-y-3 p-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Recent Verification Audit Trail</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time verification events logged by employers, background checks, and QR scanners worldwide.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs flex items-center space-x-1"
          title="Refresh Log"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-3 py-2.5">Audit Timestamp</th>
              <th className="px-3 py-2.5">Certificate ID</th>
              <th className="px-3 py-2.5">Status at Check</th>
              <th className="px-3 py-2.5">Client IP Address</th>
              <th className="px-3 py-2.5">User-Agent / Device</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-600 mb-2" />
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  No verification events recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px]">
                    {log.verifiedAt ? log.verifiedAt.replace('T', ' ').substring(0, 19) : 'Just now'}
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-indigo-700">
                    {log.certificateId}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.statusAtVerification === 'VERIFIED'
                          ? 'badge-verified'
                          : log.statusAtVerification === 'REVOKED'
                          ? 'badge-revoked'
                          : 'badge-expired'
                      }`}
                    >
                      {log.statusAtVerification}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600">
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 text-[11px] max-w-[220px] truncate" title={log.userAgent}>
                    {log.userAgent || 'Web Browser'}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => onVerifyDirect(log.certificateId)}
                      className="p-1 rounded border border-slate-200 hover:bg-indigo-50 text-indigo-600 text-[11px]"
                      title="Inspect Certificate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

