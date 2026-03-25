import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Code2, LogOut, User } from 'lucide-react';

import AnalysisForm from '../components/AnalysisForm';
import RoadmapCard from '../components/RoadmapCard';
import ProgressTracker from '../components/ProgressTracker';
import PracticeProblems from '../components/PracticeProblems';
import Chatbot from '../components/Chatbot';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      return JSON.parse(saved);
    } catch(e) { return null; }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [roadmapData, setRoadmapData] = useState(() => {
    try {
      const saved = localStorage.getItem('roadmapData');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  const [analysisMetrics, setAnalysisMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem('analysisMetrics');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : null;
    } catch(e) { return null; }
  });
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('progress');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'home';
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => { localStorage.setItem('roadmapData', JSON.stringify(roadmapData)); }, [roadmapData]);
  useEffect(() => { localStorage.setItem('analysisMetrics', JSON.stringify(analysisMetrics)); }, [analysisMetrics]);
  useEffect(() => { localStorage.setItem('progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('activeTab', activeTab); }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  const handleAnalysisResult = (data) => {
    if (data) {
      setAnalysisMetrics({
        gapPercentage: data.gapPercentage,
        missingSkills: data.missingSkills,
        requiredSkills: data.requiredSkills
      });

      if (data.roadmap) {
        // Parse Map<String, List<String>> into a flat array of steps
        const formattedRoadmap = [];
        let stepId = 1;

        for (const [skill, steps] of Object.entries(data.roadmap)) {
          formattedRoadmap.push({
            id: `skill-${stepId++}`,
            title: `Master ${skill}`,
            description: `Learning Path: ${steps.join(', ')}`,
            timeEstimate: 'In Progress'
          });
        }
        setRoadmapData(formattedRoadmap);
      }
    }
  };

  const toggleProgress = async (id) => {
    const isCompleted = !progress[id];
    
    setProgress(prev => ({
      ...prev,
      [id]: isCompleted
    }));

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skillName: id, 
          completionPercentage: isCompleted ? 100 : 0 
        })
      });
    } catch (error) {
      console.error('Failed to sync progress to backend:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside 
        style={{ 
          width: '280px', 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem'
        }}
      >
        <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>Skill Analyzer</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            className={`glass-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'home' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              border: activeTab === 'home' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              color: activeTab === 'home' ? '#d8b4fe' : 'var(--text-secondary)',
              boxShadow: 'none'
            }}
          >
            <LayoutDashboard size={20} />
            Roadmap Generator
          </button>

          <button 
            className={`glass-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'progress' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              border: activeTab === 'progress' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              color: activeTab === 'progress' ? '#d8b4fe' : 'var(--text-secondary)',
              boxShadow: 'none'
            }}
          >
            <CheckCircle size={20} />
            My Progress
          </button>

          <button 
            className={`glass-button ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
            style={{ 
              justifyContent: 'flex-start', 
              background: activeTab === 'practice' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              border: activeTab === 'practice' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              color: activeTab === 'practice' ? '#d8b4fe' : 'var(--text-secondary)',
              boxShadow: 'none'
            }}
          >
            <Code2 size={20} />
            Practice
          </button>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          {/* Logout button moved to profile dropdown */}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <header 
          style={{ 
            height: '80px', 
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 2rem',
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(8px)',
            position: 'relative',
            zIndex: 50
          }}
        >
          <div style={{ position: 'relative' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: isDropdownOpen ? 'scale(1.1)' : 'scale(1)' }}>
                <User size={20} color="var(--primary-color)" />
              </div>
            </div>
            
            {isDropdownOpen && (
              <div 
                className="glass-panel animate-fade-in"
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: '0.5rem',
                  minWidth: '200px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 100
                }}
              >
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/edit-profile'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', border: 'none', color: 'var(--text-primary)',
                    padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                    textAlign: 'left', width: '100%', transition: 'background 0.2s',
                    fontFamily: 'inherit', fontSize: '0.9rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <User size={16} /> Edit Profile
                </button>
                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }}></div>
                <button
                  onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', border: 'none', color: 'var(--danger)',
                    padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                    textAlign: 'left', width: '100%', transition: 'background 0.2s',
                    fontFamily: 'inherit', fontSize: '0.9rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          {activeTab === 'home' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Skill Analysis & Roadmap</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Enter your desired role and current skills to get a personalized roadmap.</p>
              </div>
              <AnalysisForm onResult={handleAnalysisResult} />
              
              {analysisMetrics && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }} className="animate-fade-in">
                  <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Skill Gap</h4>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>
                      {Math.round(analysisMetrics.gapPercentage)}%
                    </span>
                  </div>
                  <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Missing Skills</h4>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                      {analysisMetrics.missingSkills?.length || 0}
                    </span>
                  </div>
                  <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Required Skills</h4>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                      {analysisMetrics.requiredSkills?.length || 0}
                    </span>
                  </div>
                </div>
              )}

              <RoadmapCard roadmap={roadmapData} />
            </div>
          )}

          {activeTab === 'progress' && (
            <ProgressTracker 
              roadmap={roadmapData} 
              progress={progress} 
              toggleProgress={toggleProgress} 
            />
          )}

          {activeTab === 'practice' && (
            <PracticeProblems userRole={user?.targetRole || 'General'} />
          )}

        </div>
      </main>

      <Chatbot />
    </div>
  );
}
