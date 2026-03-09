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
import { Home as HomeIcon, BookOpen, Info, Mail, LayoutDashboard, Upload as UploadIcon, Shield, MessageSquare, MessageCircle, Video, Calculator, CalendarDays, ClipboardList, FileEdit, Trophy, CalendarCheck, Sparkles, Brain, Bell, Bookmark, User, LogOut, Sun, Moon } from 'lucide-react';

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
    <Link to="/" className="flex items-center gap-2.5 no-underline group">
      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
        NX
      </div>
      <span className="text-white font-bold text-lg tracking-tight hidden sm:inline">NOTEX</span>
    </Link>
  );

  const authButtons = (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/[0.06]"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <Link
        to="/login"
        className="text-[13px] font-medium text-neutral-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/[0.06] transition-all"
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="text-[13px] font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 rounded-full hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
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
        className="text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/[0.06]"
      >
        {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
      </button>

      <div className="w-px h-5 bg-white/[0.1] mx-1" />

      <Link to="/dashboard" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors" title="Dashboard">
        <LayoutDashboard className="w-[18px] h-[18px]" />
      </Link>
      <Link to="/upload" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors" title="Upload">
        <UploadIcon className="w-[18px] h-[18px]" />
      </Link>
      <Link to="/notifications" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors relative" title="Notifications">
        <Bell className="w-[18px] h-[18px]" />
      </Link>
      <Link to="/bookmarks" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors" title="Bookmarks">
        <Bookmark className="w-[18px] h-[18px]" />
      </Link>
      {user.role === 'admin' && (
        <Link to="/admin" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors" title="Admin">
          <Shield className="w-[18px] h-[18px]" />
        </Link>
      )}

      <div className="w-px h-5 bg-white/[0.1] mx-1" />

      <Link to="/profile" className="flex items-center gap-2 ml-0.5 group" title="Profile">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow ring-2 ring-white/[0.1]">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </Link>
      <button
        onClick={handleLogout}
        className="text-neutral-400 hover:text-red-400 p-2 rounded-full hover:bg-red-500/[0.08] transition-all"
        title="Logout"
      >
        <LogOut className="w-[18px] h-[18px]" />
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
