import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '@/utils/api';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch { setNotifications([]); } finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch { /* ignore */ }
  };

  const getIcon = (type) => {
    const icons = { new_material: '📚', review: '⭐', badge: '🏅', system: '🔔' };
    return icons[type] || '🔔';
  };

  const getTimeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'Just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Notifications</h1>
            <p style={{ color: '#a1a1aa' }}>{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && <GradientButton variant="variant" onClick={markAllRead}>Mark all read</GradientButton>}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '4rem' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔔</div>
            <div style={{ color: '#71717a' }}>No notifications</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {notifications.map(n => (
              <div key={n._id} onClick={() => !n.read && markRead(n._id)}
                style={{
                  display: 'flex', gap: '0.75rem', padding: '1rem', cursor: n.read ? 'default' : 'pointer',
                  background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(129,140,248,0.05)',
                  border: `1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(129,140,248,0.15)'}`,
                  borderRadius: '12px', transition: 'all 0.2s'
                }}>
                <div style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: '0.1rem' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: n.read ? 500 : 600, color: n.read ? '#a1a1aa' : '#fff' }}>{n.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.15rem' }}>{n.message}</div>
                  <div style={{ fontSize: '0.7rem', color: '#52525b', marginTop: '0.25rem' }}>{getTimeAgo(n.createdAt)}</div>
                </div>
                {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', flexShrink: 0, marginTop: '0.4rem' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
