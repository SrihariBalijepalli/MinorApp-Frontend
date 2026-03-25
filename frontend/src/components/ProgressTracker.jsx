import React from 'react';
import { CheckSquare, Square, Trophy } from 'lucide-react';

export default function ProgressTracker({ roadmap, progress, toggleProgress }) {
  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <Trophy size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Active Roadmap</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Generate a roadmap from the Analysis tab to start tracking your progress.</p>
      </div>
    );
  }

  const completedCount = roadmap.filter(step => progress[step.id]).length;
  const progressPercentage = Math.round((completedCount / roadmap.length) * 100);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.8rem' }}>My Progress</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Keep pushing! You're closer to your goal every day.</p>
          </div>
          <div style={{ 
            width: '80px', height: '80px', 
            borderRadius: '50%', 
            background: `conic-gradient(var(--success) ${progressPercentage}%, rgba(255,255,255,0.1) 0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{progressPercentage}%</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              background: 'linear-gradient(90deg, var(--primary-color), var(--success))', 
              height: '100%', 
              width: `${progressPercentage}%`,
              transition: 'width 0.5s ease-in-out'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {roadmap.map((step, index) => {
          const isCompleted = !!progress[step.id];
          return (
            <div 
              key={step.id}
              onClick={() => toggleProgress(step.id)}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--glass-border)',
                background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--glass-bg)',
                opacity: isCompleted ? 0.7 : 1
              }}
            >
              <div style={{ color: isCompleted ? 'var(--success)' : 'var(--text-secondary)' }}>
                {isCompleted ? <CheckSquare size={28} /> : <Square size={28} />}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                  {step.title}
                </h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
