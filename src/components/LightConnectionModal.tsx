import React, { useState } from 'react';
import { X, Sparkles, Send, Globe } from 'lucide-react';
import { RealParticipantCapsule } from '../server/db.ts';
import { sound } from '../utils/audio.ts';

interface LightConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStranger: RealParticipantCapsule | null;
  userCapsule: RealParticipantCapsule | null;
  onSendLight: (target: RealParticipantCapsule) => void;
  isSent: boolean;
  onOpenPostLight: () => void;
  totalParticipants: number;
}

export const LightConnectionModal: React.FC<LightConnectionModalProps> = ({
  isOpen,
  onClose,
  targetStranger,
  userCapsule,
  onSendLight,
  isSent,
  onOpenPostLight,
  totalParticipants,
}) => {
  if (!isOpen) return null;

  const hasEnoughParticipants = totalParticipants > 1 && !!targetStranger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#03060f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        <button
          onClick={onClose}
          aria-label="Close connection modal"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!hasEnoughParticipants ? (
          /* Zero/Low Participants State */
          <div className="space-y-6 py-4">
            <div className="w-12 h-12 mx-auto rounded-full border border-white/10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            </div>

            <div className="space-y-2">
              <h2 className="font-cinzel text-xl text-slate-200 font-light tracking-[0.2em] uppercase">
                NO OTHER LIGHTS YET.
              </h2>
              <p className="text-xs text-amber-300/90 font-serif italic">
                YOU COULD BE THE FIRST.
              </p>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed">
              When other real participants seal their capsules across Earth, their lights will glow here.
            </p>

            {!userCapsule && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPostLight();
                }}
                className="w-full py-3 px-6 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-medium text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105"
              >
                POST YOUR LIGHT ✦
              </button>
            )}
          </div>
        ) : (
          /* Real Anonymous Participant Found */
          <div className="space-y-6 py-2">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-num uppercase tracking-[0.25em] text-cyan-400">
                FIND A LIGHT
              </span>
              <h2 className="font-cinzel text-xl text-slate-100 font-light tracking-wider">
                {targetStranger.id}
              </h2>
              <div className="text-xs text-slate-400">
                {targetStranger.cityName}, {targetStranger.country}
              </div>
            </div>

            {/* Minimal Anonymous Capsule Excerpt */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono-num">
                  LEFT BEHIND
                </span>
                <span className="text-xs text-slate-300 font-light">
                  {targetStranger.leavingConcept}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono-num">
                  GIFT TO A STRANGER
                </span>
                <span className="text-xs text-amber-300 font-mono-num tracking-widest">
                  {targetStranger.strangerGift === 'LIGHT' && '✦ LIGHT'}
                  {targetStranger.strangerGift === 'COURAGE' && '+ COURAGE'}
                  {targetStranger.strangerGift === 'HOPE' && '∞ HOPE'}
                  {targetStranger.strangerGift === 'SILENCE' && '○ SILENCE'}
                </span>
              </div>
            </div>

            {/* Send Light Action */}
            <div>
              {isSent ? (
                <div className="py-3 px-4 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs uppercase tracking-widest font-mono-num">
                  ✦ LIGHT SENT
                </div>
              ) : (
                <button
                  onClick={() => onSendLight(targetStranger)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium text-xs uppercase tracking-[0.2em] rounded-full transition-all cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND LIGHT ✦</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
