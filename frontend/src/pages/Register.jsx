import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User } from 'lucide-react';
import FloatingElements from '../components/FloatingElements';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, targetRole: '' })
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed. Ensure backend is running.';
        try {
          const errData = await response.json();
          if (errData) errorMessage = errData.message || errData.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create account or backend unavailable.');
    }
  };

  return (
    <div className="auth-container">
      <FloatingElements />
      <div className="auth-image-side animate-fade-in">
        <img src="/auth-bg.png" alt="Tech AI Background" />
        <div className="auth-image-overlay">
          <h1 className="text-shimmer" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
            Unlock Your Potential
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.8, maxWidth: '420px', lineHeight: '1.7', color: 'rgba(241,245,249,0.8)' }}>
            Create an account today to get personalized learning roadmaps based on your target role and current skills.
          </p>
        </div>
      </div>
      
      <div className="auth-form-side">
        <div 
          className="glass-panel animate-fade-in" 
          style={{ 
            padding: '2.5rem', 
            maxWidth: '420px', 
            width: '90%', 
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(59, 130, 246, 0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="animate-glow-pulse" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(56, 189, 248, 0.1))', padding: '18px', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
              <UserPlus size={32} color="var(--neon-blue)" />
            </div>
          </div>
      
          <h2 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>
            Create Account
          </h2>
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Full Name
          </label>
          <input
            type="text"
            className="glass-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Email
          </label>
          <input
            type="email"
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Password
          </label>
          <input
            type="password"
            className="glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Confirm Password
          </label>
          <input
            type="password"
            className="glass-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>

        <button type="submit" className="glass-button">
          <UserPlus size={20} />
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: 600 }}>
          Sign In
        </Link>
      </p>
        </div>
      </div>
    </div>
  );
}
