import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CertiVerify Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'linear-gradient(135deg, #fdf2f8, #eef2ff)' }}>
          <div style={{ maxWidth: '540px', width: '100%', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #fee2e2' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#991b1b', marginBottom: '8px' }}>Application Render Notice</h2>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
              The application encountered a runtime issue during display:
            </p>
            <pre style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#b91c1c', overflowX: 'auto', marginBottom: '20px' }}>
              {this.state.error?.toString() || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#4f46e5', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
