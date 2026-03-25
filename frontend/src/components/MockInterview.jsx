import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Swords, Clock, Trophy, ArrowRight, CheckCircle2, XCircle, Play, RotateCcw } from 'lucide-react';
import CodeEditor from './CodeEditor';
import PROBLEM_BANK from '../data/problemBank';

const INTERVIEW_CONFIG = {
  totalProblems: 3,
  difficulties: ['Basic', 'Intermediate', 'Advanced'],
  timeLimitSeconds: 45 * 60, // 45 minutes
};

function getRandomProblems() {
  const selected = [];
  for (const diff of INTERVIEW_CONFIG.difficulties) {
    const pool = PROBLEM_BANK[diff] || [];
    if (pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.push({ ...pool[idx], difficulty: diff });
    }
  }
  return selected;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MockInterview() {
  const [phase, setPhase] = useState('start'); // 'start' | 'interview' | 'results'
  const [problems, setProblems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [solvedInSession, setSolvedInSession] = useState([]);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_CONFIG.timeLimitSeconds);
  const [startTime, setStartTime] = useState(null);

  // Timer
  useEffect(() => {
    if (phase !== 'interview') return;
    if (timeLeft <= 0) { setPhase('results'); return; }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const startInterview = () => {
    const selected = getRandomProblems();
    setProblems(selected);
    setCurrentIdx(0);
    setSolvedInSession([]);
    setTimeLeft(INTERVIEW_CONFIG.timeLimitSeconds);
    setStartTime(Date.now());
    setPhase('interview');
  };

  const handleSolved = (problemId) => {
    if (!solvedInSession.includes(problemId)) {
      setSolvedInSession(prev => [...prev, problemId]);
    }
  };

  const handleNext = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase('results');
    }
  };

  const handleBack = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase('results');
    }
  };

  // ─── Start Screen ───
  if (phase === 'start') {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2rem 0' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px', margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Swords size={40} color="#d8b4fe" />
        </div>

        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.6rem' }}>Mock Interview</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.9rem' }}>
          Simulate a real coding interview! You'll get <strong style={{ color: '#d8b4fe' }}>3 problems</strong> (Easy → Medium → Hard)
          with a <strong style={{ color: '#fbbf24' }}>45-minute</strong> time limit. Try to solve as many as you can!
        </p>

        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>📋 Rules</h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 2, fontSize: '0.85rem' }}>
            <li>3 problems: 1 Easy, 1 Medium, 1 Hard</li>
            <li>45-minute total time limit</li>
            <li>Problems are randomly selected</li>
            <li>You can skip and move to the next problem</li>
            <li>Score is calculated based on problems solved & time</li>
          </ul>
        </div>

        <button
          onClick={startInterview}
          style={{
            padding: '0.75rem 3rem', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Play size={18} /> Start Interview
        </button>
      </div>
    );
  }

  // ─── Results Screen ───
  if (phase === 'results') {
    const totalTime = INTERVIEW_CONFIG.timeLimitSeconds - timeLeft;
    const score = solvedInSession.length;
    const maxScore = problems.length;
    const percentage = Math.round((score / maxScore) * 100);
    const rating = percentage >= 100 ? 'Outstanding!' : percentage >= 66 ? 'Great Job!' : percentage >= 33 ? 'Keep Practicing!' : 'Don\'t Give Up!';
    const emoji = percentage >= 100 ? '🏆' : percentage >= 66 ? '🌟' : percentage >= 33 ? '💪' : '📚';

    // Save best score
    try {
      const best = JSON.parse(localStorage.getItem('mockInterviewBest') || '{}');
      if (!best.score || score > best.score || (score === best.score && totalTime < best.time)) {
        localStorage.setItem('mockInterviewBest', JSON.stringify({ score, time: totalTime, date: new Date().toISOString() }));
      }
    } catch {}

    return (
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{emoji}</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{rating}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Mock Interview Complete</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</h4>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: percentage >= 66 ? 'var(--success)' : '#fbbf24' }}>{score}/{maxScore}</span>
          </div>
          <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Time Used</h4>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatTime(totalTime)}</span>
          </div>
          <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</h4>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{percentage}%</span>
          </div>
        </div>

        {/* Problem breakdown */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Problem Breakdown</h4>
          {problems.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0',
              borderBottom: i < problems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              {solvedInSession.includes(p.id)
                ? <CheckCircle2 size={18} color="var(--success)" />
                : <XCircle size={18} color="var(--danger)" />
              }
              <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{p.title}</span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 600,
                color: { Basic: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' }[p.difficulty],
                background: `${{ Basic: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' }[p.difficulty]}15`,
                padding: '2px 6px', borderRadius: '4px'
              }}>
                {{ Basic: 'Easy', Intermediate: 'Medium', Advanced: 'Hard' }[p.difficulty]}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={startInterview}
            style={{
              padding: '0.6rem 2rem', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              color: 'white', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <RotateCcw size={14} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Interview In-Progress ───
  const currentProblem = problems[currentIdx];
  const isSolvedCurrent = solvedInSession.includes(currentProblem?.id);
  const isUrgent = timeLeft < 300; // under 5 min

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Interview Header Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 1.5rem',
        background: isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.08)',
        borderBottom: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Swords size={18} color="#d8b4fe" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mock Interview</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {problems.map((p, i) => (
              <div key={i} style={{
                width: '24px', height: '24px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                background: i === currentIdx ? 'rgba(139, 92, 246, 0.3)' : solvedInSession.includes(p.id) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                color: i === currentIdx ? '#d8b4fe' : solvedInSession.includes(p.id) ? '#10b981' : 'var(--text-secondary)',
                border: i === currentIdx ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent'
              }}>
                {solvedInSession.includes(p.id) ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontFamily: "'Cascadia Code', monospace",
            fontSize: '0.9rem', fontWeight: 700,
            color: isUrgent ? 'var(--danger)' : '#fbbf24',
            animation: isUrgent ? 'pulse 1s infinite' : 'none'
          }}>
            <Clock size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
            {formatTime(timeLeft)}
          </span>

          <button onClick={handleNext} style={{
            padding: '0.35rem 1rem', borderRadius: '6px', border: 'none',
            background: 'rgba(139, 92, 246, 0.2)', color: '#d8b4fe',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.3rem'
          }}>
            {currentIdx < problems.length - 1 ? <><ArrowRight size={14} /> Next</> : <><Trophy size={14} /> Finish</>}
          </button>
        </div>
      </div>

      {/* Problem Area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {currentProblem && (
          <CodeEditor
            key={currentProblem.id}
            problem={currentProblem}
            onBack={handleBack}
            onSolved={handleSolved}
            isSolved={isSolvedCurrent}
          />
        )}
      </div>
    </div>
  );
}
