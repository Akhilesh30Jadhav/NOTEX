import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';

export default function Contact() {
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const accentColor = '#818cf8'; // Indigo
  const borderColor = '#27272a';
  const bgColor = '#09090b';

  return (
    <div style={{
      minHeight: '100vh',
      color: '#fff',
    }}>

      {/* Hero Section */}
      <section style={{
        padding: isMobile ? '4rem 1.5rem' : '6rem 2rem',
        textAlign: 'center',
        borderBottom: `1px solid ${borderColor}`
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
            <span style={{ fontSize: '12px' }}>💬</span>
            <span style={{ 
              color: '#a1a1aa', 
              fontWeight: 600, 
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Contact Us
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
            Get In Touch
            <br />
            <span style={{ color: accentColor }}>
              With Us
            </span>
          </h1>

          <p style={{
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            color: '#a1a1aa',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Have questions, suggestions, or need support? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1.2fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            
            {/* Contact Form Container - Structural */}
            <div style={{
              position: 'relative',
              background: 'rgba(9, 9, 11, 0.8)',
              border: `1px solid rgba(39, 39, 42, 0.6)`,
              borderRadius: '8px',
              padding: isMobile ? '1.5rem' : '3rem',
              backdropFilter: 'blur(12px)',
            }}>
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                Send a Message
              </h2>
              <p style={{ color: '#a1a1aa', marginBottom: '2.5rem', fontSize: '15px' }}>
                Fill out the form below and we'll get back to you ASAP
              </p>

              {isSubmitted ? (
                <SuccessMessage onReset={() => setIsSubmitted(false)} accentColor={accentColor} />
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Name & Email Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <FormInput
                      label="Full Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#a1a1aa',
                      fontWeight: 600,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em'
                    }}>
                      Subject <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: '#18181b',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        fontSize: '15px',
                        color: 'white',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#a1a1aa',
                      fontWeight: 600,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em'
                    }}>
                      Message <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: '#18181b',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        fontSize: '15px',
                        color: 'white',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Submit Button */}
                  <GradientButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </GradientButton>
                </form>
              )}
            </div>

            {/* Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ContactCard
                icon="📧"
                title="Email Us"
                description="Get in touch via email"
                info="akhilesh30jadhav@gmail.com"
              />
             
              <ContactCard
                icon="📍"
                title="Location"
                description="D Y Patil University"
                info="Navi Mumbai, MH, India"
              />
              
              {/* Quick Info Box */}
              <div style={{
                position: 'relative',
                background: 'rgba(9, 9, 11, 0.75)',
                border: '1px solid rgba(39, 39, 42, 0.6)',
                borderRadius: '8px',
                padding: '1.5rem',
                backdropFilter: 'blur(8px)',
              }}>
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                  Quick Info
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#a1a1aa' }}>Response Time</span>
                    <span style={{ color: '#e4e4e7', fontWeight: 500 }}>Within 24 hours</span>
                  </div>
                  <div style={{ height: '1px', background: '#27272a' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#a1a1aa' }}>Best For</span>
                    <span style={{ color: '#e4e4e7', fontWeight: 500 }}>Bug reports, feedback</span>
                  </div>
                  <div style={{ height: '1px', background: '#27272a' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#a1a1aa' }}>Platform</span>
                    <span style={{ color: '#e4e4e7', fontWeight: 500 }}>NOTEX Student Portal</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem',
        borderTop: `1px solid rgba(39, 39, 42, 0.6)`,
        background: 'rgba(9, 9, 11, 0.9)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
        }}>
          <span style={{ color: '#71717a', fontSize: '14px' }}>
            NOTEX &middot; Built for D Y Patil University students
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>Home</Link>
            <Link to="/about" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>About</Link>
            <Link to="/materials" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>Materials</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


function FormInput({ label, name, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '0.5rem',
        color: '#a1a1aa',
        fontWeight: 600,
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
      }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '6px',
          fontSize: '15px',
          color: 'white',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => e.target.style.borderColor = '#818cf8'} // Indigo Focus
        onBlur={(e) => e.target.style.borderColor = '#27272a'}
      />
    </div>
  );
}

function SuccessMessage({ onReset, accentColor }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
        Message Sent
      </h3>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem', lineHeight: 1.6 }}>
        Thank you for reaching out. We'll get back to you shortly.
      </p>
      <GradientButton
        onClick={onReset}
        variant="variant"
      >
        Send Another
      </GradientButton>
    </div>
  );
}

function ContactCard({ icon, title, description, info }) {
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(9, 9, 11, 0.75)',
      border: '1px solid rgba(39, 39, 42, 0.6)',
      borderRadius: '8px',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      backdropFilter: 'blur(8px)',
    }}>
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div style={{
        width: '40px',
        height: '40px',
        background: '#18181b',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        border: '1px solid #27272a',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
          {title}
        </h3>
        <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '0.25rem' }}>
          {description}
        </p>
        <div style={{ color: '#fff', fontWeight: 500, fontSize: '14px' }}>
          {info}
        </div>
      </div>
    </div>
  );
}