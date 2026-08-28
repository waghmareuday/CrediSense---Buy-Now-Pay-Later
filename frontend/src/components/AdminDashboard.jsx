import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

// ---------- helpers ----------

const fmt = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const riskColor = (p) => {
  if (p < 0.35) return '#10b981';
  if (p < 0.6) return '#f59e0b';
  return '#f43f5e';
};

// ---------- Custom Tooltip ----------

function ShapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#0f1117',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      minWidth: '180px',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {d.feature}
      </p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: d.impact > 0 ? '#fb7185' : '#34d399' }}>
        {d.impact > 0 ? '+' : ''}{d.impact.toFixed(4)} impact
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
        Input: <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{typeof d.value === 'number' ? d.value.toLocaleString() : d.value}</span>
      </p>
    </div>
  );
}

// ---------- KPI Card ----------

function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.25)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: accent || 'rgba(255,255,255,0.08)',
      }} />
      <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>{sub}</p>}
    </div>
  );
}

// ---------- Transaction Row ----------

function TxRow({ tx, selected, onClick }) {
  const approved = tx.decision === 'APPROVED';
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        padding: '14px 16px',
        borderRadius: '12px',
        border: selected
          ? '1px solid rgba(124,106,247,0.4)'
          : '1px solid rgba(255,255,255,0.05)',
        background: selected
          ? 'rgba(124,106,247,0.08)'
          : 'rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
        }
      }}
    >
      {/* left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
        borderRadius: '3px 0 0 3px',
        background: approved ? '#10b981' : '#f43f5e',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: '10px' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
            #{String(tx.id).slice(-6).padStart(6, '0')}
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{tx.product_name}</p>
        </div>
        <span className={approved ? 'badge-approved' : (tx.decision === 'COUNTER_OFFER' ? 'badge-warning' : 'badge-declined')}>
          {tx.decision}
        </span>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '10px', marginLeft: '10px',
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '8px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
          ₹{Number(tx.cart_value).toLocaleString()}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: riskColor(tx.risk_probability) }}>
          {(tx.risk_probability * 100).toFixed(1)}% risk
        </span>
      </div>
    </button>
  );
}

// ---------- SHAP Chart ----------

function ShapChart({ explanations }) {
  const data = [...explanations].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 20, left: 110, bottom: 4 }}
        barCategoryGap="30%"
      >
        <XAxis
          type="number"
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
          tickLine={false}
        />
        <YAxis
          dataKey="feature"
          type="category"
          width={120}
          tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine x={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <Tooltip content={<ShapTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.impact > 0 ? '#f43f5e' : '#10b981'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------- Empty State ----------

function EmptyState() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px',
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.3 }}>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>No transaction selected</p>
      <p style={{ fontSize: '13px', lineHeight: 1.6 }}>Select a transaction from the left to view SHAP explainability analysis.</p>
    </div>
  );
}

// ---------- Main Component ----------

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const { data } = await axios.get(`${API_URL}/api/transactions`);
        setTransactions(data);
        if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
      } catch { /* silent */ }
    };
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  const selected = transactions.find(t => t.id === selectedId) || null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '20px',
      height: 'calc(100vh - 200px)',
      minHeight: '600px',
    }}>

      {/* ── Left: Transaction feed ── */}
      <div className="glass" style={{ borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Feed</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginTop: '2px' }}>Applications</p>
          </div>
          {/* Pulse dot */}
          <div style={{ position: 'relative', width: '10px', height: '10px' }}>
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: '#10b981',
              animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
              opacity: 0.6,
            }} />
            <div style={{
              position: 'absolute', inset: '1px',
              borderRadius: '50%',
              background: '#10b981',
            }} />
          </div>
        </div>

        {/* Stats row */}
        {transactions.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '8px', marginBottom: '16px', flexShrink: 0,
          }}>
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '10px 12px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: '4px' }}>Approved</p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#34d399' }}>
                {transactions.filter(t => t.decision === 'APPROVED').length}
              </p>
            </div>
            <div style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '10px', padding: '10px 12px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: '4px' }}>Declined</p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#fb7185' }}>
                {transactions.filter(t => t.decision === 'DECLINED').length}
              </p>
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontSize: '13px', lineHeight: 1.7 }}>
              No applications yet.<br />Submit one from the Checkout tab.
            </div>
          ) : transactions.map(tx => (
            <TxRow
              key={tx.id}
              tx={tx}
              selected={selectedId === tx.id}
              onClick={() => setSelectedId(tx.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: SHAP panel ── */}
      <div className="glass" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Model Explainability Engine
          </p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginTop: '4px' }}>
            SHAP Analysis
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '6px', lineHeight: 1.6 }}>
            SHapley Additive exPlanations · Required for FinTech regulatory compliance (ECOA, GDPR Article 22)
          </p>
        </div>

        {selected ? (
          <>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px', flexShrink: 0 }}>
              <KpiCard
                label="Verdict"
                value={selected.decision}
                accent={selected.decision === 'APPROVED' ? '#10b981' : (selected.decision === 'COUNTER_OFFER' ? '#f59e0b' : '#f43f5e')}
              />
              <KpiCard
                label="Default Probability"
                value={`${(selected.risk_probability * 100).toFixed(2)}%`}
                sub={selected.risk_probability > 0.5 ? 'High risk detected' : 'Within acceptable range'}
                accent={riskColor(selected.risk_probability)}
              />
              <KpiCard
                label="Product / Value"
                value={`₹${Number(selected.cart_value).toLocaleString()}`}
                sub={selected.product_name}
                accent="rgba(79,142,247,0.7)"
              />
            </div>

            {/* Fraud Flags */}
            {selected.fraud_flags && selected.fraud_flags.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '10px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', marginBottom: '6px' }}>Fraud Alerts Triggered</p>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  {selected.fraud_flags.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {/* Chart */}
            <div style={{
              flex: 1,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '14px',
              padding: '20px 16px 16px',
              minHeight: 0,
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', marginLeft: '110px' }}>
                Feature Impact on Default Risk
              </p>
              <ShapChart explanations={selected.shap_explanations} />
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px',
              marginTop: '16px', flexShrink: 0,
              paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              {[
                { color: '#f43f5e', label: 'Increases default risk' },
                { color: '#10b981', label: 'Decreases default risk' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '3px', background: item.color,
                    boxShadow: `0 0 8px ${item.color}60`,
                  }} />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @media (max-width: 900px) {
          .admin-grid { grid-template-columns: 1fr !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
}
