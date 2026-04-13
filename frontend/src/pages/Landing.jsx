import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef(null);
  const vaultImgRef = useRef(null);

  useEffect(() => {
    // Hero vault floating animation (continuous loop — no opacity:0 risks)
    gsap.to(vaultImgRef.current, {
      y: -18,
      duration: 2.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Scroll-triggered section reveals (uses fromTo so initial opacity is set by CSS)
    const sections = gsap.utils.toArray('.scroll-reveal');
    sections.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: 'hidden', background: '#0a0f1e', color: '#fff' }}>

      {/* ── NAVBAR ── */}
      <nav className="anim-slide-down" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 64px', height: '68px',
        background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🔐</span>
          <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>
            <span style={{ color: '#F5C518' }}>Pass</span>Vault
          </span>
        </div>
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {['Features', 'Security', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem',
              textDecoration: 'none', transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
              {item}
            </a>
          ))}
          <Link to="/register" style={{
            background: '#1a6ef5', color: '#fff', padding: '9px 20px',
            borderRadius: '6px', fontWeight: '600', fontSize: '0.9rem',
            textDecoration: 'none', transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.target.style.background = '#1558cc'}
            onMouseLeave={e => e.target.style.background = '#1a6ef5'}>
            Start Free Trial
          </Link>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Log In
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '100px 64px 60px',
        background: 'linear-gradient(135deg, #0d1b3e 0%, #0a0f1e 60%, #0d1b3e 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Grid dots background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: 'radial-gradient(circle, #4a9eff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Glow orb */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,110,245,0.25) 0%, transparent 70%)',
          top: '50%', left: '30%', transform: 'translate(-50%, -50%)', pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '80px', position: 'relative' }}>
          {/* Left text */}
          <div style={{ flex: '1', minWidth: '320px' }}>
            <div className="anim-slide-down" style={{ animationDelay: '0.1s',
              display: 'inline-block', background: 'rgba(26,110,245,0.15)',
              border: '1px solid rgba(26,110,245,0.3)', borderRadius: '20px',
              padding: '5px 14px', fontSize: '0.82rem', color: '#4a9eff',
              marginBottom: '24px', fontWeight: '600'
            }}>
              🔒 End-to-End Encrypted
            </div>
            <h1 className="anim-slide-down" style={{
              animationDelay: '0.2s',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800',
              lineHeight: '1.12', marginBottom: '20px', letterSpacing: '-1.5px'
            }}>
              Secure. Simple.<br />
              <span style={{ color: '#F5C518' }}>Yours.</span>
            </h1>
            <p className="anim-slide-up" style={{
              animationDelay: '0.3s',
              fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.7', marginBottom: '40px', maxWidth: '440px'
            }}>
              The vault your digital life deserves. End-to-end encryption for all your passwords and notes.
            </p>
            <div className="anim-slide-up" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', animationDelay: '0.4s' }}>
              <Link to="/register" style={{
                background: '#1a6ef5', color: '#fff', padding: '15px 32px',
                borderRadius: '8px', fontWeight: '700', fontSize: '1rem',
                textDecoration: 'none', boxShadow: '0 8px 32px rgba(26,110,245,0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'inline-block'
              }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(26,110,245,0.5)'; }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 32px rgba(26,110,245,0.35)'; }}>
                Get PassVault Free
              </Link>
              <a href="#features" style={{
                border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                padding: '15px 32px', borderRadius: '8px', fontWeight: '600',
                fontSize: '1rem', textDecoration: 'none',
                transition: 'border-color 0.2s ease, background 0.2s ease',
                display: 'inline-block'
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.background = 'transparent'; }}>
                Learn More
              </a>
            </div>

            {/* Single honest badge */}
            <div className="anim-fade-in" style={{ animationDelay: '0.6s', marginTop: '40px', display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '8px', padding: '10px 18px'
            }}>
              <span style={{ color: '#10b981', fontSize: '1.1rem' }}>🔒</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Protected with <strong style={{ color: '#10b981' }}>AES-256</strong> end-to-end encryption</span>
            </div>
          </div>

          {/* Right: Vault image — masked to blend seamlessly */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '100%', maxWidth: '500px',
              maskImage: 'radial-gradient(ellipse 75% 80% at 50% 45%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 80% at 50% 45%, black 40%, transparent 100%)',
            }}>
              <img
                ref={vaultImgRef}
                src="/vault-hero.png"
                alt="PassVault secure vault"
                className="anim-scale-in"
                style={{
                  animationDelay: '0.3s',
                  width: '100%',
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.1) saturate(1.2) drop-shadow(0 20px 60px rgba(26,110,245,0.5))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 64px', background: '#0d1118' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
              Why Choose <span style={{ color: '#F5C518' }}>PassVault</span>?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
              Enterprise-grade security, built for everyone.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {[
              { icon: '🔐', title: 'Zero-Knowledge Encryption', desc: 'Your master password never leaves your device. We mathematically cannot see your data — ever.', delay: '0s' },
              { icon: '📱', title: 'Sync All Devices', desc: 'Access your vault seamlessly across all your devices. Changes sync instantly and securely.', delay: '0.12s' },
              { icon: '🛡️', title: 'Password Health Check', desc: 'Automatic breach detection and password strength analysis to keep your accounts safe.', delay: '0.24s' },
              { icon: '⚡', title: 'Instant Autofill', desc: 'Browser-native autofill that detects login forms and fills them in one click.', delay: '0.36s' },
              { icon: '📋', title: 'Secure Notes', desc: 'Store sensitive information, credit cards, and private notes with the same AES-256 encryption.', delay: '0.48s' },
              { icon: '🔑', title: 'Password Generator', desc: 'Generate unique, strong passwords instantly — never reuse a password again.', delay: '0.6s' },
            ].map(f => (
              <div key={f.title} className="scroll-reveal feature-card" style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '36px 28px',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
                  e.currentTarget.style.borderColor = 'rgba(26,110,245,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" style={{
        padding: '100px 64px',
        background: '#0a0f1e',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
              Your Data. <span style={{ color: '#F5C518' }}>Our Zero-Knowledge.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              We've built an architecture where you are the only one with the key. Even if we wanted to, we couldn't see your data.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            <div className="scroll-reveal glass-panel" style={{ padding: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '24px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>AES-256 Encryption</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                We use Government-grade AES-256 bit encryption to secure your vault. Most supercomputers would take billions of years to crack just one of your passwords.
              </p>
            </div>
            <div className="scroll-reveal glass-panel" style={{ padding: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '24px' }}>🔑</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>Local Decryption</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                Your master key is derived locally on your device and never sent to our servers. All encryption and decryption happens right in your browser.
              </p>
            </div>
            <div className="scroll-reveal glass-panel" style={{ padding: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '24px' }}>☁️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>Secure Cloud Sync</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                We only store the encrypted "blob". Without your master password, that data is just noise to everyone else, including us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTO-FILL SECTION ── */}
      <section style={{
        padding: '100px 64px',
        background: 'linear-gradient(135deg, #0d1b3e 0%, #0a0f1e 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)',
          bottom: '-150px', right: '-150px', pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap' }}>
          <div className="scroll-reveal" style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '20px', lineHeight: '1.15', letterSpacing: '-1px' }}>
              Automate Your<br />
              <span style={{ color: '#F5C518' }}>Access.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '36px', maxWidth: '440px' }}>
              Your vault where you need it. Intelligent browser autofill detected and delivered — no copy-pasting ever again.
            </p>
            <a href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#1a6ef5', color: '#fff', padding: '14px 28px',
              borderRadius: '8px', fontWeight: '700', textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(26,110,245,0.3)',
              transition: 'transform 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              Add Extension to Chrome →
            </a>
          </div>

          {/* Visual feature list */}
          <div className="scroll-reveal" style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '✅', text: 'One-click login to any website' },
              { icon: '✅', text: 'Works on Chrome, Firefox, Edge, Safari' },
              { icon: '✅', text: 'Detects phishing sites automatically' },
              { icon: '✅', text: 'Fills credit cards and addresses too' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px', padding: '18px 20px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', fontWeight: '500' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{
        padding: '120px 64px',
        background: '#0d1118',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
              Simple, Transparent <span style={{ color: '#F5C518' }}>Pricing.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
              Choose the plan that fits your digital life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Free */}
            <div className="scroll-reveal glass-panel" style={{ padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Personal</div>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px' }}>$0 <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Unlimited Passwords', '1 Device Sync', 'Security Audit', '2FA Support', 'Password Generator'].map(f => (
                  <li key={f} style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-secondary" style={{ display: 'block', padding: '14px' }}>Start Free Trial</Link>
            </div>

            {/* Pro */}
            <div className="scroll-reveal glass-panel" style={{ 
              padding: '60px 40px', textAlign: 'center', 
              border: '2px solid var(--primary)', 
              transform: 'scale(1.05)',
              position: 'relative',
              boxShadow: '0 24px 80px rgba(245, 197, 24, 0.15)'
            }}>
              <div style={{ 
                position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--primary)', color: '#000', padding: '4px 16px', borderRadius: '20px',
                fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase'
              }}>Most Popular</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Premium Plus</div>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px' }}>$2.99 <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Everything in Free', 'Unlimited Device Sync', 'BreachWatch Monitoring', 'Priority Support', 'Self-Destruct Messages'].map(f => (
                  <li key={f} style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', gap: '10px' }}>
                    <span style={{ color: 'var(--primary)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary" style={{ display: 'block', padding: '16px', fontWeight: '700' }}>Get Premium Now</Link>
            </div>

            {/* Business */}
            <div className="scroll-reveal glass-panel" style={{ padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Enterprise</div>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px' }}>$9.99 <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Everything in Premium', 'Admin Dashboard', 'Shared Team Folders', 'Audit Logs', 'SSO & Azure Integration'].map(f => (
                  <li key={f} style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#3b82f6' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-secondary" style={{ display: 'block', padding: '14px' }}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="scroll-reveal" style={{
        padding: '90px 64px', textAlign: 'center',
        background: 'linear-gradient(90deg, #1a3a8f, #1a6ef5, #0d1b3e)',
        backgroundSize: '300% 100%',
        animation: 'gradientShift 6s ease infinite'
      }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
          Start protecting your passwords today.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontSize: '1.1rem' }}>
          Free forever. No credit card required.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            background: '#F5C518', color: '#000', padding: '16px 40px',
            borderRadius: '8px', fontWeight: '700', fontSize: '1.05rem',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 8px 32px rgba(245,197,24,0.35)',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(245,197,24,0.5)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 32px rgba(245,197,24,0.35)'; }}>
            Create Free Account
          </Link>
          <Link to="/login" style={{
            background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '16px 40px',
            borderRadius: '8px', fontWeight: '600', fontSize: '1.05rem',
            textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)',
          }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 64px', background: '#07090f', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>
          <span style={{ color: '#F5C518' }}>Pass</span>Vault
        </span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
          © 2026 PassVault. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Security'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (max-width: 768px) {
          nav { padding: 0 24px !important; }
          section { padding: 60px 24px !important; }
        }
        .btn-primary { background: var(--primary); color: #000; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; cursor: pointer; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default Landing;
