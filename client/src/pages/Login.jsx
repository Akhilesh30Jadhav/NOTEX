// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Removed mouse tracking (dead code)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Theme Constants
  const borderColor = '#27272a';
  const bgColor = '#09090b';

  return (
    <div style={{
      minHeight: '100vh',
      background: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      // Engineer's Grid Background
      backgroundImage: 'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>

      {/* Login Card - Structural & Solid */}
      <div style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: '#18181b',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            fontSize: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            🎓
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Welcome back
          </h2>
          <p style={{ 
            color: '#a1a1aa', 
            fontSize: '14px',
            lineHeight: 1.6
          }}>
            Sign in to access your academic resources.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(127, 29, 29, 0.2)', // Dark red tint
            border: '1px solid #7f1d1d',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {/* Submit Button - Solid White */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#27272a' : '#ffffff',
              color: loading ? '#a1a1aa' : '#000000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => !loading && (e.target.style.opacity = '1')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px', color: '#a1a1aa' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 500,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.borderBottomColor = '#fff'}
              onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
            >
              Sign up
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (Engineer Style) ---

function FormInput({ label, name, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '0.4rem',
        color: '#a1a1aa',
        fontWeight: 500,
        fontSize: '13px',
      }}>
        {label}
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
          padding: '0.6rem 0.8rem',
          background: '#18181b', // Input bg
          border: '1px solid #27272a',
          borderRadius: '6px',
          fontSize: '14px',
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