import React, { useState } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLogin() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.username, form.password);
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto glass-panel p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Admin Authentication</h2>
        <p className="text-xs text-slate-500">
          Sign in with administrative credentials to manage certificates and verify logs.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Username or Email
          </label>
          <input
            type="text"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>Sign In to Admin Console</span>
        </button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setForm({ username: 'admin', password: 'admin123' })}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Quick Fill Demo Credentials (admin / admin123)
          </button>
        </div>
      </form>
    </div>
  );
}

