import React, { useState, useContext } from 'react';
import { encryptData } from '../crypto/cryptoUtils';
import { createEntry } from '../api/vault.api';
import { AuthContext } from '../context/AuthContext';
import StrengthMeter from './StrengthMeter';

const CATEGORIES = ['Personal', 'Work', 'Finance', 'Social', 'Shopping', 'Other'];
const ENTRY_TYPES = [
  { id: 'password', label: '🔑 Password', desc: 'Login credentials' },
  { id: 'card', label: '💳 Credit Card', desc: 'Card details' },
  { id: 'note', label: '📋 Secure Note', desc: 'Encrypted text' },
];

const AddEntryModal = ({ onClose, onAdded, initialType = 'password', lockedType = null }) => {
  const [entryType, setEntryType] = useState(lockedType || initialType);
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isFavorite, setIsFavorite] = useState(false);

  // Password fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('Visa');

  // Secure note fields
  const [noteContent, setNoteContent] = useState('');

  const { masterKey } = useContext(AuthContext);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let p = '';
    for (let i = 0; i < 20; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
    setShowPassword(true);
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let plaintext = {};
      if (entryType === 'password') {
        plaintext = { type: 'password', username, password, websiteUrl, notes };
      } else if (entryType === 'card') {
        plaintext = { type: 'card', cardNumber: cardNumber.replace(/\s/g, ''), cardHolder, expiry, cvv, cardType };
      } else {
        plaintext = { type: 'note', noteContent };
      }
      const ciphertext = encryptData(plaintext, masterKey);
      await createEntry({ label, encryptedData: ciphertext, category, isFavorite });
      onAdded();
    } catch (err) {
      console.error('Failed to add entry', err);
      alert('Failed to add entry');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
      <div className="glass-panel modal-panel">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Create Record</h2>
          <button type="button" onClick={() => setIsFavorite(!isFavorite)} style={{
            background: 'transparent', fontSize: '1.5rem', cursor: 'pointer',
            opacity: isFavorite ? 1 : 0.25, transition: 'opacity 0.2s ease', border: 'none'
          }}>⭐</button>
        </div>

        {/* Type selector */}
        {!lockedType && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
            {ENTRY_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setEntryType(t.id)} style={{
                padding: '12px 8px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${entryType === t.id ? '#1a6ef5' : 'rgba(255,255,255,0.08)'}`,
                background: entryType === t.id ? 'rgba(26,110,245,0.15)' : 'rgba(255,255,255,0.03)',
                color: entryType === t.id ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s ease', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{t.label.split(' ')[0]}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600' }}>{t.label.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Common fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="label-text">Title</label>
              <input className="input-field" value={label} onChange={e => setLabel(e.target.value)} required placeholder={entryType === 'card' ? 'e.g. Visa Business' : 'e.g. Amazon'} />
            </div>
            <div>
              <label className="label-text">Folder</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ appearance: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Password fields */}
          {entryType === 'password' && (<>
            <div>
              <label className="label-text">Username / Email</label>
              <input className="input-field" value={username} onChange={e => setUsername(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-text">Password</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input className="input-field" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required style={{ flex: 1 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-secondary" style={{ padding: '0 12px' }}>
                  {showPassword ? '🔒' : '👁️'}
                </button>
                <button type="button" onClick={generatePassword} className="btn-secondary" style={{ padding: '0 14px', fontSize: '0.8rem' }}>
                  Generate
                </button>
              </div>
              {password && <StrengthMeter password={password} />}
            </div>
            <div>
              <label className="label-text">Website URL</label>
              <input className="input-field" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://www.example.com" />
            </div>
            <div>
              <label className="label-text">Notes</label>
              <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Secure notes…" style={{ minHeight: '80px', resize: 'vertical' }} />
            </div>
          </>)}

          {/* Credit card fields */}
          {entryType === 'card' && (<>
            <div>
              <label className="label-text">Cardholder Name</label>
              <input className="input-field" value={cardHolder} onChange={e => setCardHolder(e.target.value)} required placeholder="JOHN DOE" />
            </div>
            <div>
              <label className="label-text">Card Number</label>
              <input className="input-field" value={cardNumber} required
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456" maxLength={19}
                style={{ letterSpacing: '2px', fontFamily: 'monospace', fontSize: '1.05rem' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="label-text">Expiry</label>
                <input className="input-field" value={expiry} required
                  onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} />
              </div>
              <div>
                <label className="label-text">CVV</label>
                <input className="input-field" value={cvv} required
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" type="password" />
              </div>
              <div>
                <label className="label-text">Card Type</label>
                <select className="input-field" value={cardType} onChange={e => setCardType(e.target.value)} style={{ appearance: 'none' }}>
                  {['Visa', 'Mastercard', 'Amex', 'Discover', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </>)}

          {/* Secure note fields */}
          {entryType === 'note' && (
            <div>
              <label className="label-text">Secure Note</label>
              <textarea className="input-field" value={noteContent} onChange={e => setNoteContent(e.target.value)}
                required placeholder="Write your secure note here…" style={{ minHeight: '180px', resize: 'vertical', lineHeight: '1.6' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '13px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, padding: '13px' }}>Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
