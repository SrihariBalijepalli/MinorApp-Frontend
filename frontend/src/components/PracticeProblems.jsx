import React, { useState, useMemo } from 'react';
import { Code2, ChevronRight, Star, Zap, Trophy, Filter, Bookmark, BookmarkCheck, Flame, Search, Clock, Target } from 'lucide-react';
import CodeEditor from './CodeEditor';
import PROBLEM_BANK from '../data/problemBank';

const difficultyConfig = {
  Basic: { color: '#10b981', icon: Star, label: 'Easy' },
  Intermediate: { color: '#f59e0b', icon: Zap, label: 'Medium' },
  Advanced: { color: '#ef4444', icon: Trophy, label: 'Hard' }
};

// ─── Daily Challenge Logic ───
function getDailyChallenge(allProblems) {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % allProblems.length;
  return allProblems[index];
}

function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem('dailyStreak') || '{}');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastDate === today) return data.count || 0;
    if (data.lastDate === yesterday) return data.count || 0;
    return 0;
  } catch { return 0; }
}

function recordDailyComplete() {
  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem('dailyStreak') || '{}');
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let count = 1;
  if (data.lastDate === yesterday) count = (data.count || 0) + 1;
  else if (data.lastDate === today) count = data.count || 1;
  localStorage.setItem('dailyStreak', JSON.stringify({ lastDate: today, count }));
}

// ─── Get unique topics from all problems ───
function getTopics(problems) {
  const topics = new Set();
  problems.forEach(p => { if (p.topic) topics.add(p.topic); });
  return ['All Topics', ...Array.from(topics).sort()];
}

