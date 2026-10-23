// Web Audio API Synthesizer & Authentic Malaysian Malay Audio Speech Service

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  public isSpeaking: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Cheerful correct sound (arpeggio sparkle)
  playCorrect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Soft gentle boop for wrong
  playWrong() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Silent
    }
  }

  // Pop sound for dragging / dropping / tapping tiles
  playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Silent
    }
  }

  // Triumphant victory fanfare for completion
  playVictory() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 659.25, d: 0.15, t: 0.16 },
        { f: 783.99, d: 0.18, t: 0.32 },
        { f: 1046.5, d: 0.45, t: 0.52 },
      ];

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // Silent
    }
  }

  // Stop current speech playback
  stopSpeech() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      } catch {
        // Ignore
      }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.isSpeaking = false;
  }

  // Speak authentic Bahasa Melayu Malaysia using native Malay TTS endpoint
  speak(text: string, onEndCallback?: () => void) {
    if (this.isMuted) return;
    if (!text || !text.trim()) return;

    // Stop any existing speech first
    this.stopSpeech();
    this.isSpeaking = true;

    // Call server-side Malay TTS API (pure Bahasa Melayu Malaysia tl=ms)
    const audioUrl = `/api/tts?text=${encodeURIComponent(text.trim())}`;
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;

    audio.onended = () => {
      this.isSpeaking = false;
      this.currentAudio = null;
      if (onEndCallback) onEndCallback();
    };

    audio.onerror = () => {
      console.warn('Native Malay audio stream fallback to client speech synthesis.');
      this.isSpeaking = false;
      this.currentAudio = null;
      this.fallbackBrowserSpeech(text, onEndCallback);
    };

    audio.play().catch((err) => {
      console.warn('Audio play prevented or interrupted:', err);
      this.fallbackBrowserSpeech(text, onEndCallback);
    });
  }

  // Fallback to client browser speech synthesis only if audio stream fails
  private fallbackBrowserSpeech(text: string, onEndCallback?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ms-MY';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;

      // Look specifically for a Malaysian Malay voice
      const voices = window.speechSynthesis.getVoices();
      const malayVoice = voices.find((v) => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        const name = (v.name || '').toLowerCase();
        const isIndonesian = lang.startsWith('id') || name.includes('indonesia');
        return !isIndonesian && (lang === 'ms-my' || lang.startsWith('ms') || name.includes('malaysia') || name.includes('melayu'));
      });

      if (malayVoice) {
        utterance.voice = malayVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }
}

export const soundManager = new SoundManager();
