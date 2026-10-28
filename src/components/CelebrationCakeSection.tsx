import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, RotateCcw, PartyPopper, ArrowLeft, Gift } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface CelebrationCakeSectionProps {
  recipientName: string;
  birthdayDate: string; // YYYY-MM-DD
  onNext: () => void;
  onPrev: () => void;
}

export const CelebrationCakeSection: React.FC<CelebrationCakeSectionProps> = ({
  recipientName,
  birthdayDate,
  onNext,
  onPrev,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    isToday: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    isToday: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate next birthday countdown correctly
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const parts = birthdayDate.split('-').map(Number);
      const bMonth = (parts[1] || 10) - 1; // 0-indexed month
      const bDay = parts[2] || 29;

      // Check if today is the birthday
      if (now.getMonth() === bMonth && now.getDate() === bDay) {
        setTimeLeft({
          isToday: true,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      // Calculate next birthday date (either this year or next year)
      let nextBirthday = new Date(now.getFullYear(), bMonth, bDay, 0, 0, 0);
      if (nextBirthday.getTime() < now.getTime()) {
        nextBirthday = new Date(now.getFullYear() + 1, bMonth, bDay, 0, 0, 0);
      }

      const diff = nextBirthday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        isToday: false,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [birthdayDate]);

  // Handle "Make a Wish" & blowing out the candles
  const handleMakeWish = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    audioEngine.playCandleBlowSound();

    // Trigger golden sparkles confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FBBF24', '#F59E0B', '#F472B6', '#E9D5FF', '#FFFFFF'],
    });

    setTimeout(() => {
      setWishRevealed(true);
    }, 700);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishRevealed(false);
    audioEngine.playStarChime();
  };

  return (
    <section id="cake-section" className="relative min-h-[90vh] py-12 px-4 sm:px-6 max-w-5xl mx-auto text-center flex flex-col justify-center">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-950/20 text-xs uppercase tracking-widest text-amber-200">
          <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
          <span>Chapter 5 • A Moment of Pure Wonder</span>
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl font-normal text-white">
          Today Is Your Day to Shine ✨
        </h2>

        <p className="font-sans-modern text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto">
          Close your eyes, breathe in the starlight, and whisper your deepest desire to the cosmos.
        </p>
      </motion.div>

      {/* Countdown or Today Celebration Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 max-w-2xl mx-auto"
      >
        {timeLeft.isToday ? (
          <div className="glass-panel-glow p-6 rounded-3xl border border-amber-400/50 text-center animate-pulse">
            <span className="text-2xl sm:text-3xl font-playfair font-bold gold-gradient-text block mb-1">
              🎉 IT’S CELEBRATION DAY! 🎉
            </span>
            <p className="font-cormorant text-lg text-amber-200 italic">
              Today, the stars sing in harmonious chorus for {recipientName}!
            </p>
          </div>
        ) : (
          <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 shadow-xl">
            <span className="text-xs text-slate-400 uppercase tracking-widest block mb-3">
              Counting Down to the Next Celestial Orbit
            </span>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="font-playfair text-xl sm:text-3xl font-bold text-amber-300 block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Days</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="font-playfair text-xl sm:text-3xl font-bold text-amber-300 block">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Hours</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="font-playfair text-xl sm:text-3xl font-bold text-amber-300 block">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Minutes</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="font-playfair text-xl sm:text-3xl font-bold text-amber-300 block">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Seconds</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Animated Birthday Cake Showcase */}
      <div className="relative max-w-lg mx-auto py-4 flex flex-col items-center">
        {/* Cake Pedestal / Ambient Platter */}
        <div className="relative w-72 sm:w-84 flex flex-col items-center">
          {/* Candles */}
          <div className="flex items-end justify-center gap-6 sm:gap-8 mb-[-4px] z-20">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Candle Flame / Smoke */}
                <AnimatePresence>
                  {candlesLit ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="relative w-5 h-8 flex items-center justify-center cursor-pointer"
                      onClick={handleMakeWish}
                      title="Click to blow out candle"
                    >
                      {/* Flickering Outer Flame */}
                      <div className="candle-flame w-4 h-7 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_#f59e0b]" />
                      {/* Inner blue base */}
                      <div className="absolute bottom-1 w-2 h-2 rounded-full bg-blue-400/80 blur-[1px]" />
                    </motion.div>
                  ) : (
                    /* Smoke Particle */
                    <motion.div
                      initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -25, scale: 1.8, x: (idx - 1) * 8 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="w-3 h-3 rounded-full bg-slate-400/60 blur-[2px] pointer-events-none mb-2"
                    />
                  )}
                </AnimatePresence>

                {/* Candle Wick */}
                <div className="w-[2px] h-3 bg-slate-800 -mb-[1px]" />

                {/* Candle Body */}
                <div
                  className={`w-3.5 sm:w-4 rounded-t-sm shadow-md border-t border-amber-200/40 ${
                    idx === 1
                      ? 'h-16 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500'
                      : 'h-13 bg-gradient-to-b from-pink-200 via-pink-300 to-purple-400'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Cake Top Tier */}
          <div className="w-44 sm:w-52 h-14 rounded-2xl bg-gradient-to-b from-indigo-900 via-purple-950 to-slate-950 border-2 border-amber-400/50 shadow-xl relative z-10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-3 bg-amber-400/40 rounded-full blur-[1px]" />
            <span className="font-script text-xl sm:text-2xl text-amber-200 drop-shadow-md">
              {recipientName.includes('(') ? recipientName.split('(')[1].replace(')', '') : recipientName} ✨
            </span>
            {/* Gold leaf stars */}
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute left-3 top-3 opacity-80" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute right-3 bottom-2 opacity-80" />
          </div>

          {/* Cake Middle Tier */}
          <div className="w-56 sm:w-68 h-18 rounded-2xl -mt-2 bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 border-2 border-amber-400/40 shadow-2xl relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-4 bg-pink-400/30 rounded-full blur-[2px]" />
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]" />
              <span className="font-playfair text-xs sm:text-sm tracking-widest uppercase text-slate-200">
                A Symphony of Stars
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]" />
            </div>
          </div>

          {/* Cake Base Stand */}
          <div className="w-68 sm:w-80 h-5 rounded-full bg-gradient-to-r from-amber-400/30 via-amber-200/50 to-amber-400/30 -mt-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-amber-300/40" />
        </div>

        {/* Action Button: "Make a Wish" or "Relight" */}
        <div className="mt-6">
          {candlesLit ? (
            <button
              onClick={handleMakeWish}
              id="make-a-wish-btn"
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 rounded-full text-base font-semibold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:shadow-[0_0_55px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
            >
              <Wind className="w-5 h-5 text-amber-900 group-hover:-translate-x-1 transition-transform" />
              <span>Make a Wish & Blow the Candles 🎂</span>
              <Sparkles className="w-4 h-4 text-amber-800" />
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-amber-200 border border-amber-400/40 bg-amber-950/40 hover:bg-amber-900/50 transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>Relight the Candles ✨</span>
            </button>
          )}
        </div>

        {/* Revealed Secret Birthday Wish & Blessing Card */}
        <AnimatePresence>
          {wishRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-6 max-w-lg w-full glass-panel-glow p-5 sm:p-7 rounded-3xl border border-amber-400/50 shadow-2xl text-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400/20 mx-auto flex items-center justify-center text-amber-300 border border-amber-300/40">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                Your Wish Has Been Whispered to the Cosmos!
              </h3>
              <p className="font-cormorant text-base sm:text-lg text-amber-200 italic leading-relaxed">
                “May the silent wishes of your heart take flight tonight. May every path you tread be illuminated by happiness, prosperity, good health, and true wonder. Happy Birthday, {recipientName}!”
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
          id="next-page-btn-cake"
          className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
        >
          <Gift className="w-5 h-5 text-amber-900 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">One Last Final Surprise 🌙✨ &rarr;</span>
          <Sparkles className="w-4 h-4 text-amber-800" />
        </button>
      </motion.div>
    </section>
  );
};
