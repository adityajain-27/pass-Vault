import React, { useState, useContext } from 'react';
import { encryptData, decryptData } from '../crypto/cryptoUtils';
import { updateEntry } from '../api/vault.api';
import { AuthContext } from '../context/AuthContext';
import StrengthMeter from './StrengthMeter';

const CATEGORIES = ['Personal', 'Work', 'Finance', 'Social', 'Shopping', 'Other'];

const EditEntryModal = ({ entry, onClose, onSaved }) => {
  const { masterKey } = useContext(AuthContext);

  // Pre-fill from decrypted data
  const [label, setLabel] = useState(entry.label || '');
  const [category, setCategory] = useState(entry.category || 'Personal');
  const [isFavorite, setIsFavorite] = useState(entry.isFavorite || false);
  const [username, setUsername] = useState(entry.decryptedData?.username || '');
  const [password, setPassword] = useState(entry.decryptedData?.password || '');
  const [websiteUrl, setWebsiteUrl] = useState(entry.decryptedData?.websiteUrl || '');
  const [notes, setNotes] = useState(entry.decryptedData?.notes || '');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let p = '';
    for (let i = 0; i < 20; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const plaintext = { username, password, websiteUrl, notes };
      const ciphertext = encryptData(plaintext, masterKey);
      await updateEntry(entry._id, {
        label,
        encryptedData: ciphertext,
        category,
        isFavorite,
      });
      onSaved();
    } catch (err) {
      console.error('Failed to update entry', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
      <div className="glass-panel modal-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Edit Record</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Changes are encrypted before saving</p>
          </div>
          <button type="button" onClick={() => setIsFavorite(!isFavorite)} style={{
            background: 'transparent', fontSize: '1.5rem', cursor: 'pointer',
            opacity: isFavorite ? 1 : 0.25, transition: 'opacity 0.2s ease', border: 'none'
          }} title="Toggle favourite">⭐</button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="label-text">Title</label>
              <input className="input-field" value={label} onChange={e => setLabel(e.target.value)} required placeholder="e.g. Amazon" />
            </div>
            <div>
              <label className="label-text">Folder / Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ appearance: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">Username / Email</label>
            <input className="input-field" value={username} onChange={e => setUsername(e.target.value)} required placeholder="your@email.com" />
          </div>

          <div>
            <label className="label-text">Password</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input className="input-field" type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)} required style={{ flex: 1 }} />
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
            <input className="input-field" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://example.com" />
          </div>

          <div>
            <label className="label-text">Notes</label>
            <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Secure notes..." style={{ minHeight: '90px', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '13px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, padding: '13px' }} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntryModal;
