// Base de mots organisée par niveau - Méthode Kit et Siam (graphémique)
// Progression des graphèmes de simple vers complexe

export const wordsByLevel: Record<number, string[]> = {
  // Niveau 1 : Voyelles simples (a, i, o, u, e, é)
  1: [
    'a', 'i', 'o', 'u', 'e', 'y',
    'ai', 'ou', 'au', 'eau',
    'ami', 'api', 'île', 'une',
    'été', 'épée', 'idée', 'année',
    'abri', 'épi', 'otarie', 'opéra',
  ],

  // Niveau 2 : Consonnes continues + voyelles (l, r, m, s, f, v)
  2: [
    'la', 'le', 'li', 'lo', 'lu',
    'ma', 'me', 'mi', 'mo', 'mu',
    'ra', 're', 'ri', 'ro', 'ru',
    'sa', 'se', 'si', 'so', 'su',
    'fa', 'fe', 'fi', 'fo', 'fu',
    'va', 've', 'vi', 'vo', 'vu',
    'ami', 'rue', 'mur', 'fur', 'sur',
    'sol', 'fil', 'vol', 'mal', 'sel',
    'lama', 'lime', 'lune', 'rame', 'rose',
    'mare', 'mère', 'père', 'sera', 'fée',
    'vélo', 'vase', 'visa', 'sofa', 'mousse',
  ],

  // Niveau 3 : Consonnes occlusives (p, t, d, b, n)
  3: [
    'pa', 'pe', 'pi', 'po', 'pu',
    'ta', 'te', 'ti', 'to', 'tu',
    'da', 'de', 'di', 'do', 'du',
    'ba', 'be', 'bi', 'bo', 'bu',
    'na', 'ne', 'ni', 'no', 'nu',
    'papa', 'papi', 'pipe', 'tape', 'tête',
    'date', 'dune', 'dame', 'bébé', 'robe',
    'tube', 'note', 'nid', 'mine', 'lune',
    'banane', 'tomate', 'domino', 'minute', 'nature',
    'patate', 'salade', 'pantalon', 'animal', 'numéro',
  ],

  // Niveau 4 : Consonnes c/k, g, ch, j
  4: [
    'ca', 'co', 'cu', 'que', 'qui',
    'ga', 'go', 'gu', 'gue', 'gui',
    'cha', 'che', 'chi', 'cho', 'chu',
    'ja', 'je', 'ji', 'jo', 'ju',
    'car', 'cave', 'café', 'cube', 'coq',
    'gare', 'gâteau', 'gomme', 'légume', 'figure',
    'chat', 'chien', 'chose', 'riche', 'vache',
    'joli', 'jupe', 'jour', 'jardin', 'jeu',
    'garage', 'cabane', 'cochon', 'machine', 'jambon',
    'chocolat', 'guitare', 'camion', 'journal', 'magique',
  ],

  // Niveau 5 : Syllabes inversées (consonne-voyelle-consonne)
  5: [
    'arc', 'art', 'air', 'or', 'os',
    'mer', 'ver', 'fer', 'par', 'car',
    'fil', 'bol', 'col', 'sol', 'mal',
    'pic', 'sac', 'bac', 'lac', 'roc',
    'bus', 'dur', 'mur', 'sur', 'pur',
    'carte', 'porte', 'forme', 'ferme', 'terme',
    'partir', 'sortir', 'dormir', 'servir', 'mordre',
    'parler', 'porter', 'former', 'marcher', 'chercher',
    'escargot', 'parfum', 'surprise', 'costume', 'palmier',
  ],

  // Niveau 6 : Sons complexes (ou, oi, on, an/en)
  6: [
    'ou', 'où', 'oui', 'nous', 'vous',
    'oi', 'roi', 'moi', 'toi', 'foi',
    'on', 'bon', 'ton', 'son', 'mon',
    'an', 'en', 'pan', 'van', 'ban',
    'loup', 'coup', 'tout', 'bout', 'goût',
    'bois', 'voix', 'trois', 'froid', 'droit',
    'pont', 'rond', 'long', 'blond', 'front',
    'dent', 'vent', 'temps', 'grand', 'blanc',
    'mouton', 'bouton', 'ballon', 'chanson', 'maison',
    'poisson', 'boisson', 'croissant', 'enfant', 'éléphant',
  ],

  // Niveau 7 : Sons complexes (in/ain, eu/oeu, au/eau)
  7: [
    'in', 'fin', 'pin', 'vin', 'lin',
    'ain', 'main', 'pain', 'bain', 'nain',
    'eu', 'peu', 'feu', 'jeu', 'bleu',
    'oeu', 'boeuf', 'oeuf', 'coeur', 'soeur',
    'au', 'eau', 'beau', 'peau', 'veau',
    'lapin', 'sapin', 'matin', 'jardin', 'dessin',
    'copain', 'demain', 'certain', 'terrain', 'vilain',
    'heure', 'peur', 'fleur', 'couleur', 'odeur',
    'cheveu', 'neveu', 'milieu', 'adieu', 'monsieur',
    'bateau', 'gâteau', 'château', 'manteau', 'oiseau',
  ],

  // Niveau 8 : Consonnes doubles et groupes complexes
  8: [
    'bl', 'cl', 'fl', 'gl', 'pl',
    'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'vr',
    'blanc', 'bleu', 'clé', 'classe', 'fleur',
    'glace', 'plume', 'plage', 'blond', 'clou',
    'bras', 'crabe', 'drap', 'fraise', 'grand',
    'prise', 'train', 'vrai', 'livre', 'arbre',
    'table', 'sable', 'stable', 'double', 'tremble',
    'exemple', 'simple', 'temple', 'peuple', 'couple',
    'spectacle', 'obstacle', 'rectangle', 'triangle', 'cercle',
  ],

  // Niveau 9 : Sons spéciaux (gu, ge, gn, ill, ail, eil)
  9: [
    'gue', 'gui', 'gué', 'guerre', 'guitare',
    'ge', 'gi', 'gy', 'page', 'cage',
    'gn', 'ligne', 'signe', 'vigne', 'montagne',
    'ill', 'fille', 'bille', 'grille', 'vanille',
    'ail', 'rail', 'travail', 'soleil', 'réveil',
    'eil', 'abeille', 'oreille', 'merveille', 'corbeille',
    'guépard', 'baguette', 'guirlande', 'pirogue', 'figure',
    'pigeon', 'plongeon', 'bourgeon', 'champignon', 'compagnon',
    'papillon', 'coquillage', 'maquillage', 'habillage', 'brouillard',
  ],

  // Niveau 10 : Mots complexes et lecture fluide
  10: [
    'aujourd\'hui', 'beaucoup', 'maintenant', 'quelquefois', 'longtemps',
    'bibliothèque', 'dinosaure', 'extraordinaire', 'magnifique', 'merveilleux',
    'appartement', 'gouvernement', 'développement', 'environnement', 'événement',
    'communication', 'imagination', 'concentration', 'organisation', 'présentation',
    'tranquillement', 'naturellement', 'certainement', 'heureusement', 'malheureusement',
    'internationale', 'professionnelle', 'traditionnelle', 'exceptionnelle', 'sensationnelle',
    'hippopotame', 'rhinocéros', 'crocodile', 'tyrannosaure', 'vélociraptor',
    'mathématiques', 'scientifique', 'géographique', 'fantastique', 'automatique',
    'anniversaire', 'extraordinaire', 'spectaculaire', 'documentaire', 'vocabulaire',
  ],
};

