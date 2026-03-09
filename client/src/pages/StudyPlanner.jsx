import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '../api/axios.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['#818cf8', '#f9a8d4', '#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

export default function StudyPlanner() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', day: 'Monday', startTime: '09:00', endTime: '10:00', color: '#818cf8' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get('/study-plans').then(r => setPlans(r.data)).catch(() => {});
  }, []);

  const addPlan = async () => {
    if (!form.title || !form.day) return;
    try {
      const res = await api.post('/study-plans', form);
      setPlans([...plans, res.data]);
      setShowForm(false);
      setForm({ title: '', subject: '', description: '', day: 'Monday', startTime: '09:00', endTime: '10:00', color: '#818cf8' });
    } catch {}
  };

  const deletePlan = async (id) => {
    try {
      await api.delete(`/study-plans/${id}`);
      setPlans(plans.filter(p => p._id !== id));
    } catch {}
  };

  const groupedByDay = DAYS.reduce((acc, day) => {
    acc[day] = plans.filter(p => p.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Study Planner</h1>
            <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>Organize your weekly study schedule</p>
          </div>
          <GradientButton onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Session'}</GradientButton>
        </div>

        {/* Add form */}
        {showForm && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Session Title *" style={inputStyle} />
              <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Subject" style={inputStyle} />
              <select value={form.day} onChange={e => setForm({...form, day: e.target.value})} style={inputStyle}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} style={{...inputStyle, flex: 1}} />
                <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} style={{...inputStyle, flex: 1}} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({...form, color: c})} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                    border: form.color === c ? '3px solid #fff' : '3px solid transparent', transition: 'border 0.2s'
                  }} />
                ))}
              </div>
            </div>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Notes (optional)" style={{...inputStyle, marginTop: '1rem', minHeight: '60px', resize: 'vertical', width: '100%'}} />
            <GradientButton onClick={addPlan} className="mt-4">Add to Schedule</GradientButton>
          </div>
        )}

        {/* Weekly Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(7, 1fr)', gap: '0.75rem' }}>
          {DAYS.map(day => (
            <div key={day} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', minHeight: '200px' }}>
              <div style={{ fontSize: '0.813rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>{day}</div>
              {groupedByDay[day].map(plan => (
                <div key={plan._id} style={{
                  background: `${plan.color}15`, border: `1px solid ${plan.color}40`, borderRadius: '10px',
                  padding: '0.75rem', marginBottom: '0.5rem', position: 'relative'
                }}>
                  <div style={{ fontSize: '0.813rem', fontWeight: 700, color: plan.color, marginBottom: '0.25rem' }}>{plan.title}</div>
                  {plan.subject && <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>{plan.subject}</div>}
                  <div style={{ fontSize: '0.7rem', color: '#71717a' }}>{plan.startTime} - {plan.endTime}</div>
                  <button onClick={() => deletePlan(plan._id)} style={{
                    position: 'absolute', top: 4, right: 4, background: 'none', border: 'none', color: '#71717a',
                    cursor: 'pointer', fontSize: '14px', lineHeight: 1
                  }}>×</button>
                </div>
              ))}
              {groupedByDay[day].length === 0 && <div style={{ fontSize: '0.75rem', color: '#3f3f46', textAlign: 'center', paddingTop: '2rem' }}>No sessions</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px',
  color: '#fff', fontSize: '0.9rem', outline: 'none'
};
