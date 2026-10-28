import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, CheckCircle, ArrowLeft, Cake } from 'lucide-react';
import type { StarWish } from '../types';
import { WishModal } from './WishModal';
import { audioEngine } from '../services/audioEngine';

interface StarWishesSectionProps {
  wishes: StarWish[];
  recipientName: string;
  onNext: () => void;
  onPrev: () => void;
}

export const StarWishesSection: React.FC<StarWishesSectionProps> = ({
  wishes,
  recipientName,
  onNext,
  onPrev,
}) => {
  const [selectedWish, setSelectedWish] = useState<StarWish | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());
  const [hoveredWishId, setHoveredWishId] = useState<string | null>(null);

  const handleStarClick = (wish: StarWish) => {
    audioEngine.playStarChime();
    setSelectedWish(wish);
    setDiscoveredIds(prev => new Set([...prev, wish.id]));
  };

  // Build SVG constellation lines between adjacent stars in list
  const constellationLines = wishes.slice(0, -1).map((w, idx) => ({
    x1: `${w.xPercent}%`,
    y1: `${w.yPercent}%`,
    x2: `${wishes[idx + 1].xPercent}%`,
    y2: `${wishes[idx + 1].yPercent}%`,
    isHighlighted:
      discoveredIds.has(w.id) && discoveredIds.has(wishes[idx + 1].id),
  }));

  return (
    <section id="wishes-section" className="relative min-h-[90vh] py-12 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-400/30 bg-purple-950/25 text-xs uppercase tracking-widest text-purple-200"
        >
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
          <span>Chapter 4 • Interactive Constellation Sky</span>
        </motion.div>

        <h2 className="font-playfair text-3xl sm:text-5xl font-normal text-white">
          Wishes Written in the Stars ✨
        </h2>

        <p className="font-sans-modern text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto">
          Tonight, each glowing star holds a sacred birthday wish for <strong className="text-amber-200 font-medium">{recipientName}</strong>.
          Tap on each star to illuminate its message.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="glass-panel px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-slate-300">
              Wishes Discovered: <strong className="text-amber-300 font-semibold">{discoveredIds.size}</strong> of {wishes.length}
            </span>
            {discoveredIds.size === wishes.length && (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> All Revealed!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Constellation Sky Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[480px] sm:h-[580px] glass-panel-glow rounded-3xl border border-white/15 overflow-hidden shadow-2xl p-4 flex items-center justify-center select-none"
      >
        {/* Deep Sky Gradient & Nebula within the board */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060719] via-[#040413] to-[#02020a] pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl pointer-events-none" />

        {/* SVG Constellation Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {constellationLines.map((line, idx) => (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.isHighlighted ? '#FBBF24' : 'rgba(255, 255, 255, 0.18)'}
              strokeWidth={line.isHighlighted ? '2' : '1'}
              strokeDasharray={line.isHighlighted ? 'none' : '4 4'}
              className="transition-all duration-700"
            />
          ))}
        </svg>

        {/* Interactive Glowing Star Nodes */}
        {wishes.map((wish, index) => {
          const isDiscovered = discoveredIds.has(wish.id);
          const isHovered = hoveredWishId === wish.id;

          return (
            <div
              key={wish.id}
              style={{
                left: `${wish.xPercent}%`,
                top: `${wish.yPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div
                onMouseEnter={() => setHoveredWishId(wish.id)}
                onMouseLeave={() => setHoveredWishId(null)}
                onClick={() => handleStarClick(wish)}
                className="group relative cursor-pointer flex flex-col items-center"
              >
                {/* Expanding Glowing Outer Ring */}
                <div
                  className={`absolute -inset-3 sm:-inset-4 rounded-full transition-all duration-500 pointer-events-none ${
                    isDiscovered ? 'opacity-80 scale-110' : 'opacity-40 group-hover:opacity-100 group-hover:scale-125'
                  }`}
                  style={{
                    backgroundColor: wish.color,
                    filter: 'blur(10px)',
                  }}
                />

                {/* Animated Star Core */}
                <motion.div
                  animate={{
                    scale: isHovered ? 1.35 : [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2.5 + (index % 3) * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg ${
                    isDiscovered
                      ? 'bg-amber-300 text-slate-950 border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.8)]'
                      : 'bg-slate-900/90 text-white border-white/30 group-hover:border-amber-300'
                  }`}
                  style={{
                    borderColor: isDiscovered ? wish.color : undefined,
                  }}
                >
                  <Star
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                      isDiscovered
                        ? 'fill-slate-950 text-slate-950 rotate-12'
                        : 'fill-amber-300/40 text-amber-200 group-hover:rotate-45'
                    }`}
                  />
                </motion.div>

                {/* Tooltip on Hover */}
                <div
                  className={`absolute bottom-full mb-2 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium glass-panel border border-amber-300/30 text-white shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                    isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                  }`}
                >
                  <span className="text-amber-300 font-semibold block">{wish.name}</span>
                  <span className="text-[10px] text-slate-300 block">{wish.constellation}</span>
                </div>

                {/* Star Label Below */}
                <span className="mt-2 text-[10px] sm:text-xs text-slate-300 font-light tracking-wider uppercase text-center max-w-[90px] sm:max-w-[110px] truncate group-hover:text-amber-200 transition-colors drop-shadow-md">
                  {wish.name.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}

        {/* Legend / Tip at bottom of map */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pointer-events-none px-2">
          <span>✦ Tap any star to reveal its celestial prophecy</span>
          <span className="text-[11px] text-amber-300/80 mt-1 sm:mt-0">
            Gold lines denote interconnected blessings
          </span>
        </div>
      </motion.div>

      {/* Navigation Buttons to Previous / Next Page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-slate-300 hover:text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <button
          onClick={onNext}
          id="next-page-btn-wishes"
          className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
        >
          <Cake className="w-5 h-5 text-amber-900 group-hover:scale-110 transition-transform" />
          <span className="tracking-wide">Time for Birthday Cake & Wish 🎂 &rarr;</span>
          <Sparkles className="w-4 h-4 text-amber-800" />
        </button>
      </motion.div>

      {/* Modal for viewing clicked star wish */}
      <WishModal
        wish={selectedWish}
        recipientName={recipientName}
        onClose={() => setSelectedWish(null)}
      />
    </section>
  );
};
