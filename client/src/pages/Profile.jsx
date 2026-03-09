import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '../api/axios.js';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0, reviews: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', department: '', year: '' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get('/profile/me').then(res => {
      setProfile(res.data.user);
      setStats(res.data.stats);
      setForm({ name: res.data.user.name, bio: res.data.user.bio || '', department: res.data.user.department || '', year: res.data.user.year || '' });
    }).catch(() => {
      if (user) {
        setProfile(user);
        setForm({ name: user.name, bio: '', department: user.department || '', year: user.year || '' });
      }
    });
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await api.put('/profile/me', form);
      setProfile(res.data);
      setEditing(false);
    } catch {}
  };

  const p = profile || user;
  if (!p) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{
          position: 'relative', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
          borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '3rem', border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '2rem', animation: 'fadeInUp 0.8s ease-out'
        }}>
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div style={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', gap: '2rem', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #f9a8d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#fff', flexShrink: 0
            }}>
              {p.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name"
                    style={{ padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '1rem' }} />
                  <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Bio (max 300 chars)" maxLength={300}
                    style={{ padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', resize: 'vertical', minHeight: '80px' }} />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Department"
                      style={{ flex: 1, padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }} />
                    <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="Year" min={1} max={4}
                      style={{ width: '80px', padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <GradientButton onClick={handleSave}>Save</GradientButton>
                    <GradientButton variant="variant" onClick={() => setEditing(false)}>Cancel</GradientButton>
                  </div>
                </div>
              ) : (
                <>
                  <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>{p.name}</h1>
                  <p style={{ color: '#a1a1aa', fontSize: '1rem', marginBottom: '0.5rem' }}>{p.email}</p>
                  {p.bio && <p style={{ color: '#d4d4d8', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.6 }}>{p.bio}</p>}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: '1rem' }}>
                    {p.department && <span style={{ padding: '0.35rem 0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '20px', color: '#a1a1aa', fontSize: '13px' }}>🎓 {p.department}</span>}
                    {p.year && <span style={{ padding: '0.35rem 0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '20px', color: '#a1a1aa', fontSize: '13px' }}>📅 Year {p.year}</span>}
                    <span style={{ padding: '0.35rem 0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '20px', color: '#818cf8', fontSize: '13px', fontWeight: 600 }}>🏷️ {p.role || 'Student'}</span>
                  </div>
                  {/* Badges */}
                  {p.badges?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {p.badges.map((b, i) => (
                        <span key={i} style={{ padding: '0.35rem 0.75rem', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '20px', color: '#c4b5fd', fontSize: '13px' }}>
                          {b.icon} {b.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <GradientButton variant="variant" onClick={() => setEditing(true)} className="min-w-0 px-4 py-2 text-sm">Edit Profile</GradientButton>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem', animation: 'fadeInUp 1s ease-out' }}>
          <ProfileStatCard icon="⬆️" label="Uploads" value={stats.uploads} color="linear-gradient(135deg, #818cf8, #6366f1)" />
          <ProfileStatCard icon="⬇️" label="Downloads" value={stats.downloads} color="linear-gradient(135deg, #f9a8d4, #ec4899)" />
          <ProfileStatCard icon="⭐" label="Reviews" value={stats.reviews} color="linear-gradient(135deg, #fbbf24, #f59e0b)" />
        </div>

        {/* Points */}
        <div style={{
          position: 'relative', background: 'rgba(129,140,248,0.08)', borderRadius: '20px', padding: '2rem',
          border: '1px solid rgba(129,140,248,0.2)', textAlign: 'center', animation: 'fadeInUp 1.2s ease-out'
        }}>
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#818cf8' }}>{p.points || 0}</div>
          <div style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 600 }}>Total Points</div>
        </div>
      </div>
    </div>
  );
}

function ProfileStatCard({ icon, label, value, color }) {
  return (
    <div style={{
      position: 'relative', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1.75rem',
      border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center'
    }}>
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div style={{ width: '50px', height: '50px', background: color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{value}</div>
      <div style={{ color: '#a1a1aa', fontSize: '0.875rem', fontWeight: 600 }}>{label}</div>
    </div>
  );
}
