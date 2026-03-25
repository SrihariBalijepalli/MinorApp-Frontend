import React, { useState, useMemo } from 'react';
import { Code2, ChevronRight, Star, Zap, Trophy, Filter } from 'lucide-react';
import CodeEditor from './CodeEditor';
import PROBLEM_BANK from '../data/problemBank';

const difficultyConfig = {
  Basic: { color: '#10b981', icon: Star, label: 'Easy' },
  Intermediate: { color: '#f59e0b', icon: Zap, label: 'Medium' },
  Advanced: { color: '#ef4444', icon: Trophy, label: 'Hard' }
};

export default function PracticeProblems({ userRole }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filter, setFilter] = useState('All');
  const [solvedProblems, setSolvedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('solvedProblems');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const allProblems = useMemo(() => {
    const result = [];
    for (const [difficulty, list] of Object.entries(PROBLEM_BANK)) {
      list.forEach(p => result.push({ ...p, difficulty }));
    }
    return result;
  }, []);

  const filtered = filter === 'All'
    ? allProblems
    : allProblems.filter(p => p.difficulty === filter);

  const handleSolved = (problemId) => {
    const updated = [...new Set([...solvedProblems, problemId])];
    setSolvedProblems(updated);
    localStorage.setItem('solvedProblems', JSON.stringify(updated));
  };

  if (selectedProblem) {
    return (
      <CodeEditor
        problem={selectedProblem}
        onBack={() => setSelectedProblem(null)}
        onSolved={handleSolved}
        isSolved={solvedProblems.includes(selectedProblem.id)}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Practice Problems
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Sharpen your skills with {allProblems.length} coding challenges — from basic to advanced.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{allProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Solved</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{solvedProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {allProblems.length > 0 ? Math.round((solvedProblems.length / allProblems.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Basic', 'Intermediate', 'Advanced'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              border: filter === f ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
              background: filter === f ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: filter === f ? '#d8b4fe' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {f !== 'All' && <Filter size={14} />}
            {f === 'All' ? `All (${allProblems.length})` : `${difficultyConfig[f]?.label || f} (${allProblems.filter(p => p.difficulty === f).length})`}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((problem) => {
          const config = difficultyConfig[problem.difficulty];
          const solved = solvedProblems.includes(problem.id);
          return (
            <div
              key={problem.id}
              onClick={() => setSelectedProblem(problem)}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: solved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--glass-border)',
                background: solved ? 'rgba(16, 185, 129, 0.05)' : 'var(--glass-bg)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = solved ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'; }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: `${config.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Code2 size={18} color={config.color} />
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: 0, fontSize: '1rem', color: 'var(--text-primary)',
                  textDecoration: solved ? 'line-through' : 'none',
                  opacity: solved ? 0.7 : 1
                }}>
                  {problem.title}
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: config.color,
                    background: `${config.color}15`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {config.label}
                  </span>
                  {problem.topic && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      {problem.topic}
                    </span>
                  )}
                  {solved && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>
                      ✓ Solved
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
