import React, { useState } from 'react';
import { Share2, Check, Globe, Sparkles, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Capsule } from '../types/capsule';
import { sound } from '../utils/audio';

interface MyLightCardProps {
  userCapsules: Capsule[];
  onClose: () => void;
  onLocateOnEarth: (lat: number, lng: number) => void;
  onAddNewLight: () => void;
}

export const MyLightCard: React.FC<MyLightCardProps> = ({
  userCapsules,
  onClose,
  onLocateOnEarth,
  onAddNewLight,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (userCapsules.length === 0) return null;

  const currentCapsule = userCapsules[Math.min(selectedIndex, userCapsules.length - 1)];

  const shareText = `I left something behind. Find my light before the world changes.\n🌎 ${currentCapsule.id} (${currentCapsule.cityName}, ${currentCapsule.country})\n${window.location.origin}/?star=${encodeURIComponent(currentCapsule.id)}`;

  const handleCopyLink = () => {
    sound.playStarHover();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    sound.playStarHover();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Before the World Changes',
          text: `I left something behind. Find my light before the world changes. 🌎 ${currentCapsule.id}`,
          url: `${window.location.origin}/?star=${encodeURIComponent(currentCapsule.id)}`,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-[#040814]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_65px_rgba(251,191,36,0.2)]">
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          aria-label="Close star card"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Multiple Stars Selector if user has > 1 */}
        {userCapsules.length > 1 && (
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[70%]">
              {userCapsules.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    sound.playStarHover();
                    setSelectedIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono-num transition-all cursor-pointer whitespace-nowrap ${
                    idx === selectedIndex
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                >
                  {c.cityName}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono-num text-slate-400">
              {selectedIndex + 1} of {userCapsules.length}
            </span>
          </div>
        )}

        {/* Header Badge & Identifier */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono-num text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>My Sealed Light</span>
          </div>
          <h2 className="font-cinzel text-3xl font-light tracking-[0.18em] text-white uppercase glow-text-gold">
            {currentCapsule.id}
          </h2>
          <p className="text-xs text-slate-400 tracking-wider">
            Glowing above {currentCapsule.cityName}, {currentCapsule.country}
          </p>
        </div>

        {/* Shareable Card Graphic Frame */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-950 border border-amber-400/20 shadow-inner space-y-3 mb-5 text-center">
          <div className="text-3xl">🌎</div>
          <blockquote className="text-sm italic font-light text-slate-200">
            "I left something behind. Find my light before the world changes."
          </blockquote>
          <div className="text-[11px] font-mono-num tracking-widest text-amber-300">
            {currentCapsule.id}
          </div>
        </div>

        {/* Capsule Inner Details */}
        <div className="space-y-3 text-xs max-h-44 overflow-y-auto pr-1 border-t border-white/[0.06] pt-4">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Leaving Behind</span>
            <p className="text-slate-200 font-light mt-0.5">{currentCapsule.leavingBehind}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Taking With</span>
            <p className="text-slate-200 font-light mt-0.5">{currentCapsule.takingWith}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">What I Hope Changes</span>
            <p className="text-slate-200 font-light mt-0.5">{currentCapsule.hopeChanges}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">For My Future Self</span>
            <p className="text-slate-200 font-light mt-0.5">{currentCapsule.futureSelfRemember}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Gift to a Stranger</span>
            <p className="text-amber-200 italic font-light mt-0.5">"{currentCapsule.strangerSentence}"</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 pt-4 border-t border-white/[0.08]">
          <button
            onClick={() => {
              sound.playStarBirth();
              onLocateOnEarth(currentCapsule.lat, currentCapsule.lng);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Locate</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Add Another Light CTA */}
          <button
            onClick={() => {
              onClose();
              onAddNewLight();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-200 border border-cyan-400/40 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Another</span>
          </button>
        </div>
      </div>
    </div>
  );
};
