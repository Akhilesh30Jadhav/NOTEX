import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '@/utils/api';

export default function VideoLectures() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ subject: '', department: '' });
  const [form, setForm] = useState({ title: '', subject: '', department: '', videoUrl: '', thumbnailUrl: '', duration: '' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.subject) params.subject = filter.subject;
      if (filter.department) params.department = filter.department;
      const res = await api.get('/videos', { params });
      setVideos(res.data || []);
    } catch { setVideos([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/videos', form);
      setShowForm(false);
      setForm({ title: '', subject: '', department: '', videoUrl: '', thumbnailUrl: '', duration: '' });
      fetchVideos();
    } catch (err) { alert(err.response?.data?.message || 'Failed to add video'); }
  };

  const isYT = (url) => url?.includes('youtube.com') || url?.includes('youtu.be');
  const getYTId = (url) => {
    const m = url?.match(/(?:youtu\.be\/|v=)([^&\s]+)/);
    return m?.[1] || '';
  };

  const inputStyle = { width: '100%', padding: '0.65rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Video Lectures</h1>
            <p style={{ color: '#a1a1aa' }}>Watch and share video lectures</p>
          </div>
          {user && <GradientButton onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Video'}</GradientButton>}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
              <input style={inputStyle} placeholder="Video Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input style={inputStyle} placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              <input style={inputStyle} placeholder="Department (e.g. CSE)" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
              <input style={inputStyle} placeholder="Duration (e.g. 45 min)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
              <input style={{ ...inputStyle, gridColumn: isMobile ? 'auto' : '1 / -1' }} placeholder="YouTube or video URL" value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} required />
              <input style={{ ...inputStyle, gridColumn: isMobile ? 'auto' : '1 / -1' }} placeholder="Thumbnail URL (optional)" value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} />
            </div>
            <GradientButton type="submit" className="mt-4">Upload Video</GradientButton>
          </form>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input style={{ ...inputStyle, width: '200px' }} placeholder="Filter by subject..." value={filter.subject} onChange={e => setFilter({ ...filter, subject: e.target.value })} />
          <input style={{ ...inputStyle, width: '200px' }} placeholder="Filter by department..." value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })} />
          <GradientButton variant="variant" onClick={fetchVideos}>Apply</GradientButton>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '4rem' }}>Loading...</div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '4rem' }}>No videos found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {videos.map(v => (
              <div key={v._id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                {/* Thumbnail / Embed */}
                <div style={{ aspectRatio: '16/9', background: '#0a0a0a', position: 'relative' }}>
                  {isYT(v.videoUrl) ? (
                    <iframe src={`https://www.youtube.com/embed/${getYTId(v.videoUrl)}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none' }} />
                  ) : v.thumbnailUrl ? (
                    <img src={v.thumbnailUrl} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#71717a', fontSize: '3rem' }}>▶</div>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{v.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(129,140,248,0.1)', borderRadius: '6px', fontSize: '0.7rem', color: '#818cf8' }}>{v.subject}</span>
                    <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', fontSize: '0.7rem', color: '#10b981' }}>{v.department}</span>
                    {v.duration && <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(251,191,36,0.1)', borderRadius: '6px', fontSize: '0.7rem', color: '#fbbf24' }}>{v.duration}</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.5rem' }}>{v.views || 0} views</div>
                  {!isYT(v.videoUrl) && v.videoUrl && (
                    <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', color: '#818cf8', fontSize: '0.8rem', textDecoration: 'underline' }}>Watch Video ↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
