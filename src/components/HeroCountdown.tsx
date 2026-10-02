import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface HeroCountdownProps {
  onEnterGlobe: () => void;
  onOpenPostLight: () => void;
  realParticipantCount: number;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  onEnterGlobe,
  onOpenPostLight,
  realParticipantCount,
}) => {
  // Target milestone: e.g. New Year 2027 (or configurable milestone)
  const targetDate = new Date('2026-12-31T23:59:59Z').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Wording evolves naturally with real participation
  const getLightsCounterText = () => {
    if (realParticipantCount === 0) {
      return '0 LIGHTS HAVE BEEN POSTED';
    } else if (realParticipantCount === 1) {
      return '1 LIGHT HAS BEEN POSTED';
    } else {
      return `${realParticipantCount.toLocaleString()} LIGHTS HAVE BEEN POSTED`;
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between items-center px-6 py-12 md:py-20 pointer-events-none select-none">
      {/* Top spacer */}
      <div />

      {/* Center Cinematic Block */}
      <div className="text-center max-w-3xl space-y-6 animate-fade-in pointer-events-none">
        <div className="space-y-3">
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.2em] text-slate-100 uppercase glow-text">
            Before the World Changes
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-slate-300 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Everyone is somewhere. <br className="hidden sm:inline" />
            Everyone is becoming someone.
          </p>
        </div>

        {/* Real Countdown */}
        <div className="pt-6 pb-2 space-y-2">
          <div className="text-[11px] font-mono-num uppercase tracking-[0.3em] text-slate-500 font-light">
            UNTIL THE WORLD CHANGES
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-6 font-mono-num text-2xl sm:text-4xl text-slate-100 font-light tracking-wider">
            <div>
              <span>{pad(timeLeft.days)}</span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-600 font-mono-num mt-1">Days</span>
            </div>
            <span className="text-slate-700">:</span>
            <div>
              <span>{pad(timeLeft.hours)}</span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-600 font-mono-num mt-1">Hours</span>
            </div>
            <span className="text-slate-700">:</span>
            <div>
              <span>{pad(timeLeft.minutes)}</span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-600 font-mono-num mt-1">Mins</span>
            </div>
            <span className="text-slate-700">:</span>
            <div>
              <span>{pad(timeLeft.seconds)}</span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-600 font-mono-num mt-1">Secs</span>
            </div>
          </div>
        </div>

        {/* Real Participant Count (Never Fabricated) */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs font-mono-num uppercase tracking-[0.25em] text-amber-300/90">
            <span className={`w-1.5 h-1.5 rounded-full ${realParticipantCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>{getLightsCounterText()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pointer-events-auto">
          <button
            onClick={() => {
              sound.playStarHover();
              onEnterGlobe();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 font-light text-xs uppercase tracking-[0.2em] rounded-full transition-all cursor-pointer hover:border-white/30"
          >
            <span>ENTER THE GLOBE</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              sound.playStarBirth();
              onOpenPostLight();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-medium text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_30px_rgba(251,191,36,0.35)] cursor-pointer hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>POST YOUR LIGHT ✦</span>
          </button>
        </div>
      </div>

      {/* Bottom Quiet Note */}
      <div className="text-[11px] font-mono-num text-slate-600 tracking-widest uppercase">
        A planetary digital ritual
      </div>
    </div>
  );
};
