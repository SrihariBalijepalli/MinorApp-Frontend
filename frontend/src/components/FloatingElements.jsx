import React, { useEffect, useState } from 'react';

export default function FloatingElements() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="floating-environment" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Background radial glow */}
      <div className="bg-glow"></div>

      {/* Perspective Grid Floor */}
      <div className="perspective-grid"></div>

      {/* Volumetric Light Rays */}
      <div className="volumetric-light"></div>
      
      {/* Particle Layers */}
      <div className="particles-layer1"></div>
      <div className="particles-layer2"></div>

      {/* Interactive Cursor Glow */}
      <div 
        style={{
          position: 'absolute',
          top: mousePos.y,
          left: mousePos.x,
          width: '500px',
          height: '500px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 10,
          transition: 'top 0.1s cubic-bezier(0.25, 1, 0.5, 1), left 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      />
      
      {/* Animated Code Syntax Symbols */}
      <div className="syntax-symbol float-1" style={{ top: '15%', left: '10%', fontSize: '5rem' }}>&#123; &#125;</div>
      <div className="syntax-symbol float-2" style={{ top: '25%', right: '15%', fontSize: '4rem' }}>&lt;/&gt;</div>
      <div className="syntax-symbol float-3" style={{ bottom: '20%', left: '20%', fontSize: '4.5rem' }}>[ ]</div>
      <div className="syntax-symbol float-4" style={{ bottom: '15%', right: '10%', fontSize: '3.5rem' }}>( )</div>
      <div className="syntax-symbol float-5" style={{ top: '45%', right: '30%', fontSize: '3rem' }}>=&gt;</div>

      {/* Floating Code Fragments */}
      <div className="code-fragment float-3" style={{ top: '20%', left: '30%' }}>const analyze = () =&gt; &#123;</div>
      <div className="code-fragment float-4" style={{ top: '60%', left: '15%' }}>return user_data;</div>
      <div className="code-fragment float-1" style={{ bottom: '30%', right: '20%' }}>await fetch(api_url);</div>
      <div className="code-fragment float-2" style={{ top: '10%', right: '40%' }}>&lt;Dashboard /&gt;</div>
      <div className="code-fragment float-5" style={{ bottom: '45%', left: '40%' }}>import &#123; Auth &#125; from './api';</div>
    </div>
  );
}
