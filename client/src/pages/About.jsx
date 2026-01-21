// src/pages/About.jsx
import { useState, useEffect } from 'react';

export default function About() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme Constants
  const accentColor = '#818cf8'; // Soft Indigo
  const borderColor = '#27272a';
  const bgColor = '#09090b';

  return (
    <div style={{
      minHeight: '100vh',
      background: bgColor,
      color: '#fff',
      overflow: 'hidden',
      // Engineer's Grid Background
      backgroundImage: 'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      
      {/* Hero Section */}
      <section style={{
        padding: isMobile ? '4rem 1.5rem' : '6rem 2rem',
        textAlign: 'center',
        position: 'relative',
        borderBottom: `1px solid ${borderColor}`
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#18181b',
            borderRadius: '99px',
            border: `1px solid ${borderColor}`,
            marginBottom: '2rem',
          }}>
            <span style={{ fontSize: '12px' }}>🎓</span>
            <span style={{ 
              color: '#a1a1aa', 
              fontWeight: 600, 
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Student-Built Solution
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? '2.5rem' : '4.5rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Solving Real Problems
            <br />
            <span style={{ color: accentColor }}>
              For Real Students
            </span>
          </h1>

          <p style={{
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            color: '#a1a1aa',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Born from the frustration of a first-year CSE-AIML student who couldn't find previous year questions or proper notes. This platform bridges the gap between students and the academic resources they desperately need.
          </p>
        </div>
      </section>

      {/* Problem & Solution - Side by Side Cards */}
      <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 2rem', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '2rem'
          }}>
            <ProblemCard
              icon="❌"
              title="The Problem"
              points={[
                "No official previous year question papers available",
                "Senior students' notes were scattered and hard to find",
                "New subjects felt overwhelming without proper guidance",
                "College didn't provide centralized resource repository",
              ]}
              accent="#ef4444" // Red for problem
            />
            <ProblemCard
              icon="✅" // Changed to Checkmark
              title="My Solution"
              points={[
                "Built a comprehensive resource sharing platform",
                "Organized materials by branch, year, and semester",
                "Created a system for students to help each other",
                "Designed with D Y Patil University structure in mind",
              ]}
              accent="#10b981" // Green for solution
            />
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 2rem', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              My Journey
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.125rem' }}>
              From a frustrated first-year to building a campus-wide solution.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}>
            <JourneyStep step="01" title="The Struggle" description="First year CSE-AIML. Faced challenges finding study materials for exams." />
            <JourneyStep step="02" title="The Idea" description="Realized all first-year students were struggling with the same resource shortage." />
            <JourneyStep step="03" title="The Build" description="Used React & Node.js to build this platform from scratch over 3 months." />
            <JourneyStep step="04" title="The Future" description="Hoping this becomes the official resource hub for D Y Patil University." />
          </div>
        </div>
      </section>

      {/* Impact & Mission */}
      <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 2rem', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}>
            <ImpactCard
              icon="🎯"
              title="My Mission"
              description="To ensure no student faces the same resource shortage I experienced. Every student deserves access to proper study materials."
            />
            <ImpactCard
              icon="🌟"
              title="Current Impact"
              description="Helping students access organized study materials, PYQs, and notes. Building a community of shared knowledge."
            />
            <ImpactCard
              icon="🔮"
              title="Future Vision"
              description="I dream of this platform becoming D Y Patil University's official student resource hub, recognized by the administration."
            />
          </div>
        </div>
      </section>

      {/* Tech Stack & Resume Project */}
      <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 2rem', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '4rem',
            alignItems: 'start'
          }}>
            {/* Text Content */}
            <div>
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Built with Modern Tech
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                As a 2nd-year student, I applied everything I've learned to build this full-stack application. This project demonstrates my technical skills and problem-solving ability.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <TechBadge tech="React.js" />
                <TechBadge tech="Node.js" />
                <TechBadge tech="MongoDB" />
                <TechBadge tech="Express.js" />
                <TechBadge tech="JWT Auth" />
                <TechBadge tech="Vercel" />
              </div>
            </div>

            {/* Stats Card */}
            <div style={{
              background: '#09090b',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                 <div style={{ fontSize: '2rem' }}>💼</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Resume-Worthy Project</h3>
              </div>
              
              <p style={{ color: '#a1a1aa', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.938rem' }}>
                Showcases full-stack development skills, user-centered design thinking, and the ability to solve real-world problems.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <StatBox value="500+" label="Lines of Code" />
                <StatBox value="15+" label="Features Built" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 2rem', textAlign: 'center', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💻</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            From Student Problem to Technical Solution
          </h3>
          <p style={{
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            marginBottom: '2rem',
            color: '#a1a1aa',
            lineHeight: 1.6,
            fontStyle: 'italic'
          }}>
            "What started as a personal frustration during my first year has evolved into a comprehensive platform. This project represents not just my technical growth, but my commitment to solving real problems through code."
          </p>
          <div style={{
            color: accentColor,
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            - Akhilesh Jadhav, 2nd Year CSE-AIML
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Join the Movement
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Help me build the resource hub that D Y Patil University students deserve. Upload your notes and share previous year papers.
          </p>
          <button
            onClick={() => window.location.href = '/register'}
            style={{
              padding: '1rem 2rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>🚀</span>
            Start Contributing
          </button>
        </div>
      </section>

    </div>
  );
}

// --- SUB COMPONENTS (Engineer Style) ---

function ProblemCard({ icon, title, points, accent }) {
  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.5rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {points.map((point, index) => (
          <li key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            color: '#a1a1aa',
            fontSize: '15px',
            lineHeight: 1.5
          }}>
            <span style={{ color: accent, fontSize: '14px', marginTop: '3px' }}>●</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function JourneyStep({ step, title, description }) {
  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '1.5rem',
      height: '100%'
    }}>
      <div style={{
        fontSize: '3rem',
        fontWeight: 900,
        color: '#18181b', // Very subtle dark grey text for the number
        marginBottom: '0.5rem',
        lineHeight: 1
      }}>
        {step}
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}

function ImpactCard({ icon, title, description }) {
  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '2rem',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        background: '#18181b',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #27272a'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <p style={{ color: '#a1a1aa', lineHeight: 1.6, fontSize: '0.95rem' }}>
        {description}
      </p>
    </div>
  );
}

function TechBadge({ tech }) {
  return (
    <span style={{
      padding: '0.4rem 0.8rem',
      background: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: 500,
      color: '#e4e4e7'
    }}>
      {tech}
    </span>
  );
}

function StatBox({ value, label }) {
  return (
    <div style={{
      background: '#18181b',
      borderRadius: '6px',
      padding: '1rem',
      textAlign: 'center',
      border: '1px solid #27272a'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}