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
      
      {/* Giant Main Ring */}
      <div className="main-ring-container animate-float-slow">
        <div className="ring-3d main-ring"></div>
        <div className="ring-3d main-ring main-ring-shadow"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="coin-3d float-1" style={{ top: '20%', right: '25%', transform: 'scale(0.8) rotateX(60deg) rotateZ(15deg)' }}></div>
      <div className="coin-3d float-2" style={{ bottom: '15%', left: '30%', transform: 'scale(1.2) rotateX(60deg) rotateZ(-25deg)' }}></div>
      <div className="cylinder-3d float-3" style={{ top: '35%', left: '15%', '--w': '40px', '--h': '160px' }}></div>
      <div className="cylinder-3d float-4" style={{ top: '25%', right: '15%', '--w': '30px', '--h': '120px' }}></div>
      <div className="cylinder-3d float-5" style={{ bottom: '30%', right: '35%', '--w': '20px', '--h': '200px', filter: 'blur(2px)', opacity: 0.6 }}></div>
    </div>
  );
}
