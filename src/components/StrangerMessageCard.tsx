import React, { useState } from 'react';
import { Sparkles, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Capsule } from '../types/capsule';
import { sound } from '../utils/audio';

interface StrangerMessageCardProps {
  capsule: Capsule;
  userCapsule: Capsule | null;
  onSendLight: (targetCapsule: Capsule) => void;
  onClose: () => void;
  isSent: boolean;
}

export const StrangerMessageCard: React.FC<StrangerMessageCardProps> = ({
  capsule,
  userCapsule,
  onSendLight,
  onClose,
  isSent,
}) => {
  const [animating, setAnimating] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const handleSendLight = () => {
    if (isSent || animating) return;
    setAnimating(true);
    sound.playSendLightConnection();
    onSendLight(capsule);
    setTimeout(() => {
      setAnimating(false);
    }, 1200);
  };

  const getRegionName = (reg?: string) => {
    switch (reg) {
      case 'australia': return 'Australia · 400 Lights';
      case 'africa': return 'Africa · 400 Lights';
      case 'north_america': return 'North America · 650 Lights';
      case 'south_america': return 'South America · 650 Lights';
      case 'europe': return 'Europe · 650 Lights';
      default: return 'Global Light';
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg">
      <div className="relative p-6 sm:p-7 rounded-3xl bg-[#040814]/95 backdrop-blur-xl border border-cyan-500/35 shadow-[0_0_55px_rgba(56,189,248,0.25)]">
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          aria-label="Dismiss message card"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Location, Region & Star ID metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2.5">
          <span className="font-semibold text-cyan-300 tracking-wide text-sm">
            {capsule.cityName}, {capsule.country}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-[11px] font-mono-num text-cyan-400/90 tracking-wider">
            {getRegionName(capsule.region)}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono-num text-[11px] text-slate-400">
            {capsule.id}
          </span>
        </div>

        {/* Primary Stranger Message */}
        <blockquote className="text-base sm:text-lg font-light italic text-slate-100 leading-relaxed glow-text">
          "{capsule.strangerSentence}"
        </blockquote>

        {/* Context line */}
        <div className="mt-2 text-xs tracking-wider text-slate-400 font-light flex items-center justify-between">
          <span>Someone somewhere in the world left this for you.</span>
          <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-medium tracking-widest uppercase cursor-pointer"
          >
            <span>{showFullDetails ? 'Less' : 'Read Capsule'}</span>
            {showFullDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Full Capsule Quotes & Reflections ("quotes and stuff") */}
        {showFullDetails && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 text-xs max-h-56 overflow-y-auto pr-1 animate-fade-in">
            {capsule.leavingBehind && (
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Leaving Behind</span>
                <p className="text-slate-200 font-light mt-0.5 leading-relaxed">{capsule.leavingBehind}</p>
              </div>
            )}
            {capsule.takingWith && (
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Taking With</span>
                <p className="text-slate-200 font-light mt-0.5 leading-relaxed">{capsule.takingWith}</p>
              </div>
            )}
            {capsule.hopeChanges && (
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">What They Hope Changes</span>
                <p className="text-slate-200 font-light mt-0.5 leading-relaxed">{capsule.hopeChanges}</p>
              </div>
            )}
            {capsule.futureSelfRemember && (
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Note to Future Self</span>
                <p className="text-cyan-200 font-light mt-0.5 leading-relaxed italic">"{capsule.futureSelfRemember}"</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button: Send Them a Light ✦ */}
        <div className="mt-5 flex items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
          <button
            onClick={handleSendLight}
            disabled={isSent || animating}
            className={`flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer ${
              isSent
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white text-slate-950 hover:bg-cyan-200 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-95'
            }`}
          >
            {isSent ? (
              <>
                <Check className="w-4 h-4 text-amber-400" />
                <span>Light Connected ✦</span>
              </>
            ) : animating ? (
              <>
                <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span>Send Them a Light</span>
                <span className="text-amber-400">✦</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
