import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEntries, deleteEntry } from '../api/vault.api';
import { decryptData } from '../crypto/cryptoUtils';
import VaultEntry from '../components/VaultEntry';
import AddEntryModal from '../components/AddEntryModal';
import EditEntryModal from '../components/EditEntryModal';

const Dashboard = ({ filterFavorites = false }) => {
  const { masterKey, unlockVault, logout } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category') || 'All';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null); 
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);

  // Sync state if URL changes
  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const fetchAndDecryptEntries = async () => {
    if (!masterKey) return;
    try {
      setLoading(true);
      const encryptedEntries = await getEntries();
      const decrypted = encryptedEntries.map(entry => {
        const data = decryptData(entry.encryptedData, masterKey);
        return { ...entry, decryptedData: data };
      }).filter(entry => entry.decryptedData !== null);
      setEntries(decrypted);
    } catch (err) {
      console.error('Failed fetching entries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (masterKey) fetchAndDecryptEntries();
  }, [masterKey]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.decryptedData?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || entry.category === activeCategory;
      const matchesFavorite = !filterFavorites || entry.isFavorite;
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [entries, searchQuery, activeCategory, filterFavorites]);

  const categories = ['All', ...new Set(entries.map(e => e.category || 'General'))];

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteEntry(id);
      fetchAndDecryptEntries();
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  if (!masterKey) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-panel anim-scale-in" style={{ padding: '48px', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔐</div>
          <h2 style={{ marginBottom: '8px', fontSize: '1.5rem', fontWeight: '700' }}>Vault Locked</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>Enter your master password to decrypt your vault.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setUnlockError('');
            try { await unlockVault(unlockPassword); }
            catch { setUnlockError('Incorrect master password.'); }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="password" className="input-field" placeholder="Master password"
              value={unlockPassword} onChange={e => setUnlockPassword(e.target.value)} required />
            {unlockError && <div style={{ color: 'var(--error)' }}>{unlockError}</div>}
            <button type="submit" className="btn-primary">Unlock Vault</button>
            <button type="button" onClick={logout} className="btn-secondary">Log Out</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '40px' }}>
      <header className="anim-slide-down" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-1px' }}>
              {filterFavorites ? 'Favorites' : 'Records'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>{filteredEntries.length} records safely stored</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '12px 32px' }}>
            + Create New
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
            <input type="text" placeholder="Search vault..." className="input-field"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }} />
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '8px 16px', borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                color: activeCategory === cat ? '#000' : 'var(--text-muted)',
                fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease'
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ visibility: (showAddModal || !!editEntry) ? 'hidden' : 'visible' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p>Decrypting vault records...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '100px',
            background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
            border: '2px dashed var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>No records found</h3>
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid-vault">
            {filteredEntries.map((entry, i) => (
              <div key={entry._id || entry.id}
                className="anim-slide-up"
                style={{ animationDelay: `${i * 0.06}s` }}>
                <VaultEntry
                  label={entry.label}
                  category={entry.category}
                  isFavorite={entry.isFavorite}
                  decryptedData={entry.decryptedData}
                  onEdit={() => setEditEntry(entry)}
                  onDelete={() => handleDelete(entry._id || entry.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddEntryModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => { setShowAddModal(false); fetchAndDecryptEntries(); }}
          lockedType="password"
        />
      )}

      {editEntry && (
        <EditEntryModal
          entry={editEntry}
          onClose={() => setEditEntry(null)}
          onSaved={() => { setEditEntry(null); fetchAndDecryptEntries(); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
