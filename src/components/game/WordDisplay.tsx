import { motion } from 'framer-motion';

interface WordDisplayProps {
  word: string;
  status?: 'waiting' | 'listening' | 'correct' | 'almost' | 'wrong';
}

export function WordDisplay({ word, status = 'waiting' }: WordDisplayProps) {
  const getColors = () => {
    switch (status) {
      case 'correct':
        return 'from-green-400 to-emerald-500 shadow-green-500/50';
      case 'almost':
        return 'from-yellow-400 to-orange-500 shadow-yellow-500/50';
      case 'wrong':
        return 'from-red-400 to-pink-500 shadow-red-500/50';
      case 'listening':
        return 'from-blue-400 to-cyan-500 shadow-blue-500/50';
      default:
        return 'from-purple-400 to-pink-500 shadow-purple-500/50';
    }
  };

  const getAnimation = () => {
    switch (status) {
      case 'correct':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0],
        };
      case 'almost':
        return {
          x: [-5, 5, -5, 5, 0],
        };
      case 'wrong':
        return {
          x: [-10, 10, -10, 10, 0],
        };
      case 'listening':
        return {
          scale: [1, 1.02, 1],
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-r ${getColors()}
        px-12 py-8 rounded-3xl shadow-2xl
        flex items-center justify-center
        min-w-[200px]
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        ...getAnimation(),
      }}
      transition={{
        duration: status === 'listening' ? 1 : 0.3,
        repeat: status === 'listening' ? Infinity : 0,
      }}
    >
      <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
        {word}
      </span>
    </motion.div>
  );
}
