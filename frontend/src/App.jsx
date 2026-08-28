import React, { useState } from 'react';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import ApiDocs from './components/ApiDocs';

function App() {
  const [view, setView] = useState('checkout');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '50vw', height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-15%',
          width: '50vw', height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,106,247,0.07) 0%, transparent 70%)',
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Nav */}
      <header style={{
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(12,14,20,0.7)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <button
            onClick={() => setView('checkout')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #4f8ef7, #7c6af7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(124,106,247,0.3)',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '18px',
              color: 'white', letterSpacing: '-0.02em',
            }}>
              CrediSense
            </span>
          </button>

          {/* Tab switcher */}
          <nav style={{
            display: 'flex', gap: '2px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '3px',
          }}>
            {[
              { id: 'checkout', label: 'API Sandbox (Test)' },
              { id: 'api_docs', label: 'API Docs' },
              { id: 'admin', label: 'Merchant Dashboard' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s ease',
                  background: view === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: view === tab.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                  boxShadow: view === tab.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, position: 'relative', zIndex: 10,
        maxWidth: '1200px', width: '100%',
        margin: '0 auto', padding: '48px 24px',
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
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.2)',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        CrediSense · Intelligent BNPL Risk Assessment
      </footer>
    </div>
  );
}

export default App;