export default function PracticeProblems({ userRole }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filter, setFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [activeView, setActiveView] = useState('problems'); // 'problems' | 'daily' | 'interview'

  const [solvedProblems, setSolvedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('solvedProblems');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarkedProblems');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const allProblems = useMemo(() => {
    const result = [];
    for (const [difficulty, list] of Object.entries(PROBLEM_BANK)) {
      list.forEach(p => result.push({ ...p, difficulty }));
    }
    return result;
  }, []);

  const topics = useMemo(() => getTopics(allProblems), [allProblems]);
  const dailyChallenge = useMemo(() => getDailyChallenge(allProblems), [allProblems]);
  const streak = getStreak();

  const filtered = useMemo(() => {
    let result = allProblems;
    if (filter !== 'All') result = result.filter(p => p.difficulty === filter);
    if (topicFilter !== 'All Topics') result = result.filter(p => p.topic === topicFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || (p.topic && p.topic.toLowerCase().includes(q)));
    }
    if (showBookmarksOnly) result = result.filter(p => bookmarks.includes(p.id));
    return result;
  }, [allProblems, filter, topicFilter, searchQuery, showBookmarksOnly, bookmarks]);

  const handleSolved = (problemId) => {
    const updated = [...new Set([...solvedProblems, problemId])];
    setSolvedProblems(updated);
    localStorage.setItem('solvedProblems', JSON.stringify(updated));
    if (dailyChallenge && problemId === dailyChallenge.id) recordDailyComplete();
  };

  const toggleBookmark = (e, problemId) => {
    e.stopPropagation();
    const updated = bookmarks.includes(problemId)
      ? bookmarks.filter(id => id !== problemId)
      : [...bookmarks, problemId];
    setBookmarks(updated);
    localStorage.setItem('bookmarkedProblems', JSON.stringify(updated));
  };

  // ─── Topic stats for radar ───
  const topicStats = useMemo(() => {
    const stats = {};
    allProblems.forEach(p => {
      const t = p.topic || 'Other';
      if (!stats[t]) stats[t] = { total: 0, solved: 0 };
      stats[t].total++;
      if (solvedProblems.includes(p.id)) stats[t].solved++;
    });
    return stats;
  }, [allProblems, solvedProblems]);

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Practice Problems
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Sharpen your skills with {allProblems.length} coding challenges — from basic to advanced.
        </p>
      </div>

      {/* ══════ Daily Challenge Banner ══════ */}
      {dailyChallenge && (
        <div
          onClick={() => setSelectedProblem(dailyChallenge)}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Target size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#d8b4fe', fontWeight: 600 }}>Daily Challenge</span>
              {streak > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                  <Flame size={12} /> {streak} day streak
                </span>
              )}
              {solvedProblems.includes(dailyChallenge.id) && (
                <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                  ✓ Completed today!
                </span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{dailyChallenge.title}</h3>
            <span style={{ fontSize: '0.75rem', color: difficultyConfig[dailyChallenge.difficulty]?.color }}>{difficultyConfig[dailyChallenge.difficulty]?.label}</span>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </div>
      )}

      {/* ══════ Stats Row ══════ */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</h4>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{allProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Solved</h4>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--success)' }}>{solvedProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</h4>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {allProblems.length > 0 ? Math.round((solvedProblems.length / allProblems.length) * 100) : 0}%
          </span>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bookmarks</h4>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fbbf24' }}>{bookmarks.length}</span>
        </div>
      </div>

      {/* ══════ Skill Radar (Topic Breakdown) ══════ */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h4 style={{ color: 'var(--text-primary)', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>📊 Topic Progress</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
          {Object.entries(topicStats).map(([topic, { total, solved }]) => {
            const pct = Math.round((solved / total) * 100);
            return (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{solved}/{total}</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      width: `${pct}%`,
                      background: pct === 100 ? '#10b981' : pct > 50 ? '#8b5cf6' : pct > 0 ? '#f59e0b' : 'transparent',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════ Search + Filter Bar ══════ */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              borderRadius: '8px', border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        {/* Topic Dropdown */}
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem', borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-secondary)',
            fontFamily: 'inherit', fontSize: '0.8rem', cursor: 'pointer', outline: 'none'
          }}
        >
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Bookmark Toggle */}
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          style={{
            padding: '0.5rem 0.75rem', borderRadius: '8px',
            border: showBookmarksOnly ? '1px solid #fbbf24' : '1px solid var(--glass-border)',
            background: showBookmarksOnly ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
            color: showBookmarksOnly ? '#fbbf24' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s'
          }}
        >
          <Bookmark size={14} /> Saved
        </button>
      </div>

      {/* Difficulty Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Basic', 'Intermediate', 'Advanced'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: filter === f ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
              background: filter === f ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: filter === f ? '#d8b4fe' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 500,
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}
          >
            {f !== 'All' && <Filter size={12} />}
            {f === 'All' ? `All (${allProblems.length})` : `${difficultyConfig[f]?.label} (${allProblems.filter(p => p.difficulty === f).length})`}
          </button>
        ))}
      </div>

      {/* ══════ Problem List ══════ */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <Search size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No problems match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((problem) => {
            const config = difficultyConfig[problem.difficulty];
            const solved = solvedProblems.includes(problem.id);
            const isBookmarked = bookmarks.includes(problem.id);
            const isDaily = dailyChallenge && problem.id === dailyChallenge.id;

            return (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                className="glass-panel"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: solved ? '1px solid rgba(16, 185, 129, 0.3)' : isDaily ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)',
                  background: solved ? 'rgba(16, 185, 129, 0.05)' : isDaily ? 'rgba(139, 92, 246, 0.05)' : 'var(--glass-bg)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = solved ? 'rgba(16, 185, 129, 0.3)' : isDaily ? 'rgba(139, 92, 246, 0.3)' : 'var(--glass-border)'; }}
              >
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: `${config.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Code2 size={16} color={config.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)',
                    textDecoration: solved ? 'line-through' : 'none',
                    opacity: solved ? 0.7 : 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {problem.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: config.color, background: `${config.color}15`, padding: '1px 6px', borderRadius: '4px' }}>
                      {config.label}
                    </span>
                    {problem.topic && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '3px' }}>
                        {problem.topic}
                      </span>
                    )}
                    {isDaily && <span style={{ fontSize: '0.65rem', color: '#d8b4fe', background: 'rgba(139, 92, 246, 0.15)', padding: '1px 5px', borderRadius: '3px' }}>⚡ Daily</span>}
                    {solved && <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 500 }}>✓</span>}
                  </div>
                </div>

                {/* Bookmark btn */}
                <button
                  onClick={(e) => toggleBookmark(e, problem.id)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem',
                    color: isBookmarked ? '#fbbf24' : 'var(--text-secondary)',
                    transition: 'color 0.2s', flexShrink: 0
                  }}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>

                <ChevronRight size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
