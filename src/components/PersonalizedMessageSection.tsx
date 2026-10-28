import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, Copy, Check, Quote, Wand2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface PersonalizedMessageSectionProps {
  recipientName: string;
  messageText: string;
  onNext: () => void;
  onPrev: () => void;
}

export const PersonalizedMessageSection: React.FC<PersonalizedMessageSectionProps> = ({
  recipientName,
  messageText,
  onNext,
  onPrev,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < messageText.length) {
        setDisplayedText(prev => prev + messageText.charAt(currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28); // gentle reading speed

    return () => clearInterval(interval);
  }, [messageText, animKey]);

  const handleReplay = () => {
    audioEngine.playStarChime();
    setAnimKey(prev => prev + 1);
  };

  const handleShowAll = () => {
    setDisplayedText(messageText);
    setIsTyping(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    audioEngine.playStarChime();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="message-section"
      className="relative min-h-[90vh] py-12 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-500/10 via-purple-600/15 to-amber-500/10 blur-[90px] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-3 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-400/30 bg-pink-950/20 text-xs uppercase tracking-widest text-pink-200">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/40" />
          <span>Chapter 2 • Whispers of the Universe</span>
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl font-normal text-white">
          A Message for <span className="font-script text-4xl sm:text-6xl gold-gradient-text">{recipientName}</span>
        </h2>
        <p className="font-sans-modern text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto">
          Words penned from the heart, illuminated by the quiet majesty of a thousand stars.
        </p>
      </motion.div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-3xl glass-panel-glow rounded-3xl p-6 sm:p-12 text-left border border-amber-300/25 shadow-2xl overflow-hidden"
      >
        {/* Floating Particle Accents */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <Sparkles className="w-6 h-6 text-amber-300/60 animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <Wand2 className="w-5 h-5 text-purple-300/50 -rotate-12" />
        </div>

        {/* Decorative Quote Icon */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 border border-amber-300/30 shadow-inner">
              <Quote className="w-5 h-5 rotate-180" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold block">
                To Our Brightest Light
              </span>
              <span className="text-[11px] text-slate-400">Written with celestial warmth</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
            <span className="text-xs text-pink-300 hidden sm:inline">Special Birthday Dedication</span>
          </div>
        </div>

        {/* Typewritten Message Body */}
        <div className="min-h-[160px] sm:min-h-[140px] flex items-start">
          <p className="font-cormorant text-xl sm:text-2xl md:text-3xl font-light text-slate-100 leading-relaxed italic tracking-wide">
            “{displayedText}
            {isTyping && (
              <span className="inline-block w-2.5 h-6 ml-1 bg-amber-400 animate-pulse align-middle" />
            )}”
          </p>
        </div>

        {/* Card Footer & Signature */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-script text-2xl sm:text-3xl text-amber-200 block">
              Forever Cherished, {recipientName}
            </span>
            <span className="text-xs text-slate-400 font-light tracking-wider">
              ✦ Star Catalog ID: JJ-BIRTHDAY-CELESTIAL ✦
            </span>
          </div>

          {/* Interactive Card Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isTyping ? (
              <button
                onClick={handleShowAll}
                className="px-3 py-1.5 rounded-full text-xs text-slate-300 hover:text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Skip Typing
              </button>
            ) : (
              <button
                onClick={handleReplay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-amber-200 border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-slate-200 border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons to Previous / Next Page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-3xl"
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
          id="next-page-btn-message"
          className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
        >
          <ImageIcon className="w-5 h-5 text-amber-900 group-hover:scale-110 transition-transform" />
          <span className="tracking-wide">Step into Your Memory Gallery 📸 &rarr;</span>
          <Sparkles className="w-4 h-4 text-amber-800" />
        </button>
      </motion.div>
    </section>
  );
};
