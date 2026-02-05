import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechState } from '../types';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    onResult,
    onError,
    language = 'fr-FR',
    continuous = false,
  } = options;

  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: '',
    error: null,
    isSupported: false,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStartingRef = useRef(false);

  // Initialisation
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    setState((prev) => ({ ...prev, isSupported: true }));

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      isStartingRef.current = false;
      setState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setState((prev) => ({ ...prev, transcript: currentTranscript }));

      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      isStartingRef.current = false;
      const errorMessage = getErrorMessage(event.error);
      setState((prev) => ({ ...prev, error: errorMessage, isListening: false }));
      if (onError) {
        onError(errorMessage);
      }
    };

    recognition.onend = () => {
      isStartingRef.current = false;
      setState((prev) => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language, continuous, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isStartingRef.current) return;

    try {
      isStartingRef.current = true;
      setState((prev) => ({ ...prev, transcript: '', error: null }));
      recognitionRef.current.start();
    } catch (error) {
      isStartingRef.current = false;
      // La reconnaissance est peut-être déjà démarrée
      console.warn('Speech recognition start error:', error);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.warn('Speech recognition stop error:', error);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: '' }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'no-speech':
      return 'Aucun son détecté. Parle plus fort !';
    case 'audio-capture':
      return 'Microphone non trouvé.';
    case 'not-allowed':
      return 'Accès au microphone refusé.';
    case 'network':
      return 'Erreur réseau.';
    case 'aborted':
      return 'Écoute annulée.';
    default:
      return 'Erreur de reconnaissance vocale.';
  }
}
