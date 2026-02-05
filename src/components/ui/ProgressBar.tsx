import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: 'sm' | 'md' | 'lg';
  color?: 'yellow' | 'green' | 'blue' | 'purple';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  height = 'md',
  color = 'yellow',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const heights = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const colors = {
    yellow: 'from-yellow-400 to-orange-500',
    green: 'from-green-400 to-emerald-500',
    blue: 'from-blue-400 to-cyan-500',
    purple: 'from-purple-400 to-pink-500',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div
        className={`w-full ${heights[height]} bg-white/20 rounded-full overflow-hidden backdrop-blur-sm`}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
      {showLabel && (
        <div className="text-center text-white/80 text-sm mt-1">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
