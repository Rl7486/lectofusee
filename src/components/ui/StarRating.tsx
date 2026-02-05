import { motion } from 'framer-motion';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function StarRating({
  stars,
  maxStars = 3,
  size = 'md',
  animated = true,
}: StarRatingProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          initial={animated ? { scale: 0, rotate: -180 } : false}
          animate={animated ? { scale: 1, rotate: 0 } : false}
          transition={{
            delay: i * 0.15,
            type: 'spring',
            stiffness: 500,
            damping: 15,
          }}
          className={`${sizes[size]} ${
            i < stars ? 'opacity-100' : 'opacity-30'
          }`}
        >
          {i < stars ? '⭐' : '☆'}
        </motion.span>
      ))}
    </div>
  );
}

// Composant pour afficher le total d'étoiles
export function StarCount({
  count,
  size = 'md',
}: {
  count: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2 ${sizes[size]} font-bold text-yellow-400`}>
      <span>⭐</span>
      <span>{count}</span>
    </div>
  );
}
