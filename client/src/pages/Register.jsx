// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '@/components/ui/gradient-button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', year: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const nav = useNavigate();

  // Removed mouse tracking effects for cleaner performance

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    nav('/dashboard');
  };

  // Theme Constants
  const borderColor = '#27272a';
  const bgColor = '#09090b';
  const inputBg = '#18181b';
  const accentColor = '#818cf8';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      padding: '2rem',
    }}>
      
      {/* Register Card */}
      <div style={{
        background: 'rgba(9, 9, 11, 0.85)',
        border: `1px solid rgba(39, 39, 42, 0.6)`,
        borderRadius: '8px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
        backdropFilter: 'blur(16px)',
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
            fontWeight: 800,
            fontSize: '1.75rem',
            color: '#fff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Create an account
          </h2>
          <p style={{
            color: '#a1a1aa',
            fontSize: '14px',
            lineHeight: 1.5
          }}>
            Enter your details below to join the R.A.I.T community.
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
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <FormInput
            label="Full Name"
            id="name"
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="XYZ ABC"
            required
          />

          <FormInput
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="name@example.com"
            required
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Min. 6 characters"
            required
            minLength={6}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Department"
              id="department"
              type="text"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              placeholder="CSE / AIML"
              required
            />

            <FormInput
              label="Year"
              id="year"
              type="number"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              min={1}
              max={4}
              required
            />
          </div>

          {/* Submit Button */}
          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </GradientButton>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px', color: '#a1a1aa' }}>
            Already have an account?{' '}
            <Link
              to="/login"
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
              Sign in
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (Engineer Style) ---

function FormInput({ label, id, type, value, onChange, placeholder, required, minLength, min, max }) {
  return (
    <div>
      <label 
        htmlFor={id} 
        style={{
          display: 'block',
          fontWeight: 500,
          marginBottom: '0.4rem',
          color: '#a1a1aa',
          fontSize: '13px',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        min={min}
        max={max}
        style={{
          width: '100%',
          padding: '0.6rem 0.8rem',
          background: '#18181b', // Darker input bg
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