import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '../api/axios.js';

export default function AttendanceTracker() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({ subject: '', date: new Date().toISOString().split('T')[0], status: 'present' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = () => {
    api.get('/attendance').then(r => {
      setRecords(r.data.records);
      setSummary(r.data.summary);
    }).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const markAttendance = async () => {
    if (!form.subject || !form.date) return;
    try {
      await api.post('/attendance', form);
      fetchData();
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Attendance Tracker</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Track your attendance and stay above 75%</p>

        {/* Mark attendance */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Subject</label>
              <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="e.g. Mathematics"
                style={{ width: '100%', padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                style={{ padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <GradientButton onClick={() => { setForm({...form, status: 'present'}); markAttendance(); }} className="min-w-0 px-4 py-2 text-sm">
                ✓ Present
              </GradientButton>
              <GradientButton variant="variant" onClick={() => { setForm({...form, status: 'absent'}); markAttendance(); }} className="min-w-0 px-4 py-2 text-sm">
                ✗ Absent
              </GradientButton>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {summary.map(s => {
              const pct = parseFloat(s.percentage);
              const isLow = pct < 75;
              return (
                <div key={s.subject} style={{
                  position: 'relative', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem',
                  border: `1px solid ${isLow ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`
                }}>
                  <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>{s.subject}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isLow ? '#ef4444' : '#10b981', marginBottom: '0.5rem' }}>{s.percentage}%</div>
                  <div style={{ fontSize: '0.813rem', color: '#a1a1aa' }}>{s.present} / {s.total} classes</div>
                  {/* Progress bar */}
                  <div style={{ marginTop: '0.75rem', height: '6px', background: '#27272a', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: isLow ? '#ef4444' : '#10b981', borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                  {isLow && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>⚠️ Below 75% threshold</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Records */}
        {records.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, color: '#fff' }}>Recent Records</div>
            {records.slice(0, 20).map((r, i) => (
              <div key={r._id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.875rem'
              }}>
                <span style={{ color: '#d4d4d8', fontWeight: 600 }}>{r.subject}</span>
                <span style={{ color: '#71717a' }}>{new Date(r.date).toLocaleDateString()}</span>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                  background: r.status === 'present' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: r.status === 'present' ? '#10b981' : '#ef4444'
                }}>{r.status}</span>
              </div>
            ))}
          </div>
        )}

        {summary.length === 0 && records.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
            <p>No attendance records yet. Start tracking above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
