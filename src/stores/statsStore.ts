import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WordStat, WordAttempt } from '../types';

interface StatsState {
  stats: Record<string, Record<string, WordStat>>; // userId -> wordId -> stats

  // Actions
  recordAttempt: (
    userId: string,
    word: string,
    level: number,
    time: number,
    stars: number,
    correct: boolean
  ) => void;
  getWordStats: (userId: string, word: string) => WordStat | null;
  getUserStats: (userId: string) => WordStat[];
  getProblematicWords: (userId: string, level: number, limit?: number) => string[];
  getWordEvolution: (userId: string, word: string) => WordAttempt[];
  getAverageTimeByLevel: (userId: string, level: number) => number;
  getTotalPracticeTime: (userId: string) => number;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: {},

      recordAttempt: (userId, word, level, time, stars, correct) => {
        set((state) => {
          const userStats = state.stats[userId] || {};
          const wordId = `${level}-${word}`;
          const existingStat = userStats[wordId];

          const attempt: WordAttempt = {
            date: new Date(),
            time,
            stars,
            correct,
          };

          const newStat: WordStat = existingStat
            ? {
                ...existingStat,
                attempts: existingStat.attempts + 1,
                successes: existingStat.successes + (correct ? 1 : 0),
                averageTime: Math.round(
                  (existingStat.averageTime * existingStat.attempts + time) /
                    (existingStat.attempts + 1)
                ),
                bestTime: correct
                  ? Math.min(existingStat.bestTime || Infinity, time)
                  : existingStat.bestTime,
                lastSeenAt: new Date(),
                history: [...existingStat.history, attempt].slice(-50), // Keep last 50
              }
            : {
                odId: wordId,
                word,
                level,
                attempts: 1,
                successes: correct ? 1 : 0,
                averageTime: time,
                bestTime: correct ? time : Infinity,
                lastSeenAt: new Date(),
                history: [attempt],
              };

          return {
            stats: {
              ...state.stats,
              [userId]: {
                ...userStats,
                [wordId]: newStat,
              },
            },
          };
        });
      },

      getWordStats: (userId, word) => {
        const state = get();
        const userStats = state.stats[userId];
        if (!userStats) return null;

        // Search across all levels
        for (const key of Object.keys(userStats)) {
          if (userStats[key].word === word) {
            return userStats[key];
          }
        }
        return null;
      },

      getUserStats: (userId) => {
        const state = get();
        const userStats = state.stats[userId];
        if (!userStats) return [];
        return Object.values(userStats);
      },

      getProblematicWords: (userId, level, limit = 5) => {
        const state = get();
        const userStats = state.stats[userId];
        if (!userStats) return [];

        return Object.values(userStats)
          .filter((stat) => stat.level === level)
          .sort((a, b) => {
            // Sort by success rate (lower = more problematic)
            const rateA = a.successes / a.attempts;
            const rateB = b.successes / b.attempts;
            return rateA - rateB;
          })
          .slice(0, limit)
          .map((stat) => stat.word);
      },

      getWordEvolution: (userId, word) => {
        const stat = get().getWordStats(userId, word);
        return stat?.history || [];
      },

      getAverageTimeByLevel: (userId, level) => {
        const state = get();
        const userStats = state.stats[userId];
        if (!userStats) return 0;

        const levelStats = Object.values(userStats).filter(
          (stat) => stat.level === level
        );
        if (levelStats.length === 0) return 0;

        const totalTime = levelStats.reduce((sum, stat) => sum + stat.averageTime, 0);
        return Math.round(totalTime / levelStats.length);
      },

      getTotalPracticeTime: (userId) => {
        const state = get();
        const userStats = state.stats[userId];
        if (!userStats) return 0;

        return Object.values(userStats).reduce((total, stat) => {
          return total + stat.history.reduce((sum, attempt) => sum + attempt.time, 0);
        }, 0);
      },
    }),
    {
      name: 'lectofusee-stats',
    }
  )
);
