import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import gsap from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false); // For Google Auth follow-up
  const [totpCode, setTotpCode] = useState('');
  const { login, googleLogin, unlockVault } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, masterPassword, requires2FA ? totpCode : undefined);
      if (result?.requires2FA) {
        setRequires2FA(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      const card = document.querySelector('.auth-card');
      if (card) {
        gsap.to(card, { x: -8, duration: 0.07, repeat: 5, yoyo: true, ease: 'none',
          onComplete: () => gsap.set(card, { x: 0 }) });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const result = await googleLogin(credentialResponse.credential);
      // Even with Google login, we need the Vault Password to derive the masterKey
      setNeedsUnlock(true);
    } catch (err) {
      setError('Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!masterPassword) return;
    try {
      unlockVault(masterPassword);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid vault password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      {/* Back to home */}
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '32px',
        color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem',
        display: 'flex', alignItems: 'center', gap: '6px',
        textDecoration: 'none', transition: 'color 0.2s ease', fontWeight: '500'
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
        ← Back to home
      </Link>

      <div className="glass-panel auth-box auth-card anim-scale-in">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#F5C518' }}>Pass</span>Vault
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.95rem' }}>
            {needsUnlock ? 'Unlock your encryption vault' : 
             requires2FA ? 'Enter your 2FA code' : 'Log in to your secure vault'}
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

        {needsUnlock ? (
          /* Social Login Step 2: Local Decryption */
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(26,110,245,0.08)', border: '1px solid rgba(26,110,245,0.2)',
              borderRadius: '8px', padding: '14px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)'
            }}>
              ✅ Identity verified. Now enter your <strong>Vault Password</strong> to decrypt your records.
            </div>
            <div>
              <label className="label-text">Vault Password</label>
              <input type="password" className="input-field" value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)} required placeholder="••••••••••••" autoFocus />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
              Unlock Vault & Go →
            </button>
            <button type="button" onClick={() => { setNeedsUnlock(false); setMasterPassword(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
              ← Back to login
            </button>
          </form>
        ) : !requires2FA ? (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="anim-slide-up" style={{ animationDelay: '0.05s' }}>
                <label className="label-text">Email</label>
                <input type="email" className="input-field" value={email}
                  onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="anim-slide-up" style={{ animationDelay: '0.12s' }}>
                <label className="label-text">Master Password</label>
                <input type="password" className="input-field" value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)} required placeholder="••••••••••••" />
              </div>
              <div className="anim-slide-up" style={{ animationDelay: '0.19s', marginTop: '4px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '8px' }} disabled={loading}>
                  {loading ? 'Logging in…' : 'Log In →'}
                </button>
              </div>
            </form>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            <div className="anim-slide-up" style={{ animationDelay: '0.25s', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                theme="filled_blue"
                shape="pill"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          </>
        ) : (
          /* 2FA Step */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(26,110,245,0.08)', border: '1px solid rgba(26,110,245,0.2)',
              borderRadius: '8px', padding: '14px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)'
            }}>
              🔐 Open your authenticator app and enter the 6-digit code for <strong style={{ color: '#4a9eff' }}>PassVault</strong>.
            </div>
            <div>
              <label className="label-text">Authentication Code</label>
              <input
                className="input-field"
                value={totpCode}
                onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{ fontSize: '1.6rem', letterSpacing: '8px', fontFamily: 'monospace', textAlign: 'center' }}
                required autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading || totpCode.length < 6}>
              {loading ? 'Verifying…' : 'Verify Code →'}
            </button>
            <button type="button" onClick={() => { setRequires2FA(false); setTotpCode(''); setError(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
              ← Back to login
            </button>
          </form>
        )}

        {!requires2FA && (
          <div className="anim-fade-in" style={{ animationDelay: '0.3s', marginTop: '28px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4a9eff', fontWeight: '600' }}>Create one free</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
