import { useState, useEffect } from 'react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import api from '@/utils/api';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaderboard');
      setLeaders(res.data || []);
    } catch { setLeaders([]); } finally { setLoading(false); }
  };

  const getBadgeColor = (badge) => {
    const colors = { uploader: '#818cf8', reviewer: '#f472b6', helper: '#10b981', scholar: '#fbbf24', veteran: '#f97316' };
    return colors[badge] || '#71717a';
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Leaderboard</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Top contributors in the community</p>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: isMobile ? '0.5rem' : '1rem', marginBottom: '3rem' }}>
            {[1, 0, 2].map((rank, i) => {
              const l = leaders[rank];
              if (!l) return null;
              const heights = ['200px', '160px', '130px'];
              const cardHeights = [heights[0], heights[1], heights[2]];
              const actualHeight = rank === 0 ? cardHeights[0] : rank === 1 ? cardHeights[1] : cardHeights[2];
              return (
                <div key={rank} style={{
                  position: 'relative', background: rank === 0 ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${rank === 0 ? 'rgba(129,140,248,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px', padding: '1.5rem 1rem', textAlign: 'center', width: isMobile ? '100px' : '160px',
                  minHeight: actualHeight, display: 'flex', flexDirection: 'column', justifyContent: 'center'
                }}>
                  {rank === 0 && <GlowingEffect spread={30} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />}
                  <div style={{ fontSize: isMobile ? '2rem' : '2.5rem' }}>{MEDALS[rank]}</div>
                  <div style={{
                    width: isMobile ? '40px' : '56px', height: isMobile ? '40px' : '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #818cf8, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: isMobile ? '1rem' : '1.25rem', margin: '0.5rem auto'
                  }}>{l.name?.charAt(0)?.toUpperCase() || '?'}</div>
                  <div style={{ fontSize: isMobile ? '0.75rem' : '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem' }}>{l.name}</div>
                  <div style={{ fontSize: isMobile ? '1rem' : '1.5rem', fontWeight: 900, color: '#818cf8', marginTop: '0.25rem' }}>{l.points || 0}</div>
                  <div style={{ fontSize: '0.65rem', color: '#71717a' }}>points</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '4rem' }}>Loading...</div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '4rem' }}>No data yet. Start contributing!</div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
            {leaders.map((l, i) => (
              <div key={l._id || i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem',
                borderBottom: i < leaders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: i < 3 ? 'rgba(129,140,248,0.04)' : 'transparent'
              }}>
                <div style={{ width: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: i < 3 ? '#818cf8' : '#71717a' }}>
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '0.85rem'
                }}>{l.name?.charAt(0)?.toUpperCase() || '?'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{l.name}</div>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    {(l.badges || []).map((b, j) => (
                      <span key={j} style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, background: `${getBadgeColor(b)}22`, color: getBadgeColor(b) }}>{b}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#818cf8' }}>{l.points || 0}</div>
                  <div style={{ fontSize: '0.65rem', color: '#71717a' }}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
