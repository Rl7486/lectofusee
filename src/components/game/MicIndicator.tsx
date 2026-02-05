import { motion } from 'framer-motion';

interface MicIndicatorProps {
  isListening: boolean;
  transcript?: string;
  error?: string | null;
}

export function MicIndicator({
  isListening,
  transcript,
  error,
}: MicIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Cercle animé autour du micro */}
      <div className="relative">
        {/* Cercles pulsants quand écoute */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/20"
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}

        {/* Bouton micro */}
        <motion.div
          className={`
            w-20 h-20 rounded-full flex items-center justify-center
            ${isListening
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : 'bg-white/20'
            }
            shadow-lg
          `}
          animate={isListening ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
        >
          <span className="text-4xl">🎤</span>
        </motion.div>
      </div>

      {/* Texte d'instruction ou transcription */}
      <div className="text-center min-h-[3rem]">
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-lg"
          >
            {error}
          </motion.p>
        ) : transcript ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-xl font-medium"
          >
            "{transcript}"
          </motion.p>
        ) : (
          <p className="text-white/60 text-lg">
            {isListening ? 'Je t\'écoute...' : 'Dis le mot à voix haute !'}
          </p>
        )}
      </div>
    </div>
  );
}
