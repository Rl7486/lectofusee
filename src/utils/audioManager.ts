// Gestionnaire de sons pour l'application
class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Pré-charger les sons au démarrage
    this.preloadSounds();
  }

  private preloadSounds() {
    const soundFiles = [
      'rocket-boost',
      'star-collect',
      'success',
      'almost',
      'level-up',
      'click',
      'woosh',
    ];

    soundFiles.forEach((name) => {
      const audio = new Audio(`/sounds/${name}.mp3`);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(soundName: string, volume: number = 0.5) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone l'audio pour permettre plusieurs lectures simultanées
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = volume;
      clone.play().catch(() => {
        // Ignorer les erreurs (autoplay restrictions)
      });
    }
  }

  playSuccess(stars: number) {
    if (stars === 3) {
      this.play('success', 0.6);
      setTimeout(() => this.play('star-collect', 0.4), 200);
      setTimeout(() => this.play('star-collect', 0.4), 400);
      setTimeout(() => this.play('star-collect', 0.4), 600);
    } else if (stars === 2) {
      this.play('success', 0.5);
      setTimeout(() => this.play('star-collect', 0.4), 200);
      setTimeout(() => this.play('star-collect', 0.4), 400);
    } else {
      this.play('success', 0.4);
      setTimeout(() => this.play('star-collect', 0.4), 200);
    }
  }

  playAlmost() {
    this.play('almost', 0.4);
  }

  playRocketBoost() {
    this.play('rocket-boost', 0.3);
  }

  playLevelUp() {
    this.play('level-up', 0.6);
  }

  playClick() {
    this.play('click', 0.3);
  }

  playWoosh() {
    this.play('woosh', 0.3);
  }
}

// Singleton
export const audioManager = new AudioManager();
