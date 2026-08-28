import React, { useState } from 'react';
import axios from 'axios';

// ---------- sub-components ----------

function ProductCard({ cartValue }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
    }}>
      <div style={{
        width: '52px', height: '52px', flexShrink: 0,
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        💻
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>MacBook Pro M3 — Space Black</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>18GB Unified Memory · 512GB SSD</p>
      </div>
      <p style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>₹{cartValue.toLocaleString()}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange, step = '1' }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        className="field"
      />
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      margin: '8px 0',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      {label && <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>}
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}

// ---------- Result States ----------

function ApprovedState({ onReset }) {
  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '50%',
        background: 'rgba(16,185,129,0.12)',
        border: '1px solid rgba(16,185,129,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 0 40px rgba(16,185,129,0.15)',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 13L9 17L19 7" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>Transaction Approved</h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px', fontSize: '14px', lineHeight: 1.7 }}>
        Your BNPL application passed our ML risk assessment.<br />0% APR, split into 4 easy payments.
      </p>
      <div style={{
        display: 'flex', gap: '10px', justifyContent: 'center',
        margin: '28px 0 0',
      }}>
        <button className="btn-secondary" onClick={onReset} style={{ padding: '10px 24px' }}>Start Over</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 28px', background: 'linear-gradient(135deg, #059669, #10b981)' }}>
          Confirm Order →
        </button>
      </div>
    </div>
  );
}

function DeclinedState({ onReset }) {
  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '50%',
        background: 'rgba(244,63,94,0.1)',
        border: '1px solid rgba(244,63,94,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 0 40px rgba(244,63,94,0.12)',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>Transaction Declined</h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px', fontSize: '14px', lineHeight: 1.7 }}>
        Our model identified elevated risk with this application.<br />You may still complete the purchase using a standard card.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '28px 0 0' }}>
        <button className="btn-secondary" onClick={onReset} style={{ padding: '10px 24px' }}>Try Again</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 28px' }}>
          Pay with Card →
        </button>
      </div>
    </div>
  );
}

function CounterOfferState({ onReset }) {
  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '50%',
        background: 'rgba(245,158,11,0.1)',
        border: '1px solid rgba(245,158,11,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 0 40px rgba(245,158,11,0.12)',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 9V12M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>Counter-Offer Required</h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px', fontSize: '14px', lineHeight: 1.7 }}>
        We cannot approve a 0-down plan for this profile.<br />However, we can approve this transaction with a <b>50% down-payment</b> today.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '28px 0 0' }}>
        <button className="btn-secondary" onClick={onReset} style={{ padding: '10px 24px' }}>Decline</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 28px', background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#000' }}>
          Pay 50% Upfront →
        </button>
      </div>
    </div>
  );
}

// ---------- Main Component ----------

const FIELDS = [
  { label: 'Age', name: 'age', step: '1' },
  { label: 'Annual Income (₹)', name: 'income', step: '10000' },
  { label: 'Credit Score', name: 'credit_score', step: '1' },
  { label: 'Months Employed', name: 'months_employed', step: '1' },
  { label: 'Active Loans', name: 'num_active_loans', step: '1' },
  { label: 'Debt-to-Income Ratio', name: 'debt_to_income_ratio', step: '0.01' },
];

