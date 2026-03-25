import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        let errorMessage = 'Login failed. Ensure backend is running.';
        try {
          const errData = await response.json();
          if (errData) {
            errorMessage = errData.message || errData.error || errorMessage;
          }
        } catch (e) {
          // fallback if non-json
        }
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      
      if (userData) {
        toast.success(`Welcome back, ${userData.name}!`);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/analyze');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      // Now it will correctly show "User not found" or "Invalid password" if the backend returns it
      if (error.message.includes('User not found')) {
        toast.error('Account not found! Please click Create one below to register.');
      } else {
        toast.error(error.message || 'Login failed or backend is unavailable');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image-side animate-fade-in">
        <img src="/auth-bg.png" alt="Tech AI Background" />
        <div className="auth-image-overlay">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)', letterSpacing: '-1px' }}>
            Master Your Skills
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.85, maxWidth: '450px', lineHeight: '1.6' }}>
            Join the ultimate AI-driven roadmap generator to level up your career and track your progress seamlessly.
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
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '16px', borderRadius: '50%' }}>
          <User size={32} color="var(--primary-color)" />
        </div>
      </div>
      
      <h2 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>
        Welcome Back
      </h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Email
          </label>
          <input
            type="email"
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Password
          </label>
          <input
            type="password"
            className="glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="glass-button">
          <LogIn size={20} />
          Sign In
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
          Create one
        </Link>
      </p>
        </div>
      </div>
    </div>
  );
}
