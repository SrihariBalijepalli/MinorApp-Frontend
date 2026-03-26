import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { User, Save, ArrowLeft } from 'lucide-react';
import FloatingElements from '../components/FloatingElements';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const user = JSON.parse(savedUser);
        setName(user.name || '');
        setEmail(user.email || '');
        setTargetRole(user.targetRole || '');
      } else {
        navigate('/login');
      }
    } catch(e) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const params = new URLSearchParams();
      params.append('email', email); // Cannot change email in this system
      if (name) params.append('name', name);
      if (password) params.append('password', password);
      if (targetRole) params.append('targetRole', targetRole);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        let errorMessage = 'Update failed. Ensure backend is running.';
        try {
          const errData = await response.json();
          if (errData) errorMessage = errData.message || errData.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      toast.success('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/analyze');
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile.');
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <FloatingElements />
      <div 
        className="glass-panel animate-fade-in" 
        style={{ 
          padding: '2.5rem', 
          maxWidth: '500px', 
          width: '100%', 
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(139, 92, 246, 0.05)'
        }}
      >
        <Link to="/analyze" style={{ position: 'absolute', top: '24px', left: '24px', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
          <div className="animate-glow-pulse" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(56, 189, 248, 0.1))', padding: '18px', borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <User size={32} color="var(--neon-purple)" />
          </div>
        </div>
        
        <h2 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>
          Edit Profile
        </h2>
        
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Email (Read-only)
            </label>
            <input
              type="email"
              className="glass-input"
              value={email}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <input
              type="text"
              className="glass-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Target Role
            </label>
            <input
              type="text"
              className="glass-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              New Password (Optional)
            </label>
            <input
              type="password"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          <button type="submit" className="glass-button">
            <Save size={20} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
