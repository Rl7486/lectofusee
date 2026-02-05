import type { MatchResult } from '../types';

// Groupes de sons équivalents en français
// Chaque groupe contient des graphies qui se prononcent pareil
const PHONETIC_GROUPS: string[][] = [
  // Son /o/
  ['eau', 'au', 'o', 'oh', 'ô', 'aux', 'eaux', 'ot', 'os', 'op'],
  // Son /e/ fermé
  ['é', 'ée', 'er', 'ez', 'et', 'ai', 'ei', 'ais'],
  // Son /ɛ/ ouvert
  ['è', 'ê', 'e', 'ai', 'ei', 'ait', 'aie'],
  // Son /ã/
  ['an', 'en', 'am', 'em', 'ant', 'ent', 'ans', 'ens'],
  // Son /ɔ̃/
  ['on', 'om', 'ont', 'ons'],
  // Son /ɛ̃/
  ['in', 'ain', 'ein', 'im', 'aim', 'un', 'um', 'yn', 'ym'],
  // Son /u/
  ['ou', 'oo', 'ou', 'oû', 'ous', 'out', 'oux'],
  // Son /wa/
  ['oi', 'oie', 'ois', 'oit', 'oix', 'oy'],
  // Son /f/
  ['f', 'ph', 'ff'],
  // Son /k/
  ['c', 'k', 'qu', 'q', 'ck', 'ch'],
  // Son /s/
  ['s', 'ss', 'c', 'ç', 'sc', 'ti'],
  // Son /z/
  ['z', 's', 'zz'],
  // Son /ʒ/
  ['j', 'g', 'ge'],
  // Son /ɲ/
  ['gn', 'ni'],
  // Son /j/ (yod)
  ['ill', 'il', 'y', 'i', 'ille'],
];

// Convertit un texte en sa forme phonétique simplifiée
function toPhonetic(text: string): string {
  let result = text.toLowerCase();

  // Trier les groupes par longueur décroissante pour matcher les plus longs d'abord
  const sortedGroups = PHONETIC_GROUPS.map(group =>
    [...group].sort((a, b) => b.length - a.length)
  );

  for (const group of sortedGroups) {
    const canonical = group[group.length - 1]; // Le plus court comme forme canonique
    for (const variant of group) {
      if (variant !== canonical && result.includes(variant)) {
        result = result.replace(new RegExp(variant, 'g'), canonical);
      }
    }
  }

  return result;
}

// Substitutions directes pour cas spéciaux
const DIRECT_EQUIVALENTS: Record<string, string[]> = {
  'eau': ['o', 'oh', 'au'],
  'et': ['é', 'ai'],
  'est': ['é', 'ai', 'e'],
  'les': ['lé', 'lai'],
  'des': ['dé', 'dai'],
  'mes': ['mé', 'mai'],
  'tes': ['té', 'tai'],
  'ses': ['sé', 'sai'],
};

// Distance de Levenshtein
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Normalise un texte (minuscules, suppression accents pour comparaison)
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z]/g, ''); // Garde uniquement les lettres
}

// Génère toutes les variations phonétiques d'un mot
function getPhoneticVariations(text: string): string[] {
  const variations = new Set<string>();
  variations.add(text);
  variations.add(toPhonetic(text));

  // Ajouter les équivalents directs
  for (const [word, equivalents] of Object.entries(DIRECT_EQUIVALENTS)) {
    if (text === word) {
      equivalents.forEach(eq => variations.add(eq));
    }
    if (equivalents.includes(text)) {
      variations.add(word);
      equivalents.forEach(eq => variations.add(eq));
    }
  }

  // Générer des variations avec les groupes phonétiques
  for (const group of PHONETIC_GROUPS) {
    for (const variant of group) {
      if (text.includes(variant)) {
        for (const replacement of group) {
          if (replacement !== variant) {
            variations.add(text.replace(new RegExp(variant, 'g'), replacement));
          }
        }
      }
    }
  }

  return [...variations];
}

// Extrait le "squelette" consonantique d'un mot (consonnes principales)
function getConsonantSkeleton(text: string): string {
  return text.replace(/[aeiouyàâäéèêëïîôùûü]/g, '').replace(/(.)\1+/g, '$1');
}

