import type { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'space',
    name: 'Espace',
    backgroundColor: 'from-indigo-900 via-purple-900 to-slate-900',
    character: '🚀',
    unlocked: true, // Débloqué par défaut
  },
  {
    id: 'dinosaurs',
    name: 'Dinosaures',
    backgroundColor: 'from-green-800 via-emerald-900 to-lime-900',
    character: '🦕',
    unlocked: false,
  },
  {
    id: 'animals',
    name: 'Animaux',
    backgroundColor: 'from-amber-700 via-orange-800 to-yellow-900',
    character: '🦁',
    unlocked: false,
  },
  {
    id: 'pokemon',
    name: 'Pokémon',
    backgroundColor: 'from-yellow-500 via-red-600 to-blue-700',
    character: '⚡',
    unlocked: false,
  },
  {
    id: 'numberblocks',
    name: 'Numberblocks',
    backgroundColor: 'from-red-500 via-blue-500 to-green-500',
    character: '🔢',
    unlocked: false,
  },
];

export const themeCosts: Record<string, number> = {
  dinosaurs: 100,
  animals: 150,
  pokemon: 200,
  numberblocks: 250,
};

export function getTheme(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function getUnlockedThemes(unlockedIds: string[]): Theme[] {
  return themes.filter((t) => t.unlocked || unlockedIds.includes(t.id));
}
