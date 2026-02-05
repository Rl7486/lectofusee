import { motion, AnimatePresence } from 'framer-motion';
import { StarRating } from '../ui/StarRating';

interface FeedbackPopupProps {
  isVisible: boolean;
  type: 'success' | 'almost' | 'skip';
  stars?: number;
  message?: string;
}

export function FeedbackPopup({
  isVisible,
  type,
  stars = 0,
  message,
}: FeedbackPopupProps) {
  const getEmoji = () => {
    switch (type) {
      case 'success':
        if (stars === 3) return '🎉';
        if (stars === 2) return '👏';
        return '👍';
      case 'almost':
        return '💪';
      case 'skip':
        return '➡️';
      default:
        return '✨';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'success':
        if (stars === 3) return 'Super rapide !';
        if (stars === 2) return 'Très bien !';
        return 'Bien joué !';
      case 'almost':
        return 'Presque ! Essaie encore !';
      case 'skip':
        return 'Mot suivant !';
      default:
        return '';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'almost':
        return 'from-yellow-500 to-orange-600';
      case 'skip':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-purple-500 to-pink-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0, y: -50, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className={`
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            bg-gradient-to-br ${getColors()}
            px-8 py-6 rounded-3xl shadow-2xl
            flex flex-col items-center gap-3
            z-50
          `}
        >
          {/* Emoji */}
          <motion.span
            className="text-6xl"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {getEmoji()}
          </motion.span>

          {/* Message */}
          <p className="text-2xl font-bold text-white text-center">
            {message || getDefaultMessage()}
          </p>

          {/* Étoiles (seulement pour success) */}
          {type === 'success' && stars > 0 && (
            <StarRating stars={stars} size="lg" animated />
          )}

          {/* Confettis pour 3 étoiles */}
          {type === 'success' && stars === 3 && (
            <Confetti />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composant confettis simple
function Confetti() {
  const confettiColors = ['🎊', '🎉', '✨', '⭐', '💫'];
  const confettis = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: confettiColors[i % confettiColors.length],
    x: Math.random() * 200 - 100,
    y: Math.random() * -200 - 50,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {confettis.map((c) => (
        <motion.span
          key={c.id}
          className="absolute left-1/2 top-1/2 text-2xl"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: c.x,
            y: c.y,
            opacity: 0,
            rotate: c.rotation,
          }}
          transition={{
            duration: 1,
            delay: c.delay,
            ease: 'easeOut',
          }}
        >
          {c.emoji}
        </motion.span>
      ))}
    </div>
  );
}
