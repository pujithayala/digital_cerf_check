import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  UploadCloud,
  LogOut,
  Search,
  RefreshCw,
  ExternalLink,
  Download,
  AlertTriangle,
  Trash2,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AuditLogsTable } from './AuditLogsTable';

export function AdminDashboard({
  onOpenIssueModal,
  onOpenBulkModal,
  onOpenRevokeModal,
  onOpenPreview,
  onVerifyDirect,
}) {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [adminView, setAdminView] = useState('certs'); // 'certs' | 'logs'

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats(token);
      setStats(data);
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await api.listCertificates(token, { query, status, page, size: 10 });
      setCertificates(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error('Failed to load certificates', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchCertificates();
    }
  }, [token, page, status]);

  const handleDelete = async (certId) => {
    if (!window.confirm(`Permanently delete certificate record ${certId}?`)) return;
    try {
      await api.deleteCertificate(token, certId);
      fetchCertificates();
      fetchStats();
    } catch (e) {
      alert(e.message || 'Failed to delete certificate');
    }
  };

  const handleExportCsv = () => {
    if (!certificates.length) {
      alert('No certificates available to export');
      return;
    }
    const headers = ['CertificateId', 'StudentName', 'CourseName', 'Organisation', 'IssueDate', 'ExpiryDate', 'Status', 'Grade'];
    const rows = certificates.map((c) => [
      c.certificateId,
      `"${c.studentName}"`,
      `"${c.courseName}"`,
      `"${c.organisation}"`,
      c.issueDate,
      c.expiryDate || '',
      c.status,
      `"${c.grade || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent([headers.join(','), ...rows.map((r) => r.join(','))].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `certiverify_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Certificate Authority Console</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Authenticated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{user?.username || 'admin'}</strong> ({user?.role || 'ROLE_ADMIN'})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenIssueModal}
            className="gradient-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>

          <button
            onClick={onOpenBulkModal}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 flex items-center space-x-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Issued</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalCertificates}</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active Verified</div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.verifiedCertificates}</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-red-600">Revoked</div>
            <div className="text-2xl font-extrabold text-red-700 mt-1">{stats.revokedCertificates}</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Expired</div>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">{stats.expiredCertificates}</div>
          </div>
          <div className="glass-card p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Verifications</div>
            <div className="text-2xl font-extrabold text-indigo-700 mt-1">{stats.totalVerifications}</div>
          </div>
        </div>
      )}

      {/* Sub-view switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAdminView('certs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminView === 'certs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Issued Certificates Directory
        </button>
        <button
          onClick={() => setAdminView('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminView === 'logs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Real-Time Verification Audit Trail
        </button>
      </div>

      {adminView === 'logs' ? (
        <AuditLogsTable onVerifyDirect={onVerifyDirect} />
      ) : (
        <>
          {/* Search and Filters */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ID, student, course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCertificates()}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="REVOKED">Revoked</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <button
            onClick={fetchCertificates}
            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Certificate ID</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Course / Degree</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                    Querying credentials repository...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    No certificate records found matching the criteria.
                  </td>
                </tr>
              ) : (
                certificates.map((c) => (
                  <tr key={c.certificateId} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {c.certificateId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.studentName}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate">{c.courseName}</td>
                    <td className="px-4 py-3 text-slate-500">{c.issueDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'VERIFIED'
                            ? 'badge-verified'
                            : c.status === 'REVOKED'
                            ? 'badge-revoked'
                            : 'badge-expired'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onOpenPreview(c)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Preview Certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onVerifyDirect(c.certificateId)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 text-indigo-600 transition-colors"
                          title="Verify in Public View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={api.getPdfDownloadUrl(c.certificateId)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        {c.status !== 'REVOKED' && (
                          <button
                            onClick={() => onOpenRevokeModal(c)}
                            className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                            title="Revoke Certificate"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(c.certificateId)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="space-x-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-2.5 py-1 rounded border border-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-2.5 py-1 rounded border border-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

