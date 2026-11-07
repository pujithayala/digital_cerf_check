const API_BASE = '/api';

export const api = {
  // Public Verification & Stats
  async getPublicStats() {
    const res = await fetch(`${API_BASE}/stats/public`);
    if (!res.ok) throw new Error('Failed to fetch public stats');
    const json = await res.json();
    return json.data;
  },

  async verifyCertificate(certificateId) {
    const res = await fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(certificateId)}`);
    const json = await res.json();
    if (!res.ok && !json.data) {
      throw new Error(json.message || 'Verification check failed');
    }
    return json.data;
  },

  async getCertificateById(certificateId) {
    const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(certificateId)}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Certificate not found');
    return json.data;
  },

  // Admin Authentication
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Invalid username or password');
    }
    return json.data;
  },

  // Admin Operations (Protected)
  async getAdminStats(token) {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load admin stats');
    return json.data;
  },

  async getAuditLogs(token) {
    const res = await fetch(`${API_BASE}/stats/audit-logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load audit logs');
    return json.data;
  },

  async listCertificates(token, { query = '', status = '', page = 0, size = 10 } = {}) {
    let url = `${API_BASE}/certificates?page=${page}&size=${size}`;
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (status) url += `&status=${status}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load certificates');
    return json.data;
  },

  async createCertificate(token, certData) {
    const res = await fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(certData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to issue certificate');
    return json.data;
  },

  async bulkCreateCertificates(token, list) {
    const res = await fetch(`${API_BASE}/certificates/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(list),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to process bulk upload');
    return json.data;
  },

  async revokeCertificate(token, certificateId, reason) {
    const res = await fetch(`${API_BASE}/certificates/${certificateId}/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to revoke certificate');
    return json.data;
  },

  async deleteCertificate(token, certificateId) {
    const res = await fetch(`${API_BASE}/certificates/${certificateId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete certificate');
    return json.data;
  },

  // File and Resource URLs
  getPdfDownloadUrl(certificateId) {
    return `${API_BASE}/certificates/${encodeURIComponent(certificateId)}/download`;
  },

  getReportDownloadUrl(certificateId) {
    return `${API_BASE}/certificates/${encodeURIComponent(certificateId)}/verification-report`;
  },

  getBadgeSvgUrl(certificateId) {
    return `${API_BASE}/certificates/${encodeURIComponent(certificateId)}/verification-badge`;
  },
};

