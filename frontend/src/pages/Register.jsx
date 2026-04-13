import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StrengthMeter from '../components/StrengthMeter';
import gsap from 'gsap';

const Register = () => {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (masterPassword !== confirmPassword) {
      setError('Passwords do not match');
      const card = document.querySelector('.auth-card');
      if (card) {
        gsap.to(card, { x: -8, duration: 0.07, repeat: 5, yoyo: true, ease: 'none',
          onComplete: () => gsap.set(card, { x: 0 }) });
      }
      return;
    }
    setLoading(true);
    try {
      await register(email, masterPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
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
        textDecoration: 'none', transition: 'color 0.2s ease',
        fontWeight: '500'
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
        ← Back to home
      </Link>

      <div className="glass-panel auth-box auth-card anim-scale-in" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#F5C518' }}>Pass</span>Vault
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.95rem' }}>
            Create your free account
          </p>
        </div>

        {/* Warning */}
        <div className="anim-slide-up" style={{
          background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid var(--error)',
          padding: '12px 14px', marginBottom: '24px', fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.6)', borderRadius: '8px', lineHeight: '1.5'
        }}>
          <strong style={{ color: '#fca5a5' }}>Important:</strong> Your master password cannot be recovered. We never store it.
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="anim-slide-up" style={{ animationDelay: '0.05s' }}>
            <label className="label-text">Email</label>
            <input type="email" className="input-field" value={email}
              onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>

          <div className="anim-slide-up" style={{ animationDelay: '0.12s' }}>
            <label className="label-text">Master Password</label>
            <input type="password" className="input-field" value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)} required placeholder="Create a strong password" />
            <StrengthMeter password={masterPassword} />
          </div>

          <div className="anim-slide-up" style={{ animationDelay: '0.19s' }}>
            <label className="label-text">Confirm Password</label>
            <input type="password" className="input-field" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm your password" />
          </div>

          <div className="anim-slide-up" style={{ animationDelay: '0.26s', marginTop: '4px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '8px' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Free Account →'}
            </button>
          </div>
        </form>

        <div className="anim-fade-in" style={{ animationDelay: '0.4s', marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4a9eff', fontWeight: '600' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
