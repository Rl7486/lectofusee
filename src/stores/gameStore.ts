import { create } from 'zustand';
import type { GameSession, Screen } from '../types';

interface GameState {
  currentScreen: Screen;
  currentSession: GameSession | null;
  currentWordIndex: number;
  currentAttempt: number;
  sessionStartTime: number | null;
  wordStartTime: number | null;
  selectedTheme: string;
  selectedLevel: number;

  // Actions
  setScreen: (screen: Screen) => void;
  startSession: (userId: string, level: number, theme: string, words: string[]) => void;
  recordWordResult: (word: string, responseTime: number, stars: number, skipped: boolean) => void;
  nextWord: () => void;
  incrementAttempt: () => void;
  resetAttempt: () => void;
  endSession: () => void;
  setSelectedTheme: (theme: string) => void;
  setSelectedLevel: (level: number) => void;
  startWordTimer: () => void;
  getElapsedWordTime: () => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'home',
  currentSession: null,
  currentWordIndex: 0,
  currentAttempt: 1,
  sessionStartTime: null,
  wordStartTime: null,
  selectedTheme: 'space',
  selectedLevel: 1,

  setScreen: (screen) => set({ currentScreen: screen }),

  startSession: (userId, level, theme, words) => {
    const session: GameSession = {
      userId,
      level,
      theme,
      startedAt: new Date(),
      words: words.map((word) => ({
        word,
        responseTime: 0,
        attempts: 0,
        stars: 0,
        skipped: false,
      })),
      totalStars: 0,
      completed: false,
    };
    set({
      currentSession: session,
      currentWordIndex: 0,
      currentAttempt: 1,
      sessionStartTime: Date.now(),
      wordStartTime: Date.now(),
    });
  },

  recordWordResult: (_word, responseTime, stars, skipped) => {
    set((state) => {
      if (!state.currentSession) return state;

      const updatedWords = state.currentSession.words.map((w, i) =>
        i === state.currentWordIndex
          ? { ...w, responseTime, stars, skipped, attempts: state.currentAttempt }
          : w
      );

      return {
        currentSession: {
          ...state.currentSession,
          words: updatedWords,
          totalStars: state.currentSession.totalStars + stars,
        },
      };
    });
  },

  nextWord: () => {
    set((state) => ({
      currentWordIndex: state.currentWordIndex + 1,
      currentAttempt: 1,
      wordStartTime: Date.now(),
    }));
  },

  incrementAttempt: () => {
    set((state) => ({
      currentAttempt: state.currentAttempt + 1,
    }));
  },

  resetAttempt: () => {
    set({ currentAttempt: 1 });
  },

  endSession: () => {
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, completed: true }
        : null,
    }));
  },

  setSelectedTheme: (theme) => set({ selectedTheme: theme }),

  setSelectedLevel: (level) => set({ selectedLevel: level }),

  startWordTimer: () => set({ wordStartTime: Date.now() }),

  getElapsedWordTime: () => {
    const { wordStartTime } = get();
    if (!wordStartTime) return 0;
    return Date.now() - wordStartTime;
  },
}));
