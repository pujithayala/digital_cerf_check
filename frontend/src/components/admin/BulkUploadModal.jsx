import React, { useState } from 'react';
import { UploadCloud, Layers, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const { token } = useAuth();
  const [csvText, setCsvText] = useState(
`studentName,courseName,organisation,issueDate,expiryDate,grade
Emily Clark,Full-Stack Cloud Development,CertiVerify Institute,2026-03-01,2028-03-01,Distinction
David Miller,Cybersecurity Threat Intelligence,CyberDefense Guild,2026-02-15,,Grade A
Sophia Chen,Generative AI & Agentic Systems,AI Standards Institute,2026-01-20,2029-01-20,Honors`
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const downloadSampleCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'certiverify_sample_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert('Please provide CSV data with a header and at least one certificate record.');
        setLoading(false);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const requests = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        if (cols.length >= 3) {
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });
          requests.push({
            studentName: rowObj.studentName || cols[0],
            courseName: rowObj.courseName || cols[1],
            organisation: rowObj.organisation || cols[2],
            issueDate: rowObj.issueDate || new Date().toISOString().split('T')[0],
            expiryDate: rowObj.expiryDate || null,
            grade: rowObj.grade || 'Pass',
          });
        }
      }

      const result = await api.bulkCreateCertificates(token, requests);
      alert(`Successfully processed batch issuance of ${result.length} certificates!`);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message || 'Batch upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-indigo-600" />
            <span>Bulk Issue Certificates (CSV)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Columns: <code>studentName,courseName,organisation,issueDate,expiryDate,grade</code></span>
          <button
            onClick={downloadSampleCsv}
            className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Template</span>
          </button>
        </div>

        <textarea
          rows="8"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkSubmit}
            disabled={loading}
            className="gradient-btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            <span>Process Batch Issuance</span>
          </button>
        </div>
      </div>
    </div>
  );
}

