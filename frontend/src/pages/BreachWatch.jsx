import React, { useState, useContext, useEffect } from 'react';
import { getEntries } from '../api/vault.api';
import { checkPasswordBreach } from '../api/breach.api';
import { decryptData } from '../crypto/cryptoUtils';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';

const BreachWatch = () => {
    const { masterKey } = useContext(AuthContext);
    const [status, setStatus] = useState('idle'); // idle, scanning, complete
    const [results, setResults] = useState([]);
    const [progress, setProgress] = useState(0);

    const startScan = async () => {
        setStatus('scanning');
        setResults([]);
        setProgress(0);
        
        try {
            const entries = await getEntries();
            const passwordEntries = entries.filter(e => {
                const dec = decryptData(e.encryptedData, masterKey);
                return dec && dec.type === 'password';
            });

            const foundBreaches = [];
            for (let i = 0; i < passwordEntries.length; i++) {
                const entry = passwordEntries[i];
                const dec = decryptData(entry.encryptedData, masterKey);
                
                const check = await checkPasswordBreach(dec.password);
                if (check.breached) {
                    foundBreaches.push({ label: entry.label, count: check.count });
                }
                setProgress(Math.round(((i + 1) / passwordEntries.length) * 100));
            }
            setResults(foundBreaches);
            setStatus('complete');
        } catch (err) {
            console.error("Scan failed", err);
            setStatus('error');
        }
    };

    useEffect(() => {
        if (status === 'complete') {
            gsap.from('.breach-anim', { opacity: 0, scale: 0.95, y: 10, stagger: 0.1, duration: 0.5 });
        }
    }, [status]);

    return (
        <div className="app-container" style={{ padding: '48px 60px' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>BreachWatch</h1>
                <p style={{ color: 'var(--text-muted)' }}>Scan billions of leaked records for your passwords</p>
            </header>

            {status === 'idle' && (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '24px' }}>👁️‍🗨️</div>
                    <h2 style={{ marginBottom: '16px' }}>Ready to Scan your Vault?</h2>
                    <p style={{ maxWidth: '500px', margin: '0 auto 32px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        We will securely check every password in your vault against the HaveIBeenPwned database of billions of leaked credentials. 
                        <strong> Your passwords never leave this device.</strong>
                    </p>
                    <button onClick={startScan} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                        Start Full Vault Scan
                    </button>
                </div>
            )}

            {status === 'scanning' && (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>Scan in Progress... {progress}%</div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Checking records against secure global hash-lists...</p>
                </div>
            )}

            {status === 'complete' && (
                <div className="anim-fade-in">
                    <div className="glass-panel" style={{ 
                        padding: '32px', marginBottom: '32px', 
                        background: results.length > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        border: `1px solid ${results.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                    }}>
                        <h2 style={{ color: results.length > 0 ? '#ef4444' : '#10b981', marginBottom: '8px' }}>
                            {results.length > 0 ? `⚠️ Found ${results.length} At-Risk Records` : "✅ Your Vault is Clean"}
                        </h2>
                        <p style={{ fontSize: '0.9rem' }}>
                            {results.length > 0 
                                ? "One or more of your passwords have appeared in public data breaches. We recommend changing them immediately."
                                : "None of your current passwords were found in existing data breaches. Great job!"}
                        </p>
                    </div>

                    {results.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {results.map((r, i) => (
                                <div key={i} className="glass-panel breach-anim" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{r.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Seen {r.count.toLocaleString()} times in previous leaks</div>
                                    </div>
                                    <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', background: '#ef4444' }}>Change Password</button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <button onClick={startScan} className="btn-secondary">Scan Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BreachWatch;
