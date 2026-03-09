import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '@/utils/api';

export default function CollaborativeNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ title: '', subject: '', isPublic: false });
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const editorRef = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data || []);
    } catch { setNotes([]); }
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notes', form);
      setNotes([res.data, ...notes]);
      setActive(res.data);
      setShowNew(false);
      setForm({ title: '', subject: '', isPublic: false });
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const loadNote = async (id) => {
    try {
      const res = await api.get(`/notes/${id}`);
      setActive(res.data);
    } catch { /* ignore */ }
  };

  const handleContentChange = (content) => {
    setActive(prev => ({ ...prev, content }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => autoSave(content), 1500);
  };

  const autoSave = async (content) => {
    if (!active) return;
    setSaving(true);
    try {
      await api.put(`/notes/${active._id}`, { content });
    } catch { /* ignore */ }
    setSaving(false);
  };

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      if (active?._id === id) setActive(null);
    } catch { /* ignore */ }
  };

  const addCollaborator = async () => {
    const email = prompt('Enter collaborator email:');
    if (!email) return;
    try {
      const res = await api.post(`/notes/${active._id}/collaborators`, { email });
      setActive(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const inputStyle = { width: '100%', padding: '0.65rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Collaborative Notes</h1>
            <p style={{ color: '#a1a1aa' }}>Create and edit notes together</p>
          </div>
          <GradientButton onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : '+ New Note'}</GradientButton>
        </div>

        {showNew && (
          <form onSubmit={createNote} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
              <input style={inputStyle} placeholder="Note title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input style={inputStyle} placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} /> Public note
              </label>
            </div>
            <GradientButton type="submit" className="mt-4">Create</GradientButton>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: '1.5rem' }}>
          {/* Sidebar */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1rem', maxHeight: '70vh', overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Your Notes</h3>
            {notes.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '0.8rem' }}>No notes yet</p>
            ) : notes.map(n => (
              <div key={n._id} onClick={() => loadNote(n._id)}
                style={{
                  padding: '0.65rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.35rem',
                  background: active?._id === n._id ? 'rgba(129,140,248,0.12)' : 'transparent',
                  border: active?._id === n._id ? '1px solid rgba(129,140,248,0.3)' : '1px solid transparent',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => { if (active?._id !== n._id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (active?._id !== n._id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{n.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#71717a', display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  {n.subject && <span>{n.subject}</span>}
                  {n.isPublic && <span style={{ color: '#10b981' }}>Public</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', minHeight: '50vh'
          }}>
            {active ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{active.title}</h2>
                    <span style={{ fontSize: '0.75rem', color: saving ? '#fbbf24' : '#10b981' }}>
                      {saving ? 'Saving...' : 'Saved'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={addCollaborator} style={{ padding: '0.35rem 0.75rem', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '6px', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem' }}>+ Collaborator</button>
                    <button onClick={() => deleteNote(active._id)} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                </div>
                {active.collaborators?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {active.collaborators.map((c, i) => (
                      <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', fontSize: '0.7rem', color: '#10b981' }}>{c.name || c.email || 'User'}</span>
                    ))}
                  </div>
                )}
                <textarea ref={editorRef} value={active.content || ''} onChange={e => handleContentChange(e.target.value)}
                  placeholder="Start typing your notes here..."
                  style={{
                    width: '100%', minHeight: '40vh', padding: '1rem', background: '#0a0a0a', border: '1px solid #18181b',
                    borderRadius: '10px', color: '#e4e4e7', fontSize: '0.9rem', lineHeight: '1.7', outline: 'none', resize: 'vertical',
                    fontFamily: 'inherit'
                  }} />
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', color: '#71717a' }}>
                Select or create a note to start editing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
