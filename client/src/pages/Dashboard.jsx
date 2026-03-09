
// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GlowingEffect } from '@/components/ui/glowing-effect';

export default function Dashboard() {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: isMobile ? '2rem 1rem' : '3rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Gradient Orbs */}
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15), transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            top: '10%',
            left: '5%',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
            transition: 'transform 0.3s ease-out',
            animation: 'float 20s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(249, 168, 212, 0.15), transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            top: '40%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            transition: 'transform 0.3s ease-out',
            animation: 'float 25s ease-in-out infinite reverse'
          }} />
        </>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '3rem', animation: 'fadeInUp 0.8s ease-out' }}>
          <h1 style={{
            fontSize: isMobile ? '2rem' : '3.5rem',
            fontWeight: 900,
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            Welcome back, <span style={{
              background: 'linear-gradient(90deg, #a78bfa, #f9a8d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{user?.name}!</span> 👋
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: isMobile ? '1rem' : '1.25rem',
            lineHeight: 1.6
          }}>
            Your personalized academic dashboard - everything you need in one place
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <StatCard
            icon="📚"
            title="Materials"
            value="Browse"
            description="Access study resources"
            gradient="linear-gradient(135deg, #a78bfa, #8b5cf6)"
            link="/materials"
          />
          <StatCard
            icon="⬆️"
            title="Upload"
            value="Share"
            description="Contribute materials"
            gradient="linear-gradient(135deg, #f9a8d4, #ec4899)"
            link="/upload"
          />
          <StatCard
            icon="👤"
            title="Profile"
            value={user?.role || 'Student'}
            description="Your account details"
            gradient="linear-gradient(135deg, #fbbf24, #f59e0b)"
          />
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: '2rem',
          animation: 'fadeInUp 1.2s ease-out'
        }}>
          {/* Account Details Card */}
          <div style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: isMobile ? '2rem 1.5rem' : '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #a78bfa, #f9a8d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                Account Details
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                Your profile information
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <DetailItem label="Full Name" value={user?.name} icon="👤" />
              <DetailItem label="Email Address" value={user?.email} icon="📧" />
              <DetailItem label="Department" value={user?.department} icon="🎓" />
              <DetailItem label="Year" value={user?.year} icon="📅" />
              <DetailItem label="Role" value={user?.role || 'Student'} icon="🏷️" />
              {user?.studentId && <DetailItem label="Student ID" value={user?.studentId} icon="🆔" />}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <QuickActionCard
              icon="📖"
              title="Browse Materials"
              description="Explore study resources"
              link="/materials"
              gradient="linear-gradient(135deg, #667eea, #764ba2)"
            />
            <QuickActionCard
              icon="📤"
              title="Upload Content"
              description="Share your notes"
              link="/upload"
              gradient="linear-gradient(135deg, #f093fb, #f5576c)"
            />
            <QuickActionCard
              icon="💬"
              title="Contact Support"
              description="Get help anytime"
              link="/contact"
              gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
            />
          </div>
        </div>

        {/* Info Banner */}
        <div style={{
          marginTop: '3rem',
          position: 'relative',
          background: 'rgba(167, 139, 250, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderRadius: '20px',
          padding: isMobile ? '2rem 1.5rem' : '2.5rem',
          textAlign: 'center',
          animation: 'fadeInUp 1.4s ease-out'
        }}>
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <h3 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #a78bfa, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            🚀 More Features Coming Soon!
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.063rem',
            lineHeight: 1.7,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            We're constantly improving your experience. Stay tuned for notifications, analytics, personalized recommendations, and more!
          </p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, description, gradient, link }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const CardContent = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.4s ease',
        cursor: link ? 'pointer' : 'default',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 30px 60px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div style={{
        width: '60px',
        height: '60px',
        background: gradient,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 900,
        color: 'white',
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '0.5rem'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        {description}
      </div>
    </div>
  );

  return link ? <Link to={link} style={{ textDecoration: 'none' }}>{CardContent}</Link> : CardContent;
}

// Detail Item Component
function DetailItem({ label, value, icon }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{
        fontSize: '1.5rem',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.813rem',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '0.25rem',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '1rem',
          color: 'white',
          fontWeight: 600
        }}>
          {value || 'Not set'}
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, title, description, link, gradient }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '1.75rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textDecoration: 'none',
        transition: 'all 0.4s ease',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 25px 50px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.2)',
        display: 'block'
      }}
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div style={{
        width: '50px',
        height: '50px',
        background: gradient,
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 800,
        color: 'white',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 1.5
      }}>
        {description}
      </p>
    </Link>
  );
}
