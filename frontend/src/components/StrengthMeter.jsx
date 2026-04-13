import React from 'react';
import zxcvbn from 'zxcvbn';

const LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#10b981'];
const WIDTHS = [20, 40, 60, 80, 100];

const StrengthMeter = ({ password }) => {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score; // 0–4
  const color = COLORS[score];
  const label = LABELS[score];
  const width = WIDTHS[score];

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Password strength</span>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color }}>{label}</span>
      </div>
      <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: '3px', transition: 'width 0.3s ease, background 0.3s ease' }} />
      </div>
      {result.feedback?.warning && (
        <div style={{ fontSize: '0.72rem', marginTop: '5px', color: 'rgba(255,255,255,0.4)' }}>
          ⚠ {result.feedback.warning}
        </div>
      )}
    </div>
  );
};

export default StrengthMeter;
