// Web Audio API Celestial Synthesizer & Audio Engine
// Generates dreamy, ethereal ambient harp and music box arpeggios reliably without external MP3 dependencies

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.55;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioSource: MediaElementAudioSourceNode | null = null;
  private synthInterval: number | null = null;
  private subscribers: Array<(state: { isPlaying: boolean; isMuted: boolean; volume: number }) => void> = [];

  // Celestial Pentatonic Scale frequencies (Hz) for Eb Major / C minor ethereal space
  private melodyNotes = [
    311.13, // Eb4
    349.23, // F4
    392.0,  // G4
    466.16, // Bb4
    523.25, // C5
    622.25, // Eb5
    698.46, // F5
    783.99, // G5
    932.33, // Bb5
    1046.5, // C6
  ];

  private bassNotes = [
    77.78,  // Eb2
    103.83, // Ab2
    116.54, // Bb2
    130.81, // C3
  ];

  private noteIndex = 0;
  private barCount = 0;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      // Analyser for visualizer & equalizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      // Celestial Echo / Delay
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.value = 0.42; // dreamy tempo delay

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.38;

      // Delay filter to make echoes warm & muffled
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 1800;

      // Connect delay loop
      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);

      // Delay to master
      this.delayNode.connect(this.masterGain);

      // Master to analyser, analyser to destination
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle celestial bell / chime note
  private playChime(freq: number, duration: number = 2.2, volumeGain: number = 0.2, detune: number = 0) {
    if (!this.ctx || !this.masterGain || !this.delayNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm sine wave with subtle shimmer
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.detune.setValueAtTime(detune, this.ctx.currentTime);

    // Soft attack, long celestial decay
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volumeGain, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.delayNode);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  // Play warm celestial bass pad
  private playDrone(freq: number, duration: number = 4.0) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  // Step the procedural celestial music
  private tickSynth = () => {
    if (!this.isPlaying) return;

    // Pattern patterns of gentle arpeggio
    const patterns = [
      [0, 2, 4, 7, 5, 3, 2, 4],
      [1, 3, 5, 8, 7, 4, 3, 1],
      [2, 4, 6, 9, 7, 5, 4, 2],
      [0, 3, 5, 7, 9, 6, 4, 1],
    ];

    const currentPattern = patterns[Math.floor(this.barCount / 8) % patterns.length];
    const noteStep = currentPattern[this.noteIndex % currentPattern.length];
    const freq = this.melodyNotes[noteStep % this.melodyNotes.length];

    // Play melody chime
    this.playChime(freq, 2.5, 0.18, (Math.random() - 0.5) * 6);

    // Occasionally play a high crystalline shimmer
    if (this.noteIndex % 4 === 0 && Math.random() > 0.4) {
      const highNote = this.melodyNotes[this.melodyNotes.length - 1 - (this.noteIndex % 3)];
      setTimeout(() => {
        this.playChime(highNote, 1.8, 0.08);
      }, 200);
    }

    // Play bass root at the start of every 4 beats
    if (this.noteIndex % 8 === 0) {
      const bassIndex = Math.floor(this.barCount / 8) % this.bassNotes.length;
      this.playDrone(this.bassNotes[bassIndex], 4.5);
    }

    this.noteIndex++;
    if (this.noteIndex % 8 === 0) {
      this.barCount++;
    }
  };

  public play() {
    this.initContext();
    this.isPlaying = true;

    if (this.customAudio && this.customAudio.src) {
      this.customAudio.play().catch(() => {});
    } else {
      if (this.synthInterval) clearInterval(this.synthInterval);
      // Tick every 450ms for a peaceful, slow harp rhythm (~66 BPM)
      this.tickSynth();
      this.synthInterval = window.setInterval(this.tickSynth, 460);
    }

    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.muted = this.isMuted;
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
    this.notify();
  }

  // Play specific sound effects
  public playStarChime() {
    this.initContext();
    if (this.ctx && this.masterGain) {
      [880, 1174.66, 1396.91, 1760].forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq, 2.0, 0.15);
        }, idx * 75);
      });
    }
  }

  public playCandleBlowSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Gentle soft whoosh
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();

    // Followed by celebration sparkles
    setTimeout(() => {
      this.playStarChime();
    }, 400);
  }

  public playWarpSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // Get frequency data for equalizer visualization
  public getEqualizerData(): number[] {
    if (!this.analyser || !this.isPlaying || this.isMuted) {
      return [0.15, 0.2, 0.18, 0.12, 0.22];
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Pick 5 frequency bands
    const bands = [
      dataArray[1] / 255,
      dataArray[3] / 255,
      dataArray[6] / 255,
      dataArray[10] / 255,
      dataArray[15] / 255,
    ];

    return bands.map(v => Math.max(0.12, v));
  }

  // Load custom audio file
  public loadCustomAudio(file: File) {
    this.initContext();
    const url = URL.createObjectURL(file);
    if (!this.customAudio) {
      this.customAudio = new Audio();
      this.customAudio.loop = true;
    }
    this.customAudio.src = url;

    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }

    if (this.ctx && !this.customAudioSource) {
      try {
        this.customAudioSource = this.ctx.createMediaElementSource(this.customAudio);
        if (this.masterGain) {
          this.customAudioSource.connect(this.masterGain);
        }
      } catch (e) {
        // Source already connected
      }
    }

    if (this.isPlaying) {
      this.customAudio.play().catch(() => {});
    }
    this.notify();
  }

  public subscribe(cb: (state: { isPlaying: boolean; isMuted: boolean; volume: number }) => void) {
    this.subscribers.push(cb);
    cb({ isPlaying: this.isPlaying, isMuted: this.isMuted, volume: this.volume });
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach(cb =>
      cb({ isPlaying: this.isPlaying, isMuted: this.isMuted, volume: this.volume })
    );
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
    };
  }
}

export const audioEngine = new AudioEngine();
