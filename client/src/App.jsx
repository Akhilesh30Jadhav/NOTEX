import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Materials from './pages/Materials.jsx';
import Upload from './pages/Upload.jsx';
import Admin from './pages/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import MaterialFiles from "./pages/MaterialFiles.jsx";
import Home from './pages/Home.jsx';
import ResourcesLite from "./pages/ResourcesLite.jsx";
import AnimatedShaderBackground from './components/AnimatedShaderBackground.jsx';
import { GradientButton } from '@/components/ui/gradient-button';

// New feature pages
import Profile from './pages/Profile.jsx';
import StudyPlanner from './pages/StudyPlanner.jsx';
import Forum from './pages/Forum.jsx';
import Chat from './pages/Chat.jsx';
import AttendanceTracker from './pages/AttendanceTracker.jsx';
import CGPACalculator from './pages/CGPACalculator.jsx';
import VideoLectures from './pages/VideoLectures.jsx';
import CollaborativeNotes from './pages/CollaborativeNotes.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Notifications from './pages/Notifications.jsx';
import Calendar from './pages/Calendar.jsx';
import AISummarizer from './pages/AISummarizer.jsx';
import AIQuiz from './pages/AIQuiz.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav style={{
      background: isScrolled ? 'rgba(9, 9, 11, 0.95)' : 'rgba(9, 9, 11, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${isScrolled ? '#27272a' : 'transparent'}`,
      padding: isMobile ? '0.875rem 0' : '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0 1rem' : '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: isMobile ? '32px' : '36px',
            height: isMobile ? '32px' : '36px',
            background: '#818cf8',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: isMobile ? '13px' : '14px',
          }}>
            NX
          </div>
          <span style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: isMobile ? '18px' : '22px',
            letterSpacing: '-0.5px'
          }}>
            NOTEX
          </span>
        </Link>

        {/* Desktop Menu */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <NavLink href="/" text="Home" />
            <NavLink href="/materials" text="Materials" />
            
            {/* Features Dropdown */}
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setShowFeatures(true)}
              onMouseLeave={() => setShowFeatures(false)}>
              <span style={{ color: '#a1a1aa', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#a1a1aa'}>
                Features ▾
              </span>
              {showFeatures && (
                <div style={{
                  position: 'absolute', top: '100%', left: '-60px', background: 'rgba(9,9,11,0.98)',
                  border: '1px solid #27272a', borderRadius: '8px', padding: '0.5rem 0', minWidth: '200px',
                  zIndex: 100, boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
                }}>
                  <DropdownLink href="/forum" text="💬 Discussion Forum" />
                  <DropdownLink href="/chat" text="🗨️ Chat Rooms" />
                  <DropdownLink href="/videos" text="🎥 Video Lectures" />
                  <DropdownLink href="/cgpa" text="🧮 CGPA Calculator" />
                  <DropdownLink href="/study-planner" text="📅 Study Planner" />
                  <DropdownLink href="/attendance" text="📊 Attendance" />
                  <DropdownLink href="/notes-editor" text="📝 Collab Notes" />
                  <DropdownLink href="/leaderboard" text="🏆 Leaderboard" />
                  <DropdownLink href="/calendar" text="📆 Calendar" />
                  <DropdownLink href="/ai-summarizer" text="✨ AI Summarizer" />
                  <DropdownLink href="/ai-quiz" text="🧠 AI Quiz" />
                </div>
              )}
            </div>

            <NavLink href="/about" text="About" />
            <NavLink href="/contact" text="Contact" />

            {/* Theme toggle */}
            <button onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
                <NavLink href="/dashboard" text="Dashboard" />
                <NavLink href="/upload" text="Upload" />
                {user.role === 'admin' && <NavLink href="/admin" text="Admin" />}

                {/* Quick Icons */}
                <Link to="/notifications" style={{ fontSize: '16px', textDecoration: 'none' }} title="Notifications">🔔</Link>
                <Link to="/bookmarks" style={{ fontSize: '16px', textDecoration: 'none' }} title="Bookmarks">🔖</Link>

                {/* User avatar - links to profile */}
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem', textDecoration: 'none' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#818cf8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500 }}>
                    {user.name ?? user.email}
                  </span>
                </Link>

                <GradientButton
                  variant="variant"
                  onClick={handleLogout}
                  className="px-4 py-2 min-w-0 text-sm"
                >
                  Logout
                </GradientButton>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: '1rem' }}>
                <GradientButton variant="variant" asChild className="px-5 py-2 min-w-0 text-sm">
                  <Link to="/login">
                    Login
                  </Link>
                </GradientButton>
                <GradientButton asChild className="px-5 py-2 min-w-0 text-sm">
                  <Link to="/register">
                    Get Started
                  </Link>
                </GradientButton>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#e4e4e7'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(9, 9, 11, 0.98)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #27272a',
          padding: '1.5rem 1rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <MobileNavLink href="/" text="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/materials" text="Materials" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/forum" text="💬 Forum" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/chat" text="🗨️ Chat" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/videos" text="🎥 Videos" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/cgpa" text="🧮 CGPA Calc" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/study-planner" text="📅 Study Planner" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/attendance" text="📊 Attendance" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/notes-editor" text="📝 Collab Notes" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/leaderboard" text="🏆 Leaderboard" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/calendar" text="📆 Calendar" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/ai-summarizer" text="✨ AI Summarizer" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/ai-quiz" text="🧠 AI Quiz" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/about" text="About" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/contact" text="Contact" onClick={() => setIsMobileMenuOpen(false)} />

            {/* Theme toggle mobile */}
            <button onClick={toggleTheme} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#e4e4e7', fontSize: '15px', fontWeight: 500, textAlign: 'left', cursor: 'pointer' }}>
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {user ? (
              <>
                <MobileNavLink href="/dashboard" text="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/upload" text="Upload" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/profile" text="👤 Profile" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/bookmarks" text="🔖 Bookmarks" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/notifications" text="🔔 Notifications" onClick={() => setIsMobileMenuOpen(false)} />
                {user.role === 'admin' && (
                  <MobileNavLink href="/admin" text="Admin" onClick={() => setIsMobileMenuOpen(false)} />
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1rem', marginTop: '0.5rem',
                  borderTop: '1px solid #27272a', paddingTop: '1rem'
                }}>
                  <div style={{
                    width: '28px', height: '28px', background: '#818cf8',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 600
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500 }}>
                    {user.name ?? user.email}
                  </span>
                </div>
                <GradientButton
                  variant="variant"
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full min-w-0 text-sm"
                >
                  Logout
                </GradientButton>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                <GradientButton variant="variant" asChild className="w-full min-w-0 text-sm text-center">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                    Login
                  </Link>
                </GradientButton>
                <GradientButton asChild className="w-full min-w-0 text-sm text-center">
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                    Get Started
                  </Link>
                </GradientButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, text }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#ffffff' : '#a1a1aa',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '14px',
        transition: 'color 0.2s ease',
      }}
    >
      {text}
    </Link>
  );
}

function MobileNavLink({ href, text, onClick }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      style={{
        color: '#e4e4e7',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '15px',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        display: 'block',
        transition: 'background 0.2s ease',
      }}
    >
      {text}
    </Link>
  );
}

function DropdownLink({ href, text }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', padding: '0.5rem 1rem', color: hovered ? '#fff' : '#a1a1aa',
        background: hovered ? 'rgba(129,140,248,0.1)' : 'transparent',
        textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'all 0.15s'
      }}>
      {text}
    </Link>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Fixed shader background behind everything */}
          <AnimatedShaderBackground />
          <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/resources" element={<ResourcesLite />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/materials/:id/files" element={<MaterialFiles />} />
              <Route path="/cgpa" element={<CGPACalculator />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/study-planner" element={<StudyPlanner />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/attendance" element={<AttendanceTracker />} />
                <Route path="/videos" element={<VideoLectures />} />
                <Route path="/notes-editor" element={<CollaborativeNotes />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai-summarizer" element={<AISummarizer />} />
                <Route path="/ai-quiz" element={<AIQuiz />} />
              </Route>

              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
