
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Bet } from './types';
import { INITIAL_WALLET, PAYOUTS } from './constants';
import { Header } from './components/Header';
import { BettingBoard } from './components/BettingBoard';
import { DiceArea } from './components/DiceArea';
import { Controls } from './components/Controls';
import { MessagePanel } from './components/MessagePanel';
import { SplashScreen } from './components/SplashScreen';
import { Character } from './components/Character';
import { GoogleGenAI, Modality } from "@google/genai";

const BG_MUSIC_URL = 'https://assets.mixkit.co/music/preview/mixkit-cyberpunk-fashion-627.mp3';
const SFX_CHIP = 'https://assets.mixkit.co/sfx/preview/mixkit-poker-chips-stack-2003.mp3';
const SFX_ROLL = 'https://assets.mixkit.co/sfx/preview/mixkit-dice-roll-on-a-table-2005.mp3';
const SFX_WIN = 'https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3';
const SFX_LOSE = 'https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-623.mp3';
const SFX_CLICK = 'https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChip, setCurrentChip] = useState(10);
  const [gameState, setGameState] = useState<GameState>({
    wallet: INITIAL_WALLET,
    lastRoll: null,
    currentBets: [],
    isRolling: false,
    message: "SYSTEM ONLINE",
    recentWin: 0,
    betMultiplier: 10
  });

  const [aiComment, setAiComment] = useState<string>("The matrix awaits your input.");
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<{ [key: string]: HTMLAudioElement }>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio(BG_MUSIC_URL);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.25;
    sfxRef.current = {
      chip: new Audio(SFX_CHIP),
      roll: new Audio(SFX_ROLL),
      win: new Audio(SFX_WIN),
      lose: new Audio(SFX_LOSE),
      click: new Audio(SFX_CLICK),
    };
    (Object.values(sfxRef.current) as HTMLAudioElement[]).forEach(audio => { audio.volume = 0.5; });
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) bgMusicRef.current.muted = isMuted;
    (Object.values(sfxRef.current) as HTMLAudioElement[]).forEach(audio => { audio.muted = isMuted; });
  }, [isMuted]);

  const playSfx = (key: string) => {
    if (isMuted) return;
    const sound = sfxRef.current[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    playSfx('click');
    setIsMuted(!isMuted);
  };

  const handleStart = () => {
    setGameStarted(true);
    playSfx('click');
    if (bgMusicRef.current) {
      bgMusicRef.current.play().catch(() => {});
    }
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const speakAiComment = async (text: string, isWin: boolean) => {
    if (isMuted || !process.env.API_KEY || !audioContextRef.current) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Speak in a calm, female cybernetic AI voice. Comment: "${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContextRef.current,
          24000,
          1
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (e) {
      console.error("AI Voice error:", e);
    }
  };

  const getAiCommentary = async (sum: number, winAmount: number, totalBet: number) => {
    if (!process.env.API_KEY) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `The player rolled ${sum}. Result: ${winAmount > 0 ? 'Win' : 'Loss'}. Give a short, futuristic "Matrix" style commentary (max 10 words). Mention the grid or data streams.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const comment = response.text || "Analyzing data stream.";
      setAiComment(comment);
      speakAiComment(comment, winAmount > 0);
    } catch (e) {
      console.error("AI Commentary error:", e);
    }
  };

  const placeBet = (value: number) => {
    if (gameState.wallet < currentChip) return;
    playSfx('chip');
    setGameState(prev => {
      const existingBet = prev.currentBets.find(b => b.value === value);
      let newBets;
      if (existingBet) {
        newBets = prev.currentBets.map(b => b.value === value ? { ...b, amount: b.amount + currentChip } : b);
      } else {
        newBets = [...prev.currentBets, { value, amount: currentChip }];
      }
      return {
        ...prev,
        wallet: prev.wallet - currentChip,
        currentBets: newBets,
        message: "STAKE REGISTERED"
      };
    });
  };

  const handleDouble = () => {
    const totalCurrentBet = gameState.currentBets.reduce((acc, b) => acc + b.amount, 0);
    if (gameState.wallet < totalCurrentBet) return;
    playSfx('click');
    playSfx('chip');
    setGameState(prev => ({
      ...prev,
      wallet: prev.wallet - totalCurrentBet,
      currentBets: prev.currentBets.map(b => ({ ...b, amount: b.amount * 2 }))
    }));
  };

  const handleClear = () => {
    const totalCurrentBet = gameState.currentBets.reduce((acc, b) => acc + b.amount, 0);
    playSfx('click');
    setGameState(prev => ({
      ...prev,
      wallet: prev.wallet + totalCurrentBet,
      currentBets: [],
      message: "BUFFER CLEARED"
    }));
  };

  const handleSetChip = (val: number) => {
    setCurrentChip(val);
    setGameState(prev => ({ ...prev, betMultiplier: val }));
    playSfx('click');
  };

  const rollDice = () => {
    if (gameState.currentBets.length === 0 || gameState.isRolling) return;
    playSfx('roll');
    setGameState(prev => ({ ...prev, isRolling: true, message: "EXECUTING ROLL...", recentWin: 0 }));

    setTimeout(async () => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const winningBet = gameState.currentBets.find(b => b.value === sum);
      const totalBet = gameState.currentBets.reduce((acc, b) => acc + b.amount, 0);
      let winAmount = 0;
      
      if (winningBet) {
        winAmount = winningBet.amount * PAYOUTS[sum];
        playSfx('win');
      } else {
        playSfx('lose');
      }

      setGameState(prev => ({
        ...prev,
        isRolling: false,
        lastRoll: [d1, d2],
        wallet: prev.wallet + winAmount,
        recentWin: winAmount,
        currentBets: [],
        message: winAmount > 0 ? `CREDITS ACCREDITED: ${sum}` : `DATA PACKET LOST: ${sum}`
      }));
      getAiCommentary(sum, winAmount, totalBet);
    }, 1500);
  };

  const totalBetAmount = gameState.currentBets.reduce((acc, b) => acc + b.amount, 0);

  if (!gameStarted) {
    return <SplashScreen onStart={handleStart} />;
  }

  return (
    <div className="h-screen matrix-bg text-white font-sans overflow-hidden flex flex-col items-center relative">
      <div className="absolute inset-0 circuit-grid z-0"></div>
      <div className="scanline" />
      
      {/* Floating Tech Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i} 
          className="tech-particle"
          style={{ 
            left: `${Math.random() * 100}%`, 
            bottom: `-20px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 4 + 6}s`,
            opacity: Math.random() * 0.4 + 0.1,
            backgroundColor: Math.random() > 0.5 ? '#22d3ee' : '#a855f7'
          }}
        ></div>
      ))}

      <Header 
        wallet={gameState.wallet} 
        recentWin={gameState.recentWin} 
        isMuted={isMuted} 
        onToggleMute={toggleMute} 
      />

      <div className="z-50 mt-4">
        <MessagePanel message={gameState.message} aiComment={aiComment} />
      </div>

      <div className="relative flex-1 w-full flex flex-col items-center justify-center perspective-table z-10 pt-4">
        
        {/* Holographic Stage */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-10">
          <div className="hologram-effect relative flex flex-col items-center">
            {/* Background Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full"></div>
            <Character className="w-32 md:w-40 h-auto opacity-60 md:opacity-80 scale-90" />
            
            {/* Tech Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-400/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
          </div>
        </div>
        
        {/* Dice area - centered */}
        <div className="relative z-30 mb-[-120px] scale-[0.85] md:scale-100">
          <DiceArea dice={gameState.lastRoll || [4, 6]} isRolling={gameState.isRolling} />
          <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-64 h-12 bg-cyan-400/5 border border-cyan-400/10 rounded-full blur-2xl -z-10 animate-pulse"></div>
        </div>
        
        {/* Betting Board Cards - Fanned as in image */}
        <div className="w-full max-w-6xl h-[320px] md:h-[380px] relative mt-24 scale-[0.8] md:scale-95">
          <div className="absolute inset-0 table-surface">
             <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 via-transparent to-black/40 border-t border-cyan-500/20 rounded-[100%] -z-20"></div>
          </div>

          <BettingBoard 
            currentBets={gameState.currentBets} 
            onPlaceBet={placeBet} 
            disabled={gameState.isRolling} 
            winningSum={gameState.lastRoll ? gameState.lastRoll[0] + gameState.lastRoll[1] : null}
          />
        </div>
      </div>

      {/* Control Panel re-styled */}
      <div className="w-full bg-[#050510]/95 backdrop-blur-3xl border-t border-cyan-900/20 py-4 px-8 z-[60] shadow-[0_-15px_40px_rgba(0,0,0,0.8)] flex-shrink-0 pb-8">
        <Controls 
          onRoll={rollDice}
          onDouble={handleDouble}
          onClear={handleClear}
          isRolling={gameState.isRolling}
          canRoll={gameState.currentBets.length > 0}
          currentBetAmount={totalBetAmount}
          currentChip={currentChip}
          onSetChip={handleSetChip}
        />
      </div>
    </div>
  );
};

export default App;
