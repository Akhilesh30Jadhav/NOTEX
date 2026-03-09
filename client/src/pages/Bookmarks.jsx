import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '@/utils/api';

export default function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchBookmarks(); }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookmarks');
      setBookmarks(res.data || []);
    } catch { setBookmarks([]); } finally { setLoading(false); }
  };

  const removeBookmark = async (materialId) => {
    try {
      await api.delete(`/bookmarks/${materialId}`);
      setBookmarks(bookmarks.filter(b => (b.material?._id || b.material) !== materialId));
    } catch { /* ignore */ }
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Bookmarks</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Your saved study materials</p>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '4rem' }}>Loading...</div>
        ) : bookmarks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📌</div>
            <div style={{ color: '#71717a' }}>No bookmarks yet. Save materials to find them quickly!</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {bookmarks.map(b => {
              const mat = b.material || {};
              return (
                <div key={b._id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', transition: 'border-color 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem'
                  }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mat.title || 'Untitled'}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                      {mat.subject && <span style={{ fontSize: '0.7rem', color: '#818cf8' }}>{mat.subject}</span>}
                      {mat.department && <span style={{ fontSize: '0.7rem', color: '#71717a' }}>{mat.department}</span>}
                    </div>
                  </div>
                  <button onClick={() => removeBookmark(mat._id || b.material)} style={{
                    padding: '0.35rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0
                  }}>Remove</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
