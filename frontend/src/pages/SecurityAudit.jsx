import React, { useState, useEffect, useContext } from 'react';
import { getEntries } from '../api/vault.api';
import { runSecurityAudit } from '../crypto/auditUtils';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';

const SecurityAudit = () => {
    const { masterKey } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const performAudit = async () => {
            setScanning(true);
            try {
                const entries = await getEntries();
                // Artificial delay for "Scanning" feel
                await new Promise(r => setTimeout(r, 1500));
                const results = runSecurityAudit(entries, masterKey);
                setStats(results);
            } catch (err) {
                console.error("Audit failed", err);
            } finally {
                setScanning(false);
            }
        };
        performAudit();
    }, [masterKey]);

    useEffect(() => {
        if (!scanning && stats) {
            gsap.from('.audit-card', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
        }
    }, [scanning, stats]);

    if (scanning) {
        return (
            <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <div className="spinner" style={{ width: '60px', height: '60px', marginBottom: '24px' }}></div>
                <h2 style={{ fontWeight: '700' }} className="anim-fade-in">Scanning your vault...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Analyzing password strength and reuse patterns</p>
            </div>
        );
    }

    const { score, breakdown, weak, reused, old } = stats;
    const scoreColor = score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="app-container" style={{ padding: '48px 60px' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Security Audit</h1>
                <p style={{ color: 'var(--text-muted)' }}>Complete overview of your digital security health</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
                {/* Score Section */}
                <div className="glass-panel audit-card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '180px', height: '180px', borderRadius: '50%',
                        border: `12px solid rgba(255,255,255,0.05)`,
                        borderTopColor: scoreColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px', position: 'relative'
                    }}>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: scoreColor }}>{score}</div>
                    </div>
                    <h2 style={{ marginBottom: '8px' }}>Vault Health Score</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {score === 100 ? "Perfect! Your vault is highly secure." : "Your vault requires attention."}
                    </p>
                </div>

                {/* Breakdown Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="glass-panel audit-card" style={{ padding: '24px', borderLeft: `4px solid ${weak.length > 0 ? '#ef4444' : '#10b981'}` }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Weak Passwords</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{weak.length}</div>
                    </div>
                    <div className="glass-panel audit-card" style={{ padding: '24px', borderLeft: `4px solid ${reused.length > 0 ? '#f59e0b' : '#10b981'}` }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Reused Passwords</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{reused.length}</div>
                    </div>
                    <div className="glass-panel audit-card" style={{ padding: '24px', borderLeft: `4px solid ${old.length > 0 ? '#3b82f6' : '#10b981'}` }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Old (6m+) Passwords</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{old.length}</div>
                    </div>
                    <div className="glass-panel audit-card" style={{ padding: '24px', borderLeft: `4px solid #10b981` }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Records</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.total}</div>
                    </div>
                </div>
            </div>

            {/* Detailed Issues List */}
            <div style={{ marginTop: '48px' }}>
                <h2 style={{ marginBottom: '24px' }}>Actions Recommended</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {weak.map(item => (
                        <div key={item.id} className="glass-panel audit-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong style={{ color: '#ef4444' }}>Weak Password:</strong> {item.label}
                            </div>
                            <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>Change Now</button>
                        </div>
                    ))}
                    {reused.map(item => (
                        <div key={item.id} className="glass-panel audit-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong style={{ color: '#f59e0b' }}>Reused Password:</strong> {item.label}
                            </div>
                            <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>Update</button>
                        </div>
                    ))}
                    {weak.length === 0 && reused.length === 0 && (
                        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            🎉 No critical security issues found!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityAudit;
