import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Moon, Gift, ArrowLeft, RotateCcw } from 'lucide-react';
import { GrandFinaleModal } from './GrandFinaleModal';
import { audioEngine } from '../services/audioEngine';

interface FinalSurpriseSectionProps {
  recipientName: string;
  onPrev: () => void;
  onRestart: () => void;
}

export const FinalSurpriseSection: React.FC<FinalSurpriseSectionProps> = ({
  recipientName,
  onPrev,
  onRestart,
}) => {
  const [isFinaleOpen, setIsFinaleOpen] = useState(false);

  const handleOpenFinale = () => {
    audioEngine.playStarChime();
    setIsFinaleOpen(true);
  };

  return (
    <section
      id="finale-section"
      className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 text-center overflow-hidden"
    >
      {/* Background celestial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-800/15 via-pink-600/15 to-amber-500/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-8 z-10">
        {/* Floating Moon Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-400/30 bg-pink-950/20 text-xs uppercase tracking-widest text-pink-200"
        >
          <Moon className="w-3.5 h-3.5 text-amber-300" />
          <span>Chapter 6 • Final Celestial Surprise</span>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="font-playfair text-3xl sm:text-5xl md:text-6xl font-normal text-white leading-tight"
        >
          Your Place Among the Stars
        </motion.h2>

        {/* Heartfelt Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="glass-panel-glow p-8 sm:p-12 rounded-3xl border border-amber-300/30 shadow-2xl relative"
        >
          <Sparkles className="w-5 h-5 text-amber-300 absolute top-4 right-4 animate-pulse" />
          <Star className="w-4 h-4 text-pink-300 absolute bottom-4 left-4" />

          <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-slate-100 font-light italic leading-relaxed">
            “Out of all the stars in the universe, this little corner of the sky belongs to you. Keep shining, keep smiling, and never forget how special you are. 💖”
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-amber-200">
            <span className="h-[1px] w-12 bg-amber-400/40" />
            <span className="font-script text-2xl">Forever in your orbit</span>
            <span className="h-[1px] w-12 bg-amber-400/40" />
          </div>
        </motion.div>

        {/* Button: "One Last Surprise ✨" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-2 flex flex-col items-center justify-center gap-4"
        >
          <button
            onClick={handleOpenFinale}
            id="one-last-surprise-btn"
            className="group relative inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:shadow-[0_0_70px_rgba(251,191,36,0.9)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
          >
            <Gift className="w-5 h-5 text-amber-900 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide text-slate-950">One Last Surprise ✨</span>
            <Sparkles className="w-4 h-4 text-amber-800" />
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>

            <span className="text-slate-600">•</span>

            <button
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs text-amber-300/80 hover:text-amber-200 border border-amber-400/20 bg-amber-950/20 hover:bg-amber-900/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay from Beginning ↺</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grand Finale Celebration Takeover */}
      <GrandFinaleModal
        recipientName={recipientName}
        isOpen={isFinaleOpen}
        onClose={() => setIsFinaleOpen(false)}
      />
    </section>
  );
};
