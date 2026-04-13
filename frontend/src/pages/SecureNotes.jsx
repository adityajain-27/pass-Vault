import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEntries, deleteEntry, updateEntry, createEntry } from '../api/vault.api';
import { decryptData, encryptData } from '../crypto/cryptoUtils';

const SecureNotes = () => {
  const { masterKey } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const load = async () => {
    if (!masterKey) return;
    try {
      setLoading(true);
      const all = await getEntries();
      const noteEntries = all
        .map(e => {
          try {
            const data = decryptData(e.encryptedData, masterKey);
            return { ...e, decryptedData: data };
          } catch { return null; }
        })
        .filter(e => e && e.decryptedData?.type === 'note');
      setNotes(noteEntries);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [masterKey]);

  useEffect(() => {
    if (activeNote) {
      setEditContent(activeNote.decryptedData?.noteContent || '');
      setEditLabel(activeNote.label || '');
    }
  }, [activeNote?._id]);

  const saveNote = async () => {
    if (!activeNote) return;
    setSaving(true);
    try {
      const plaintext = { ...activeNote.decryptedData, noteContent: editContent };
      const ciphertext = encryptData(plaintext, masterKey);
      await updateEntry(activeNote._id, { label: editLabel, encryptedData: ciphertext });
      await load();
      setActiveNote(prev => ({ ...prev, label: editLabel, decryptedData: { ...prev.decryptedData, noteContent: editContent } }));
    } catch (err) {
      console.error('Failed to save note', err);
    } finally {
      setSaving(false);
    }
  };

  const createNewNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const plaintext = { type: 'note', noteContent: '' };
      const ciphertext = encryptData(plaintext, masterKey);
      await createEntry({ label: newTitle.trim(), encryptedData: ciphertext, category: 'Personal', isFavorite: false });
      setNewTitle('');
      setShowNewForm(false);
      await load();
    } catch (err) {
      console.error('Failed to create note', err);
    } finally {
      setCreating(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note permanently?')) return;
    await deleteEntry(id);
    setActiveNote(null);
    await load();
  };

  const filtered = notes.filter(n =>
    n.label?.toLowerCase().includes(search.toLowerCase()) ||
    n.decryptedData?.noteContent?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Notes list sidebar ── */}
      <div style={{
        width: '320px',
        flexShrink: 0,
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(7,9,15,0.6)',
      }}>
        {/* Sidebar header */}
        <div style={{ padding: '28px 20px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>📋 Secure Notes</h2>
            <button onClick={() => setShowNewForm(!showNewForm)} className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
              + New
            </button>
          </div>

          {/* New Note Form */}
          {showNewForm && (
            <form onSubmit={createNewNote} style={{ marginBottom: '12px' }}>
              <input
                className="input-field"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Note title…"
                autoFocus
                style={{ marginBottom: '8px', fontSize: '0.9rem' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }} disabled={creating || !newTitle.trim()}>
                  {creating ? 'Creating…' : 'Create Note'}
                </button>
                <button type="button" onClick={() => { setShowNewForm(false); setNewTitle(''); }}
                  className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  ✕
                </button>
              </div>
            </form>
          )}

          <input className="input-field" placeholder="Search notes…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.875rem' }} />
        </div>

        {/* Note list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 20px', scrollbarWidth: 'thin' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 12px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
              {notes.length === 0 ? (
                <>No notes yet.<br />Click <strong style={{ color: '#4a9eff' }}>+ New</strong> to create one.</>
              ) : (
                'No matching notes found.'
              )}
            </div>
          ) : (
            filtered.map(note => (
              <div key={note._id} onClick={() => setActiveNote(note)} style={{
                padding: '13px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                background: activeNote?._id === note._id ? 'rgba(26,110,245,0.12)' : 'transparent',
                borderLeft: `3px solid ${activeNote?._id === note._id ? '#1a6ef5' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => { if (activeNote?._id !== note._id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (activeNote?._id !== note._id) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {note.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
                  {note.decryptedData?.noteContent?.slice(0, 100) || <em>Empty note — click to edit</em>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Note editor ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeNote ? (
          <>
            {/* Editor toolbar */}
            <div style={{
              padding: '18px 36px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(0,0,0,0.1)',
            }}>
              <div style={{ flex: 1 }}>
                <input
                  className="input-field"
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    borderRadius: 0,
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    padding: '4px 0',
                    boxShadow: 'none',
                    width: '100%',
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {activeNote.category} · AES-256 encrypted
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <button onClick={saveNote} className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.875rem' }} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save'}
                </button>
                <button onClick={() => deleteNote(activeNote._id)} className="btn-secondary"
                  style={{ padding: '9px 16px', fontSize: '0.875rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.25)' }}>
                  🗑 Delete
                </button>
              </div>
            </div>

            {/* Textarea editor */}
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder="Start writing your secure note… (Auto-saved when you click Save)"
              style={{
                flex: 1,
                resize: 'none',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-main)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                lineHeight: '1.8',
                padding: '32px 40px',
              }}
            />
          </>
        ) : (
          /* Empty state */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📋</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>No note selected</h3>
            <p style={{ fontSize: '0.9rem', textAlign: 'center', maxWidth: '320px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              Select a note from the sidebar, or click <strong style={{ color: '#4a9eff' }}>+ New</strong> in the top-left to create your first encrypted note.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureNotes;
