import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Stars } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface OpeningScreenProps {
  recipientName: string;
  onOpen: () => void;
  onWarpStart: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  recipientName,
  onOpen,
  onWarpStart,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    onWarpStart();

    // Play warp sound and start dreamy celestial music
    try {
      audioEngine.playWarpSound();
      audioEngine.play();
    } catch (e) {
      console.warn('Audio init:', e);
    }

    // Allow warp effect to build up before revealing main experience
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden select-none bg-[#03030c]/90 backdrop-blur-[2px]"
    >
      {/* Animated Glowing Nebula Aura */}
      <div className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-gradient-to-tr from-purple-900/30 via-indigo-600/20 to-pink-600/15 blur-3xl pointer-events-none animate-nebula -z-10" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-amber-400/10 blur-2xl pointer-events-none -z-10 translate-y-16" />

      {/* Center Cosmic Portal & Moon */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="relative mb-8"
      >
        {/* Moon Halo Glow */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-300/30 to-purple-400/20 blur-xl animate-pulse" />

        {/* Crescent Moon Visual */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400/80 shadow-[0_0_50px_rgba(251,191,36,0.45)] ring-2 ring-amber-300/40">
          <Moon className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-950 fill-indigo-950/90 -rotate-12 translate-x-2 drop-shadow-md" />

          {/* Orbiting Sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-amber-200 absolute top-0 left-1/2 drop-shadow-sm" />
            <Stars className="w-3.5 h-3.5 text-purple-200 absolute bottom-1 right-2 drop-shadow-sm" />
          </motion.div>
        </div>
      </motion.div>

      {/* Intro Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-center max-w-xl mx-auto space-y-4 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 backdrop-blur-md text-xs sm:text-sm tracking-widest uppercase text-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>A Symphony of Stars</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">
          “A little universe,
          <br />
          <span className="font-script text-4xl sm:text-6xl md:text-7xl font-normal gold-gradient-text block mt-2">
            made just for you…”
          </span>
        </h1>

        <p className="font-sans-modern text-sm sm:text-base text-slate-300/80 font-light max-w-md mx-auto pt-2">
          An emotional, starlit celebration dedicated to <strong className="text-amber-200 font-medium">{recipientName}</strong>.
          Step into a constellation of wishes, timeless memories, and celestial magic.
        </p>
      </motion.div>

      {/* Button: "Open Your Surprise ✨" */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="mt-10 sm:mt-12 z-10"
      >
        <button
          onClick={handleOpenClick}
          disabled={isOpening}
          id="open-surprise-btn"
          className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full text-base sm:text-lg font-medium text-slate-900 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:shadow-[0_0_50px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer overflow-hidden disabled:opacity-80"
        >
          {/* Shimmer sweep effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

          {/* Button content */}
          <Sparkles className="w-5 h-5 text-amber-800 transition-transform group-hover:rotate-45" />
          <span className="font-sans-modern font-semibold tracking-wide text-slate-950">
            {isOpening ? 'Opening Your Cosmos...' : 'Open Your Surprise ✨'}
          </span>
        </button>

        <p className="text-xs text-slate-400/60 text-center mt-4 tracking-wider uppercase font-light">
          🎧 Sound On for the full cinematic experience
        </p>
      </motion.div>
    </motion.div>
  );
};
