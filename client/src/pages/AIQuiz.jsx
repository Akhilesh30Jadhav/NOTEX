import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '@/utils/api';

export default function AIQuiz() {
  const [text, setText] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateQuiz = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const res = await api.post('/ai/generate-quiz', { text, numQuestions });
      setQuiz(res.data.questions);
    } catch (err) {
      setQuiz([{
        question: 'AI Quiz Generation requires an API key configured on the server.',
        options: ['Contact admin to set up the AI API key', 'Option B', 'Option C', 'Option D'],
        correct: 0
      }]);
    } finally { setLoading(false); }
  };

  const selectAnswer = (qIdx, oIdx) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIdx]: oIdx });
  };

  const handleSubmit = () => setSubmitted(true);

  const getScore = () => {
    if (!quiz) return 0;
    return quiz.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>AI Quiz Generator</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Paste your notes to generate MCQs and test yourself</p>

        {!quiz ? (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem'
          }}>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Paste your study notes, lecture content, or textbook excerpts here..."
              style={{
                width: '100%', minHeight: '180px', padding: '1rem', background: '#0a0a0a', border: '1px solid #18181b',
                borderRadius: '10px', color: '#e4e4e7', fontSize: '0.9rem', lineHeight: '1.7', outline: 'none', resize: 'vertical',
                fontFamily: 'inherit'
              }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <label style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Number of questions:</label>
              <select value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}
                style={{ padding: '0.5rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', outline: 'none' }}>
                {[3, 5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <GradientButton onClick={generateQuiz} disabled={loading} className="mt-4 w-full">
              {loading ? 'Generating...' : '🧠 Generate Quiz'}
            </GradientButton>
          </div>
        ) : (
          <>
            {/* Score */}
            {submitted && (
              <div style={{
                background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)',
                borderRadius: '16px', padding: '1.5rem', textAlign: 'center', marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#818cf8' }}>{getScore()}/{quiz.length}</div>
                <div style={{ color: '#a1a1aa', fontWeight: 600 }}>
                  {getScore() === quiz.length ? '🎉 Perfect!' : getScore() >= quiz.length * 0.7 ? '👏 Great job!' : '📚 Keep studying!'}
                </div>
              </div>
            )}

            {/* Questions */}
            {quiz.map((q, qIdx) => (
              <div key={qIdx} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#818cf8', marginRight: '0.5rem' }}>Q{qIdx + 1}.</span>
                  {q.question}
                </div>
                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  {q.options.map((opt, oIdx) => {
                    const selected = answers[qIdx] === oIdx;
                    const isCorrect = q.correct === oIdx;
                    let bg = 'rgba(255,255,255,0.03)';
                    let border = 'rgba(255,255,255,0.08)';
                    if (submitted && isCorrect) { bg = 'rgba(16,185,129,0.1)'; border = 'rgba(16,185,129,0.4)'; }
                    else if (submitted && selected && !isCorrect) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.4)'; }
                    else if (selected) { bg = 'rgba(129,140,248,0.1)'; border = 'rgba(129,140,248,0.3)'; }
                    return (
                      <div key={oIdx} onClick={() => selectAnswer(qIdx, oIdx)}
                        style={{
                          padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: submitted ? 'default' : 'pointer',
                          background: bg, border: `1px solid ${border}`, transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                          border: selected ? `2px solid ${submitted ? (isCorrect ? '#10b981' : '#ef4444') : '#818cf8'}` : '2px solid #3f3f46',
                          background: selected ? (submitted ? (isCorrect ? '#10b981' : '#ef4444') : '#818cf8') : 'transparent',
                          display: 'inline-block' }} />
                        <span style={{ fontSize: '0.85rem', color: '#e4e4e7' }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {!submitted && <GradientButton onClick={handleSubmit} className="flex-1">Submit Quiz</GradientButton>}
              <GradientButton variant="variant" onClick={() => { setQuiz(null); setAnswers({}); setSubmitted(false); }} className="flex-1">
                {submitted ? 'Try Again' : 'New Quiz'}
              </GradientButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
