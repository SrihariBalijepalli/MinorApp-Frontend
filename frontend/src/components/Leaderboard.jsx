import React, { useMemo } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Flame, Target, ChevronUp, Minus } from 'lucide-react';
import PROBLEM_BANK from '../data/problemBank';

// ─── Simulated leaderboard users ───
const SAMPLE_USERS = [
  { name: 'Arjun Patel', solved: 42, accuracy: 91, streak: 14, trend: 'up' },
  { name: 'Priya Sharma', solved: 38, accuracy: 88, streak: 21, trend: 'up' },
  { name: 'Rahul Verma', solved: 35, accuracy: 85, streak: 7, trend: 'same' },
  { name: 'Sneha Reddy', solved: 30, accuracy: 82, streak: 10, trend: 'up' },
  { name: 'Vikram Singh', solved: 27, accuracy: 79, streak: 5, trend: 'same' },
  { name: 'Ananya Gupta', solved: 24, accuracy: 76, streak: 3, trend: 'up' },
  { name: 'Karthik Nair', solved: 20, accuracy: 73, streak: 8, trend: 'same' },
  { name: 'Divya Iyer', solved: 18, accuracy: 70, streak: 2, trend: 'up' },
  { name: 'Manish Kumar', solved: 15, accuracy: 68, streak: 1, trend: 'same' },
  { name: 'Ritu Joshi', solved: 12, accuracy: 65, streak: 4, trend: 'up' },
];

function getRankStyle(rank) {
  if (rank === 1) return { bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))', border: 'rgba(255, 215, 0, 0.4)', icon: Crown, color: '#ffd700' };
  if (rank === 2) return { bg: 'linear-gradient(135deg, rgba(192, 192, 192, 0.12), rgba(169, 169, 169, 0.08))', border: 'rgba(192, 192, 192, 0.3)', icon: Medal, color: '#c0c0c0' };
  if (rank === 3) return { bg: 'linear-gradient(135deg, rgba(205, 127, 50, 0.12), rgba(184, 115, 51, 0.08))', border: 'rgba(205, 127, 50, 0.3)', icon: Medal, color: '#cd7f32' };
  return { bg: 'transparent', border: 'var(--glass-border)', icon: null, color: 'var(--text-secondary)' };
}

