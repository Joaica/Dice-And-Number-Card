
import React from 'react';

interface DiceAreaProps {
  dice: [number, number];
  isRolling: boolean;
}

const Die: React.FC<{ value: number; isRolling: boolean; colorClass: string }> = ({ value, isRolling, colorClass }) => {
  const pips = Array.from({ length: 9 });
  const activePips = [
    [], // 0
    [4], // 1
    [0, 8], // 2
    [0, 4, 8], // 3
    [0, 2, 6, 8], // 4
    [0, 2, 4, 6, 8], // 5
    [0, 2, 3, 5, 6, 8], // 6
  ][value];

  return (
    <div className={`
      relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#0a0a20] via-[#050510] to-black border ${colorClass} rounded-2xl
      shadow-[0_0_30px_rgba(34,211,238,0.1),inset_0_0_15px_rgba(255,255,255,0.02)]
      flex items-center justify-center transform transition-all duration-500
      ${isRolling ? 'animate-[bounce_0.3s_ease-in-out_infinite] scale-110' : 'rotate-[8deg]'}
    `}>
      {/* Die Faces grid */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 w-full h-full p-4 md:p-5 relative z-10">
        {pips.map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 ${activePips.includes(i) ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'bg-white/5'}`} 
          />
        ))}
      </div>
      
      {/* Top Gloss */}
      <div className="absolute top-1 left-1 w-1/2 h-1/3 bg-gradient-to-br from-white/5 to-transparent rounded-tl-xl"></div>
      
      {/* Bottom Glow */}
      <div className="absolute bottom-[-2px] w-[80%] h-[1px] bg-cyan-400/40 blur-sm"></div>
    </div>
  );
};

export const DiceArea: React.FC<DiceAreaProps> = ({ dice, isRolling }) => {
  return (
    <div className={`flex gap-10 md:gap-16 pointer-events-none relative z-50 transition-all duration-700 ${isRolling ? 'translate-y-[-10px]' : 'translate-y-0'}`}>
      <div className="relative group">
        <Die value={dice[0]} isRolling={isRolling} colorClass="border-cyan-400/40" />
        {isRolling && <div className="absolute inset-[-8px] bg-cyan-400/15 blur-xl animate-pulse rounded-full"></div>}
      </div>
      <div className="relative group">
        <Die value={dice[1]} isRolling={isRolling} colorClass="border-purple-500/40" />
        {isRolling && <div className="absolute inset-[-8px] bg-purple-500/15 blur-xl animate-pulse rounded-full"></div>}
      </div>
    </div>
  );
};
