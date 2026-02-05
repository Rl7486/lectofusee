import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';
import { getWordCountByLevel } from '../../data/words';

export function LevelSelector() {
  const { getCurrentUser } = useUserStore();
  const { setScreen, setSelectedLevel } = useGameStore();

  const user = getCurrentUser();
  const maxLevel = user?.currentLevel || 1;

  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level);
    setScreen('game');
  };

  const handleBack = () => {
    setScreen('home');
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          ← Retour
        </Button>
        <h2 className="text-2xl font-bold text-white flex-1 text-center">
          Choisis ton niveau
        </h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Grille des niveaux */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
          const isUnlocked = level <= maxLevel;
          const wordCount = getWordCountByLevel(level);

          return (
            <motion.button
              key={level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: level * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && handleSelectLevel(level)}
              disabled={!isUnlocked}
              className={`
                relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1
                transition-all duration-200
                ${isUnlocked
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer'
                  : 'bg-white/10 cursor-not-allowed'
                }
              `}
            >
              {/* Numéro du niveau */}
              <span className={`text-3xl font-bold ${isUnlocked ? 'text-white' : 'text-white/30'}`}>
                {level}
              </span>

              {/* Nombre de mots */}
              <span className={`text-xs ${isUnlocked ? 'text-white/80' : 'text-white/20'}`}>
                {wordCount} mots
              </span>

              {/* Cadenas si verrouillé */}
              {!isUnlocked && (
                <span className="absolute text-2xl opacity-50">🔒</span>
              )}

              {/* Badge niveau actuel */}
              {level === maxLevel && level > 1 && (
                <motion.div
                  className="absolute -top-2 -right-2 text-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⭐
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Info niveau */}
      <div className="text-center text-white/60 text-sm mt-4">
        <p>Gagne des étoiles pour débloquer les niveaux suivants !</p>
        <p className="text-xs mt-1">
          Niveau {maxLevel} débloqué sur 10
        </p>
      </div>
    </div>
  );
}
