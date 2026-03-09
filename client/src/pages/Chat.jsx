import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GradientButton } from '@/components/ui/gradient-button';
import api from '../api/axios.js';

const DEFAULT_ROOMS = ['General', 'CSE', 'AIML', 'IT', 'EXTC', 'Mechanical'];

export default function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [activeRoom, setActiveRoom] = useState('General');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMessages = () => {
    api.get(`/chat/${activeRoom}`).then(r => setMessages(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalRef.current);
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await api.post(`/chat/${activeRoom}`, { message: input.trim() });
      setInput('');
      fetchMessages();
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '1rem' : '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', height: 'calc(100vh - 140px)' }}>
        {/* Sidebar */}
        {(!isMobile || showSidebar) && (
          <div style={{
            width: isMobile ? '100%' : '220px', flexShrink: 0, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.813rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Channels</div>
            {rooms.map(room => (
              <button key={room} onClick={() => { setActiveRoom(room); if (isMobile) setShowSidebar(false); }}
                style={{
                  padding: '0.6rem 0.75rem', background: activeRoom === room ? 'rgba(129,140,248,0.15)' : 'transparent',
                  border: activeRoom === room ? '1px solid rgba(129,140,248,0.3)' : '1px solid transparent',
                  borderRadius: '8px', color: activeRoom === room ? '#818cf8' : '#a1a1aa', cursor: 'pointer',
                  textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s'
                }}>
                # {room}
              </button>
            ))}
          </div>
        )}

        {/* Chat area */}
        {(!isMobile || !showSidebar) && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isMobile && <button onClick={() => setShowSidebar(true)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '1.25rem' }}>←</button>}
              <span style={{ fontWeight: 700, color: '#fff' }}># {activeRoom}</span>
              <span style={{ fontSize: '0.75rem', color: '#71717a' }}>{messages.length} messages</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.length === 0 && <div style={{ textAlign: 'center', color: '#3f3f46', paddingTop: '4rem' }}>No messages yet. Start the conversation!</div>}
              {messages.map((msg, i) => {
                const isMe = msg.sender?._id === user?._id;
                return (
                  <div key={msg._id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ fontSize: '0.7rem', color: '#71717a', marginBottom: '0.2rem' }}>
                      {msg.sender?.name || 'Unknown'} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{
                      padding: '0.6rem 1rem', borderRadius: '12px', maxWidth: '75%', fontSize: '0.9rem', lineHeight: 1.5,
                      background: isMe ? 'rgba(129,140,248,0.2)' : 'rgba(255,255,255,0.05)',
                      color: isMe ? '#c4b5fd' : '#d4d4d8', border: `1px solid ${isMe ? 'rgba(129,140,248,0.3)' : 'rgba(255,255,255,0.08)'}`
                    }}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {user ? (
              <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.5rem' }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..."
                  style={{ flex: 1, padding: '0.75rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                <GradientButton onClick={sendMessage} className="min-w-0 px-4">Send</GradientButton>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#71717a', borderTop: '1px solid rgba(255,255,255,0.08)' }}>Login to chat</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
