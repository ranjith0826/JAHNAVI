import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Compass, Feather, Moon, Camera, Sun, Wand2, Star } from 'lucide-react';
import type { StarWish } from '../types';

interface WishModalProps {
  wish: StarWish | null;
  recipientName: string;
  onClose: () => void;
}

export const WishModal: React.FC<WishModalProps> = ({ wish, recipientName, onClose }) => {
  if (!wish) return null;

  // Icon mapper
  const renderIcon = () => {
    const props = { className: 'w-8 h-8 text-amber-200' };
    switch (wish.iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Feather': return <Feather {...props} />;
      case 'Moon': return <Moon {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Wand2': return <Wand2 {...props} />;
      default: return <Star {...props} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full glass-panel-glow rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl text-center space-y-6 overflow-hidden"
          style={{
            boxShadow: `0 0 50px -10px ${wish.color}40`,
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Radial Background Accent */}
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ backgroundColor: wish.color }}
          />

          {/* Icon Badge */}
          <div className="relative mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-slate-900 via-purple-950 to-slate-900 border border-amber-300/40 shadow-lg">
            <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: wish.color }} />
            {renderIcon()}
          </div>

          {/* Constellation & Star Name */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium block">
              {wish.constellation}
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              {wish.name}
            </h3>
            <p className="font-cormorant text-lg text-amber-200/90 italic">
              “{wish.shortWish}”
            </p>
          </div>

          {/* Full Message */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
            <p className="font-sans-modern text-sm sm:text-base text-slate-200 font-light leading-relaxed">
              {wish.fullMessage}
            </p>
          </div>

          {/* Dedication footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Written for {recipientName}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-medium transition-colors cursor-pointer border border-amber-300/30"
            >
              Seal Wish ✨
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
