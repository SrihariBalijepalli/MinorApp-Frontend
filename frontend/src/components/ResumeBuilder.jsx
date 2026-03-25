import React, { useState, useMemo } from 'react';
import { FileText, Download, User, Briefcase, Award, Code2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import PROBLEM_BANK from '../data/problemBank';

export default function ResumeBuilder({ user }) {
  const [resumeData, setResumeData] = useState({
    phone: '',
    location: '',
    website: '',
    summary: '',
    experience: '',
    education: '',
    projects: ''
  });

  const solved = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('solvedProblems') || '[]'); } catch { return []; }
  }, []);

  const allProblems = useMemo(() => {
    const result = [];
    for (const [difficulty, list] of Object.entries(PROBLEM_BANK)) {
      list.forEach(p => result.push({ ...p, difficulty }));
    }
    return result;
  }, []);

  const topSkills = useMemo(() => {
    const topics = {};
    allProblems.forEach(p => {
      if (solved.includes(p.id) && p.topic) {
        topics[p.topic] = (topics[p.topic] || 0) + 1;
      }
    });
    return Object.entries(topics).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [allProblems, solved]);

  const handleChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const generateResume = () => {
    const accuracy = allProblems.length > 0 ? Math.round((solved.length / allProblems.length) * 100) : 0;

    const html = `
<!DOCTYPE html>
<html>
<head>
<title>Resume - ${user?.fullName || 'Your Name'}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'Arial', sans-serif; color: #1e293b; background: white; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.5; }
  .name { font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  .title { font-size: 16px; color: #8b5cf6; font-weight: 500; margin-bottom: 12px; }
  .contact { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; font-size: 13px; color: #64748b; }
  .contact span { display: flex; align-items: center; gap: 4px; }
  .line { height: 2px; background: linear-gradient(90deg, #8b5cf6, #3b82f6); margin-bottom: 24px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 700; color: #8b5cf6; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
  .content { font-size: 13px; color: #475569; white-space: pre-line; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 12px; font-size: 12px; color: #334155; font-weight: 500; }
  .skill-tag.highlight { background: #ede9fe; border-color: #c4b5fd; color: #7c3aed; }
  .stats { display: flex; gap: 24px; margin-top: 8px; }
  .stat { font-size: 12px; color: #64748b; }
  .stat strong { color: #1e293b; font-size: 14px; }
</style>
</head>
<body>
  <div class="name">${user?.fullName || 'Your Name'}</div>
  <div class="title">${user?.targetRole || 'Software Developer'}</div>
  <div class="contact">
    ${user?.email ? `<span>📧 ${user.email}</span>` : ''}
    ${resumeData.phone ? `<span>📱 ${resumeData.phone}</span>` : ''}
    ${resumeData.location ? `<span>📍 ${resumeData.location}</span>` : ''}
    ${resumeData.website ? `<span>🌐 ${resumeData.website}</span>` : ''}
  </div>
  <div class="line"></div>

  ${resumeData.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="content">${resumeData.summary}</div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-grid">
      ${topSkills.map(s => `<span class="skill-tag highlight">${s}</span>`).join('')}
      ${(user?.skills || '').split(',').filter(Boolean).map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
    </div>
    <div class="stats" style="margin-top: 12px;">
      <div class="stat"><strong>${solved.length}</strong> problems solved</div>
      <div class="stat"><strong>${accuracy}%</strong> accuracy</div>
      <div class="stat"><strong>${topSkills.length}</strong> topics mastered</div>
    </div>
  </div>

  ${resumeData.experience ? `
  <div class="section">
    <div class="section-title">Experience</div>
    <div class="content">${resumeData.experience}</div>
  </div>` : ''}

  ${resumeData.education ? `
  <div class="section">
    <div class="section-title">Education</div>
    <div class="content">${resumeData.education}</div>
  </div>` : ''}

  ${resumeData.projects ? `
  <div class="section">
    <div class="section-title">Projects</div>
    <div class="content">${resumeData.projects}</div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">Coding Achievements</div>
    <div class="content">
• Solved ${solved.length} algorithmic coding challenges across ${topSkills.length} topics
• Achieved ${accuracy}% overall accuracy on the Skill Analyzer platform
• Proficient in topics: ${topSkills.slice(0, 6).join(', ')}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) setTimeout(() => win.print(), 500);
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px',
    border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none',
    transition: 'border-color 0.2s'
  };

  const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical', lineHeight: 1.6 };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Resume Builder</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Auto-generates a professional resume from your profile, skills, and solved problems.
        </p>
      </div>

      {/* Auto-filled section */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <User size={16} color="var(--primary-color)" />
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Auto-Filled from Profile</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
            <div style={{ ...inputStyle, background: 'rgba(139, 92, 246, 0.05)', opacity: 0.8 }}>{user?.fullName || 'N/A'}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Target Role</label>
            <div style={{ ...inputStyle, background: 'rgba(139, 92, 246, 0.05)', opacity: 0.8 }}>{user?.targetRole || 'N/A'}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Email</label>
            <div style={{ ...inputStyle, background: 'rgba(139, 92, 246, 0.05)', opacity: 0.8 }}>{user?.email || 'N/A'}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Proven Skills ({topSkills.length} topics)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {topSkills.slice(0, 5).map(s => (
                <span key={s} style={{ fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.15)', color: '#d8b4fe', padding: '2px 8px', borderRadius: '4px' }}>{s}</span>
              ))}
              {topSkills.length > 5 && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>+{topSkills.length - 5} more</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Briefcase size={16} color="#f59e0b" />
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Additional Details (Optional)</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Phone</label>
            <input style={inputStyle} placeholder="+91 9876543210" value={resumeData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Location</label>
            <input style={inputStyle} placeholder="City, Country" value={resumeData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
          </div>
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Professional Summary</label>
          <textarea style={textareaStyle} placeholder="A brief 2-3 sentence summary about yourself..." value={resumeData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Experience</label>
          <textarea style={textareaStyle} placeholder="Software Developer at XYZ Corp (2023-Present)&#10;- Built REST APIs..." value={resumeData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Education</label>
          <textarea style={textareaStyle} placeholder="B.Tech in Computer Science, Anurag University (2022-2026)&#10;CGPA: 8.5" value={resumeData.education}
            onChange={(e) => handleChange('education', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Projects</label>
          <textarea style={textareaStyle} placeholder="Skill Analyzer Platform&#10;- Built a full-stack career development platform..." value={resumeData.projects}
            onChange={(e) => handleChange('projects', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'} />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateResume}
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
        <FileText size={18} /> Generate & Download Resume
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        Your coding achievements and proven skills are automatically included.
      </p>
    </div>
  );
}
