import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEntries, deleteEntry } from '../api/vault.api';
import { decryptData } from '../crypto/cryptoUtils';
import VaultEntry from '../components/VaultEntry';
import AddEntryModal from '../components/AddEntryModal';
import EditEntryModal from '../components/EditEntryModal';

const CreditCards = () => {
  const { masterKey } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAndDecryptCards = async () => {
    if (!masterKey) return;
    try {
      setLoading(true);
      const encryptedEntries = await getEntries();
      const decrypted = encryptedEntries.map(entry => {
        try {
          const data = decryptData(entry.encryptedData, masterKey);
          return { ...entry, decryptedData: data };
        } catch (e) { return null; }
      }).filter(entry => entry && entry.decryptedData?.type === 'card');
      setEntries(decrypted);
    } catch (err) {
      console.error('Failed fetching cards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (masterKey) fetchAndDecryptCards();
  }, [masterKey]);

  const filteredCards = useMemo(() => {
    return entries.filter(entry => 
      entry.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.decryptedData?.cardNumber?.includes(searchQuery)
    );
  }, [entries, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteEntry(id);
      fetchAndDecryptCards();
    } catch (err) {
      alert('Failed to delete card');
    }
  };

  return (
    <div className="app-container" style={{ padding: '40px' }}>
      <header className="anim-slide-down" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-1px' }}>💳 Credit Cards</h1>
            <p style={{ color: 'var(--text-muted)' }}>{filteredCards.length} cards securely stored</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '12px 32px' }}>
            + Add Card
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="Search cards..." className="input-field" 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }} />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
        </div>
      </header>

      <div style={{ visibility: (showAddModal || !!editEntry) ? 'hidden' : 'visible' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Decrypting cards...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '100px',
            background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
            border: '2px dashed var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>No cards found</h3>
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Click "Add Card" to store your first card securelly.</p>
          </div>
        ) : (
          <div className="grid-vault">
            {filteredCards.map((entry, i) => (
              <div key={entry._id || entry.id} className="anim-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
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
          onAdded={() => { setShowAddModal(false); fetchAndDecryptCards(); }}
          initialType="card"
          lockedType="card"
        />
      )}

      {editEntry && (
        <EditEntryModal 
          entry={editEntry} 
          onClose={() => setEditEntry(null)}
          onSaved={() => { setEditEntry(null); fetchAndDecryptCards(); }}
        />
      )}
    </div>
  );
};

export default CreditCards;