// Fonction pour obtenir les mots d'un niveau
export function getWordsForLevel(level: number): string[] {
  return wordsByLevel[level] || [];
}

// Fonction pour obtenir un mix de mots (nouveaux + révision)
export function getSessionWords(
  level: number,
  count: number = 15,
  problematicWords: string[] = []
): string[] {
  const levelWords = getWordsForLevel(level);
  const availableWords = [...levelWords];

  // Ajouter des mots des niveaux précédents pour révision
  if (level > 1) {
    const previousLevelWords = getWordsForLevel(level - 1);
    availableWords.push(...previousLevelWords.slice(0, 10));
  }

  // Mélanger les mots
  const shuffled = availableWords.sort(() => Math.random() - 0.5);

  // Priorité aux mots problématiques
  const result: string[] = [];
  const problematicSet = new Set(problematicWords);

  // D'abord les mots problématiques
  for (const word of shuffled) {
    if (problematicSet.has(word) && result.length < count) {
      result.push(word);
    }
  }

  // Compléter avec d'autres mots
  for (const word of shuffled) {
    if (!result.includes(word) && result.length < count) {
      result.push(word);
    }
  }

  // Mélanger à nouveau pour ne pas avoir tous les problématiques au début
  return result.sort(() => Math.random() - 0.5);
}

// Total de mots disponibles
export function getTotalWordCount(): number {
  return Object.values(wordsByLevel).reduce((sum, words) => sum + words.length, 0);
}

// Obtenir le nombre de mots par niveau
export function getWordCountByLevel(level: number): number {
  return (wordsByLevel[level] || []).length;
}