// Vérifie si deux mots sont phonétiquement similaires pour un enfant
function arePhoneticallySimilar(spoken: string, expected: string): boolean {
  // Si l'un contient l'autre
  if (spoken.includes(expected) || expected.includes(spoken)) {
    return true;
  }

  // Comparer les squelettes consonantiques
  const spokenSkeleton = getConsonantSkeleton(spoken);
  const expectedSkeleton = getConsonantSkeleton(expected);

  if (spokenSkeleton === expectedSkeleton) {
    return true;
  }

  // Pour les mots courts, vérifier si les consonnes principales sont présentes
  if (expected.length <= 4) {
    const expectedConsonants = expectedSkeleton;
    let matchCount = 0;
    for (const c of expectedConsonants) {
      if (spokenSkeleton.includes(c)) matchCount++;
    }
    // Si au moins 80% des consonnes sont présentes
    if (expectedConsonants.length > 0 && matchCount / expectedConsonants.length >= 0.8) {
      return true;
    }
  }

  // Vérifier si la fin du mot correspond (souvent mieux reconnu)
  const endLength = Math.min(3, expected.length - 1);
  if (endLength > 0) {
    const expectedEnd = expected.slice(-endLength);
    const spokenEnd = spoken.slice(-endLength);
    if (expectedEnd === spokenEnd) {
      return true;
    }
  }

  return false;
}

// Fonction principale de matching
export function matchWord(spoken: string, expected: string): MatchResult {
  const normalizedSpoken = normalize(spoken);
  const normalizedExpected = normalize(expected);

  // Match exact
  if (normalizedSpoken === normalizedExpected) {
    return {
      isCorrect: true,
      isAlmost: false,
      confidence: 100,
      feedback: 'Parfait !',
    };
  }

  // Vérification avec substitutions phonétiques
  const spokenVariations = getPhoneticVariations(normalizedSpoken);
  const expectedVariations = getPhoneticVariations(normalizedExpected);

  // Comparaison des formes phonétiques
  const spokenPhonetic = toPhonetic(normalizedSpoken);
  const expectedPhonetic = toPhonetic(normalizedExpected);

  if (spokenPhonetic === expectedPhonetic) {
    return {
      isCorrect: true,
      isAlmost: false,
      confidence: 98,
      feedback: 'Très bien !',
    };
  }

  // Vérification de similarité phonétique (pour les erreurs de reconnaissance vocale)
  if (arePhoneticallySimilar(normalizedSpoken, normalizedExpected)) {
    return {
      isCorrect: true,
      isAlmost: false,
      confidence: 90,
      feedback: 'Bien !',
    };
  }

  for (const sv of spokenVariations) {
    for (const ev of expectedVariations) {
      if (sv === ev) {
        return {
          isCorrect: true,
          isAlmost: false,
          confidence: 95,
          feedback: 'Très bien !',
        };
      }
    }
  }

  // Calcul de la distance
  const distance = levenshteinDistance(normalizedSpoken, normalizedExpected);
  const maxLength = Math.max(normalizedSpoken.length, normalizedExpected.length);
  const similarity = maxLength > 0 ? ((maxLength - distance) / maxLength) * 100 : 0;

  // Tolérance basée sur la longueur du mot
  const toleranceThreshold = Math.max(1, Math.floor(normalizedExpected.length / 4));

  if (distance <= 1) {
    return {
      isCorrect: true,
      isAlmost: false,
      confidence: Math.round(similarity),
      feedback: 'Bravo !',
    };
  }

  if (distance <= toleranceThreshold) {
    return {
      isCorrect: false,
      isAlmost: true,
      confidence: Math.round(similarity),
      feedback: 'Presque ! Essaie encore.',
    };
  }

  // Le mot semble contenu dans ce qui a été dit (l'enfant a dit une phrase)
  if (normalizedSpoken.includes(normalizedExpected)) {
    return {
      isCorrect: true,
      isAlmost: false,
      confidence: 90,
      feedback: 'Bien !',
    };
  }

  return {
    isCorrect: false,
    isAlmost: false,
    confidence: Math.round(similarity),
    feedback: 'Essaie encore !',
  };
}

// Feedback encourageant pour les enfants
export function getEncouragingFeedback(stars: number): string {
  const feedbacks = {
    3: ['Super rapide !', 'Tu es un champion !', 'Excellent !', 'Fantastique !'],
    2: ['Très bien !', 'Bravo !', 'Continue comme ça !', 'Génial !'],
    1: ['Bien joué !', 'Tu y arrives !', 'C\'est ça !', 'Pas mal !'],
  };

  const options = feedbacks[stars as 1 | 2 | 3] || feedbacks[1];
  return options[Math.floor(Math.random() * options.length)];
}
