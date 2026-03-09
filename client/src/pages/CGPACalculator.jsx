import { useState, useEffect } from 'react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';

const DYP_GRADES = [
  { grade: 'O', points: 10, range: '90-100' },
  { grade: 'A+', points: 9, range: '80-89' },
  { grade: 'A', points: 8, range: '70-79' },
  { grade: 'B+', points: 7, range: '60-69' },
  { grade: 'B', points: 6, range: '55-59' },
  { grade: 'C', points: 5, range: '50-54' },
  { grade: 'P', points: 4, range: '45-49' },
  { grade: 'F', points: 0, range: 'Below 45' },
];

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState(() => {
    const saved = localStorage.getItem('notex_cgpa_data');
    return saved ? JSON.parse(saved) : [{ name: 'Semester 1', subjects: [{ name: '', credits: 3, grade: 'O' }] }];
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('notex_cgpa_data', JSON.stringify(semesters));
  }, [semesters]);

  const getGradePoints = (grade) => DYP_GRADES.find(g => g.grade === grade)?.points || 0;

  const calcSGPA = (subjects) => {
    const totalCredits = subjects.reduce((s, sub) => s + Number(sub.credits), 0);
    if (!totalCredits) return 0;
    const weighted = subjects.reduce((s, sub) => s + getGradePoints(sub.grade) * Number(sub.credits), 0);
    return (weighted / totalCredits).toFixed(2);
  };

  const calcCGPA = () => {
    let totalCredits = 0, totalWeighted = 0;
    semesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        const c = Number(sub.credits);
        totalCredits += c;
        totalWeighted += getGradePoints(sub.grade) * c;
      });
    });
    return totalCredits ? (totalWeighted / totalCredits).toFixed(2) : '0.00';
  };

  const addSemester = () => setSemesters([...semesters, { name: `Semester ${semesters.length + 1}`, subjects: [{ name: '', credits: 3, grade: 'O' }] }]);

  const removeSemester = (i) => setSemesters(semesters.filter((_, idx) => idx !== i));

  const addSubject = (semIdx) => {
    const updated = [...semesters];
    updated[semIdx].subjects.push({ name: '', credits: 3, grade: 'O' });
    setSemesters(updated);
  };

  const removeSubject = (semIdx, subIdx) => {
    const updated = [...semesters];
    updated[semIdx].subjects = updated[semIdx].subjects.filter((_, i) => i !== subIdx);
    setSemesters(updated);
  };

  const updateSubject = (semIdx, subIdx, field, value) => {
    const updated = [...semesters];
    updated[semIdx].subjects[subIdx][field] = value;
    setSemesters(updated);
  };

  const cgpa = calcCGPA();

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>CGPA Calculator</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>D.Y. Patil University grading system</p>

        {/* CGPA Overview */}
        <div style={{
          position: 'relative', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)',
          borderRadius: '20px', padding: '2rem', textAlign: 'center', marginBottom: '2rem'
        }}>
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div style={{ fontSize: '4rem', fontWeight: 900, color: '#818cf8' }}>{cgpa}</div>
          <div style={{ color: '#a1a1aa', fontSize: '1.125rem', fontWeight: 600 }}>Cumulative GPA</div>
        </div>

        {/* Grade Reference */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
          {DYP_GRADES.map(g => (
            <span key={g.grade} style={{
              padding: '0.35rem 0.75rem', background: '#18181b', border: '1px solid #27272a',
              borderRadius: '8px', color: g.points >= 7 ? '#10b981' : g.points >= 4 ? '#fbbf24' : '#ef4444',
              fontSize: '0.75rem', fontWeight: 600
            }}>{g.grade}: {g.points} ({g.range})</span>
          ))}
        </div>

        {/* Semesters */}
        {semesters.map((sem, semIdx) => (
          <div key={semIdx} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{sem.name}</h3>
                <span style={{ fontSize: '0.875rem', color: '#818cf8', fontWeight: 600 }}>SGPA: {calcSGPA(sem.subjects)}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => addSubject(semIdx)} style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '6px', padding: '0.35rem 0.75rem', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>+ Subject</button>
                {semesters.length > 1 && <button onClick={() => removeSemester(semIdx)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.35rem 0.75rem', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>}
              </div>
            </div>

            {sem.subjects.map((sub, subIdx) => (
              <div key={subIdx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input value={sub.name} onChange={e => updateSubject(semIdx, subIdx, 'name', e.target.value)} placeholder="Subject name"
                  style={{ flex: 2, minWidth: '120px', padding: '0.6rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                <input type="number" value={sub.credits} onChange={e => updateSubject(semIdx, subIdx, 'credits', e.target.value)} min={1} max={10} placeholder="Cr"
                  style={{ width: '60px', padding: '0.6rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', outline: 'none', textAlign: 'center' }} />
                <select value={sub.grade} onChange={e => updateSubject(semIdx, subIdx, 'grade', e.target.value)}
                  style={{ padding: '0.6rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}>
                  {DYP_GRADES.map(g => <option key={g.grade} value={g.grade}>{g.grade}</option>)}
                </select>
                {sem.subjects.length > 1 && (
                  <button onClick={() => removeSubject(semIdx, subIdx)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                )}
              </div>
            ))}
          </div>
        ))}

        <GradientButton onClick={addSemester} variant="variant" className="w-full">+ Add Semester</GradientButton>
      </div>
    </div>
  );
}
