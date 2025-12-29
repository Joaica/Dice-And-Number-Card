
import React, { useEffect, useState } from 'react';
import { DiceArea } from './DiceArea';
import { POSSIBLE_SUMS } from '../constants';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate random floating tech-dust particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100 + 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 12 + 8}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510] overflow-hidden cursor-pointer group select-none" 
      onClick={onStart}
    >
      {/* Background Neon Corridor Simulation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b3e] via-[#050510] to-[#0c0a1a]"></div>
        
        {/* Neon Light Pillars (Corridor Effect) */}
        <div className="absolute top-0 left-1/4 w-32 h-full bg-blue-500/5 blur-[80px] -rotate-12"></div>
        <div className="absolute top-0 right-1/4 w-32 h-full bg-purple-500/5 blur-[80px] rotate-12"></div>
        
        {/* Floor Reflection */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
        
        {/* Grid Floor */}
        <div className="absolute inset-0 opacity-10 circuit-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
      </div>

      <div className="scanline" />

      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            backgroundColor: Math.random() > 0.5 ? '#22d3ee' : '#a855f7',
            boxShadow: `0 0 8px ${Math.random() > 0.5 ? '#22d3ee' : '#a855f7'}`
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl transition-transform duration-700 group-hover:scale-[1.01]">
        
        {/* Main Title - Resized to be smaller and more elegant */}
        <div className="mb-10 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-center leading-tight font-sans uppercase">
                <span className="text-[#a5f3fc] drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter brightness-125">DICE AND</span>
                <br />
                <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">NUMBER CARDS</span>
            </h1>
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent mt-4"></div>
        </div>

        {/* Central Dice Stage with Holographic Rings */}
        <div className="relative h-48 md:h-64 flex items-center justify-center scale-100 md:scale-110 mb-12">
            <DiceArea dice={[4, 6]} isRolling={false} />
            
            {/* Holographic Table/Ring Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[280px] md:h-[280px]">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-cyan-400/5 blur-[80px] rounded-full animate-pulse"></div>
              
              {/* Rotating Tech Rings */}
              <div className="absolute inset-0 border border-cyan-400/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-4 border border-dashed border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 border border-cyan-400/10 rounded-full"></div>
              
              {/* Center Platform */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_70%)] rounded-full"></div>
            </div>
        </div>

        {/* Fanned Cards Display */}
        <div className="relative w-full h-32 md:h-48 flex items-center justify-center perspective-table">
          {POSSIBLE_SUMS.map((sum, index) => {
            const angle = -50 + (index * 10);
            return (
              <div 
                key={sum}
                className="absolute w-10 h-16 md:w-20 md:h-32 border-2 border-cyan-500/20 bg-[#0a0a1a] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:-translate-y-2 group-hover:translate-y-[-4px]"
                style={{ 
                  transformOrigin: '50% 300px',
                  transform: `rotate(${angle}deg) translateY(0px) rotateX(20deg)`,
                  zIndex: index,
                  transitionDelay: `${index * 20}ms`
                }}
              >
                <span className="text-lg md:text-3xl font-black text-white/80 font-sans tracking-tighter">{sum}</span>
                
                {/* Micro Detail corner accents */}
                <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-cyan-400/30"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-cyan-400/30"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Prompt */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="px-6 py-2 border border-cyan-400/20 bg-cyan-400/5 rounded-full backdrop-blur-sm animate-pulse">
          <p className="text-cyan-300 font-orbitron text-[10px] md:text-xs tracking-[0.4em] uppercase">
            // CLICK TO ENTER THE MATRIX //
          </p>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-12 left-12 w-20 h-20 border-l-2 border-t-2 border-cyan-400/30"></div>
      <div className="absolute top-12 right-12 w-20 h-20 border-r-2 border-t-2 border-purple-500/30"></div>
      <div className="absolute bottom-12 left-12 w-20 h-20 border-l-2 border-b-2 border-purple-500/30"></div>
      <div className="absolute bottom-12 right-12 w-20 h-20 border-r-2 border-b-2 border-cyan-400/30"></div>
    </div>
  );
};
