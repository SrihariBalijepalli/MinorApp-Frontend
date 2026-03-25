import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Hello! I'm your AI learning assistant. Ask me anything about your skill roadmap!", isUser: false, timestamp: new Date().toISOString() }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: getSimulatedResponse(userMessage.text),
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSimulatedResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('hello') || lowerText.includes('hi')) return "Hello there! How can I help you grow today?";
    if (lowerText.includes('roadmap')) return "To get a roadmap, enter your desired role and current skills in the main dashboard analyzer!";
    if (lowerText.includes('clear')) return "You can clear this chat by clicking the 'Clear' button at the top right of this window.";
    return "That's a great question. You can use this dashboard to master your skills and follow step-by-step roadmaps. Let me know if you need specific help.";
  };

  const clearHistory = () => {
    if (window.confirm('Erase all conversation history?')) {
      setMessages([{ id: 1, text: "Hello! I'm your AI learning assistant. Ask me anything about your skill roadmap!", isUser: false, timestamp: new Date().toISOString() }]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, fontFamily: 'inherit' }}>
      
      <style>{`
        @keyframes chatPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .chat-dot {
          width: 5px; height: 5px; background-color: #94a3b8; border-radius: 50%;
        }
        .chat-scrollbar::-webkit-scrollbar { width: 6px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
      `}</style>
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), #ec4899)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
            transition: 'transform 0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(236, 72, 153, 0.5)' }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.4)' }}
          aria-label="Open AI Chat"
        >
          <MessageCircle size={32} color="white" />
          <Sparkles 
            size={16} 
            color="white" 
            style={{ position: 'absolute', top: '8px', right: '8px', filter: 'drop-shadow(0 0 4px white)' }} 
          />
        </button>
      )}

      {/* Chat Window Overlay */}
      <div 
        className="glass-panel"
        style={{
          width: '380px',
          height: '600px',
          maxHeight: '80vh',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Sleek Header */}
        <div style={{
          padding: '1.25rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 100%)',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)'
            }}>
              <Bot size={22} color="white" />
              <span style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                width: '12px', height: '12px', 
                backgroundColor: 'var(--success)', 
                border: '2px solid #0f172a', borderRadius: '50%' 
              }}></span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>AI Assistant</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                Always here to help <Sparkles size={10} />
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={clearHistory} 
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)',
                fontSize: '0.75rem', cursor: 'pointer', padding: '4px 10px', borderRadius: '12px', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            >
              Clear
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.transform = 'rotate(90deg)'; e.currentTarget.style.background = 'rgba(255,0,0,0.1)' }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'rotate(0)'; e.currentTarget.style.background = 'transparent' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="chat-scrollbar" style={{
          flex: 1,
          padding: '1.25rem 1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'rgba(15, 23, 42, 0.4)'
        }}>
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in" style={{ 
              display: 'flex', 
              justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
              width: '100%'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                maxWidth: '88%',
                flexDirection: msg.isUser ? 'row-reverse' : 'row'
              }}>
                {!msg.isUser && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}>
                    <Bot size={16} color="#c7d2fe" />
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{
                    padding: '0.85rem 1.15rem',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    color: msg.isUser ? 'white' : 'var(--text-primary)',
                    background: msg.isUser ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' : 'rgba(30, 41, 59, 0.9)',
                    border: msg.isUser ? 'none' : '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    borderBottomRightRadius: msg.isUser ? '4px' : '20px',
                    borderBottomLeftRadius: msg.isUser ? '20px' : '4px',
                    boxShadow: msg.isUser ? '0 6px 15px rgba(139, 92, 246, 0.3)' : '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--text-secondary)',
                    textAlign: msg.isUser ? 'right' : 'left',
                    opacity: 0.8
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
               <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '85%' }}>
                 <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}>
                    <Bot size={16} color="#c7d2fe" />
                 </div>
                 <div style={{
                    padding: '1rem',
                    background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    borderBottomLeftRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span className="chat-dot" style={{ animation: 'chatPulse 1.2s infinite 0ms' }}></span>
                    <span className="chat-dot" style={{ animation: 'chatPulse 1.2s infinite 200ms' }}></span>
                    <span className="chat-dot" style={{ animation: 'chatPulse 1.2s infinite 400ms' }}></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="glass-input"
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                paddingRight: '3.5rem',
                borderRadius: '30px',
                fontSize: '0.95rem',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                position: 'absolute',
                right: '6px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, var(--primary-color), #ec4899)' : 'rgba(71, 85, 105, 0.5)',
                border: input.trim() ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                opacity: input.trim() ? 1 : 0.6,
                transform: input.trim() ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.2s ease',
                boxShadow: input.trim() ? '0 4px 10px rgba(139, 92, 246, 0.3)' : 'none'
              }}
            >
              <Send size={16} style={{ marginLeft: '-2px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
