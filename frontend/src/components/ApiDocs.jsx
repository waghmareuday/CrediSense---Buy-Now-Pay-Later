import React from 'react';

function CodeBlock({ children, accent }) {
  return (
    <div style={{
      background: 'var(--bg)',
      padding: '16px 18px',
      borderRadius: '8px',
      overflowX: 'auto',
      border: '1px solid var(--border)',
    }}>
      <pre style={{ margin: 0, color: accent || 'var(--text-primary)', fontSize: '12.5px', lineHeight: 1.65, fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
        {children}
      </pre>
    </div>
  );
}

function Section({ children, title, description }) {
  return (
    <div className="glass" style={{ borderRadius: '12px', padding: '22px', marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: description ? '6px' : '16px', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      {description && <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{description}</p>}
      {children}
    </div>
  );
}

export default function ApiDocs() {
  const curlSnippet = `curl -X POST https://credisense-buynowpaylater.onrender.com/api/checkout \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: cs_live_a1b2c3d4e5f6g7h8" \\
  -d '{
    "customer_identity": {
      "first_name": "Aarav Shah",
      "age": 28,
      "income": 850000,
      "credit_score": 720,
      "months_employed": 24,
      "num_active_loans": 1,
      "debt_to_income_ratio": 0.3
    },
    "address_data": {
      "billing_zip": "400001",
      "shipping_zip": "400001"
    },
    "cart_data": {
      "total_value": 125000,
      "currency": "INR",
      "items": [
        { "name": "MacBook Pro M3", "category": "electronics", "price": 125000 }
      ]
    },
    "telemetry": {
      "ip_address": "49.205.1.1",
      "vpn_detected": false
    }
  }'`.trim();

  const responseSnippet = `{
  "success": true,
  "decision": "APPROVED",
  "transaction_id": 42,
  "message": "Your BNPL request was approved!"
}

// decision can be one of:
//   "APPROVED"      → Standard 0% BNPL, 4 equal payments
//   "COUNTER_OFFER" → Approved with 50% down-payment required
//   "DECLINED"      → Application rejected`.trim();

  const decisionTable = [
    { decision: 'APPROVED', condition: 'Risk probability < 30%', action: '4× 0% EMI payments' },
    { decision: 'COUNTER_OFFER', condition: '30% ≤ Risk < 40%', action: '50% down-payment required' },
    { decision: 'DECLINED', condition: 'Risk ≥ 40% or fraud flag', action: 'Application rejected' },
  ];

  const accentMap = { APPROVED: 'var(--green)', COUNTER_OFFER: 'var(--amber)', DECLINED: 'var(--red)' };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Reference
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          API Documentation
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '560px' }}>
          Integrate the CrediSense Two-Stage Risk Engine into your checkout flow. One API call returns an instant, SHAP-explainable credit decision.
        </p>
      </div>

      {/* Base URL */}
      <Section title="Base URL">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.02em' }}>POST</span>
          <code style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
            https://credisense-buynowpaylater.onrender.com/api/checkout
          </code>
        </div>
      </Section>

      {/* Authentication */}
      <Section
        title="Authentication"
        description="Pass your secret API key in the request headers. Keys must start with cs_live_ or cs_test_."
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px' }}>
          <code style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>x-api-key:</code>
          <code style={{ fontSize: '12.5px', color: 'var(--green)', fontFamily: 'monospace' }}>cs_live_a1b2c3d4e5f6g7h8</code>
        </div>
      </Section>

      {/* cURL Example */}
      <Section title="Full Request (cURL)" description="A complete example of the payload your merchant backend should send.">
        <CodeBlock>{curlSnippet}</CodeBlock>
      </Section>

      {/* Decision Logic */}
      <Section title="Decision Logic" description="The Two-Stage Engine runs fraud heuristics first, then the XGBoost credit model.">
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                {['Decision', 'Condition', 'Outcome'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisionTable.map((row, i) => (
                <tr key={row.decision} style={{ borderBottom: i < decisionTable.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: accentMap[row.decision], letterSpacing: '0.04em' }}>{row.decision}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{row.condition}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Response */}
      <Section title="Response" description="All decisions are synchronous and returned within milliseconds.">
        <CodeBlock accent="var(--accent)">{responseSnippet}</CodeBlock>
      </Section>
    </div>
  );
}
