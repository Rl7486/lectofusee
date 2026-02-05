import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SpaceBackground } from '../components/game/SpaceBackground';
import { WordDisplay } from '../components/game/WordDisplay';
import { RocketAnimation } from '../components/game/RocketAnimation';
import { MicIndicator } from '../components/game/MicIndicator';
import { FeedbackPopup } from '../components/game/FeedbackPopup';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StarCount } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { useGameStore } from '../stores/gameStore';
import { useUserStore } from '../stores/userStore';
import { useStatsStore } from '../stores/statsStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { matchWord, getEncouragingFeedback } from '../utils/phoneticMatch';
import { calculateProgress, formatSessionTime } from '../utils/scoreCalculator';
import { getSessionWords } from '../data/words';
import { audioManager } from '../utils/audioManager';

type FeedbackType = 'success' | 'almost' | 'skip' | null;
type WordStatus = 'waiting' | 'listening' | 'correct' | 'almost' | 'wrong';

export function GameScreen() {
  const {
    currentSession,
    currentWordIndex,
    currentAttempt,
    selectedLevel,
    selectedTheme,
    startSession,
    recordWordResult,
    nextWord,
    incrementAttempt,
    endSession,
    setScreen,
    getElapsedWordTime,
    startWordTimer,
  } = useGameStore();

  const { getCurrentUser, updateUserStars } = useUserStore();
  const { recordAttempt, getProblematicWords } = useStatsStore();

  const [wordStatus, setWordStatus] = useState<WordStatus>('waiting');
  const [feedback, setFeedback] = useState<{ type: FeedbackType; stars: number; message: string } | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [boosting, setBoosting] = useState(false);

  const user = getCurrentUser();

  // Initialiser la session si nécessaire
  useEffect(() => {
    if (!currentSession && user) {
      const problematicWords = getProblematicWords(user.id, selectedLevel, 5);
      const words = getSessionWords(selectedLevel, 15, problematicWords);
      startSession(user.id, selectedLevel, selectedTheme, words);
    }
  }, [currentSession, user, selectedLevel, selectedTheme, startSession, getProblematicWords]);

  // Timer de session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((t) => t + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Callback pour la reconnaissance vocale
  const handleSpeechResult = useCallback(
    (transcript: string) => {
      if (!currentSession || feedback) return;

      const currentWord = currentSession.words[currentWordIndex]?.word;
      if (!currentWord) return;

      const result = matchWord(transcript, currentWord);
      const responseTime = getElapsedWordTime();

      if (result.isCorrect) {
        // Succès ! Étoiles basées sur le nombre de tentatives
        // 1ère tentative = 3 étoiles, 2ème = 2 étoiles, 3ème = 1 étoile
        const stars = Math.max(1, 4 - currentAttempt);
        setWordStatus('correct');
        setBoosting(true);

        // Enregistrer les stats
        if (user) {
          recordAttempt(user.id, currentWord, selectedLevel, responseTime, stars, true);
        }
        recordWordResult(currentWord, responseTime, stars, false);

        // Feedback
        audioManager.playSuccess(stars);
        setFeedback({
          type: 'success',
          stars,
          message: getEncouragingFeedback(stars),
        });

        // Passer au mot suivant après un délai
        setTimeout(() => {
          setBoosting(false);
          setFeedback(null);
          setWordStatus('waiting');

          if (currentWordIndex + 1 >= currentSession.words.length) {
            endSession();
            updateUserStars(currentSession.totalStars + stars);
            setScreen('result');
          } else {
            nextWord();
          }
        }, 1500);
      } else if (result.isAlmost) {
        // Presque !
        setWordStatus('almost');
        audioManager.playAlmost();

        if (currentAttempt >= 3) {
          // Dernier essai, on passe
          setFeedback({ type: 'almost', stars: 0, message: 'C\'était proche !' });

          if (user) {
            recordAttempt(user.id, currentWord, selectedLevel, responseTime, 0, false);
          }
          recordWordResult(currentWord, responseTime, 0, true);

          setTimeout(() => {
            setFeedback(null);
            setWordStatus('waiting');
            if (currentWordIndex + 1 >= currentSession.words.length) {
              endSession();
              updateUserStars(currentSession.totalStars);
              setScreen('result');
            } else {
              nextWord();
              startWordTimer();
            }
          }, 1500);
        } else {
          // Encore un essai
          incrementAttempt();
          setFeedback({ type: 'almost', stars: 0, message: 'Essaie encore !' });
          setTimeout(() => {
            setFeedback(null);
            setWordStatus('waiting');
          }, 1000);
        }
      } else {
        // Mauvaise réponse
        setWordStatus('wrong');

        if (currentAttempt >= 3) {
          // Dernier essai
          if (user) {
            recordAttempt(user.id, currentWord, selectedLevel, responseTime, 0, false);
          }
          recordWordResult(currentWord, responseTime, 0, true);

          setFeedback({ type: 'skip', stars: 0, message: `Le mot était : ${currentWord}` });
          setTimeout(() => {
            setFeedback(null);
            setWordStatus('waiting');
            if (currentWordIndex + 1 >= currentSession.words.length) {
              endSession();
              updateUserStars(currentSession.totalStars);
              setScreen('result');
            } else {
              nextWord();
              startWordTimer();
            }
          }, 2000);
        } else {
          incrementAttempt();
          setTimeout(() => setWordStatus('waiting'), 500);
        }
      }
    },
    [
      currentSession,
      currentWordIndex,
      currentAttempt,
      selectedLevel,
      user,
      feedback,
      getElapsedWordTime,
      recordAttempt,
      recordWordResult,
      nextWord,
      incrementAttempt,
      endSession,
      updateUserStars,
      setScreen,
      startWordTimer,
    ]
  );

  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    language: 'fr-FR',
  });

  // Démarrer l'écoute automatiquement
  useEffect(() => {
    if (!feedback && isSupported && currentSession) {
      const timer = setTimeout(() => {
        startListening();
        setWordStatus('listening');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [feedback, isSupported, currentSession, currentWordIndex, startListening]);

  // Démarrer le timer SEULEMENT quand le micro est vraiment actif
  useEffect(() => {
    if (isListening && !feedback) {
      startWordTimer();
    }
  }, [isListening, feedback, startWordTimer]);

  // Arrêter l'écoute quand on affiche un feedback
  useEffect(() => {
    if (feedback) {
      stopListening();
    }
  }, [feedback, stopListening]);

  const handleQuit = () => {
    stopListening();
    setScreen('home');
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceBackground />
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  const currentWord = currentSession.words[currentWordIndex]?.word || '';
  const progress = calculateProgress(currentWordIndex, currentSession.words.length);

  return (
    <div className="min-h-screen relative flex flex-col">
      <SpaceBackground />

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleQuit}>
          ✕
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">
            Niveau {selectedLevel}
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/60 text-sm">
            {formatSessionTime(sessionTime)}
          </span>
        </div>
        <StarCount count={currentSession.totalStars} size="sm" />
      </div>

      {/* Zone principale */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 p-4">
        {/* Fusée et progression */}
        <div className="w-full max-w-md">
          <RocketAnimation
            progress={progress}
            boosting={boosting}
            theme={selectedTheme}
          />
        </div>

        {/* Mot à lire */}
        <motion.div
          key={currentWordIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <WordDisplay word={currentWord} status={wordStatus} />
        </motion.div>

        {/* Indicateur d'essai */}
        {currentAttempt > 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-yellow-400 text-lg"
          >
            Essai {currentAttempt}/3
          </motion.p>
        )}

        {/* Microphone */}
        <MicIndicator
          isListening={isListening && !feedback}
          transcript={transcript}
          error={error}
        />

        {/* Message si reconnaissance non supportée */}
        {!isSupported && (
          <p className="text-red-400 text-center">
            La reconnaissance vocale n'est pas supportée sur ce navigateur.
            <br />
            Utilise Chrome ou Safari.
          </p>
        )}
      </div>

      {/* Barre de progression en bas */}
      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto">
          <ProgressBar progress={progress} color="yellow" />
          <p className="text-center text-white/40 text-sm mt-2">
            {currentWordIndex + 1} / {currentSession.words.length} mots
          </p>
        </div>
      </div>

      {/* Popup de feedback */}
      <FeedbackPopup
        isVisible={!!feedback}
        type={feedback?.type || 'success'}
        stars={feedback?.stars || 0}
        message={feedback?.message}
      />
    </div>
  );
}
