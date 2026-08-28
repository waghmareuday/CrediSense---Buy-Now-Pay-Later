import React, { useState } from 'react';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import ApiDocs from './components/ApiDocs';

const tabs = [
  { id: 'checkout', label: 'API Sandbox' },
  { id: 'api_docs', label: 'Documentation' },
  { id: 'admin', label: 'Dashboard' },
];

function App() {
  const [view, setView] = useState('checkout');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      
      {/* Subtle texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(204,120,92,0.04) 0%, transparent 70%)',
      }} />

      {/* Nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(26, 25, 21, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '0 28px',
          height: '56px',
          display: 'flex', alignItems: 'center', gap: '32px',
        }}>
          {/* Logo */}
          <button
            onClick={() => setView('checkout')}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontSize: '18px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}>
              CrediSense
            </span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', background: 'var(--border)', flexShrink: 0 }} />

          {/* Tabs */}
          <nav style={{ display: 'flex', gap: '4px', flex: 1 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: view === tab.id ? 500 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '-0.01em',
                  transition: 'all 0.15s ease',
                  background: view === tab.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: view === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Live badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <div style={{ position: 'relative', width: '6px', height: '6px' }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                background: 'var(--green)',
                animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
                opacity: 0.5,
              }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green)' }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>Live</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, position: 'relative', zIndex: 10,
        maxWidth: '1100px', width: '100%',
        margin: '0 auto', padding: '40px 28px 60px',
      }}>
        <div className="animate-fade-in" key={view}>
          {view === 'checkout' && <Checkout />}
          {view === 'api_docs' && <ApiDocs />}
          {view === 'admin' && <AdminDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--border)',
        padding: '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: '1100px', width: '100%', margin: '0 auto',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          CrediSense · Intelligent BNPL Risk Assessment
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Powered by XGBoost + SHAP
        </span>
      </footer>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default App;
