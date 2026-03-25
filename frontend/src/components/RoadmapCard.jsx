import React from 'react';
import { Circle, Clock, Youtube, ExternalLink } from 'lucide-react';
import { getVideosForStep } from '../data/videoRecommendations';

export default function RoadmapCard({ roadmap }) {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h3 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Your Personalized Learning Roadmap
      </h3>
      
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {roadmap.map((step, index) => {
          const videos = getVideosForStep(step.title || '', step.description || '');
          return (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                position: 'relative',
                paddingLeft: '1rem'
              }}
            >
              {/* Timeline Line */}
              {index !== roadmap.length - 1 && (
                <div 
                  style={{
                    position: 'absolute',
                    left: '1.45rem',
                    top: '2rem',
                    bottom: '-1.5rem',
                    width: '2px',
                    background: 'rgba(139, 92, 246, 0.3)',
                  }}
                />
              )}
              
              <div style={{ zIndex: 1, marginTop: '0.25rem' }}>
                <div style={{ background: 'var(--bg-color)', borderRadius: '50%' }}>
                  <Circle size={20} color="var(--primary-color)" fill="rgba(139, 92, 246, 0.2)" />
                </div>
              </div>
              
              <div 
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                    Step {index + 1}: {step.title}
                  </h4>
                  {step.timeEstimate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
                      <Clock size={12} />
                      {step.timeEstimate}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.description}
                </p>

                {/* ── Video Recommendations ── */}
                {videos.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Youtube size={14} color="#ff0000" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Recommended Videos
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {videos.map((video, vi) => (
                        <a
                          key={vi}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 0, 0, 0.1)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.25)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 0, 0, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.1)'; }}
                        >
                          <Youtube size={16} color="#ff4444" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {video.title}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              {video.channel} • {video.duration}
                            </p>
                          </div>
                          <ExternalLink size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
