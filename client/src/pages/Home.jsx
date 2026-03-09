import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';

export default function Home() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const accentColor = '#818cf8';

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', color: '#fff' }}>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        padding: isMobile ? '4rem 1.5rem' : '8rem 2rem',
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
            animation: 'fadeInUp 0.8s ease-out',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{
              color: '#e4e4e7',
              fontWeight: 600,
              fontSize: isMobile ? '0.813rem' : '0.938rem',
            }}>
              Open for R.A.I.T Students
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? '2.75rem' : '5.5rem',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            color: '#ffffff',
            animation: 'fadeInUp 1s ease-out',
            letterSpacing: '-0.03em'
          }}>
            Your Academic
            <br />
            <span style={{ color: accentColor }}>
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
              <PremiumButton to="/dashboard" text="Go to Dashboard" primary isMobile={isMobile} />
            ) : (
              <>
                <PremiumButton to="/register" text="Start Learning Free" primary isMobile={isMobile} />
                <PremiumButton to="/materials" text="Browse Materials" isMobile={isMobile} />
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '900px',
            margin: '0 auto',
            animation: 'fadeInUp 1.6s ease-out'
          }}>
            <StatCard number="15+" label="Subjects Covered" color="#ffffff" />
            <StatCard number="Open" label="Registration" color="#ffffff" />
            <StatCard number="PYQs" label="Previous Year Papers" color={accentColor} />
            <StatCard number="24/7" label="Platform Access" color={accentColor} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: isMobile ? '5rem 1.5rem' : '8rem 2rem',
        background: 'rgba(9, 9, 11, 0.85)',
        borderTop: '1px solid rgba(39, 39, 42, 0.6)',
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
            Curated resources uploaded to enhance your learning and boost academic performance.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <SimpleFeatureCard
            icon="📚"
            title="Quality Resources"
            description="Curated PDFs, notes, lab manuals, and study materials organized by semester."
          />
          <SimpleFeatureCard
            icon="🔍"
            title="Smart Filtering"
            description="Find exactly what you need - filter by branch, year, semester, and file type."
          />
          <SimpleFeatureCard
            icon="📝"
            title="Previous Year Papers"
            description="Access question papers from past exams to prepare effectively for your tests."
          />
        </div>

        {/* Second row of features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '1.5rem auto 0'
        }}>
          <SimpleFeatureCard
            icon="🏗️"
            title="Organized by Semester"
            description="Materials are sorted by branch and semester so you never waste time searching."
          />
          <SimpleFeatureCard
            icon="🤝"
            title="Community Driven"
            description="Students upload and share resources to help each other. Contribute and grow together."
          />
          <SimpleFeatureCard
            icon="🔒"
            title="Secure & Private"
            description="Your data is protected with JWT authentication. Focus on learning, we handle the rest."
          />
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section style={{
          padding: isMobile ? '6rem 1.5rem' : '8rem 2rem',
          background: 'rgba(9, 9, 11, 0.7)',
          borderTop: '1px solid rgba(39, 39, 42, 0.6)',
          position: 'relative',
          textAlign: 'center',
          overflow: 'hidden',
        }}>
          {/* Subtle accent glow - removed, shader provides background */}

          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontSize: isMobile ? '2.25rem' : '3.5rem',
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
              fontSize: isMobile ? '1.063rem' : '1.25rem',
              color: '#a1a1aa',
              marginBottom: '2.5rem',
              lineHeight: 1.7
            }}>
              Join the growing community of D Y Patil students sharing resources and helping each other succeed.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <PremiumButton to="/register" text="Create Free Account" primary large isMobile={isMobile} />
              <PremiumButton to="/about" text="Learn More" isMobile={isMobile} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem',
        borderTop: '1px solid rgba(39, 39, 42, 0.6)',
        background: 'rgba(9, 9, 11, 0.9)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px', height: '24px', background: '#818cf8', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '10px'
            }}>
              NX
            </div>
            <span style={{ color: '#71717a', fontSize: '14px' }}>
              NOTEX &middot; Built for D Y Patil University students
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>About</Link>
            <Link to="/contact" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>Contact</Link>
            <Link to="/materials" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>Materials</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


function PremiumButton({ to, text, primary, large, isMobile }) {
  return (
    <GradientButton
      asChild
      variant={primary ? "default" : "variant"}
      className={large ? "px-10 py-5 text-lg" : "px-8 py-4 text-base"}
    >
      <Link to={to} style={{ textDecoration: 'none' }}>
        {text}
      </Link>
    </GradientButton>
  );
}

function StatCard({ number, label, color }) {
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(9, 9, 11, 0.8)',
      borderRadius: '8px',
      padding: '1.5rem 1rem',
      border: '1px solid rgba(39, 39, 42, 0.6)',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'default',
      backdropFilter: 'blur(8px)',
    }}>
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
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
        position: 'relative',
        background: 'rgba(9, 9, 11, 0.75)',
        borderRadius: '8px',
        padding: '2rem',
        border: isHovered ? '1px solid rgba(63, 63, 70, 0.8)' : '1px solid rgba(39, 39, 42, 0.6)',
        transition: 'all 0.2s ease',
        cursor: 'default',
        backdropFilter: 'blur(8px)',
      }}
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div style={{
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '8px',
        background: '#18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        marginBottom: '1.25rem',
        border: '1px solid #27272a'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        marginBottom: '0.75rem',
        color: 'white',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#a1a1aa',
        lineHeight: 1.7,
        fontSize: '0.95rem'
      }}>
        {description}
      </p>
    </div>
  );
}
