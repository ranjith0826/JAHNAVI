import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Moon, Star, X, Download } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface GrandFinaleModalProps {
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const GrandFinaleModal: React.FC<GrandFinaleModalProps> = ({
  recipientName,
  isOpen,
  onClose,
}) => {
  const triggerConfettiCannons = () => {
    audioEngine.playStarChime();

    // Side cannons
    const end = Date.now() + 3000;
    const colors = ['#FBBF24', '#F59E0B', '#F472B6', '#E9D5FF', '#FFFFFF', '#60A5FA'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    if (isOpen) {
      triggerConfettiCannons();
    }
  }, [isOpen]);

  const handleDownloadKeepsake = () => {
    const certificateText = `✦ A SYMPHONY OF STARS ✦\nOFFICIAL CELESTIAL STAR REGISTRY\n\nThis certifies that a constellation of infinite warmth, boundless happiness, and eternal starlight has been officially dedicated in honor of:\n\n★ ${recipientName} ★\n\n"Out of all the stars in the universe, this little corner of the sky belongs to you. Keep shining, keep smiling, and never forget how special you are."\n\nHappy Birthday! 🌙✨\nDate: ${new Date().toLocaleDateString()}\nCoordinate: RA 18h 36m 56s / Dec +38° 47′ 01″`;

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipientName.replace(/\s+/g, '_')}_Star_Registry_Birthday_Keepsake.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none overflow-y-auto"
        onClick={onClose}
      >
        {/* Floating Background Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/20 via-pink-600/20 to-purple-600/25 blur-3xl pointer-events-none -z-10" />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full glass-panel-glow rounded-3xl p-6 sm:p-12 border-2 border-amber-300/60 shadow-[0_0_80px_rgba(251,191,36,0.35)] text-center space-y-6 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Decorative Celestial Crown */}
          <div className="flex items-center justify-center gap-3">
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <Moon className="w-8 h-8 text-amber-200 fill-amber-200/30" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          {/* Final Headline */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              ✦ The Final Celestial Blessing ✦
            </span>

            <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Happy Birthday,
              <br />
              <span className="font-script text-4xl sm:text-6xl md:text-7xl gold-gradient-text text-gold-glow block mt-2">
                {recipientName}! 🌙✨
              </span>
            </h2>
          </div>

          {/* Heartfelt Closing Letter */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3 shadow-inner">
            <p className="font-cormorant text-xl sm:text-2xl text-slate-100 italic leading-relaxed">
              “May this year surround you with effortless happiness, brave new journeys, peace in your mind, and people who celebrate your radiance every single day.”
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              You are deeply loved, endlessly appreciated, and forever cherished.
            </p>
          </div>

          {/* Floating Sparkles & Hearts Badge */}
          <div className="flex items-center justify-center gap-2 text-pink-300">
            <Heart className="w-4 h-4 fill-pink-400" />
            <span className="font-script text-2xl text-pink-200">
              Made with pure adoration
            </span>
            <Heart className="w-4 h-4 fill-pink-400" />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={triggerConfettiCannons}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:brightness-110 shadow-lg shadow-amber-400/20 cursor-pointer transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>More Confetti! 🎉</span>
            </button>

            <button
              onClick={handleDownloadKeepsake}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-amber-200 border border-amber-400/40 bg-amber-950/40 hover:bg-amber-900/40 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Save Starlight Certificate</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
