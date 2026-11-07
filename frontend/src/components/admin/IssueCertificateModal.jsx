import React, { useState } from 'react';
import { Award, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function IssueCertificateModal({ isOpen, onClose, onSuccess }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    organisation: 'CertiVerify Institute of Technology',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    grade: 'Pass with Distinction',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        expiryDate: form.expiryDate || null,
      };
      const created = await api.createCertificate(token, payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Issue New Digital Certificate</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Certificate ID (Optional, auto-generated if left blank)
            </label>
            <input
              type="text"
              placeholder="e.g. CV-2026-CLOUD99"
              value={form.certificateId}
              onChange={(e) => setForm({ ...form, certificateId: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student / Recipient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course / Degree Program Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master of Cloud Computing & DevOps"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issuing Organisation *
            </label>
            <input
              type="text"
              required
              value={form.organisation}
              onChange={(e) => setForm({ ...form, organisation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Issue Date *</label>
              <input
                type="date"
                required
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Expiry Date (Optional)</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Grade / Distinction</label>
            <input
              type="text"
              placeholder="e.g. First Class with Distinction"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn-primary px-5 py-2 rounded-xl font-bold flex items-center space-x-1.5"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Generate Certificate & QR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

