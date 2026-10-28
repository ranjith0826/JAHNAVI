import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, Image, Sparkles, User, Calendar, MessageSquare } from 'lucide-react';
import type { SurpriseConfig } from '../types';
import { INITIAL_CONFIG } from '../data/initialData';
import { audioEngine } from '../services/audioEngine';

interface CustomizerModalProps {
  isOpen: boolean;
  config: SurpriseConfig;
  onSave: (newConfig: SurpriseConfig) => void;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  config,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<SurpriseConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'general' | 'memories'>('general');

  if (!isOpen) return null;

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updatedMemories = [...formData.memories];
          updatedMemories[index] = {
            ...updatedMemories[index],
            imageUrl: reader.result,
          };
          setFormData({ ...formData, memories: updatedMemories });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemoryTextChange = (
    index: number,
    field: 'title' | 'caption' | 'category' | 'dateTag',
    value: string
  ) => {
    const updated = [...formData.memories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, memories: updated });
  };

  const handleSave = () => {
    audioEngine.playStarChime();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all details back to original default settings?')) {
      setFormData({ ...INITIAL_CONFIG });
      onSave(INITIAL_CONFIG);
      audioEngine.playStarChime();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-3xl w-full glass-panel-glow rounded-3xl p-5 sm:p-8 border border-white/20 shadow-2xl my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                  Personalize the Experience
                </h3>
                <p className="text-xs text-slate-400">
                  Easily tailor names, birthday date, heartfelt words, and photos
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 pt-4 pb-2 shrink-0">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Details & Message</span>
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'memories'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Photos & Memories ({formData.memories.length})</span>
            </button>
          </div>

          {/* Form Scroll Body */}
          <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
            {activeTab === 'general' ? (
              <>
                {/* Recipient Name */}
                <div className="text-left space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Jahnavi (Juunu)"
                  />
                </div>

                {/* Subtitle */}
                <div className="text-left space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Birthday Date */}
                <div className="text-left space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    Birthday Date (for accurate countdown / live celebration)
                  </label>
                  <input
                    type="date"
                    value={formData.birthdayDate}
                    onChange={e => setFormData({ ...formData, birthdayDate: e.target.value })}
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Heartfelt Message */}
                <div className="text-left space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
                    Personalized Birthday Message (Typewriter text)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.customMessage}
                    onChange={e => setFormData({ ...formData, customMessage: e.target.value })}
                    className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>
              </>
            ) : (
              /* Memories / Photo Customizer */
              <div className="space-y-4">
                <p className="text-xs text-slate-400 text-left">
                  Click on “Change Photo” to upload any JPG/PNG from your device, or customize titles and captions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.memories.map((mem, idx) => (
                    <div
                      key={mem.id}
                      className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-3 text-left"
                    >
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-xs font-medium text-white transition-opacity cursor-pointer">
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={mem.title}
                          onChange={e => handleMemoryTextChange(idx, 'title', e.target.value)}
                          placeholder="Memory Title"
                          className="w-full bg-slate-900/70 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                        <textarea
                          rows={2}
                          value={mem.caption}
                          onChange={e => handleMemoryTextChange(idx, 'caption', e.target.value)}
                          placeholder="Caption..."
                          className="w-full bg-slate-900/70 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
