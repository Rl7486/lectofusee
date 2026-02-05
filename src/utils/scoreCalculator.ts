// Calcule le nombre d'étoiles basé sur le temps de réponse
export function calculateStars(
  responseTimeMs: number,
  wordLength: number,
  level: number
): number {
  // Temps de base : plus le mot est long et le niveau bas, plus on est tolérant
  // Niveau 1 = très tolérant, Niveau 10 = exigeant
  const baseTimePerChar = 600 - (level * 40); // 560ms à 200ms par caractère selon le niveau
  const baseTime = wordLength * baseTimePerChar + 1000; // +1s de base

  if (responseTimeMs <= baseTime * 0.5) {
    return 3; // Très rapide - 3 étoiles
  }
  if (responseTimeMs <= baseTime) {
    return 2; // Normal - 2 étoiles
  }
  return 1; // Lent mais réussi - 1 étoile
}

// Seuils de temps pour l'affichage (en ms)
export function getTimeThresholds(wordLength: number, level: number) {
  const baseTimePerChar = 600 - (level * 40);
  const baseTime = wordLength * baseTimePerChar + 1000;

  return {
    threeStars: Math.round(baseTime * 0.5),
    twoStars: Math.round(baseTime),
    oneStar: Infinity,
  };
}

// Formatte le temps pour l'affichage
export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

// Calcule le pourcentage de progression dans la session
export function calculateProgress(currentIndex: number, totalWords: number): number {
  if (totalWords === 0) return 0;
  return Math.round((currentIndex / totalWords) * 100);
}

// Calcule le temps restant estimé pour la session
export function estimateRemainingTime(
  elapsedMs: number,
  currentIndex: number,
  totalWords: number
): number {
  if (currentIndex === 0) return 0;
  const avgTimePerWord = elapsedMs / currentIndex;
  const remainingWords = totalWords - currentIndex;
  return Math.round(avgTimePerWord * remainingWords);
}

// Formatage du temps de session (mm:ss)
export function formatSessionTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
