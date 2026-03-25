import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Search } from 'lucide-react';
import SkillInput from './SkillInput';

export default function AnalysisForm({ onResult }) {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!role.trim()) {
      toast.error('Please enter a role');
      return;
    }
    
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    setIsLoading(true);

    try {
      // Assuming backend is running locally on port 8081.
      const queryParams = new URLSearchParams({ role });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/analyze?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skills)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      toast.success('Analysis completed successfully!');
      onResult(data);
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error('Failed to perform analysis. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      <h2 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>
        Skill Analyzer API
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Target Role
          </label>
          <select
            className="glass-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ appearance: 'none', cursor: 'pointer' }}
          >
            <option value="" disabled>Select a target role...</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Mobile Developer">Mobile Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>

        <SkillInput skills={skills} setSkills={setSkills} />

        <button 
          type="submit" 
          className="glass-button"
          disabled={isLoading}
          style={{ marginTop: '2rem' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing...
            </>
          ) : (
            <>
              <Search size={20} />
              Analyze
            </>
          )}
        </button>
      </form>
    </div>
  );
}
