export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  partnerId?: string | null;
  avatar?: {
    icon: string;
    color: string;
    bg: string;
  };
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'date' | 'call' | 'visit' | 'anniversary' | 'other';
  userId: string;
  createdAt: Date;
  shared?: boolean;
}

export interface Emotion {
  id: string;
  type: string;
  createdAt: Date;
  userId: string;
  userName?: string;
}

export interface TicTacToeGame {
  id: string;
  board: string[];
  currentTurn: string;
  createdAt: Date;
  creatorId: string;
  players: string[];
  status: 'active' | 'won' | 'lost' | 'draw';
  winner?: string | null;
}

export interface WordleGame {
  id: string;
  word: string;
  guesses: string[];
  createdAt: Date;
  createdBy: string;
  status: 'active' | 'won' | 'lost';
  players: string[];
  maxGuesses: number;
}

export interface WordleGuess {
  letter: string;
  status: 'correct' | 'present' | 'absent';
} 