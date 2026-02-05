import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useGameStore } from '../../stores/gameStore';

export function ProfileSelector() {
  const { users, setCurrentUser } = useUserStore();
  const { setScreen } = useGameStore();

  const handleSelectProfile = (userId: string) => {
    setCurrentUser(userId);
    setScreen('levelSelect');
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-3xl font-bold text-white">Qui joue ?</h2>

      <div className="flex gap-8">
        {users.map((user, index) => (
          <motion.button
            key={user.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectProfile(user.id)}
            className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <motion.span
              className="text-8xl"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              {user.avatar}
            </motion.span>

            {/* Nom */}
            <span className="text-2xl font-bold text-white">{user.name}</span>

            {/* Niveau actuel */}
            <span className="text-sm text-white/60">
              Niveau {user.currentLevel}
            </span>

            {/* Étoiles */}
            <div className="flex items-center gap-1 text-yellow-400">
              <span>⭐</span>
              <span className="font-bold">{user.totalStars}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