export default function Checkout() {
  const CART_VALUE = 125000;
  const [formData, setFormData] = useState({
    age: 28,
    income: 850000,
    credit_score: 720,
    months_employed: 24,
    num_active_loans: 1,
    debt_to_income_ratio: 0.30,
  });
  const [vpnDetected, setVpnDetected] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | approved | declined | counter_offer | error

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const { data } = await axios.post(`${API_URL}/api/checkout`, {
        customer_identity: {
          first_name: "Mock User",
          ...formData
        },
        address_data: {
          billing_zip: "10001",
          shipping_zip: "10001"
        },
        cart_data: {
          total_value: CART_VALUE,
          currency: "INR",
          items: [{ name: "MacBook Pro M3", category: "electronics", price: CART_VALUE }]
        },
        telemetry: {
          ip_address: vpnDetected ? "185.15.2.1" : "192.168.1.1",
          vpn_detected: vpnDetected
        }
      }, {
        headers: {
          'x-api-key': 'cs_live_a1b2c3d4e5f6g7h8' // Simulating merchant API key
        }
      });
      setStatus(data.decision === 'APPROVED' ? 'approved' : (data.decision === 'COUNTER_OFFER' ? 'counter_offer' : 'declined'));
    } catch {
      setStatus('error');
    }
  };

  if (status === 'approved' || status === 'declined' || status === 'counter_offer' || status === 'error') {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div className="glass" style={{ borderRadius: '20px', padding: '40px 36px' }}>
          {status === 'approved' && <ApprovedState onReset={() => setStatus('idle')} />}
          {status === 'declined' && <DeclinedState onReset={() => setStatus('idle')} />}
          {status === 'counter_offer' && <CounterOfferState onReset={() => setStatus('idle')} />}
          {status === 'error' && <DeclinedState onReset={() => setStatus('idle')} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 340px) minmax(0, 1fr)',
      gap: '24px',
      maxWidth: '960px',
      margin: '0 auto',
      alignItems: 'start',
    }}
    className="checkout-grid"
    >
      {/* Left: Order summary */}
      <div className="glass" style={{ borderRadius: '20px', padding: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Order Summary
        </p>
        <ProductCard cartValue={CART_VALUE} />

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Subtotal', value: `₹${CART_VALUE.toLocaleString()}` },
            { label: 'Shipping', value: 'Free', accent: '#34d399' },
            { label: 'BNPL Fee', value: '0%', accent: '#34d399' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: row.accent || 'rgba(255,255,255,0.7)' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>Total</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>₹{CART_VALUE.toLocaleString()}</span>
        </div>

        {/* BNPL Splits */}
        <div style={{
          marginTop: '20px', padding: '14px 16px',
          background: 'rgba(79,142,247,0.06)',
          border: '1px solid rgba(79,142,247,0.15)',
          borderRadius: '12px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#4f8ef7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            BNPL Split
          </p>
          <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            4 × ₹{(CART_VALUE / 4).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>/ month</span>
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>0% interest · No hidden fees</p>
        </div>
      </div>

      {/* Right: Application form */}
      <div className="glass" style={{ borderRadius: '20px', padding: '32px 28px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #4f8ef7, #7c6af7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L10.5 3.5V8.5L6 11L1.5 8.5V3.5L6 1Z" fill="white" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
              CrediSense BNPL
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            AI-powered risk assessment via XGBoost + SHAP. Instant decisions for financial compliance.
          </p>
        </div>

        {/* Model info bar */}
        <div style={{
          display: 'flex', gap: '6px', flexWrap: 'wrap',
          marginBottom: '24px', alignItems: 'center'
        }}>
          {['XGBoost', 'SHAP Explainable', 'Real-time'].map(tag => (
            <span key={tag} style={{
              fontSize: '11px', fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '3px 10px',
            }}>{tag}</span>
          ))}
          <span style={{
            fontSize: '11px', fontWeight: 600, marginLeft: 'auto',
            color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            API Key Verified
          </span>
        </div>

        <Divider label="Applicant Profile" />

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {FIELDS.map(f => (
              <InputField
                key={f.name}
                label={f.label}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                step={f.step}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <input 
              type="checkbox" 
              id="vpn" 
              checked={vpnDetected} 
              onChange={(e) => setVpnDetected(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#4f8ef7' }}
            />
            <label htmlFor="vpn" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', userSelect: 'none' }}>
              Simulate Fraud Telemetry (VPN Detected)
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <div className="spinner" style={{ marginRight: '10px' }} />
                Analyzing Risk Profile…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                  <rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="2" />
                  <path d="M2 10H22" stroke="white" strokeWidth="2" />
                </svg>
                Apply & Complete Purchase
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '14px', lineHeight: 1.6 }}>
            Decisions powered by XGBoost (scale_pos_weight) + SHAP for regulatory compliance
          </p>
        </form>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
