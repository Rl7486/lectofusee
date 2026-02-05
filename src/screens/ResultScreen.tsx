import { motion } from 'framer-motion';
import { SpaceBackground } from '../components/game/SpaceBackground';
import { StarCount } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { useGameStore } from '../stores/gameStore';
import { useUserStore } from '../stores/userStore';

export function ResultScreen() {
  const { currentSession, setScreen, selectedLevel, setSelectedLevel } = useGameStore();
  const { getCurrentUser, updateUserLevel } = useUserStore();

  const user = getCurrentUser();

  if (!currentSession) {
    return null;
  }

  const totalWords = currentSession.words.length;
  const correctWords = currentSession.words.filter((w) => w.stars > 0).length;
  const totalStars = currentSession.totalStars;
  const maxStars = totalWords * 3;
  const percentage = Math.round((correctWords / totalWords) * 100);

  // Vérifier si on débloque le niveau suivant
  const canUnlockNextLevel = percentage >= 80 && selectedLevel < 10;
  const nextLevel = selectedLevel + 1;

  const handlePlayAgain = () => {
    setScreen('game');
  };

  const handleNextLevel = () => {
    if (canUnlockNextLevel && user) {
      updateUserLevel(nextLevel);
      setSelectedLevel(nextLevel);
    }
    setScreen('game');
  };

  const handleHome = () => {
    setScreen('home');
  };

  const getMessage = () => {
    if (percentage === 100) return 'Parfait ! Tu es un champion ! 🏆';
    if (percentage >= 80) return 'Super travail ! 🌟';
    if (percentage >= 60) return 'Bien joué ! Continue ! 💪';
    if (percentage >= 40) return 'Pas mal ! Tu peux faire mieux ! 📚';
    return 'Continue de t\'entraîner ! 🚀';
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      <SpaceBackground />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full"
      >
        {/* Titre */}
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-white text-center mb-6"
        >
          Bravo {user?.name} ! 🎉
        </motion.h1>

        {/* Message encourageant */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/80 text-center mb-6"
        >
          {getMessage()}
        </motion.p>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Mots réussis */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 rounded-2xl p-4 text-center"
          >
            <p className="text-white/60 text-sm">Mots lus</p>
            <p className="text-3xl font-bold text-white">
              {correctWords}/{totalWords}
            </p>
          </motion.div>

          {/* Pourcentage */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 rounded-2xl p-4 text-center"
          >
            <p className="text-white/60 text-sm">Réussite</p>
            <p className="text-3xl font-bold text-green-400">{percentage}%</p>
          </motion.div>
        </div>

        {/* Étoiles gagnées */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2 mb-6"
        >
          <p className="text-white/60">Étoiles gagnées</p>
          <div className="flex items-center gap-3">
            <StarCount count={totalStars} size="lg" />
            <span className="text-white/40">/ {maxStars}</span>
          </div>
        </motion.div>

        {/* Badge niveau suivant */}
        {canUnlockNextLevel && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 mb-6 text-center"
          >
            <p className="text-white font-bold">🎊 Nouveau niveau débloqué !</p>
            <p className="text-white/80">Niveau {nextLevel} disponible</p>
          </motion.div>
        )}

        {/* Boutons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          {canUnlockNextLevel ? (
            <Button onClick={handleNextLevel} variant="primary" size="lg">
              🚀 Niveau suivant
            </Button>
          ) : (
            <Button onClick={handlePlayAgain} variant="primary" size="lg">
              🔄 Rejouer
            </Button>
          )}

          <Button onClick={handleHome} variant="ghost" size="md">
            🏠 Accueil
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
