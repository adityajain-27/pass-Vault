import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, masterPassword);
      navigate('/dashboard');
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
            Log in to your secure vault
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

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

        <div className="anim-fade-in" style={{ animationDelay: '0.3s', marginTop: '28px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4a9eff', fontWeight: '600' }}>Create one free</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
