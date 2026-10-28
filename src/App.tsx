import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CosmicCanvas } from './components/CosmicCanvas';
import { OpeningScreen } from './components/OpeningScreen';
import { HeroSection } from './components/HeroSection';
import { PersonalizedMessageSection } from './components/PersonalizedMessageSection';
import { MemoryGallerySection } from './components/MemoryGallerySection';
import { StarWishesSection } from './components/StarWishesSection';
import { CelebrationCakeSection } from './components/CelebrationCakeSection';
import { FinalSurpriseSection } from './components/FinalSurpriseSection';
import { MusicPlayerDock } from './components/MusicPlayerDock';
import { CustomizerModal } from './components/CustomizerModal';
import { INITIAL_CONFIG, INITIAL_STAR_WISHES } from './data/initialData';
import type { SurpriseConfig, StarWish } from './types';
import { SlidersHorizontal } from 'lucide-react';
import { audioEngine } from './services/audioEngine';

export function App() {
  const [pageStep, setPageStep] = useState<number>(0);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<SurpriseConfig>(() => {
    try {
      const saved = localStorage.getItem('juunu_birthday_gallery_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return INITIAL_CONFIG;
  });

  const [wishes] = useState<StarWish[]>(INITIAL_STAR_WISHES);

  const handleSaveConfig = (newConfig: SurpriseConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('juunu_birthday_gallery_v3', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  };

  const goToStep = (step: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioEngine.playStarChime();
    setPageStep(step);
  };

  const handleOpenSurprise = () => {
    setIsWarping(false);
    goToStep(1);
  };

  const chapterTitles = [
    'Cosmic Gate',
    'Celestial Celebration',
    'Heartfelt Letter',
    'Memory Gallery',
    'Constellation Wishes',
    'Birthday Cake & Candles',
    'Grand Finale',
  ];

  return (
    <div className="relative min-h-screen bg-[#03030c] text-slate-100 font-sans-modern overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Dynamic Canvas Stars & Nebula Background */}
      <CosmicCanvas isWarping={isWarping} />

      {/* Discreet Minimal Top Indicator (Only visible after opening) */}
      {pageStep > 0 && (
        <header className="fixed top-4 left-0 right-0 z-30 px-4 sm:px-8 flex items-center justify-between pointer-events-none">
          {/* Chapter Progress Pill */}
          <div className="glass-panel px-4 py-1.5 rounded-full border border-white/10 text-xs flex items-center gap-2 pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 font-medium">Chapter {pageStep} of 6:</span>
            <span className="text-slate-300 font-light hidden sm:inline">
              {chapterTitles[pageStep]}
            </span>
          </div>

          {/* Discreet Edit / Personalize trigger */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            title="Edit Details & Memories"
            className="glass-panel p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-amber-400/40 pointer-events-auto transition-colors cursor-pointer shadow-lg"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </header>
      )}

      {/* Step-by-Step Page Chapters */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* Page 0: Cosmic Intro Gate */}
          {pageStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <OpeningScreen
                recipientName={config.recipientName}
                onWarpStart={() => setIsWarping(true)}
                onOpen={handleOpenSurprise}
              />
            </motion.div>
          )}

          {/* Page 1: Hero Section */}
          {pageStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <HeroSection
                recipientName={config.recipientName}
                subtitle={config.subtitle}
                onNext={() => goToStep(2)}
              />
            </motion.div>
          )}

          {/* Page 2: Personalized Birthday Message */}
          {pageStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <PersonalizedMessageSection
                recipientName={config.recipientName}
                messageText={config.customMessage}
                onNext={() => goToStep(3)}
                onPrev={() => goToStep(1)}
              />
            </motion.div>
          )}

          {/* Page 3: Interactive Memory Gallery */}
          {pageStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <MemoryGallerySection
                memories={config.memories}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
                onNext={() => goToStep(4)}
                onPrev={() => goToStep(2)}
              />
            </motion.div>
          )}

          {/* Page 4: Interactive Star Wishes Constellation */}
          {pageStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <StarWishesSection
                wishes={wishes}
                recipientName={config.recipientName}
                onNext={() => goToStep(5)}
                onPrev={() => goToStep(3)}
              />
            </motion.div>
          )}

          {/* Page 5: Birthday Cake & Celebration */}
          {pageStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <CelebrationCakeSection
                recipientName={config.recipientName}
                birthdayDate={config.birthdayDate}
                onNext={() => goToStep(6)}
                onPrev={() => goToStep(4)}
              />
            </motion.div>
          )}

          {/* Page 6: Final Grand Finale Surprise */}
          {pageStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <FinalSurpriseSection
                recipientName={config.recipientName}
                onPrev={() => goToStep(5)}
                onRestart={() => goToStep(0)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Background Music Player Dock */}
      <MusicPlayerDock />

      {/* Customizer / Personalization Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        config={config}
        onSave={handleSaveConfig}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
}

export default App;
