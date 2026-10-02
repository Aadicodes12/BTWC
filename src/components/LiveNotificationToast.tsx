import React from 'react';
import { Capsule } from '../types/capsule';
import { Sparkles, X, Globe } from 'lucide-react';

interface LiveNotificationToastProps {
  capsule: Capsule | null;
  onLocate: (capsule: Capsule) => void;
  onDismiss: () => void;
}

export const LiveNotificationToast: React.FC<LiveNotificationToastProps> = ({
  capsule,
  onLocate,
  onDismiss,
}) => {
  if (!capsule) return null;

  return (
    <div className="fixed top-20 right-6 z-40 max-w-sm pointer-events-auto animate-fade-in">
      <div className="relative p-4 rounded-2xl bg-[#040814]/90 backdrop-blur-xl border border-cyan-400/30 shadow-[0_0_30px_rgba(56,189,248,0.2)] text-left">
        <button
          onClick={onDismiss}
          aria-label="Dismiss live alert"
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono-num uppercase tracking-widest text-cyan-300 font-medium">
            Live Request on Globe
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-200">
          {capsule.cityName}, {capsule.country}
        </div>

        <p className="text-xs italic text-slate-300 font-light mt-1 line-clamp-2">
          "{capsule.strangerSentence}"
        </p>

        <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[10px] font-mono-num text-slate-400">
            {capsule.id}
          </span>
          <button
            onClick={() => onLocate(capsule)}
            className="flex items-center gap-1.5 text-[11px] text-cyan-300 hover:text-cyan-200 uppercase tracking-wider font-medium cursor-pointer"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Locate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
