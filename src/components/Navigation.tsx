import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface NavigationProps {
  currentView: 'landing' | 'explore';
  onNavigate: (view: 'landing' | 'explore') => void;
  hasUserCapsule: boolean;
  onOpenMyStar: () => void;
  onOpenPostLight: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  hasUserCapsule,
  onOpenMyStar,
  onOpenPostLight,
  isMuted,
  onToggleSound,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-10 border-b border-white/[0.03] bg-black/40 backdrop-blur-sm pointer-events-auto select-none">
      {/* Wordmark */}
      <button
        onClick={() => onNavigate('landing')}
        className="font-cinzel text-xs sm:text-sm md:text-base tracking-[0.24em] text-slate-200 uppercase hover:text-cyan-300 transition-colors cursor-pointer text-left"
      >
        Before the World Changes
      </button>

      {/* Restrained Navigation */}
      <div className="flex items-center gap-4 sm:gap-6 text-xs font-light tracking-[0.2em] text-slate-400 uppercase">
        <button
          onClick={() => {
            sound.playStarHover();
            onNavigate('explore');
          }}
          className={`hover:text-slate-100 transition-colors cursor-pointer ${
            currentView === 'explore' ? 'text-slate-100 font-medium' : ''
          }`}
        >
          The Globe
        </button>

        {hasUserCapsule ? (
          <button
            onClick={() => {
              sound.playStarHover();
              onOpenMyStar();
            }}
            className="hover:text-amber-300 text-amber-400/90 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>My Star</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playStarBirth();
              onOpenPostLight();
            }}
            className="hover:text-amber-300 transition-colors cursor-pointer text-amber-400/90 font-medium"
          >
            Post a Light
          </button>
        )}

        <button
          onClick={onToggleSound}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400/80" />}
        </button>
      </div>
    </header>
  );
};
