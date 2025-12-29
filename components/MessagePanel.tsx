
import React from 'react';

interface MessagePanelProps {
  message: string;
  aiComment: string;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({ message, aiComment }) => {
  return (
    <div className="text-center z-50 pointer-events-none w-full max-w-2xl px-4 flex flex-col items-center">
      <div className="relative inline-block px-12 py-2.5 bg-[#050510]/80 backdrop-blur-xl border border-cyan-900/30 rounded-md mb-3 shadow-[0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Micro detail line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <h2 className={`text-sm md:text-base font-orbitron font-black tracking-[0.5em] uppercase ${message.includes('WIN') || message.includes('ACCREDITED') ? 'text-cyan-400 glow-winner' : 'text-cyan-200/80'}`}>
          {message}
        </h2>
      </div>
      
      <div className="flex flex-col items-center gap-1.5 max-w-md">
        <div className="w-16 h-[1px] bg-cyan-400/20"></div>
        <p className="text-[9px] md:text-[10px] font-mono text-cyan-400/60 font-medium uppercase tracking-[0.2em] italic">
          <span className="text-cyan-500 font-bold mr-1.5">// AI_SYSTEM:</span>
          "{aiComment}"
        </p>
      </div>
    </div>
  );
};
