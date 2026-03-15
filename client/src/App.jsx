import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { Header1 } from '@/components/ui/header';
import AnoAI from '@/components/ui/animated-shader-background';

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

  return (
    <Header1
      user={user}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={handleLogout}
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
