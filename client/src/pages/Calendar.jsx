import { useState, useEffect } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#818cf8', '#f472b6', '#10b981', '#fbbf24', '#f97316', '#06b6d4', '#a78bfa'];

export default function Calendar() {
  const [events, setEvents] = useState(() => {
    const s = localStorage.getItem('notex_calendar');
    return s ? JSON.parse(s) : [];
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', color: COLORS[0], type: 'exam' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('notex_calendar', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const addEvent = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setEvents([...events, { ...form, id: Date.now() }]);
    setForm({ title: '', date: '', time: '', color: COLORS[0], type: 'exam' });
    setShowForm(false);
  };

  const removeEvent = (id) => setEvents(events.filter(e => e.id !== id));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (day) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const inputStyle = { width: '100%', padding: '0.65rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' };

  // Upcoming events
  const todayStr = today.toISOString().split('T')[0];
  const upcoming = events.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '2rem 1rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Calendar</h1>
            <p style={{ color: '#a1a1aa' }}>Track exams, deadlines, and events</p>
          </div>
          <GradientButton onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Event'}</GradientButton>
        </div>

        {showForm && (
          <form onSubmit={addEvent} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
              <input style={inputStyle} placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
                <option value="deadline">Deadline</option>
                <option value="holiday">Holiday</option>
                <option value="other">Other</option>
              </select>
              <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              <input style={inputStyle} type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {COLORS.map(c => (
                  <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
            <GradientButton type="submit" className="mt-4">Add Event</GradientButton>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: '1.5rem' }}>
          {/* Calendar Grid */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}>←</button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}>→</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', padding: '0.35rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a' }}>{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                return (
                  <div key={day} style={{
                    aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '8px', cursor: 'default', position: 'relative',
                    background: isToday(day) ? 'rgba(129,140,248,0.15)' : dayEvents.length ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: isToday(day) ? '1px solid rgba(129,140,248,0.4)' : '1px solid transparent'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: isToday(day) ? 700 : 500, color: isToday(day) ? '#818cf8' : '#e4e4e7' }}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                        {dayEvents.slice(0, 3).map((ev, j) => (
                          <div key={j} style={{ width: '5px', height: '5px', borderRadius: '50%', background: ev.color }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Upcoming</h3>
            {upcoming.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No upcoming events</p>
            ) : upcoming.map(ev => (
              <div key={ev.id} style={{
                display: 'flex', gap: '0.65rem', padding: '0.65rem', marginBottom: '0.5rem',
                background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `3px solid ${ev.color}`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{ev.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a' }}>{ev.date}{ev.time ? ` · ${ev.time}` : ''}</div>
                  <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: `${ev.color}22`, color: ev.color }}>{ev.type}</span>
                </div>
                <button onClick={() => removeEvent(ev.id)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '0.85rem', alignSelf: 'flex-start' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
