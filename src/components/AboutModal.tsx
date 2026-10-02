import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeaveLight: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenLeaveLight,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-[#040814]/95 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(56,189,248,0.15)] max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Global Digital Time Capsule</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-white font-light tracking-wide uppercase glow-text">
              Before the World Changes
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            <p>
              Somewhere right now, an ancient bell is swaying in the wind. A train is cutting through mountain snow. Someone is packing a suitcase in a small bedroom, and someone else is turning off their phone to look up at the dark sky.
            </p>
            <p>
              We are accustomed to experiencing time alone—measured in calendar notifications, alarms, and personal anxieties. But once every revolution around the sun, eight billion people cross an invisible boundary into the next morning together.
            </p>
            <p>
              <strong className="text-cyan-200 font-normal">Before the World Changes</strong> is an anonymous global monument. Every participant places a quiet point of light on their approximate coordinates. You seal what you are letting go of, carry what matters forward, and leave a single sentence for a stranger whose name you will never know.
            </p>
            <p className="italic text-slate-400">
              No accounts. No vanity metrics. No ads. Just a glowing planet floating in the dark, reminding us that tomorrow belongs to everyone.
            </p>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono-num text-slate-400">
              Coordination: Planet Earth · 2026
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenLeaveLight();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
            >
              Add Your Light
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
