import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function SkillInput({ skills, setSkills }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        User Skills
      </label>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {skills.map((skill) => (
          <span 
            key={skill} 
            className="animate-fade-in"
            style={{
              padding: '6px 12px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: '#d8b4fe'
            }}
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="glass-input"
          placeholder="Type a skill and press Add or Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddSkill(e);
          }}
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="glass-button"
          style={{ width: 'auto', padding: '12px 16px' }}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
