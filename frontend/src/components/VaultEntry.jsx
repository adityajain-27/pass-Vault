import React, { useState } from 'react';

const CARD_ICONS = { Visa: '💳', Mastercard: '💳', Amex: '💳', Discover: '💳', Other: '💳' };

const VaultEntry = ({ label, category, isFavorite, decryptedData, onEdit, onDelete }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState('');

  const type = decryptedData?.type || 'password';

  const copyToClipboard = (text, field) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
      setTimeout(() => navigator.clipboard.writeText(''), 30000);
    });
  };

  const maskCard = (num) => {
    if (!num) return '•••• •••• •••• ••••';
    const clean = num.replace(/\D/g, '');
    return `•••• •••• •••• ${clean.slice(-4)}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
      {isFavorite && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.9rem' }}>⭐</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.7rem', background: 'rgba(26,110,245,0.12)', color: '#4a9eff',
              padding: '2px 8px', borderRadius: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>{category || 'General'}</span>
            <span style={{
              fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.4)', padding: '2px 8px', borderRadius: '10px', fontWeight: '500'
            }}>
              {type === 'card' ? '💳 Card' : type === 'note' ? '📋 Note' : '🔑 Password'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
          <button className="btn-secondary" onClick={onEdit} style={{ padding: '5px 11px', fontSize: '0.78rem' }}>Edit</button>
          <button className="btn-secondary" onClick={onDelete} style={{ padding: '5px 11px', fontSize: '0.78rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.25)' }}>Delete</button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '14px' }} />

      {/* ── Password type ── */}
      {type === 'password' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span className="label-text">Username / Email</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{decryptedData?.username || 'N/A'}</span>
              <button onClick={() => copyToClipboard(decryptedData?.username, 'user')}
                className="btn-secondary" style={{ padding: '3px 10px', fontSize: '0.75rem' }}>
                {copied === 'user' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div>
            <span className="label-text">Password</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input type={showSecret ? 'text' : 'password'} value={decryptedData?.password || ''} readOnly
                className="input-field" style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }} />
              <button onClick={() => setShowSecret(!showSecret)} className="btn-secondary" style={{ padding: '8px 10px' }}>
                {showSecret ? '🔒' : '👁️'}
              </button>
              <button onClick={() => copyToClipboard(decryptedData?.password, 'pass')}
                className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                {copied === 'pass' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
          {decryptedData?.websiteUrl && (
            <div>
              <span className="label-text">Website</span>
              <a href={decryptedData.websiteUrl.startsWith('http') ? decryptedData.websiteUrl : `https://${decryptedData.websiteUrl}`}
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#4a9eff', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🔗 {decryptedData.websiteUrl}
              </a>
            </div>
          )}
          {decryptedData?.notes && (
            <div>
              <span className="label-text">Notes</span>
              <div style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.15)', padding: '8px 12px', borderRadius: '6px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
                {decryptedData.notes}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Credit Card type ── */}
      {type === 'card' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a3a8f, #1a6ef5)',
            borderRadius: '10px', padding: '20px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-30px', right: '20px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{decryptedData?.cardType || 'Card'}</div>
            <div style={{ fontSize: '1.15rem', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '16px' }}>
              {showSecret ? (decryptedData?.cardNumber?.replace(/(\d{4})/g, '$1 ').trim() || '•••• •••• •••• ••••') : maskCard(decryptedData?.cardNumber)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>CARDHOLDER</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{decryptedData?.cardHolder || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>EXPIRES</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{decryptedData?.expiry || 'MM/YY'}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowSecret(!showSecret)} className="btn-secondary" style={{ flex: 1, padding: '8px' }}>
              {showSecret ? '🔒 Hide' : '👁️ Reveal'}
            </button>
            <button onClick={() => copyToClipboard(decryptedData?.cardNumber, 'card')}
              className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}>
              {copied === 'card' ? '✓ Copied' : 'Copy Number'}
            </button>
          </div>
        </div>
      )}

      {/* ── Secure Note type ── */}
      {type === 'note' && (
        <div>
          <span className="label-text">Secure Note</span>
          <div style={{
            background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '12px',
            fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.65',
            maxHeight: '120px', overflow: 'hidden', position: 'relative',
            filter: showSecret ? 'none' : 'blur(4px)', transition: 'filter 0.3s ease',
            userSelect: showSecret ? 'text' : 'none'
          }}>
            {decryptedData?.noteContent || 'Empty note'}
          </div>
          <button onClick={() => setShowSecret(!showSecret)} className="btn-secondary"
            style={{ width: '100%', padding: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
            {showSecret ? '🔒 Hide Note' : '👁️ Reveal Note'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VaultEntry;
