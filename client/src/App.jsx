import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
import { FloatingNav } from '@/components/ui/floating-navbar';
import AnoAI from '@/components/ui/animated-shader-background';
import { Home as HomeIcon, BookOpen, Info, Mail, LayoutDashboard, Upload as UploadIcon, Shield, MessageSquare, MessageCircle, Video, Calculator, CalendarDays, ClipboardList, FileEdit, Trophy, CalendarCheck, Sparkles, Brain, LogOut } from 'lucide-react';

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

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon className="w-4 h-4" /> },
    { name: "Materials", link: "/materials", icon: <BookOpen className="w-4 h-4" /> },
    { name: "About", link: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Contact", link: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  const featureItems = [
    { name: "Discussion Forum", link: "/forum", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "Chat Rooms", link: "/chat", icon: <MessageCircle className="w-4 h-4" /> },
    { name: "Video Lectures", link: "/videos", icon: <Video className="w-4 h-4" /> },
    { name: "CGPA Calculator", link: "/cgpa", icon: <Calculator className="w-4 h-4" /> },
    { name: "Study Planner", link: "/study-planner", icon: <CalendarDays className="w-4 h-4" /> },
    { name: "Attendance", link: "/attendance", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Collab Notes", link: "/notes-editor", icon: <FileEdit className="w-4 h-4" /> },
    { name: "Leaderboard", link: "/leaderboard", icon: <Trophy className="w-4 h-4" /> },
    { name: "Calendar", link: "/calendar", icon: <CalendarCheck className="w-4 h-4" /> },
    { name: "AI Summarizer", link: "/ai-summarizer", icon: <Sparkles className="w-4 h-4" /> },
    { name: "AI Quiz", link: "/ai-quiz", icon: <Brain className="w-4 h-4" /> },
  ];

  const logo = (
    <Link to="/" className="flex items-center gap-2 no-underline">
      <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center text-white font-extrabold text-[10px]">
        NX
      </div>
      <span className="text-white font-bold text-xl tracking-tight hidden sm:inline">NOTEX</span>
    </Link>
  );

  const authButtons = (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="text-neutral-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/[0.08]"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <Link
        to="/login"
        className="text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="text-sm font-semibold border border-indigo-400/50 text-white px-3.5 py-1.5 rounded-lg bg-indigo-500/25 hover:bg-indigo-500/35 transition-colors"
      >
        Get Started
      </Link>
    </div>
  );

  const userMenu = user ? (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="text-neutral-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.08]"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <Link to="/dashboard" className="text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors" title="Dashboard">
        Dashboard
      </Link>
      <Link to="/upload" className="hidden lg:inline text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors" title="Upload">
        Upload
      </Link>
      {user.role === 'admin' && (
        <Link to="/admin" className="hidden xl:inline text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors" title="Admin">
          Admin
        </Link>
      )}
      <Link to="/profile" className="flex items-center gap-2 pl-1 text-neutral-300 hover:text-white transition-colors" title="Profile">
        <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="hidden xl:inline text-sm font-medium max-w-[95px] truncate">{user.name || 'User'}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-neutral-300 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/[0.12] transition-colors"
        title="Logout"
      >
        Logout
      </button>
    </div>
  ) : null;

  return (
    <FloatingNav
      navItems={navItems}
      featureItems={featureItems}
      logo={logo}
      authButtons={authButtons}
      userMenu={userMenu}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnoAI />
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
