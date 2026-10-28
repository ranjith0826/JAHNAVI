import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Mail } from 'lucide-react';

interface HeroSectionProps {
  recipientName: string;
  subtitle: string;
  onNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ recipientName, subtitle, onNext }) => {
  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 text-center overflow-hidden"
    >
      {/* Radiant Cosmic Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-gradient-to-tr from-amber-500/10 via-purple-600/15 to-pink-500/10 blur-[100px] pointer-events-none -z-10" />

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 z-10">
        {/* Floating Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-950/20 backdrop-blur-md text-xs sm:text-sm font-medium tracking-widest uppercase text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Chapter 1 • Celestial Celebration</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>A Symphony of Stars</span>
        </motion.div>

        {/* Large Elegant Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className="space-y-2"
        >
          <h2 className="font-cormorant text-xl sm:text-2xl md:text-3xl tracking-widest uppercase text-slate-300 font-light">
            In Honour of an Extraordinary Soul
          </h2>

          <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-tight">
            Happy Birthday,
            <span className="block mt-2 font-script text-5xl sm:text-7xl md:text-8xl lg:text-9xl gold-gradient-text text-gold-glow">
              {recipientName} ✨
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-cormorant text-lg sm:text-2xl md:text-3xl text-slate-200/90 italic font-light max-w-2xl mx-auto px-4 leading-relaxed"
        >
          “{subtitle}”
        </motion.p>

        {/* Cinematic Starlight Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center justify-center gap-4 py-2"
        >
          <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          <Star className="w-4 h-4 text-amber-300 fill-amber-300/40 animate-pulse" />
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30" />
          <Star className="w-4 h-4 text-amber-300 fill-amber-300/40 animate-pulse" />
          <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-amber-400/50 to-transparent" />
        </motion.div>

        {/* Celestial Constellation Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="pt-2 grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto text-center"
        >
          <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 hover:border-amber-400/30 transition-colors">
            <span className="font-playfair text-lg sm:text-2xl font-bold text-amber-300 block">365</span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-light uppercase tracking-wider">
              Golden Sunrises
            </span>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 hover:border-purple-400/30 transition-colors">
            <span className="font-playfair text-lg sm:text-2xl font-bold text-purple-300 block">Infinite</span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-light uppercase tracking-wider">
              Cosmic Love
            </span>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 hover:border-pink-400/30 transition-colors">
            <span className="font-playfair text-lg sm:text-2xl font-bold text-pink-300 block">1 of 1</span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-light uppercase tracking-wider">
              Rare & Treasured
            </span>
          </div>
        </motion.div>

        {/* Big Navigation Button to Next Page */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="pt-6 flex items-center justify-center"
        >
          <button
            onClick={onNext}
            id="next-page-btn-hero"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_65px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
          >
            <Mail className="w-5 h-5 text-amber-900 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Read Your Birthday Letter 💖 &rarr;</span>
            <Sparkles className="w-4 h-4 text-amber-800" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
