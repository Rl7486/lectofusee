import type { Reward } from '../types';

export const rewards: Reward[] = [
  // Thèmes
  {
    id: 'theme-dinosaurs',
    name: 'Thème Dinosaures',
    type: 'theme',
    cost: 100,
    preview: '🦕',
    description: 'Voyage au temps des dinosaures !',
  },
  {
    id: 'theme-animals',
    name: 'Thème Animaux',
    type: 'theme',
    cost: 150,
    preview: '🦁',
    description: 'Safari dans la savane !',
  },
  {
    id: 'theme-pokemon',
    name: 'Thème Pokémon',
    type: 'theme',
    cost: 200,
    preview: '⚡',
    description: 'Attrape-les tous !',
  },
  {
    id: 'theme-numberblocks',
    name: 'Thème Numberblocks',
    type: 'theme',
    cost: 250,
    preview: '🔢',
    description: 'Les blocs mathématiques !',
  },

  // Personnages spéciaux
  {
    id: 'character-rocket-gold',
    name: 'Fusée Dorée',
    type: 'character',
    cost: 75,
    preview: '🌟',
    description: 'Une fusée qui brille !',
  },
  {
    id: 'character-rocket-rainbow',
    name: 'Fusée Arc-en-ciel',
    type: 'character',
    cost: 125,
    preview: '🌈',
    description: 'Une fusée multicolore !',
  },

  // Animations spéciales
  {
    id: 'animation-confetti',
    name: 'Super Confettis',
    type: 'animation',
    cost: 50,
    preview: '🎊',
    description: 'Plus de confettis à chaque victoire !',
  },
  {
    id: 'animation-fireworks',
    name: 'Feux d\'artifice',
    type: 'animation',
    cost: 100,
    preview: '🎆',
    description: 'Des feux d\'artifice explosifs !',
  },
];

export function getReward(id: string): Reward | undefined {
  return rewards.find((r) => r.id === id);
}

export function getAvailableRewards(unlockedIds: string[]): Reward[] {
  return rewards.filter((r) => !unlockedIds.includes(r.id));
}

export function canAfford(stars: number, cost: number): boolean {
  return stars >= cost;
}
