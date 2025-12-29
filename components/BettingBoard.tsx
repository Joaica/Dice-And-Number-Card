
import React from 'react';
import { POSSIBLE_SUMS, PAYOUTS } from '../constants';
import { Bet } from '../types';

interface BettingBoardProps {
  currentBets: Bet[];
  onPlaceBet: (value: number) => void;
  disabled: boolean;
  winningSum: number | null;
}

const Chip: React.FC<{ color: 'cyan' | 'purple'; offset: number }> = ({ color, offset }) => (
  <div 
    className={`absolute w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/40 shadow-xl transition-all
      ${color === 'cyan' ? 'bg-cyan-600 bg-gradient-to-tr from-cyan-900 via-cyan-500 to-cyan-300' : 'bg-purple-600 bg-gradient-to-tr from-purple-900 via-purple-600 to-purple-400'}
    `}
    style={{ transform: `translateY(-${offset * 4}px) rotateX(25deg) scale(${1 + offset * 0.01})` }}
  >
    <div className="w-full h-full rounded-full border border-black/20 flex items-center justify-center">
      <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[7px] font-orbitron font-black text-white">
        {color === 'cyan' ? 'C' : 'M'}
      </div>
    </div>
  </div>
);

export const BettingBoard: React.FC<BettingBoardProps> = ({ currentBets, onPlaceBet, disabled, winningSum }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
      {POSSIBLE_SUMS.map((sum, index) => {
        const angle = -60 + (index * 12);
        const bet = currentBets.find(b => b.value === sum);
        const isWinner = winningSum === sum;
        
        return (
          <div 
            key={sum}
            className={`absolute card-3d group ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ 
              transform: `rotate(${angle}deg) translateY(180px) rotateX(-20deg)`,
              transformOrigin: '50% -120px',
              zIndex: isWinner ? 200 : index + 10
            }}
            onClick={() => !disabled && onPlaceBet(sum)}
          >
            {isWinner && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 font-orbitron text-cyan-400 font-black glow-winner animate-bounce text-[9px] tracking-[0.2em] whitespace-nowrap bg-black/80 px-4 py-1.5 rounded-full border border-cyan-400/50 z-50">
                // DATA_SYNC_WIN //
              </div>
            )}

            <div className={`
              w-12 h-20 md:w-16 md:h-28 rounded-lg border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300
              ${isWinner 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
                : 'border-cyan-500/20 bg-[#0a0a1a]/90 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'}
            `}>
              {/* Card micro detail */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-400/40"></div>
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-400/40"></div>

              {/* Multiplier Label */}
              <div className="absolute top-1 right-1 text-[6px] font-orbitron text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                x{PAYOUTS[sum]}
              </div>
              
              {/* Main Number - Clean white font as in image */}
              <span className={`text-2xl md:text-3xl font-black font-sans ${isWinner ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-white/80 group-hover:text-white'}`}>
                {sum}
              </span>

              {/* Chip Stacking */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
                {bet && Array.from({ length: Math.min(6, Math.ceil(bet.amount / 10)) }).map((_, i) => (
                  <Chip key={i} color="cyan" offset={i} />
                ))}
                {isWinner && Array.from({ length: 4 }).map((_, i) => (
                  <Chip key={i} color="purple" offset={i + (bet ? Math.ceil(bet.amount / 10) : 0)} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
