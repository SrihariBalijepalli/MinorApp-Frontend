import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Mail, Lock } from 'lucide-react';
import FloatingElements from '../components/FloatingElements';

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
    <div className="auth-fullscreen-wrapper">
      <FloatingElements />
      
      <div 
        className="premium-glass-card animate-fade-in-scale" 
        style={{ 
          padding: '3rem', 
          width: '100%',
          maxWidth: '440px',
          zIndex: 10,
          margin: '0 20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="animate-glow-pulse" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(56, 189, 248, 0.15))', padding: '20px', borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <User size={36} color="var(--neon-blue)" style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.8))' }} />
          </div>
        </div>
    
        <h2 className="text-shimmer" style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-1px' }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
          Sign in to continue your journey
        </p>
    
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
              EMAIL ADDRESS
            </label>
            <div className="input-group-premium">
              <input
                type="email"
                className="glass-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Mail className="input-icon" size={20} />
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
              PASSWORD
            </label>
            <div className="input-group-premium">
              <input
                type="password"
                className="glass-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Lock className="input-icon" size={20} />
            </div>
          </div>

          <button type="submit" className="glass-button" style={{ padding: '16px', fontSize: '1.1rem', letterSpacing: '1px' }}>
            <LogIn size={22} />
            ACCESS CONSOLE
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}></div>
          <span style={{ position: 'relative', background: 'rgba(10, 15, 36, 1)', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.85rem', zIndex: 2, borderRadius: '8px' }}>
            New to the platform?
          </span>
        </div>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
          <Link to="/register" style={{ color: 'var(--neon-blue)', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.5px', transition: 'text-shadow 0.3s', display: 'inline-block' }} onMouseOver={e => e.target.style.textShadow = '0 0 10px rgba(56,189,248,0.5)'} onMouseOut={e => e.target.style.textShadow = 'none'}>
            CREATE AN ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
}
