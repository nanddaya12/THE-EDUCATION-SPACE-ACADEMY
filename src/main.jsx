import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '40px auto', background: '#fff', border: '1px solid #fee2e2', borderRadius: 16, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#dc2626', fontSize: 20, margin: '0 0 12px 0' }}>⚠️ Application Interface Error</h2>
          <p style={{ color: '#4b5563', fontSize: 14 }}>The interface caught a runtime error:</p>
          <pre style={{ background: '#fef2f2', color: '#991b1b', padding: 16, borderRadius: 8, fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
            >
              Clear Storage & Reset
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#0b1c30', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reload Page
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
  </React.StrictMode>,
);
