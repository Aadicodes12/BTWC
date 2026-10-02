import React, { useState } from 'react';
import { Share2, Check, Globe, X } from 'lucide-react';
import { RealParticipantCapsule } from '../server/db.ts';
import { sound } from '../utils/audio.ts';

interface StarPassModalProps {
  capsule: RealParticipantCapsule | null;
  isOpen: boolean;
  onClose: () => void;
  onLocateOnEarth: (lat: number, lng: number) => void;
  isFirstLight?: boolean;
}

export const StarPassModal: React.FC<StarPassModalProps> = ({
  capsule,
  isOpen,
  onClose,
  onLocateOnEarth,
  isFirstLight = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !capsule) return null;

  const dateStr = new Date(capsule.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const starUrl = `${window.location.origin}/?star=${encodeURIComponent(capsule.id)}`;

  const handleCopy = () => {
    sound.playStarHover();
    navigator.clipboard.writeText(starUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    sound.playStarHover();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Before the World Changes',
          text: `${capsule.id} — A light posted before the world changed.`,
          url: starUrl,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#03060f] border border-amber-400/20 rounded-3xl p-7 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        {/* Dismiss */}
        <button
          onClick={onClose}
          aria-label="Close star pass"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* First light celebration note */}
        {isFirstLight && (
          <div className="mb-4 inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono-num uppercase tracking-[0.25em] text-amber-300">
            YOU ARE THE FIRST LIGHT.
          </div>
        )}

        {/* Minimal Star Pass Graphic Frame */}
        <div className="my-2 p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.08] relative overflow-hidden">
          <div className="w-12 h-12 mx-auto rounded-full border border-amber-400/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          </div>

          <h2 className="font-cinzel text-2xl text-slate-100 tracking-[0.2em] uppercase font-light">
            {capsule.id}
          </h2>

          <p className="text-xs text-amber-300/90 font-serif italic mt-2">
            A light posted before the world changed.
          </p>

          <div className="mt-5 pt-4 border-t border-white/[0.06] text-[11px] font-mono-num text-slate-400 space-y-1">
            <div>{capsule.cityName}, {capsule.country}</div>
            <div className="text-[10px] text-slate-500">{dateStr}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => {
              sound.playStarBirth();
              onLocateOnEarth(capsule.lat, capsule.lng);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 uppercase tracking-widest transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Locate</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-medium text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Star</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
