// Profil utilisateur
export interface User {
  id: string;
  name: string;
  avatar: string;
  currentLevel: number;
  totalStars: number;
  unlockedThemes: string[];
  unlockedRewards: string[];
  createdAt: Date;
}

// Statistiques par mot
export interface WordStat {
  odId: string;
  word: string;
  level: number;
  attempts: number;
  successes: number;
  averageTime: number;
  bestTime: number;
  lastSeenAt: Date;
  history: WordAttempt[];
}

export interface WordAttempt {
  date: Date;
  time: number;
  stars: number;
  correct: boolean;
}

// Session de jeu
export interface GameSession {
  userId: string;
  level: number;
  theme: string;
  startedAt: Date;
  words: SessionWord[];
  totalStars: number;
  completed: boolean;
}

export interface SessionWord {
  word: string;
  responseTime: number;
  attempts: number;
  stars: number;
  skipped: boolean;
}

// Récompense
export interface Reward {
  id: string;
  name: string;
  type: 'theme' | 'character' | 'animation' | 'sound';
  cost: number;
  preview: string;
  description: string;
}

// Thème visuel
export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  character: string;
  unlocked: boolean;
}

// Mot dans la base de données
export interface Word {
  id: string;
  text: string;
  level: number;
  category?: string;
  phonetic?: string;
}

// Résultat du matching phonétique
export interface MatchResult {
  isCorrect: boolean;
  isAlmost: boolean;
  confidence: number;
  feedback: string;
}

// État de la reconnaissance vocale
export interface SpeechState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

// Screen types
export type Screen = 'home' | 'game' | 'result' | 'shop' | 'parent' | 'levelSelect';

// Paramètres
export interface Settings {
  sessionDuration: number; // minutes
  soundEnabled: boolean;
  voiceSensitivity: number; // 0-1
}
