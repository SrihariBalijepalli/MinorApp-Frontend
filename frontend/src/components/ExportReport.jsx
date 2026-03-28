import React, { useMemo } from 'react';
import { Download, FileText, Trophy, Target, Clock, Code2 } from 'lucide-react';
import PROBLEM_BANK from '../data/problemBank';

export default function ExportReport({ user }) {
  const solved = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('solvedProblems') || '[]'); } catch { return []; }
  }, []);
  const bookmarks = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('bookmarkedProblems') || '[]'); } catch { return []; }
  }, []);
  const streak = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('dailyStreak') || '{}').count || 0; } catch { return 0; }
  }, []);
  const interviewBest = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('mockInterviewBest') || '{}'); } catch { return {}; }
  }, []);

  const allProblems = useMemo(() => {
    const result = [];
    for (const [difficulty, list] of Object.entries(PROBLEM_BANK)) {
      list.forEach(p => result.push({ ...p, difficulty }));
    }
    return result;
  }, []);

  const topicStats = useMemo(() => {
    const s = {};
    allProblems.forEach(p => {
      const t = p.topic || 'Other';
      if (!s[t]) s[t] = { total: 0, solved: 0 };
      s[t].total++;
      if (solved.includes(p.id)) s[t].solved++;
    });
    return s;
  }, [allProblems, solved]);

  const solvedByDifficulty = useMemo(() => {
    const counts = { Basic: 0, Intermediate: 0, Advanced: 0 };
    allProblems.forEach(p => {
      if (solved.includes(p.id)) counts[p.difficulty]++;
    });
    return counts;
  }, [allProblems, solved]);

  const exportPDF = () => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const accuracy = allProblems.length > 0 ? Math.round((solved.length / allProblems.length) * 100) : 0;

    const html = `
<!DOCTYPE html>
<html>
<head>
<title>Progress Report - ${user?.fullName || 'User'}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; background: white; }
  .header { text-align: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #8b5cf6; }
  .header h1 { font-size: 28px; color: #8b5cf6; margin-bottom: 4px; }
  .header p { color: #64748b; font-size: 14px; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 18px; color: #1e293b; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
  .stat-card .value { font-size: 28px; font-weight: 700; }
  .stat-card .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .green { color: #10b981; } .purple { color: #8b5cf6; } .yellow { color: #f59e0b; } .red { color: #ef4444; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
  th { background: #f1f5f9; font-weight: 600; color: #475569; }
  .bar-bg { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; }
  .footer { margin-top: 32px; text-align: center; color: #94a3b8; font-size: 12px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
  <div class="header">
    <h1>📊 Skillio Progress Report</h1>
    <p>${user?.fullName || 'User'} • ${user?.email || ''} • Generated on ${date}</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card"><div class="label">Total Problems</div><div class="value purple">${allProblems.length}</div></div>
    <div class="stat-card"><div class="label">Solved</div><div class="value green">${solved.length}</div></div>
    <div class="stat-card"><div class="label">Accuracy</div><div class="value purple">${accuracy}%</div></div>
    <div class="stat-card"><div class="label">Day Streak</div><div class="value yellow">${streak}</div></div>
  </div>

  <div class="section">
    <h2>📈 Difficulty Breakdown</h2>
    <table>
      <tr><th>Difficulty</th><th>Solved</th><th>Total</th><th>Progress</th></tr>
      <tr>
        <td>🟢 Easy</td><td>${solvedByDifficulty.Basic}</td><td>${allProblems.filter(p=>p.difficulty==='Basic').length}</td>
        <td><div class="bar-bg"><div class="bar-fill" style="width:${allProblems.filter(p=>p.difficulty==='Basic').length ? Math.round(solvedByDifficulty.Basic/allProblems.filter(p=>p.difficulty==='Basic').length*100) : 0}%;background:#10b981"></div></div></td>
      </tr>
      <tr>
        <td>🟡 Medium</td><td>${solvedByDifficulty.Intermediate}</td><td>${allProblems.filter(p=>p.difficulty==='Intermediate').length}</td>
        <td><div class="bar-bg"><div class="bar-fill" style="width:${allProblems.filter(p=>p.difficulty==='Intermediate').length ? Math.round(solvedByDifficulty.Intermediate/allProblems.filter(p=>p.difficulty==='Intermediate').length*100) : 0}%;background:#f59e0b"></div></div></td>
      </tr>
      <tr>
        <td>🔴 Hard</td><td>${solvedByDifficulty.Advanced}</td><td>${allProblems.filter(p=>p.difficulty==='Advanced').length}</td>
        <td><div class="bar-bg"><div class="bar-fill" style="width:${allProblems.filter(p=>p.difficulty==='Advanced').length ? Math.round(solvedByDifficulty.Advanced/allProblems.filter(p=>p.difficulty==='Advanced').length*100) : 0}%;background:#ef4444"></div></div></td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>🎯 Topic Progress</h2>
    <table>
      <tr><th>Topic</th><th>Solved</th><th>Total</th><th>Progress</th></tr>
      ${Object.entries(topicStats).map(([topic, { total, solved: s }]) => `
        <tr><td>${topic}</td><td>${s}</td><td>${total}</td>
        <td><div class="bar-bg"><div class="bar-fill" style="width:${Math.round(s/total*100)}%;background:#8b5cf6"></div></div></td></tr>
      `).join('')}
    </table>
  </div>

  ${interviewBest.score !== undefined ? `
  <div class="section">
    <h2>⚔️ Mock Interview Best</h2>
    <table>
      <tr><th>Score</th><th>Time</th><th>Date</th></tr>
      <tr><td>${interviewBest.score}/3</td><td>${Math.floor((interviewBest.time||0)/60)}m ${(interviewBest.time||0)%60}s</td><td>${interviewBest.date ? new Date(interviewBest.date).toLocaleDateString() : 'N/A'}</td></tr>
    </table>
  </div>` : ''}

  <div class="footer">
    Skillio Platform • ${date} • This report was auto-generated based on your practice activity.
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      setTimeout(() => { win.print(); }, 500);
    }
  };

  const accuracy = allProblems.length > 0 ? Math.round((solved.length / allProblems.length) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Export Progress Report</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Download a detailed PDF of your coding progress, topic strengths, and achievements.</p>
      </div>

      {/* Preview Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1.25rem', textAlign: 'center' }}>
          <Code2 size={20} color="var(--primary-color)" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Problems Solved</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{solved.length}/{allProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1.25rem', textAlign: 'center' }}>
          <Target size={20} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>{accuracy}%</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1.25rem', textAlign: 'center' }}>
          <Clock size={20} color="#ec4899" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Day Streak</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fbbf24' }}>{streak}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '120px', padding: '1.25rem', textAlign: 'center' }}>
          <Trophy size={20} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Interview Best</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{interviewBest.score !== undefined ? `${interviewBest.score}/3` : 'N/A'}</span>
        </div>
      </div>

      {/* Topic Breakdown Preview */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Topic Breakdown</h4>
        {Object.entries(topicStats).map(([topic, { total, solved: s }]) => (
          <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '120px', fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic}</span>
            <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '3px', width: `${Math.round(s/total*100)}%`, background: 'var(--primary-color)', transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '40px', textAlign: 'right' }}>{s}/{total}</span>
          </div>
        ))}
      </div>

      {/* Export Button */}
      <button
        onClick={exportPDF}
        style={{
          width: '100%', padding: '0.9rem', borderRadius: '12px', border: 'none',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s',
          boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <Download size={18} /> Export as PDF
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        Opens a print-optimized page — use your browser's "Save as PDF" option.
      </p>
    </div>
  );
}
