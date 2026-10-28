import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import type { MemoryItem } from '../types';

interface MemoryLightboxProps {
  memories: MemoryItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MemoryLightbox: React.FC<MemoryLightboxProps> = ({
  memories,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onClose, onNext, onPrev]);

  if (selectedIndex === null) return null;
  const current = memories[selectedIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
          title="Close (Esc)"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-300 transition-all cursor-pointer border border-white/20 shadow-lg"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-300 transition-all cursor-pointer border border-white/20 shadow-lg"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Lightbox Content Container */}
        <motion.div
          key={current.id}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full max-h-[90vh] glass-panel-glow rounded-3xl overflow-hidden border border-amber-300/30 flex flex-col shadow-2xl"
        >
          {/* Main Photo Area */}
          <div className="relative w-full h-[52vh] sm:h-[62vh] bg-slate-950 overflow-hidden flex items-center justify-center">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover sm:object-contain object-center"
            />
            {/* Subtle glow edge */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]" />
          </div>

          {/* Caption & Metadata Footer */}
          <div className="p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl text-left">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {current.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {current.dateTag}
                </span>
              </div>

              <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-white">
                {current.title}
              </h3>
              <p className="font-cormorant text-base sm:text-lg text-slate-300 italic font-light leading-snug">
                “{current.caption}”
              </p>
            </div>

            {/* Pagination indicator */}
            <div className="text-right self-end sm:self-center shrink-0">
              <span className="font-playfair text-sm text-amber-300 font-semibold">
                {selectedIndex + 1}
              </span>
              <span className="text-xs text-slate-500"> / {memories.length}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
