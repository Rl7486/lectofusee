import { motion } from 'framer-motion';

interface RocketAnimationProps {
  progress: number; // 0-100
  boosting?: boolean;
  theme?: string;
}

export function RocketAnimation({
  progress,
  boosting = false,
  theme = 'space',
}: RocketAnimationProps) {
  // Obtenir le caractère selon le thème
  const getCharacter = () => {
    switch (theme) {
      case 'dinosaurs':
        return '🦕';
      case 'animals':
        return '🦁';
      case 'pokemon':
        return '⚡';
      case 'numberblocks':
        return '🔢';
      default:
        return '🚀';
    }
  };

  return (
    <div className="relative w-full h-24 my-4">
      {/* Ligne de progression */}
      <div className="absolute top-1/2 left-4 right-4 h-2 bg-white/20 rounded-full -translate-y-1/2">
        {/* Progression */}
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Marqueurs de progression */}
        {[25, 50, 75].map((marker) => (
          <div
            key={marker}
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white/50 ${
              progress >= marker ? 'bg-yellow-400' : 'bg-white/10'
            }`}
            style={{ left: `${marker}%`, transform: 'translate(-50%, -50%)' }}
          />
        ))}

        {/* Arrivée */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl">
          🏁
        </div>
      </div>

      {/* Fusée/Personnage animé */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        animate={{
          left: `calc(${Math.min(progress, 95)}% + 1rem)`,
          y: boosting ? [-5, 5, -5] : 0,
          rotate: boosting ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          left: { duration: 0.5, ease: 'easeOut' },
          y: { duration: 0.2, repeat: boosting ? Infinity : 0 },
          rotate: { duration: 0.3, repeat: boosting ? Infinity : 0 },
        }}
      >
        <span className="text-4xl drop-shadow-lg">{getCharacter()}</span>

        {/* Flammes/traînée si boost */}
        {boosting && (
          <motion.div
            className="absolute -left-6 top-1/2 -translate-y-1/2"
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          >
            <span className="text-2xl">🔥</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
