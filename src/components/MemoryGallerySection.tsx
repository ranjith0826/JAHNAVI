import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Maximize2, Image as ImageIcon, Star, ArrowLeft } from 'lucide-react';
import type { MemoryItem } from '../types';
import { MemoryLightbox } from './MemoryLightbox';
import { audioEngine } from '../services/audioEngine';

interface MemoryGallerySectionProps {
  memories: MemoryItem[];
  onOpenCustomizer: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MemoryGallerySection: React.FC<MemoryGallerySectionProps> = ({
  memories,
  onOpenCustomizer,
  onNext,
  onPrev,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Radiance', 'Elegance', 'Cherished'];

  const filteredMemories =
    activeCategory === 'All'
      ? memories
      : memories.filter(m => m.category.toLowerCase() === activeCategory.toLowerCase());

  const handleCardClick = (index: number) => {
    audioEngine.playStarChime();
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % memories.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + memories.length) % memories.length);
  };

  return (
    <section id="gallery-section" className="relative min-h-[90vh] py-12 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-950/20 text-xs uppercase tracking-widest text-amber-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Chapter 3 • Moments Written in Starlight</span>
        </motion.div>

        <h2 className="font-playfair text-3xl sm:text-5xl font-normal text-white">
          Interactive Memory Gallery
        </h2>

        <p className="font-sans-modern text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto">
          Every glance holds a constellation of smiles. Click on any memory of Juunu to view it in full starlit glory.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Quick Customize Photos Trigger */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-purple-300 border border-purple-400/30 bg-purple-950/30 hover:bg-purple-900/40 transition-colors cursor-pointer ml-1"
            title="Upload personal photos or modify captions"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Customize Photos</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid - Perfectly centered 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto w-full">
        {filteredMemories.map((item, index) => {
          const globalIndex = memories.findIndex(m => m.id === item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => handleCardClick(globalIndex)}
              className="group relative glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(245,158,11,0.2)] flex flex-col"
            >
              {/* Portrait Aspect Ratio for Juunu's Photos */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Hover Maximize Icon Badge */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 backdrop-blur-md text-white/80 group-hover:text-amber-300 group-hover:scale-110 transition-all border border-white/10 opacity-0 group-hover:opacity-100">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-950/70 backdrop-blur-md text-amber-200 border border-amber-300/30">
                  {item.category}
                </div>
              </div>

              {/* Text Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2 bg-gradient-to-b from-transparent to-slate-950/50">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                    {item.dateTag}
                  </span>
                  <h3 className="font-playfair text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-cormorant text-base text-slate-300/80 italic line-clamp-2 mt-1">
                    “{item.caption}”
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-amber-300/80 font-medium border-t border-white/5">
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View in Lightbox &rarr;
                  </span>
                  <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons to Previous / Next Page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
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
          id="next-page-btn-gallery"
          className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] transition-all duration-300 hover:scale-105 active:scale-100 cursor-pointer overflow-hidden"
        >
          <Star className="w-5 h-5 text-amber-900 group-hover:rotate-45 transition-transform" />
          <span className="tracking-wide">Wishes Written in the Stars ⭐ &rarr;</span>
          <Sparkles className="w-4 h-4 text-amber-800" />
        </button>
      </motion.div>

      {/* Lightbox Modal */}
      <MemoryLightbox
        memories={memories}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
};