export default function Leaderboard({ user }) {
  const allProblems = useMemo(() => {
    const result = [];
    for (const [difficulty, list] of Object.entries(PROBLEM_BANK)) {
      list.forEach(p => result.push({ ...p, difficulty }));
    }
    return result;
  }, []);

  const currentUserStats = useMemo(() => {
    let solved = [];
    let streak = 0;
    try { solved = JSON.parse(localStorage.getItem('solvedProblems') || '[]'); } catch {}
    try { streak = JSON.parse(localStorage.getItem('dailyStreak') || '{}').count || 0; } catch {}
    const accuracy = allProblems.length > 0 ? Math.round((solved.length / allProblems.length) * 100) : 0;
    return {
      name: user?.fullName || user?.name || 'You',
      solved: solved.length,
      accuracy,
      streak,
      trend: 'up',
      isCurrentUser: true,
    };
  }, [allProblems, user]);

  // Merge current user into simulated users and sort by solved count
  const leaderboard = useMemo(() => {
    const combined = [
      ...SAMPLE_USERS.map(u => ({ ...u, isCurrentUser: false })),
      currentUserStats,
    ];
    combined.sort((a, b) => b.solved - a.solved || b.accuracy - a.accuracy);
    return combined.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [currentUserStats]);

  const currentUserRank = leaderboard.find(u => u.isCurrentUser)?.rank || '-';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          See how you stack up against other coders. Climb the ranks by solving more problems!
        </p>
      </div>

      {/* Your Rank Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.08))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: 'white',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
            }}>
              #{currentUserRank}
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Your Ranking</h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {currentUserStats.name} • {currentUserStats.solved} problems solved
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Accuracy</div>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-color)' }}>{currentUserStats.accuracy}%</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Streak</div>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Flame size={16} /> {currentUserStats.streak}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 90px 90px 80px 50px',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--text-secondary)',
          fontWeight: 600,
        }}>
          <span>Rank</span>
          <span>User</span>
          <span style={{ textAlign: 'center' }}>Solved</span>
          <span style={{ textAlign: 'center' }}>Accuracy</span>
          <span style={{ textAlign: 'center' }}>Streak</span>
          <span style={{ textAlign: 'center' }}>Trend</span>
        </div>

        {/* Rows */}
        {leaderboard.map((entry) => {
          const rankStyle = getRankStyle(entry.rank);
          const RankIcon = rankStyle.icon;

          return (
            <div
              key={entry.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 90px 90px 80px 50px',
                padding: '0.85rem 1.25rem',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                background: entry.isCurrentUser
                  ? 'rgba(139, 92, 246, 0.08)'
                  : rankStyle.bg,
                borderLeft: entry.isCurrentUser
                  ? '3px solid #8b5cf6'
                  : entry.rank <= 3
                  ? `3px solid ${rankStyle.color}`
                  : '3px solid transparent',
                transition: 'background 0.15s',
              }}
              onMouseOver={(e) => { if (!entry.isCurrentUser) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseOut={(e) => { if (!entry.isCurrentUser) e.currentTarget.style.background = entry.rank <= 3 ? rankStyle.bg : 'transparent'; }}
            >
              {/* Rank */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {RankIcon ? (
                  <RankIcon size={18} color={rankStyle.color} />
                ) : (
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', width: '18px', textAlign: 'center' }}>
                    {entry.rank}
                  </span>
                )}
                {entry.rank <= 3 && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: rankStyle.color }}>{entry.rank}</span>
                )}
              </div>

              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: entry.isCurrentUser
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                    : `hsl(${entry.name.length * 37 % 360}, 60%, ${entry.rank <= 3 ? '50%' : '35%'})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0
                }}>
                  {entry.name.charAt(0)}
                </div>
                <div>
                  <span style={{
                    fontSize: '0.88rem',
                    fontWeight: entry.isCurrentUser ? 700 : 500,
                    color: entry.isCurrentUser ? '#d8b4fe' : 'var(--text-primary)',
                  }}>
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span style={{
                        fontSize: '0.6rem', background: 'rgba(139, 92, 246, 0.2)',
                        color: '#d8b4fe', padding: '1px 6px', borderRadius: '4px',
                        marginLeft: '0.4rem', fontWeight: 600, verticalAlign: 'middle'
                      }}>YOU</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Solved */}
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: '0.9rem', fontWeight: 700,
                  color: entry.rank <= 3 ? 'var(--success)' : 'var(--text-primary)'
                }}>
                  {entry.solved}
                </span>
              </div>

              {/* Accuracy */}
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: '0.85rem', fontWeight: 600,
                  color: entry.accuracy >= 80 ? 'var(--success)' : entry.accuracy >= 60 ? '#fbbf24' : 'var(--text-secondary)'
                }}>
                  {entry.accuracy}%
                </span>
              </div>

              {/* Streak */}
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                {entry.streak >= 7 && <Flame size={13} color="#f59e0b" />}
                <span style={{
                  fontSize: '0.85rem', fontWeight: 600,
                  color: entry.streak >= 7 ? '#fbbf24' : 'var(--text-secondary)'
                }}>
                  {entry.streak}d
                </span>
              </div>

              {/* Trend */}
              <div style={{ textAlign: 'center' }}>
                {entry.trend === 'up' ? (
                  <ChevronUp size={16} color="#10b981" />
                ) : (
                  <Minus size={16} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
        Rankings are based on problems solved. Solve more problems to climb higher!
      </p>
    </div>
  );
}
