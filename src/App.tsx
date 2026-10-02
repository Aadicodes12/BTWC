/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EarthGlobe } from './components/EarthGlobe.tsx';
import { Navigation } from './components/Navigation.tsx';
import { HeroCountdown } from './components/HeroCountdown.tsx';
import { CapsuleExperience } from './components/CapsuleExperience.tsx';
import { StarPassModal } from './components/StarPassModal.tsx';
import { LightConnectionModal } from './components/LightConnectionModal.tsx';
import { ClimaxTransition } from './components/ClimaxTransition.tsx';
import { MajorCity } from './data/majorCities.ts';
import { RealParticipantCapsule } from './server/db.ts';
import { liveBackend } from './services/liveBackend.ts';
import { sound } from './utils/audio.ts';
import { Sparkles, Globe, Compass, Layers } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'explore'>('landing');

  // Real data state (100% genuine, zero fake participants)
  const [participants, setParticipants] = useState<RealParticipantCapsule[]>([]);
  const [realCount, setRealCount] = useState<number>(0);
  const [userCapsule, setUserCapsule] = useState<RealParticipantCapsule | null>(null);
  const [isFirstLight, setIsFirstLight] = useState<boolean>(false);

  // Modals
  const [isRitualOpen, setIsRitualOpen] = useState(false);
  const [isStarPassOpen, setIsStarPassOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isClimaxOpen, setIsClimaxOpen] = useState(false);

  // Selections & Targets
  const [selectedParticipant, setSelectedParticipant] = useState<RealParticipantCapsule | null>(null);
  const [targetStranger, setTargetStranger] = useState<RealParticipantCapsule | null>(null);
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [presetCity, setPresetCity] = useState<MajorCity | null>(null);
  const [isConnectionSent, setIsConnectionSent] = useState(false);
  const [activeConnectionArc, setActiveConnectionArc] = useState<{
    from: [number, number];
    to: [number, number];
  } | null>(null);

  // Sealing animation state
  const [sealingTarget, setSealingTarget] = useState<{ lat: number; lng: number; starId: string } | null>(null);

  // Climax state
  const [isBlackout, setIsBlackout] = useState(false);
  const [isBurst, setIsBurst] = useState(false);

  // Audio mute
  const [isMuted, setIsMuted] = useState(false);

  // 1. Initial Load & Real-Time SSE Subscription
  useEffect(() => {
    // Load local user star if already created on this device
    try {
      const saved = localStorage.getItem('before_world_changes_real_star');
      if (saved) {
        setUserCapsule(JSON.parse(saved) as RealParticipantCapsule);
      }
    } catch {}

    // Fetch real initial participants & real count from backend
    liveBackend.fetchParticipants().then((list) => {
      setParticipants(list);
      setRealCount(list.length);
    });

    // Subscribe to live SSE events (when real participants join worldwide)
    const unsubscribe = liveBackend.subscribe({
      onInit: (initialList, count) => {
        setParticipants(initialList);
        setRealCount(count);
      },
      onNewLight: (newLight, count) => {
        setParticipants((prev) => {
          if (prev.some((p) => p.id === newLight.id)) return prev;
          return [...prev, newLight];
        });
        setRealCount(count);
      },
      onConnection: (conn) => {
        setActiveConnectionArc({ from: conn.from, to: conn.to });
        sound.playSendLightConnection();
        setTimeout(() => setActiveConnectionArc(null), 4000);
      },
    });

    // Check shared URL param: `/?star=STAR%23XXXXXX`
    const params = new URLSearchParams(window.location.search);
    const starParam = params.get('star');
    if (starParam) {
      fetch(`/api/participants/${encodeURIComponent(starParam)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.lat != null) {
            setSelectedParticipant(data);
            setTargetLocation({ lat: data.lat, lng: data.lng });
            setCurrentView('explore');
          }
        })
        .catch(() => {});
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle Sealing Ceremony
  const handleSealingTriggered = async (capsule: RealParticipantCapsule) => {
    setIsRitualOpen(false);

    // If zero participants currently exist, user is the first light!
    if (realCount === 0) {
      setIsFirstLight(true);
    }

    // 1. Trigger sealing animation on globe
    setSealingTarget({ lat: capsule.lat, lng: capsule.lng, starId: capsule.id });
    setTargetLocation({ lat: capsule.lat, lng: capsule.lng });

    // 2. Persist to real backend
    await liveBackend.postCapsule(capsule);

    // 3. Save locally
    setUserCapsule(capsule);
    try {
      localStorage.setItem('before_world_changes_real_star', JSON.stringify(capsule));
    } catch {}

    // 4. Reveal Star Pass after settling into Earth
    setTimeout(() => {
      setSealingTarget(null);
      setIsStarPassOpen(true);
    }, 2800);
  };

  // Handle Find a Light
  const handleOpenFindLight = async () => {
    sound.playStarHover();
    const stranger = await liveBackend.fetchStranger(userCapsule?.id);
    setTargetStranger(stranger);
    setIsConnectionSent(false);

    if (stranger) {
      setTargetLocation({ lat: stranger.lat, lng: stranger.lng });
    }
    setIsConnectOpen(true);
  };

  // Handle Send Light
  const handleSendLight = async (target: RealParticipantCapsule) => {
    sound.playSendLightConnection();
    setIsConnectionSent(true);

    const fromCoords: [number, number] = userCapsule
      ? [userCapsule.lat, userCapsule.lng]
      : [target.lat + 15, target.lng - 30];

    const toCoords: [number, number] = [target.lat, target.lng];

    setActiveConnectionArc({ from: fromCoords, to: toCoords });

    await liveBackend.sendConnection(
      userCapsule?.id || 'ANONYMOUS',
      target.id,
      fromCoords[0],
      fromCoords[1],
      toCoords[0],
      toCoords[1],
      'LIGHT'
    );

    setTimeout(() => {
      setActiveConnectionArc(null);
    }, 4000);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.startCelestialDrone();
    }
  };

  const handleStartAtmosphere = () => {
    if (!isMuted) {
      sound.startCelestialDrone();
    }
  };

  return (
    <div
      onClick={handleStartAtmosphere}
      className="relative w-screen h-screen overflow-hidden bg-[#010206] text-slate-100 select-none"
    >
      {/* 3D WebGL Earth (The Primary Interface) */}
      <div className="absolute inset-0 z-0">
        <EarthGlobe
          participants={participants}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={(p) => {
            setSelectedParticipant(p);
            if (p) setTargetLocation({ lat: p.lat, lng: p.lng });
          }}
          onSelectCity={(city) => {
            setTargetLocation({ lat: city.lat, lng: city.lng });
            setPresetCity(city);
          }}
          activeConnection={activeConnectionArc}
          viewMode={currentView === 'landing' ? 'landing' : 'explore'}
          targetLocation={targetLocation}
          sealingAnimationTarget={sealingTarget}
          isBlackout={isBlackout}
          isBurst={isBurst}
        />
      </div>

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_140px_rgba(1,2,6,0.95)] z-10" />

      {/* Restrained Navigation */}
      <Navigation
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        hasUserCapsule={!!userCapsule}
        onOpenMyStar={() => setIsStarPassOpen(true)}
        onOpenPostLight={() => setIsRitualOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Landing View (Center Cinematic Reveal) */}
      {currentView === 'landing' && !isRitualOpen && !isClimaxOpen && (
        <HeroCountdown
          onEnterGlobe={() => setCurrentView('explore')}
          onOpenPostLight={() => setIsRitualOpen(true)}
          realParticipantCount={realCount}
        />
      )}

      {/* Explore View Minimal Bottom Controls */}
      {currentView === 'explore' && !selectedParticipant && !isClimaxOpen && !isRitualOpen && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-5 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-xs pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <button
            onClick={handleOpenFindLight}
            className="flex items-center gap-1.5 text-cyan-300/90 hover:text-cyan-200 uppercase tracking-widest text-[11px] cursor-pointer transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Find a Light</span>
          </button>

          <span className="text-slate-700">·</span>

          {userCapsule ? (
            <button
              onClick={() => setIsStarPassOpen(true)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 uppercase tracking-widest text-[11px] cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>My Star</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRitualOpen(true)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 uppercase tracking-widest text-[11px] cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Post a Light</span>
            </button>
          )}

          <span className="text-slate-700">·</span>

          <button
            onClick={() => setIsClimaxOpen(true)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 uppercase tracking-widest text-[11px] cursor-pointer transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Final Countdown</span>
          </button>
        </div>
      )}

      {/* Selected Participant Details Drawer */}
      {selectedParticipant && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[90%] p-5 rounded-2xl bg-[#03060f]/95 border border-white/10 backdrop-blur-md text-left space-y-3 pointer-events-auto animate-fade-in shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-num text-amber-400 uppercase tracking-widest">
              {selectedParticipant.id}
            </span>
            <button
              onClick={() => setSelectedParticipant(null)}
              className="text-xs text-slate-500 hover:text-slate-200 uppercase cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="text-xs text-slate-300">
            {selectedParticipant.cityName}, {selectedParticipant.country}
          </div>

          <div className="pt-2 border-t border-white/[0.06] space-y-1">
            <span className="text-[10px] uppercase font-mono-num text-slate-500">Left Behind:</span>
            <p className="text-xs italic text-slate-200 font-light">"{selectedParticipant.leavingConcept}"</p>
          </div>

          {selectedParticipant.strangerGift && (
            <div className="text-[11px] font-mono-num text-amber-300 pt-1">
              GIFT: {selectedParticipant.strangerGift === 'LIGHT' && '✦ LIGHT'}
              {selectedParticipant.strangerGift === 'COURAGE' && '+ COURAGE'}
              {selectedParticipant.strangerGift === 'HOPE' && '∞ HOPE'}
              {selectedParticipant.strangerGift === 'SILENCE' && '○ SILENCE'}
            </div>
          )}
        </div>
      )}

      {/* 60–90 Second Ritual Capsule Flow */}
      <CapsuleExperience
        isOpen={isRitualOpen}
        onClose={() => setIsRitualOpen(false)}
        onSealingTriggered={handleSealingTriggered}
        presetCity={presetCity}
        totalExistingLights={realCount}
      />

      {/* Star Pass Modal */}
      <StarPassModal
        capsule={userCapsule}
        isOpen={isStarPassOpen}
        onClose={() => setIsStarPassOpen(false)}
        onLocateOnEarth={(lat, lng) => {
          setTargetLocation({ lat, lng });
          setCurrentView('explore');
        }}
        isFirstLight={isFirstLight}
      />

      {/* Light Connection (Find a Light / Send Light) */}
      <LightConnectionModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        targetStranger={targetStranger}
        userCapsule={userCapsule}
        onSendLight={handleSendLight}
        isSent={isConnectionSent}
        onOpenPostLight={() => {
          setIsConnectOpen(false);
          setIsRitualOpen(true);
        }}
        totalParticipants={realCount}
      />

      {/* 10-Second Climax Sequence & After the Event */}
      {isClimaxOpen && (
        <ClimaxTransition
          userCapsule={userCapsule}
          onBlackoutChange={setIsBlackout}
          onBurstChange={setIsBurst}
          onExitClimax={() => {
            setIsClimaxOpen(false);
            setIsBlackout(false);
            setIsBurst(false);
            setCurrentView('explore');
          }}
          onSavePostEventLine={(line) => {
            if (userCapsule) {
              liveBackend.savePostEventLine(userCapsule.id, line);
            }
          }}
        />
      )}
    </div>
  );
}
