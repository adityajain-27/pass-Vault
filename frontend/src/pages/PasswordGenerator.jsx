import React, { useState, useCallback, useEffect } from 'react';
import StrengthMeter from '../components/StrengthMeter';
import gsap from 'gsap';

const HISTORY_LIMIT = 10;

const PasswordGenerator = () => {
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [exclude, setExclude] = useState('');
  const [generated, setGenerated] = useState('');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let chars = '';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    // remove excluded chars
    if (exclude) chars = chars.split('').filter(c => !exclude.includes(c)).join('');
    if (!chars) return;

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) result += chars[array[i] % chars.length];

    setGenerated(result);
    setHistory(prev => [result, ...prev].slice(0, HISTORY_LIMIT));
    setCopied(false);

    // Animate the output
    const el = document.getElementById('gen-output');
    if (el) gsap.from(el, { opacity: 0.2, y: 4, duration: 0.25, ease: 'power2.out' });
  }, [length, useUpper, useLower, useNumbers, useSymbols, exclude]);

  useEffect(() => { generatePassword(); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


  const Toggle = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
        background: value ? '#1a6ef5' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s ease', flexShrink: 0
      }}>
        <div style={{
          position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
          background: '#fff', top: '3px', left: value ? '23px' : '3px',
          transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
        }} />
      </div>
    </div>
  );

  return (
    <div className="app-container" style={{ padding: '48px 60px', maxWidth: '900px' }}>
      <header className="anim-slide-down" style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>Password Generator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Cryptographically strong passwords using <code style={{ color: '#4a9eff' }}>crypto.getRandomValues()</code>
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
        {/* Main panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Generated password output */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <label className="label-text" style={{ marginBottom: '12px' }}>Generated Password</label>
            <div id="gen-output" style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontFamily: 'monospace',
              letterSpacing: '2px', wordBreak: 'break-all', lineHeight: '1.5',
              color: '#fff', marginBottom: '20px', minHeight: '60px',
              padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              {generated || '—'}
            </div>

            {/* Strength bar */}
            {generated && (
              <div style={{ marginBottom: '20px' }}>
                <StrengthMeter password={generated} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => copyToClipboard(generated)} className="btn-primary"
                style={{ flex: 1, padding: '12px' }}>
                {copied ? '✓ Copied!' : '📋 Copy Password'}
              </button>
              <button onClick={generatePassword} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                🔄 Regenerate
              </button>
            </div>
          </div>

          {/* Length slider */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontWeight: '600' }}>Password Length</span>
              <span style={{ fontWeight: '800', fontSize: '1.3rem', color: '#4a9eff' }}>{length}</span>
            </div>
            <input type="range" min={8} max={64} value={length} onChange={e => setLength(+e.target.value)}
              style={{ width: '100%', accentColor: '#1a6ef5', height: '6px', outline: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>8 (minimum)</span>
              <span>64 (maximum)</span>
            </div>
          </div>

          {/* Character options */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '4px' }}>Character Types</h3>
            <Toggle label="Uppercase Letters (A–Z)" value={useUpper} onChange={setUseUpper} />
            <Toggle label="Lowercase Letters (a–z)" value={useLower} onChange={setUseLower} />
            <Toggle label="Numbers (0–9)" value={useNumbers} onChange={setUseNumbers} />
            <Toggle label="Symbols (!@#$%^&*…)" value={useSymbols} onChange={setUseSymbols} />
            <div style={{ paddingTop: '16px' }}>
              <label className="label-text">Exclude Characters</label>
              <input className="input-field" value={exclude} onChange={e => setExclude(e.target.value)}
                placeholder='e.g. 0Ol1I (to avoid ambiguous chars)' />
            </div>
          </div>

          <button onClick={generatePassword} className="btn-primary" style={{ padding: '16px', fontSize: '1rem', width: '100%' }}>
            ⚡ Generate New Password
          </button>
        </div>

        {/* History panel */}
        <div className="glass-panel anim-slide-up" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Recent Passwords</h3>
          {history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No history yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((pw, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px', border: '1px solid var(--border-color)'
                }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: i === 0 ? '#4a9eff' : 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {i === 0 ? pw : pw.slice(0, 12) + '…'}
                  </span>
                  <button onClick={() => copyToClipboard(pw)} style={{
                    background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                    fontSize: '0.75rem', padding: '2px 6px', flexShrink: 0, transition: 'color 0.2s'
                  }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', marginTop: '16px', lineHeight: '1.5' }}>
            History is stored in memory only and cleared when you leave this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
