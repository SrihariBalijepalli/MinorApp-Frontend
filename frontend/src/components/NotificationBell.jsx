import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Bell, X, Target, Flame, Trophy, Swords, CheckCircle2, BookOpen } from 'lucide-react';

// ─── Generate smart notifications based on user activity ───
function generateNotifications() {
  const notifs = [];
  const now = new Date();
  const today = now.toDateString();

  // 1. Daily Challenge
  const streakData = JSON.parse(localStorage.getItem('dailyStreak') || '{}');
  const streak = streakData.count || 0;
  if (streakData.lastDate !== today) {
    notifs.push({
      id: `daily-${today}`,
      icon: Target,
      iconColor: '#8b5cf6',
      title: 'New Daily Challenge!',
      message: 'A fresh coding problem is waiting for you. Keep your streak alive!',
      time: 'Today',
      type: 'challenge'
    });
  }

  // 2. Streak reminder
  if (streak >= 3) {
    notifs.push({
      id: `streak-${streak}`,
      icon: Flame,
      iconColor: '#f59e0b',
      title: `🔥 ${streak}-Day Streak!`,
      message: `You're on fire! Don't break your ${streak}-day coding streak.`,
      time: 'Ongoing',
      type: 'streak'
    });
  }

  // 3. Problems solved milestones
  const solved = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
  const milestones = [5, 10, 25, 50, 75];
  for (const m of milestones) {
    if (solved.length >= m) {
      notifs.push({
        id: `milestone-${m}`,
        icon: Trophy,
        iconColor: '#10b981',
        title: `${m} Problems Solved!`,
        message: `Congratulations! You've solved ${m} coding problems. Keep going!`,
        time: 'Achievement',
        type: 'milestone'
      });
    }
  }

  // 4. Mock Interview suggestion
  const interviewBest = JSON.parse(localStorage.getItem('mockInterviewBest') || '{}');
  if (solved.length >= 5 && !interviewBest.score) {
    notifs.push({
      id: 'interview-suggest',
      icon: Swords,
      iconColor: '#ec4899',
      title: 'Ready for a Mock Interview?',
      message: 'You\'ve solved enough problems. Try a timed mock interview to test your skills!',
      time: 'Suggestion',
      type: 'suggestion'
    });
  }

  // 5. Bookmarks reminder
  const bookmarks = JSON.parse(localStorage.getItem('bookmarkedProblems') || '[]');
  if (bookmarks.length > 0) {
    const unsolved = bookmarks.filter(id => !solved.includes(id));
    if (unsolved.length > 0) {
      notifs.push({
        id: 'bookmarks-remind',
        icon: BookOpen,
        iconColor: '#fbbf24',
        title: `${unsolved.length} Saved Problems Pending`,
        message: 'You have bookmarked problems you haven\'t solved yet. Give them a try!',
        time: 'Reminder',
        type: 'reminder'
      });
    }
  }

  // 6. Welcome back
  const lastVisit = localStorage.getItem('lastVisitDate');
  if (lastVisit && lastVisit !== today) {
    notifs.push({
      id: `welcome-${today}`,
      icon: CheckCircle2,
      iconColor: '#3b82f6',
      title: 'Welcome Back!',
      message: 'Great to see you again. Pick up where you left off!',
      time: 'Just now',
      type: 'welcome'
    });
  }
  localStorage.setItem('lastVisitDate', today);

  return notifs;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dismissedNotifs') || '[]'); }
    catch { return []; }
  });

  const allNotifs = useMemo(() => generateNotifications(), []);
  const notifications = allNotifs.filter(n => !dismissed.includes(n.id));
  const unreadCount = notifications.length;

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('dismissedNotifs', JSON.stringify(updated));
  };

  const clearAll = () => {
    const updated = [...dismissed, ...notifications.map(n => n.id)];
    setDismissed(updated);
    localStorage.setItem('dismissedNotifs', JSON.stringify(updated));
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: isOpen ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          border: isOpen ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)',
          borderRadius: '10px',
          padding: '0.5rem',
          cursor: 'pointer',
          color: isOpen ? '#d8b4fe' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #ec4899)',
            color: 'white', fontSize: '0.65rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '360px',
          maxHeight: '480px',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Notifications {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({unreadCount})</span>}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={clearAll}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#8b5cf6', fontSize: '0.75rem', fontFamily: 'inherit', fontWeight: 500
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notification Items */}
          {notifications.length === 0 ? (
            <div style={{ padding: '2.5rem 1.25rem', textAlign: 'center' }}>
              <Bell size={32} style={{ opacity: 0.2, marginBottom: '0.75rem', color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>You're all caught up!</p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => {
                const IconComp = notif.icon;
                return (
                  <div
                    key={notif.id}
                    style={{
                      display: 'flex', gap: '0.75rem', padding: '0.9rem 1.25rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s', cursor: 'default',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: `${notif.iconColor}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={18} color={notif.iconColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ margin: '0 0 0.15rem', fontSize: '0.83rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {notif.title}
                      </h5>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(148, 163, 184, 0.6)', marginTop: '0.25rem', display: 'block' }}>
                        {notif.time}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-secondary)', padding: '0.25rem', flexShrink: 0,
                        opacity: 0.5, transition: 'opacity 0.15s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '0.5'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
