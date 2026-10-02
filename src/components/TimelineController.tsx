import React from 'react';
import { TimelinePhase } from '../types/capsule';
import { sound } from '../utils/audio';
import { Play, Clock, Sparkles } from 'lucide-react';

interface TimelineControllerProps {
  currentPhase: TimelinePhase;
  onSelectPhase: (phase: TimelinePhase) => void;
  onTrigger10sClimax: () => void;
  onClose: () => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentPhase,
  onSelectPhase,
  onTrigger10sClimax,
  onClose,
}) => {
  const phases: { id: TimelinePhase; label: string; desc: string }[] = [
    { id: '30_days', label: '30 Days Out', desc: 'Faint, sparse lights across continents.' },
    { id: '7_days', label: '7 Days Out', desc: 'Globe is noticeably populated by early travellers.' },
    { id: '24_hours', label: '24 Hours Out', desc: 'Thousands of glowing lanterns illuminate the dark.' },
    { id: '1_hour', label: '1 Hour Out', desc: 'Densely illuminated web of human anticipation.' },
    { id: 'countdown_10s', label: 'Final 10 Seconds', desc: 'Earth halts, UI fades, darkness, then the flare.' },
    { id: 'post_event', label: 'Post-Event Dawn', desc: 'Reflection experience: “You Made It” & First Line.' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-[#030712]/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(56,189,248,0.2)]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-slate-200">
            Temporal Simulation
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {phases.map((p) => {
          const isActive = currentPhase === p.id;
          const isClimax = p.id === 'countdown_10s';

          return (
            <button
              key={p.id}
              onClick={() => {
                sound.playStarHover();
                if (isClimax) {
                  onTrigger10sClimax();
                } else {
                  onSelectPhase(p.id);
                }
              }}
              className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-20 ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : isClimax
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium tracking-wide ${
                  isActive ? 'text-cyan-200' : isClimax ? 'text-amber-300' : 'text-slate-300'
                }`}>
                  {p.label}
                </span>
                {isClimax ? (
                  <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                ) : (
                  isActive && <Sparkles className="w-3 h-3 text-cyan-400" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-light line-clamp-2">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
