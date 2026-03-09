import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '../api/axios.js';

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', subject: '', tags: '' });
  const [answerForms, setAnswerForms] = useState({});
  const [filter, setFilter] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = () => {
    const params = filter ? `?subject=${encodeURIComponent(filter)}` : '';
    api.get(`/forum${params}`).then(r => setPosts(r.data)).catch(() => {});
  };

  useEffect(() => { fetchPosts(); }, [filter]);

  const createPost = async () => {
    if (!form.title || !form.body || !form.subject) return;
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      await api.post('/forum', payload);
      setShowForm(false);
      setForm({ title: '', body: '', subject: '', tags: '' });
      fetchPosts();
    } catch {}
  };

  const submitAnswer = async (postId) => {
    const body = answerForms[postId];
    if (!body) return;
    try {
      await api.post(`/forum/${postId}/answer`, { body });
      setAnswerForms({ ...answerForms, [postId]: '' });
      fetchPosts();
    } catch {}
  };

  const toggleUpvote = async (postId) => {
    try {
      await api.post(`/forum/${postId}/upvote`);
      fetchPosts();
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Discussion Forum</h1>
            <p style={{ color: '#a1a1aa' }}>Ask questions, share knowledge</p>
          </div>
          {user && <GradientButton onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New Question'}</GradientButton>}
        </div>

        {/* Filter */}
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by subject..."
          style={{ width: '100%', padding: '0.75rem 1rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', marginBottom: '1.5rem', outline: 'none' }} />

        {/* New post form */}
        {showForm && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Question title *" style={inputStyle} />
              <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Subject *" style={inputStyle} />
              <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} placeholder="Describe your question in detail... *" style={{...inputStyle, minHeight: '120px', resize: 'vertical'}} />
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags (comma separated)" style={inputStyle} />
              <GradientButton onClick={createPost}>Post Question</GradientButton>
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}><div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div><p>No discussions yet. Be the first to ask!</p></div>}
        {posts.map(post => (
          <div key={post._id} style={{
            position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem'
          }}>
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{post.title}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.813rem', color: '#a1a1aa' }}>
                  <span>📚 {post.subject}</span>
                  <span>👤 {post.author?.name || 'Anonymous'}</span>
                  <span>🕐 {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={() => toggleUpvote(post._id)} style={{
                background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '8px',
                padding: '0.5rem 0.75rem', color: '#818cf8', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600
              }}>
                ▲ {post.upvotes?.length || 0}
              </button>
            </div>

            <p style={{ color: '#d4d4d8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>{post.body}</p>

            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {post.tags.map((t, i) => <span key={i} style={{ padding: '0.2rem 0.6rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#71717a', fontSize: '0.75rem' }}>{t}</span>)}
              </div>
            )}

            {/* Answers */}
            {post.answers?.length > 0 && (
              <div style={{ borderTop: '1px solid #27272a', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.813rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.75rem' }}>{post.answers.length} Answer{post.answers.length > 1 ? 's' : ''}</div>
                {post.answers.map((a, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '0.25rem' }}>👤 {a.author?.name || 'Anonymous'} · {new Date(a.createdAt).toLocaleDateString()}</div>
                    <p style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: 1.6 }}>{a.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Answer form */}
            {user && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input value={answerForms[post._id] || ''} onChange={e => setAnswerForms({...answerForms, [post._id]: e.target.value})}
                  placeholder="Write an answer..." style={{...inputStyle, flex: 1}} onKeyDown={e => e.key === 'Enter' && submitAnswer(post._id)} />
                <GradientButton onClick={() => submitAnswer(post._id)} className="min-w-0 px-4 py-2 text-sm">Reply</GradientButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' };
