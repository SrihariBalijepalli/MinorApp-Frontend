import React from 'react';

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h3 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Analysis Results
      </h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {Object.entries(result).map(([key, value]) => (
          <div 
            key={key}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              {key}
            </span>
            <span style={{ fontSize: '1.125rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
