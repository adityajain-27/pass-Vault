import React, { useState, useEffect } from 'react';
import { get2FAStatus, setup2FA, enable2FA, disable2FA } from '../api/twoFactor.api';

const TwoFactorSetup = () => {
  const [status, setStatus] = useState(null); // null=loading, true=enabled, false=disabled
  const [step, setStep] = useState('idle'); // idle | setup | verify | disable
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadStatus = async () => {
    try {
      const res = await get2FAStatus();
      setStatus(res.data.enabled);
    } catch { setStatus(false); }
  };

  useEffect(() => { loadStatus(); }, []);

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await setup2FA();
      setQrCode(res.data.qrCode);
      setSecret(res.data.secret);
      setStep('setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    } finally { setLoading(false); }
  };

  const handleEnable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await enable2FA(code);
      setSuccess('✅ Two-factor authentication enabled!');
      setStep('idle');
      setCode('');
      loadStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally { setLoading(false); }
  };

  const handleDisable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await disable2FA(code);
      setSuccess('2FA has been disabled.');
      setStep('idle');
      setCode('');
      loadStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally { setLoading(false); }
  };

  if (status === null) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px' }}>
      <div className="spinner" /><span style={{ color: 'var(--text-muted)' }}>Loading 2FA status...</span>
    </div>
  );

  return (
    <div className="app-container" style={{ padding: '48px 60px', maxWidth: '700px' }}>
      <header className="anim-slide-down" style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>
          Two-Factor Authentication
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Add an extra layer of protection using a TOTP authenticator app (Google Authenticator, Authy, etc.)
        </p>
      </header>

      {/* Status banner */}
      <div className="glass-panel anim-slide-up" style={{
        padding: '20px 24px', marginBottom: '32px',
        borderLeft: `4px solid ${status ? 'var(--success)' : 'rgba(255,255,255,0.2)'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px'
      }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>
            {status ? '🔐 Two-Factor Authentication is ON' : '⚠️ Two-Factor Authentication is OFF'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {status
              ? 'Your account is protected. A code is required on every login.'
              : 'Your account relies on password only. Enable 2FA for better security.'}
          </div>
        </div>
        {!status && step === 'idle' && (
          <button onClick={handleSetup} className="btn-primary" style={{ padding: '10px 24px', flexShrink: 0 }} disabled={loading}>
            {loading ? 'Setting up…' : 'Enable 2FA'}
          </button>
        )}
        {status && step === 'idle' && (
          <button onClick={() => { setStep('disable'); setError(''); setSuccess(''); }}
            className="btn-secondary" style={{ padding: '10px 24px', flexShrink: 0, color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)' }}>
            Disable 2FA
          </button>
        )}
      </div>

      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '14px 18px', marginBottom: '24px', color: 'var(--success)', fontSize: '0.9rem' }}>
          {success}
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {/* ── SETUP STEP: Show QR ── */}
      {step === 'setup' && (
        <div className="glass-panel anim-scale-in" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>Scan with your Authenticator App</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '28px' }}>
            Open Google Authenticator, Authy, or any TOTP app and scan the QR code below.
          </p>

          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              <img src={qrCode} alt="2FA QR Code" style={{
                width: '200px', height: '200px', borderRadius: '12px',
                border: '4px solid rgba(255,255,255,0.1)'
              }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Scan this QR code</p>
            </div>

            {/* Manual entry */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Can't scan? Enter this code manually:
              </p>
              <div style={{
                fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '2px',
                background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid var(--border-color)', wordBreak: 'break-all',
                color: '#4a9eff', marginBottom: '24px'
              }}>
                {secret}
              </div>

              <form onSubmit={handleEnable}>
                <label className="label-text">Enter the 6-digit code from your app</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    className="input-field"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                    placeholder="000000"
                    maxLength={6}
                    style={{ fontSize: '1.3rem', letterSpacing: '6px', fontFamily: 'monospace', flex: 1, textAlign: 'center' }}
                    required autoFocus
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0 20px' }} disabled={loading || code.length < 6}>
                    {loading ? '…' : 'Verify'}
                  </button>
                </div>
              </form>

              <button onClick={() => { setStep('idle'); setQrCode(''); setSecret(''); }} style={{
                marginTop: '16px', background: 'transparent', border: 'none',
                color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline'
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DISABLE STEP ── */}
      {step === 'disable' && (
        <div className="glass-panel anim-scale-in" style={{ padding: '32px', borderLeft: '4px solid var(--error)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px', color: 'var(--error)' }}>Disable Two-Factor Authentication</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
            Enter a current valid 6-digit code from your authenticator app to confirm.
          </p>
          <form onSubmit={handleDisable}>
            <label className="label-text">Current 2FA Code</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                className="input-field"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                placeholder="000000"
                maxLength={6}
                style={{ fontSize: '1.3rem', letterSpacing: '6px', fontFamily: 'monospace', flex: 1, textAlign: 'center' }}
                required autoFocus
              />
              <button type="submit" className="btn-secondary" style={{ padding: '0 20px', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)' }} disabled={loading || code.length < 6}>
                {loading ? '…' : 'Disable'}
              </button>
            </div>
          </form>
          <button onClick={() => { setStep('idle'); setCode(''); setError(''); }} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline'
          }}>Cancel</button>
        </div>
      )}

      {/* How it works */}
      {step === 'idle' && (
        <div className="anim-fade-in" style={{ marginTop: '40px' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>How it works</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { n: '1', t: 'Install an authenticator app', d: 'Use Google Authenticator, Authy, Microsoft Authenticator, or any TOTP app.' },
              { n: '2', t: 'Scan the QR code', d: 'When you click Enable 2FA, scan the QR code with your app to link it.' },
              { n: '3', t: 'Enter the 6-digit code', d: 'Verify with a code from your app. Your account is now protected.' },
              { n: '4', t: 'Code required on login', d: 'Every login asks for a code after your password — even if your password leaks, attackers can\'t get in.' },
            ].map(item => (
              <div key={item.n} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '16px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)', borderRadius: '8px'
              }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0 }}>
                  {item.n}
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>{item.t}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
