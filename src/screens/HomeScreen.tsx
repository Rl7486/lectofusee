import { motion } from 'framer-motion';
import { ProfileSelector } from '../components/navigation/ProfileSelector';
import { SpaceBackground } from '../components/game/SpaceBackground';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal';

export function HomeScreen() {
  const { setScreen } = useGameStore();
  const [showParentModal, setShowParentModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      <SpaceBackground />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LectoFusée
          </motion.h1>
          <motion.div
            className="text-6xl mt-2"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚀
          </motion.div>
          <p className="text-white/60 mt-2 text-lg">
            Apprends à lire en t'amusant !
          </p>
        </motion.div>

        {/* Sélection du profil */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileSelector />
        </motion.div>

        {/* Bouton mode parent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParentModal(true)}
          >
            👨‍👩‍👧‍👦 Mode Parent
          </Button>
        </motion.div>
      </div>

      {/* Modal PIN parent */}
      <Modal
        isOpen={showParentModal}
        onClose={() => {
          setShowParentModal(false);
          setPin('');
        }}
        title="Mode Parent"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/60 text-center">
            Entre le code PIN pour accéder aux paramètres
          </p>

          {/* Champ PIN */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={pinError ? { x: [-5, 5, -5, 5, 0] } : {}}
                className={`
                  w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold
                  ${pin[i] ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/30'}
                  ${pinError ? 'bg-red-500' : ''}
                `}
              >
                {pin[i] ? '●' : '○'}
              </motion.div>
            ))}
          </div>

          {/* Clavier numérique */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (num === 'del') {
                    setPin((p) => p.slice(0, -1));
                  } else if (num !== null && pin.length < 4) {
                    const newPin = pin + num;
                    setPin(newPin);
                    if (newPin.length === 4) {
                      setTimeout(() => {
                        if (newPin === '1234') {
                          setShowParentModal(false);
                          setPin('');
                          setScreen('parent');
                        } else {
                          setPinError(true);
                          setTimeout(() => {
                            setPinError(false);
                            setPin('');
                          }, 500);
                        }
                      }, 100);
                    }
                  }
                }}
                disabled={num === null}
                className={`
                  w-14 h-14 rounded-xl text-xl font-bold
                  ${num === null ? 'invisible' : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'}
                `}
              >
                {num === 'del' ? '⌫' : num}
              </motion.button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
