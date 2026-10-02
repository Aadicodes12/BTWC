import React, { useState, useEffect } from 'react';
import { RealParticipantCapsule } from '../server/db.ts';
import { sound } from '../utils/audio.ts';

interface ClimaxTransitionProps {
  userCapsule: RealParticipantCapsule | null;
  onBlackoutChange: (blackout: boolean) => void;
  onBurstChange: (burst: boolean) => void;
  onExitClimax: () => void;
  onSavePostEventLine: (line: string) => void;
}

export const ClimaxTransition: React.FC<ClimaxTransitionProps> = ({
  userCapsule,
  onBlackoutChange,
  onBurstChange,
  onExitClimax,
  onSavePostEventLine,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [stage, setStage] = useState<
    'counting' | 'darkness' | 'world_changed' | 'you_werent_alone' | 'after_event'
  >('counting');
  const [postEventLine, setPostEventLine] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 10s Countdown sequence
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerDarkness();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const triggerDarkness = () => {
    setStage('darkness');
    onBlackoutChange(true);
    sound.triggerClimaxSilence();

    // 2.2s complete darkness & silence pause
    setTimeout(() => {
      setStage('world_changed');
      onBlackoutChange(false);
      onBurstChange(true);
      sound.playClimaxChime();

      // 4.5s later: "YOU WEREN'T ALONE"
      setTimeout(() => {
        setStage('you_werent_alone');

        // 5s later: "AFTER THE EVENT"
        setTimeout(() => {
          setStage('after_event');
          sound.startCelestialDrone();
        }, 5000);
      }, 4500);
    }, 2200);
  };

  const handleSaveContinuation = () => {
    if (postEventLine.trim()) {
      onSavePostEventLine(postEventLine.trim().slice(0, 120));
      setIsSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 select-none animate-fade-in">
      {/* 10-Second Countdown */}
      {stage === 'counting' && (
        <div className="text-center space-y-4">
          <div className="text-[12px] font-mono-num uppercase tracking-[0.4em] text-slate-500">
            UNTIL THE WORLD CHANGES
          </div>
          <div className="font-cinzel text-7xl sm:text-9xl text-slate-100 font-light tracking-wider animate-pulse">
            {secondsLeft}
          </div>
        </div>
      )}

      {/* Complete Darkness & Silence */}
      {stage === 'darkness' && <div className="text-transparent">.</div>}

      {/* THE WORLD HAS CHANGED */}
      {stage === 'world_changed' && (
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl text-white font-light tracking-[0.25em] uppercase glow-text">
            THE WORLD HAS CHANGED.
          </h1>
        </div>
      )}

      {/* YOU WEREN'T ALONE */}
      {stage === 'you_werent_alone' && (
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl text-amber-300 font-light tracking-[0.25em] uppercase glow-text-gold">
            YOU WEREN'T ALONE.
          </h1>
        </div>
      )}

      {/* AFTER THE EVENT: YOU MADE IT */}
      {stage === 'after_event' && (
        <div className="max-w-xl w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="font-cinzel text-4xl sm:text-5xl text-slate-100 font-light tracking-[0.2em] uppercase">
              YOU MADE IT.
            </h1>
            <p className="text-xs text-slate-400 tracking-wider">
              The world is different now, and so are you.
            </p>
          </div>

          {/* Reveal what they left behind */}
          {userCapsule && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-left space-y-3">
              <div className="text-[10px] font-mono-num uppercase tracking-[0.25em] text-amber-400">
                WHAT YOU LEFT BEHIND
              </div>
              <div className="text-base font-cinzel text-slate-200">
                "{userCapsule.leavingConcept}"
              </div>
              {userCapsule.futureSelfLine && (
                <div className="text-xs italic text-slate-400 pt-2 border-t border-white/[0.04]">
                  "{userCapsule.futureSelfLine}"
                </div>
              )}
            </div>
          )}

          {/* WRITE YOUR FIRST LINE */}
          <div className="space-y-4 pt-2">
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-mono-num">
              WRITE YOUR FIRST LINE.
            </div>

            <textarea
              maxLength={120}
              rows={3}
              value={postEventLine}
              onChange={(e) => setPostEventLine(e.target.value)}
              placeholder="Now that the world has changed..."
              className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 resize-none font-light leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-num text-slate-600">
                {postEventLine.length}/120
              </span>

              {isSaved ? (
                <span className="text-xs text-amber-300 font-mono-num tracking-widest">
                  RECORDED IN YOUR STAR ✦
                </span>
              ) : (
                <button
                  onClick={handleSaveContinuation}
                  disabled={!postEventLine.trim()}
                  className="px-6 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 font-medium text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  SAVE
                </button>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onExitClimax}
              className="text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
            >
              RETURN TO EARTH →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
