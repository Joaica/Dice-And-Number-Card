
export interface Bet {
  value: number;
  amount: number;
}

export interface GameState {
  wallet: number;
  lastRoll: [number, number] | null;
  currentBets: Bet[];
  isRolling: boolean;
  message: string;
  recentWin: number;
  betMultiplier: number;
}

export interface DieProps {
  value: number;
  isRolling: boolean;
}
