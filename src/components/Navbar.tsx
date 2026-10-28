import React, { useEffect, useState } from 'react';
import { Sparkles, Music, Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface NavbarProps {
  recipientName: string;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ recipientName, onOpenCustomizer }) => {
  const [audioState, setAudioState] = useState(audioEngine.getState());
  const [equalizerLevels, setEqualizerLevels] = useState([0.2, 0.4, 0.3, 0.5, 0.2]);

  useEffect(() => {
    const unsub = audioEngine.subscribe(state => {
      setAudioState(state);
    });

    const interval = setInterval(() => {
      setEqualizerLevels(audioEngine.getEqualizerData());
    }, 120);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto glass-panel rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/10 shadow-lg shadow-black/40">
        {/* Brand / Name */}
        <div
          onClick={() => scrollToSection('hero-section')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="text-left">
            <span className="font-playfair text-sm sm:text-base font-bold tracking-wide text-white block group-hover:text-amber-200 transition-colors">
              {recipientName}
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase hidden sm:block">
              Symphony of Stars
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium tracking-wide text-slate-300">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('message-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Message
          </button>
          <button
            onClick={() => scrollToSection('gallery-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Memories
          </button>
          <button
            onClick={() => scrollToSection('wishes-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Star Wishes
          </button>
          <button
            onClick={() => scrollToSection('cake-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Birthday Cake
          </button>
          <button
            onClick={() => scrollToSection('finale-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300 font-semibold"
          >
            Grand Finale ✨
          </button>
        </nav>

        {/* Action Controls: Music + Personalize */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Equalizer & Toggle */}
          <button
            onClick={() => audioEngine.togglePlay()}
            title={audioState.isPlaying ? 'Pause Celestial Music' : 'Play Celestial Music'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
              audioState.isPlaying
                ? 'border-amber-400/50 bg-amber-400/10 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${audioState.isPlaying ? 'animate-bounce text-amber-300' : ''}`} />
            
            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-[2px] h-3.5 w-4 sm:w-5">
              {equalizerLevels.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    audioState.isPlaying ? 'bg-amber-300' : 'bg-slate-600'
                  }`}
                  style={{
                    height: audioState.isPlaying ? `${Math.max(20, val * 100)}%` : '30%',
                  }}
                />
              ))}
            </div>

            <span className="hidden sm:inline text-[11px] font-sans-modern">
              {audioState.isPlaying ? 'Music On' : 'Music Off'}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => audioEngine.toggleMute()}
            title={audioState.isMuted ? 'Unmute' : 'Mute'}
            className="p-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {audioState.isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Personalize Button */}
          <button
            onClick={onOpenCustomizer}
            title="Personalize Details & Photos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium hover:brightness-110 transition-all shadow-md shadow-purple-900/40 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="hidden sm:inline">Personalize</span>
          </button>
        </div>
      </div>
    </header>
  );
};
