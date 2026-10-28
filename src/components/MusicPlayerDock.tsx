import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Upload,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export const MusicPlayerDock: React.FC = () => {
  const [audioState, setAudioState] = useState(audioEngine.getState());
  const [equalizerLevels, setEqualizerLevels] = useState([0.2, 0.4, 0.3, 0.5, 0.2]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsub = audioEngine.subscribe(state => {
      setAudioState(state);
    });

    // Animate equalizer and progress
    const interval = setInterval(() => {
      setEqualizerLevels(audioEngine.getEqualizerData());
      if (audioEngine.getState().isPlaying) {
        setTrackProgress(prev => (prev >= 100 ? 0 : prev + 0.35));
      }
    }, 120);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioEngine.loadCustomAudio(file);
      audioEngine.play();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomAudioUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* Main Floating Glass Dock */}
      <motion.div
        layout
        className={`glass-panel rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
          audioState.isPlaying
            ? 'border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
            : 'border-white/10'
        } ${isExpanded ? 'p-4 w-72 sm:w-80' : 'p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3'}`}
      >
        {isExpanded ? (
          /* Expanded Full Controller */
          <div className="space-y-3">
            {/* Header / Collapse */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-semibold text-slate-200">
                  Celestial Sound Player
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Track Info */}
            <div className="text-left space-y-0.5">
              <span className="text-xs font-medium text-white block truncate">
                Symphony of the Stars
              </span>
              <span className="text-[10px] text-amber-300/80 block">
                Procedural Celestial Harp & Chimes
              </span>
            </div>

            {/* Simulated Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-pink-400 h-full transition-all duration-200"
                style={{ width: `${trackProgress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1">
              {/* Play/Pause */}
              <button
                onClick={() => audioEngine.togglePlay()}
                className="p-2.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                {audioState.isPlaying ? (
                  <Pause className="w-4 h-4 fill-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => audioEngine.toggleMute()}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  {audioState.isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.isMuted ? 0 : audioState.volume}
                  onChange={e => audioEngine.setVolume(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 accent-amber-400 h-1 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              {/* Custom Song Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Play Your Own Audio/Song File"
                className="p-2 rounded-xl border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[10px]">MP3</span>
              </button>
            </div>
          </div>
        ) : (
          /* Compact Dock Bar */
          <>
            {/* Play/Pause Button */}
            <button
              onClick={() => audioEngine.togglePlay()}
              className="p-2 sm:p-2.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-transform active:scale-90 cursor-pointer shadow-md"
              title={audioState.isPlaying ? 'Pause' : 'Play'}
            >
              {audioState.isPlaying ? (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 ml-0.5" />
              )}
            </button>

            {/* Track Title & Equalizer */}
            <div
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 cursor-pointer group px-1"
            >
              <div className="flex items-end gap-[2px] h-4 w-5">
                {equalizerLevels.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      audioState.isPlaying ? 'bg-amber-300' : 'bg-slate-600'
                    }`}
                    style={{
                      height: audioState.isPlaying ? `${Math.max(20, val * 100)}%` : '25%',
                    }}
                  />
                ))}
              </div>

              <div className="text-left hidden sm:block">
                <span className="text-[11px] font-medium text-slate-200 block max-w-[120px] truncate group-hover:text-amber-200">
                  Celestial Harp
                </span>
                <span className="text-[9px] text-slate-400 block">
                  {audioState.isPlaying ? 'Playing Ambient...' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Mute Toggle */}
            <button
              onClick={() => audioEngine.toggleMute()}
              className="p-1.5 rounded-full text-slate-400 hover:text-white cursor-pointer"
              title={audioState.isMuted ? 'Unmute' : 'Mute'}
            >
              {audioState.isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Expand arrow */}
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              title="Expand Controls"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};
