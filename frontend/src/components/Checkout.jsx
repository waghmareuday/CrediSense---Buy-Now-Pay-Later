import React, { useState } from 'react';
import axios from 'axios';

// ---------- sub-components ----------

function ProductCard({ productName, cartValue }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
    }}>
      <div style={{
        width: '44px', height: '44px', flexShrink: 0,
        borderRadius: '8px',
        background: 'rgba(204,120,92,0.1)',
        border: '1px solid var(--accent-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
      }}>
        🛒
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{productName}</p>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Merchant Cart Item</p>
      </div>
      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>₹{Number(cartValue).toLocaleString()}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange, step = '1', type = 'number' }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      {label && (
        <span style={{ fontSize: '10.5px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  );
}

// ---------- Result States ----------

function ApprovedState({ onReset }) {
  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div style={{
        width: '56px', height: '56px',
        borderRadius: '50%',
        background: 'var(--green-dim)',
        border: '1px solid var(--green-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 13L9 17L19 7" stroke="#6db890" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
        Application Approved
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
        Your BNPL application passed our ML risk assessment.<br />0% APR · Split into 4 equal payments.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
        <button className="btn-secondary" onClick={onReset} style={{ padding: '10px 22px' }}>Start over</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 26px' }}>Confirm order →</button>
      </div>
    </div>
  );
}

function DeclinedState({ onReset }) {
  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div style={{
        width: '56px', height: '56px',
        borderRadius: '50%',
        background: 'var(--red-dim)',
        border: '1px solid var(--red-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="#d97070" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
        Application Declined
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
        Our model identified elevated risk with this profile.<br />You may still complete the purchase using a standard card.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
        <button className="btn-secondary" onClick={onReset} style={{ padding: '10px 22px' }}>Try again</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 26px' }}>Pay with card →</button>
      </div>
    </div>
  );
}

function CounterOfferState({ onReset }) {
  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div style={{
        width: '56px', height: '56px',
        borderRadius: '50%',
        background: 'var(--amber-dim)',
        border: '1px solid var(--amber-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 9V12M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
        Counter-offer Available
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
        Standard BNPL is unavailable for this profile.<br />
        However, you may proceed with a <strong style={{ color: 'var(--text-primary)' }}>50% down-payment</strong> today.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
        <button className="btn-secondary" onClick={onReset} style={{ padding: '10px 22px' }}>Decline</button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 26px', background: 'var(--amber)', boxShadow: 'none' }}>
          Pay 50% upfront →
        </button>
      </div>
    </div>
  );
}

// ---------- Main Component ----------

const CREDIT_FIELDS = [
  { label: 'Age', name: 'age', step: '1' },
  { label: 'Annual Income (₹)', name: 'income', step: '10000' },
  { label: 'Credit Score', name: 'credit_score', step: '1' },
  { label: 'Months Employed', name: 'months_employed', step: '1' },
  { label: 'Active Loans', name: 'num_active_loans', step: '1' },
  { label: 'Debt-to-Income Ratio', name: 'debt_to_income_ratio', step: '0.01' },
];

export default function Checkout() {
  const [formData, setFormData] = useState({
    product_name: 'MacBook Pro M3',
    cart_value: 125000,
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
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const { data } = await axios.post(`${API_URL}/api/checkout`, {
        customer_identity: { first_name: 'Mock User', ...formData },
        address_data: { billing_zip: '10001', shipping_zip: '10001' },
        cart_data: {
          total_value: formData.cart_value,
          currency: 'INR',
          items: [{ name: formData.product_name, category: 'electronics', price: formData.cart_value }],
        },
        telemetry: {
          ip_address: vpnDetected ? '185.15.2.1' : '192.168.1.1',
          vpn_detected: vpnDetected,
        },
      }, {
        headers: { 'x-api-key': 'cs_live_a1b2c3d4e5f6g7h8' },
      });
      setStatus(data.decision === 'APPROVED' ? 'approved' : data.decision === 'COUNTER_OFFER' ? 'counter_offer' : 'declined');
    } catch {
      setStatus('error');
    }
  };

  if (['approved', 'declined', 'counter_offer', 'error'].includes(status)) {
    return (
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div className="glass" style={{ borderRadius: '16px', padding: '8px' }}>
          {status === 'approved' && <ApprovedState onReset={() => setStatus('idle')} />}
          {status === 'declined' && <DeclinedState onReset={() => setStatus('idle')} />}
          {status === 'counter_offer' && <CounterOfferState onReset={() => setStatus('idle')} />}
          {status === 'error' && <DeclinedState onReset={() => setStatus('idle')} />}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
          API Sandbox
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Simulate a BNPL Request
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '560px' }}>
          Adjust the merchant cart data and applicant profile below. This mirrors the exact JSON payload your e-commerce integration would send to the CrediSense API.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)',
        gap: '20px',
        alignItems: 'start',
      }}
      className="checkout-grid"
      >
        {/* Left: Order summary */}
        <div className="glass" style={{ borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Order summary
          </p>
          <ProductCard productName={formData.product_name} cartValue={formData.cart_value} />

          <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {[
              { label: 'Subtotal', value: `₹${Number(formData.cart_value).toLocaleString()}` },
              { label: 'Shipping', value: 'Free', accent: 'var(--green)' },
              { label: 'BNPL Fee', value: '0%', accent: 'var(--green)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: row.accent || 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              ₹{Number(formData.cart_value).toLocaleString()}
            </span>
          </div>

          {/* BNPL Split */}
          <div style={{
            padding: '14px',
            background: 'rgba(204,120,92,0.05)',
            border: '1px solid var(--accent-border)',
            borderRadius: '10px',
          }}>
            <p style={{ fontSize: '10.5px', fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
              BNPL Split
            </p>
            <p style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              4 × ₹{(formData.cart_value / 4).toLocaleString()}
              <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '5px' }}>/&nbsp;month</span>
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>0% interest · No hidden fees</p>
          </div>

          {/* Model info */}
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['XGBoost', 'SHAP', 'Two-Stage Engine'].map(tag => (
              <span key={tag} style={{
                fontSize: '11px', fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '5px',
                padding: '2px 9px',
              }}>{tag}</span>
            ))}
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--green)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              API Key Active
            </span>
          </div>
        </div>

        {/* Right: Form */}
        <div className="glass" style={{ borderRadius: '14px', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '5px' }}>
              Risk Assessment Form
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Fields below map directly to the JSON payload sent to <code style={{ fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '1px 6px', borderRadius: '4px' }}>POST /api/checkout</code>
            </p>
          </div>

          <Divider label="Merchant Cart" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '16px 0' }}>
            <InputField label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} type="text" />
            <InputField label="Cart Total (₹)" name="cart_value" value={formData.cart_value} onChange={handleChange} step="1000" />
          </div>

          <Divider label="Applicant Profile" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '16px 0' }}>
            {CREDIT_FIELDS.map(f => (
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

          <Divider label="Fraud Telemetry" />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            margin: '14px 0 20px',
            padding: '11px 14px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}>
            <input
              type="checkbox"
              id="vpn"
              checked={vpnDetected}
              onChange={(e) => setVpnDetected(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <label htmlFor="vpn" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none', lineHeight: 1.4 }}>
              Simulate VPN / suspicious telemetry (triggers Stage 1 fraud decline)
            </label>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <div className="spinner" style={{ marginRight: '10px' }} />
                Analysing risk profile…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Run Risk Assessment
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>
            Decisions powered by XGBoost + SHAP · Compliant with ECOA &amp; GDPR Art. 22
          </p>
        </div>

        <style>{`
          @media (max-width: 740px) {
            .checkout-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
