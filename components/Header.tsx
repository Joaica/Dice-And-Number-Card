
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  wallet: number;
  recentWin: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wallet, recentWin, isMuted, onToggleMute }) => {
  return (
    <div className="w-full flex items-start justify-between p-4 md:p-6 z-40">
      <div className="flex flex-col gap-2">
        <button 
          onClick={onToggleMute}
          className="p-2 rounded-full bg-slate-900/50 border border-cyan-900/30 text-slate-500 hover:text-cyan-400 transition-all pointer-events-auto"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        {recentWin > 0 && (
          <span className="text-cyan-400 font-orbitron text-[8px] animate-pulse tracking-[0.3em] uppercase">
            SYNC_PROFIT: +${recentWin}
          </span>
        )}
      </div>

      <div className="flex flex-col items-end pointer-events-none">
        <span className="text-[8px] font-orbitron text-cyan-500/50 tracking-[0.2em] uppercase">SYSTEM CREDITS</span>
        <span className="text-2xl md:text-3xl font-orbitron font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          ${wallet.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
