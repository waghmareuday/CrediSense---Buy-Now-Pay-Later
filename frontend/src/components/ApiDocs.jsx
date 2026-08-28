import React from 'react';

export default function ApiDocs() {
  const codeSnippet = `
// POST /api/checkout
// Headers: { "x-api-key": "cs_live_a1b2c3d4e5f6g7h8" }

{
  "customer_identity": {
    "first_name": "John Doe",
    "age": 28,
    "income": 850000,
    "credit_score": 720,
    "months_employed": 24,
    "num_active_loans": 1,
    "debt_to_income_ratio": 0.3
  },
  "address_data": {
    "billing_zip": "10001",
    "shipping_zip": "10001"
  },
  "cart_data": {
    "total_value": 125000,
    "currency": "INR",
    "items": [
      { "name": "MacBook Pro", "category": "electronics", "price": 125000 }
    ]
  },
  "telemetry": {
    "ip_address": "192.168.1.1",
    "vpn_detected": false
  }
}
  `.trim();

  const responseSnippet = `
{
  "success": true,
  "decision": "APPROVED", // Or "DECLINED", "COUNTER_OFFER"
  "transaction_id": 14,
  "message": "Your BNPL request was approved!"
}
  `.trim();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          API Documentation
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6 }}>
          Integrate the CrediSense BNPL Risk Engine into your e-commerce platform. Our API assesses both Fraud Risk and Credit Risk in real-time.
        </p>
      </div>

      <div className="glass" style={{ borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Authentication</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
          Pass your secret API key in the headers of all requests.
        </p>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <code style={{ color: '#34d399', fontSize: '13px' }}>x-api-key: cs_live_a1b2c3d4e5f6g7h8</code>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>The Checkout Payload (POST)</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
          Our Two-Stage Risk Engine requires context about the user, their cart, and their browser telemetry to generate an accurate XGBoost risk profile.
        </p>
        <div style={{ background: '#0d1117', padding: '16px', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
          <pre style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.5 }}>
            {codeSnippet}
          </pre>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>The Decision Response</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
          You will receive an instant, compliant decision: APPROVED, DECLINED, or COUNTER_OFFER (requires 50% down-payment).
        </p>
        <div style={{ background: '#0d1117', padding: '16px', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
          <pre style={{ margin: 0, color: '#4f8ef7', fontSize: '13px', lineHeight: 1.5 }}>
            {responseSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
