import React from 'react';

export default function FloatingElements() {
  return (
    <div className="floating-environment" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Background radial glow */}
      <div className="bg-glow"></div>

      {/* Volumetric Light Rays */}
      <div className="volumetric-light"></div>
      
      {/* Giant Main Ring */}
      <div className="main-ring-container animate-float-slow">
        <div className="ring-3d main-ring"></div>
        <div className="ring-3d main-ring main-ring-shadow"></div>
      </div>
      
      {/* Second Floating Coin */}
      <div className="coin-3d float-1" style={{ top: '20%', right: '25%', transform: 'scale(0.8) rotateX(60deg) rotateZ(15deg)' }}></div>
      
      {/* Third Floating Coin */}
      <div className="coin-3d float-2" style={{ bottom: '15%', left: '30%', transform: 'scale(1.2) rotateX(60deg) rotateZ(-25deg)' }}></div>

      {/* Cylinders */}
      <div className="cylinder-3d float-3" style={{ top: '35%', left: '15%', '--w': '40px', '--h': '160px' }}></div>
      <div className="cylinder-3d float-4" style={{ top: '25%', right: '15%', '--w': '30px', '--h': '120px' }}></div>
      <div className="cylinder-3d float-5" style={{ bottom: '30%', right: '35%', '--w': '20px', '--h': '200px', filter: 'blur(2px)', opacity: 0.6 }}></div>
    </div>
  );
}
