import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Settings } from '../types';

interface UserState {
  users: User[];
  currentUserId: string | null;
  settings: Settings;

  // Actions
  setCurrentUser: (userId: string) => void;
  updateUserStars: (stars: number) => void;
  updateUserLevel: (level: number) => void;
  unlockTheme: (themeId: string) => void;
  unlockReward: (rewardId: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  getCurrentUser: () => User | null;
}

const defaultUsers: User[] = [
  {
    id: 'leo',
    name: 'Léo',
    avatar: '👦',
    currentLevel: 1,
    totalStars: 0,
    unlockedThemes: ['space'],
    unlockedRewards: [],
    createdAt: new Date(),
  },
  {
    id: 'lilou',
    name: 'Lilou',
    avatar: '👧',
    currentLevel: 1,
    totalStars: 0,
    unlockedThemes: ['space'],
    unlockedRewards: [],
    createdAt: new Date(),
  },
];

const defaultSettings: Settings = {
  sessionDuration: 10,
  soundEnabled: true,
  voiceSensitivity: 0.7,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      currentUserId: null,
      settings: defaultSettings,

      setCurrentUser: (userId) => set({ currentUserId: userId }),

      updateUserStars: (stars) => set((state) => ({
        users: state.users.map((user) =>
          user.id === state.currentUserId
            ? { ...user, totalStars: user.totalStars + stars }
            : user
        ),
      })),

      updateUserLevel: (level) => set((state) => ({
        users: state.users.map((user) =>
          user.id === state.currentUserId
            ? { ...user, currentLevel: level }
            : user
        ),
      })),

      unlockTheme: (themeId) => set((state) => ({
        users: state.users.map((user) =>
          user.id === state.currentUserId && !user.unlockedThemes.includes(themeId)
            ? { ...user, unlockedThemes: [...user.unlockedThemes, themeId] }
            : user
        ),
      })),

      unlockReward: (rewardId) => set((state) => ({
        users: state.users.map((user) =>
          user.id === state.currentUserId && !user.unlockedRewards.includes(rewardId)
            ? { ...user, unlockedRewards: [...user.unlockedRewards, rewardId] }
            : user
        ),
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      getCurrentUser: () => {
        const state = get();
        return state.users.find((u) => u.id === state.currentUserId) || null;
      },
    }),
    {
      name: 'lectofusee-users',
    }
  )
);
