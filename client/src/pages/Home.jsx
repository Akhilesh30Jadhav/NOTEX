import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  const accentColor = '#818cf8'; 
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', background: '#09090b', color: '#fff' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        padding: isMobile ? '4rem 1.5rem' : '8rem 2rem',
        background: '#09090b', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        <div style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1.25rem',
            background: '#18181b', 
            borderRadius: '50px',
            border: '1px solid #27272a', 
            marginBottom: '2rem',
          }}>
            <span style={{ fontSize: '1.25rem' }}></span>
            <span style={{ 
              color: '#e4e4e7', 
              fontWeight: 600, 
              fontSize: isMobile ? '0.813rem' : '0.938rem',
            }}>
              Created for R.A.I.T Students
            </span>
          </div>

            <h1 style={{
                fontSize: isMobile ? '2.75rem' : '6rem',
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: '1.5rem',
                color: '#ffffff', 
                animation: 'fadeInUp 1s ease-out',
                letterSpacing: '-0.03em'
            }}>
                Your Academic 
                <br />
                {/* Accent Color Applied Here */}
                <span style={{
                    color: accentColor, 
                }}>
                  Success Hub
                </span>
            </h1>

          <p style={{
                fontSize: isMobile ? '1.125rem' : '1.375rem',
                color: '#a1a1aa', 
                maxWidth: '800px',
                margin: '0 auto 3rem',
                lineHeight: 1.7,
                fontWeight: 400, 
                animation: 'fadeInUp 1.2s ease-out',
            }}>
                Transform your learning with 
                <span style={{ color: '#ffffff', fontWeight: 600 }}> curated materials</span>, 
                <span style={{ color: '#ffffff', fontWeight: 600 }}> high-quality notes</span>, and a 
                <span style={{ color: '#ffffff', fontWeight: 600 }}> collaborative community</span>.
            </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem',
            animation: 'fadeInUp 1.4s ease-out'
          }}>
            {user ? (
              <PremiumButton to="/dashboard"  text="Go to Dashboard" primary isMobile={isMobile} />
            ) : (
              <>
                <PremiumButton to="/register" text="Start Learning Free" primary isMobile={isMobile} />
                <PremiumButton to="/materials"  text="Browse Materials" isMobile={isMobile} />
              </>
            )}
          </div>

          {/* Stats Grid - Using the accent color */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '900px',
            margin: '0 auto',
            animation: 'fadeInUp 1.6s ease-out'
          }}>
            <StatCard number="Coming Soon" label="Materials" color="#ffffff" />
            <StatCard number="Open" label="Registration" color="#ffffff" />
            <StatCard number="Tracking" label="Student Success" color={accentColor} />
            <StatCard number="24/7" label="Platform Access" color={accentColor} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem',
        background: '#09090b', 
        borderTop: '1px solid #27272a',
        position: 'relative'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.25rem',
            background: '#18181b',
            borderRadius: '50px',
            border: '1px solid #27272a',
            marginBottom: '1.5rem'
          }}>
            <span style={{ 
              color: '#e4e4e7', 
              fontWeight: 700, 
              fontSize: '0.875rem',
              letterSpacing: '0.05em'
            }}>
               FEATURES
            </span>
          </div>
          <h2 style={{
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 900,
            marginBottom: '1.5rem',
            color: '#ffffff', 
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            Everything You Need
            <br />
            <span style={{ color: accentColor }}>
              To Excel
            </span>
          </h2>
          <p style={{
            fontSize: isMobile ? '1.063rem' : '1.25rem',
            color: '#a1a1aa',
            lineHeight: 1.7
          }}>
            Powerful tools designed to enhance your learning and boost academic performance.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <SimpleFeatureCard
            
            title="Quality Resources"
            description="Curated PDFs, notes, and study materials from top students and educators."
          />
          <SimpleFeatureCard
            
            title="Advanced Search"
            description="Find exactly what you need with intelligent search and filtering."
          />
          <SimpleFeatureCard
           
            title="Secure & Private"
            description="Your data is protected with encryption and secure storage."
          />
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section style={{
          padding: isMobile ? '6rem 1.5rem' : '10rem 2rem',
          background: '#09090b',
          borderTop: '1px solid #27272a',
          position: 'relative',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontSize: isMobile ? '2.25rem' : '4rem',
              fontWeight: 900,
              marginBottom: '1.5rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              Ready to Transform
              <br />
              Your Learning?
            </h2>
            <p style={{
              fontSize: isMobile ? '1.063rem' : '1.375rem',
              color: '#a1a1aa',
              marginBottom: '3rem',
              lineHeight: 1.7
            }}>
              Join students achieving academic excellence.
              <br />
              Start your journey today!
            </p>
            <PremiumButton to="/register"  text="Create Free Account" primary large isMobile={isMobile} />
          </div>
        </section>
      )}
    </div>
  );
}


function PremiumButton({ to, icon, text, primary, large, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: large 
          ? (isMobile ? '1.25rem 2.5rem' : '1.5rem 3rem')
          : (isMobile ? '1rem 2rem' : '1.125rem 2.25rem'),
        background: primary ? '#ffffff' : 'transparent',
        border: primary ? '1px solid #ffffff' : '1px solid #27272a',
        color: primary ? '#000000' : '#ffffff',
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: large ? '1.125rem' : '1rem',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      {text}
    </Link>
  );
}

function StatCard({ number, label, color }) {
  return (
    <div style={{
      background: '#09090b',
      borderRadius: '8px',
      padding: '1.5rem 1rem',
      border: '1px solid #27272a',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'default'
    }}>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: 900, 
        color: color, 
        marginBottom: '0.5rem',
      }}>
        {number}
      </div>
      <div style={{ 
        fontSize: '0.875rem', 
        color: '#a1a1aa',
        fontWeight: 600,
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
    </div>
  );
}

function SimpleFeatureCard({ icon, title, description }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#09090b',
        borderRadius: '8px',
        padding: '2.5rem',
        border: isHovered ? '1px solid #52525b' : '1px solid #27272a',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      <div style={{
        width: '4.5rem',
        height: '4.5rem',
        borderRadius: '8px',
        background: '#18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.25rem',
        marginBottom: '1.5rem',
        border: '1px solid #27272a'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        marginBottom: '1rem',
        color: 'white',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#a1a1aa',
        lineHeight: 1.7,
        fontSize: '1rem'
      }}>
        {description}
      </p>
    </div>
  );
}