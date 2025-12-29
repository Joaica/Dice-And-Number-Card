
import React from 'react';
import { HelpCircle, Trash2, Zap, Play } from 'lucide-react';

interface ControlsProps {
  onRoll: () => void;
  onDouble: () => void;
  onClear: () => void;
  isRolling: boolean;
  canRoll: boolean;
  currentBetAmount: number;
  currentChip: number;
  onSetChip: (value: number) => void;
}

const CHIP_VALUES = [1, 5, 10, 50, 100];

export const Controls: React.FC<ControlsProps> = ({ 
  onRoll, 
  onDouble, 
  onClear,
  isRolling, 
  canRoll, 
  currentBetAmount,
  currentChip,
  onSetChip
}) => {
  const rollButtonClass = `
    relative overflow-hidden group flex-1 md:flex-none px-10 py-3 rounded-xl flex items-center justify-center transition-all active:scale-95 min-w-[160px] md:min-w-[220px]
    ${isRolling || !canRoll
      ? 'bg-[#0a0a20] text-slate-700 opacity-40 cursor-not-allowed border border-white/5'
      : 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-cyan-400/50'
    }
  `;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-8">
        {/* Futuristic Larger Chip Selector */}
        <div className="flex items-center gap-3 p-1.5 bg-[#050515]/80 border border-cyan-900/40 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          {CHIP_VALUES.map((val) => {
            const isActive = currentChip === val;
            return (
              <button
                key={val}
                onClick={() => onSetChip(val)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300
                  ${isActive 
                    ? 'bg-cyan-500 text-white shadow-[0_0_25px_rgba(34,211,238,0.6)] scale-110 z-10 border-2 border-cyan-200/50' 
                    : 'bg-[#0a0a1a] text-slate-500 border border-cyan-900/30 hover:border-cyan-400/40 hover:bg-[#0f0f25]'
                  }`}
              >
                <span className={`text-[8px] md:text-[10px] font-orbitron font-black mb-[-2px] ${isActive ? 'text-white' : 'text-slate-600'}`}>$</span>
                <span className={`text-base md:text-xl font-orbitron font-black ${isActive ? 'text-white' : 'text-slate-400'}`}>{val}</span>
                
                {isActive && (
                    <div className="absolute inset-0 rounded-full animate-pulse bg-cyan-400/20 blur-md -z-10"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col justify-center min-w-[140px]">
          <span className="text-[9px] md:text-[10px] font-orbitron text-cyan-400 tracking-[0.3em] uppercase mb-1 font-bold">CURRENT STAKE</span>
          <div className="flex items-center gap-4">
             <span className="text-3xl md:text-4xl font-orbitron font-black text-white tracking-tight">
               ${currentBetAmount.toLocaleString()}
             </span>
             <button 
               onClick={onClear}
               disabled={isRolling || currentBetAmount === 0}
               className="p-2 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500/40 hover:bg-red-500/20 hover:text-red-400 transition-all disabled:opacity-5"
               title="Clear current stake"
             >
                <Trash2 size={16} />
             </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          onClick={onDouble}
          disabled={isRolling || !canRoll}
          className="group relative flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#0a0a20]/60 border border-cyan-900/40 rounded-xl hover:border-cyan-500/50 transition-all disabled:opacity-10 active:scale-95"
        >
          <Zap size={16} className="text-cyan-400" />
          <span className="text-[10px] md:text-xs font-orbitron font-black text-slate-300 tracking-[0.2em] uppercase">DOUBLE_DATA</span>
        </button>

        <button
          onClick={onRoll}
          disabled={isRolling || !canRoll}
          className={rollButtonClass}
        >
          <div className="flex items-center gap-3 relative z-10">
            {isRolling ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <Play size={18} fill="white" />
            )}
            <span className="text-sm md:text-base font-black tracking-[0.4em] uppercase font-orbitron">
              {isRolling ? 'RUNNING' : 'EXECUTE'}
            </span>
          </div>
        </button>

        <button className="hidden md:flex w-12 h-12 items-center justify-center rounded-xl bg-[#0a0a20] border border-cyan-900/40 text-slate-600 hover:text-cyan-400 transition-all">
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  );
};
