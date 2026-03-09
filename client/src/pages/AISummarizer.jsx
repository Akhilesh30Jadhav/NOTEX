import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '@/utils/api';

export default function AISummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSummarize = async () => {
    if (!text.trim() && !file) return;
    setLoading(true);
    setSummary('');
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/ai/summarize-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSummary(res.data.summary);
      } else {
        const res = await api.post('/ai/summarize', { text });
        setSummary(res.data.summary);
      }
    } catch (err) {
      setSummary('⚠️ AI summarization requires an API key configured on the server. Please contact admin.\n\nError: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>AI Notes Summarizer</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Paste your notes or upload a file to get an AI-generated summary</p>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
        }}>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your notes, lecture content, or any text here..."
            style={{
              width: '100%', minHeight: '200px', padding: '1rem', background: '#0a0a0a', border: '1px solid #18181b',
              borderRadius: '10px', color: '#e4e4e7', fontSize: '0.9rem', lineHeight: '1.7', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit'
            }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <label style={{
              padding: '0.5rem 1rem', background: 'rgba(129,140,248,0.05)', border: '1px dashed rgba(129,140,248,0.3)',
              borderRadius: '8px', cursor: 'pointer', color: '#818cf8', fontSize: '0.85rem'
            }}>
              📎 {file ? file.name : 'Upload PDF/TXT'}
              <input type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
            </label>
            {file && <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '0.85rem' }}>✕ Clear file</button>}
          </div>

          <GradientButton onClick={handleSummarize} disabled={loading} className="mt-4 w-full">
            {loading ? 'Summarizing...' : '✨ Summarize'}
          </GradientButton>
        </div>

        {summary && (
          <div style={{
            background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.2)',
            borderRadius: '16px', padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.75rem' }}>📝 Summary</h3>
            <div style={{ color: '#e4e4e7', fontSize: '0.9rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{summary}</div>
            <button onClick={() => navigator.clipboard.writeText(summary)}
              style={{ marginTop: '1rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.8rem' }}>
              📋 Copy Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
