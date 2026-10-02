import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, MapPin, Plus, Wand2 } from 'lucide-react';
import { GLOBAL_CITIES, LEAVING_BEHIND_POOL, TAKING_WITH_POOL, HOPE_CHANGES_POOL, FUTURE_SELF_POOL, STRANGER_SENTENCE_POOL } from '../data/mockCapsules';
import { Capsule } from '../types/capsule';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CapsuleCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapsuleSealed: (capsule: Capsule) => void;
  presetLocation?: { cityName: string; country: string; lat: number; lng: number } | null;
}

export const CapsuleCreationModal: React.FC<CapsuleCreationModalProps> = ({
  isOpen,
  onClose,
  onCapsuleSealed,
  presetLocation,
}) => {
  const [step, setStep] = useState(0);

  // Form state
  const [selectedCity, setSelectedCity] = useState(GLOBAL_CITIES[0]);
  const [customCitySearch, setCustomCitySearch] = useState('');
  const [leavingBehind, setLeavingBehind] = useState('');
  const [takingWith, setTakingWith] = useState('');
  const [hopeChanges, setHopeChanges] = useState('');
  const [futureSelfRemember, setFutureSelfRemember] = useState('');
  const [strangerSentence, setStrangerSentence] = useState('');

  // Sealing state
  const [isSealing, setIsSealing] = useState(false);
  const [sealedCapsule, setSealedCapsule] = useState<Capsule | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSealedCapsule(null);
      setIsSealing(false);
      if (presetLocation) {
        setSelectedCity({
          id: `preset-${Date.now()}`,
          name: presetLocation.cityName,
          country: presetLocation.country,
          lat: presetLocation.lat,
          lng: presetLocation.lng,
        });
      }
    }
  }, [isOpen, presetLocation]);

  if (!isOpen) return null;

  const handleNext = () => {
    sound.playStarHover();
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    sound.playStarHover();
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleResetForAnotherLight = () => {
    sound.playStarBirth();
    setStep(0);
    setLeavingBehind('');
    setTakingWith('');
    setHopeChanges('');
    setFutureSelfRemember('');
    setStrangerSentence('');
    setSealedCapsule(null);
  };

  const generateStarId = (region: string) => {
    const chars = '0123456789ABCDEF';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const prefix =
      region === 'australia' ? 'AU' :
      region === 'africa' ? 'AF' :
      region === 'north_america' ? 'NA' :
      region === 'south_america' ? 'SA' : 'EU';
    return `STAR #${prefix}${code}`;
  };

  const detectRegion = (lat: number, lng: number): 'australia' | 'africa' | 'north_america' | 'south_america' | 'europe' => {
    if (lat < -10 && lng > 110 && lng < 179) return 'australia';
    if (lat > -35 && lat < 37 && lng > -20 && lng < 52) return 'africa';
    if (lat > 10 && lng > -170 && lng < -50) return 'north_america';
    if (lat <= 12 && lat > -60 && lng > -90 && lng < -30) return 'south_america';
    return 'europe';
  };

  const handleSealCapsule = () => {
    setIsSealing(true);
    sound.playStarBirth();

    const region = detectRegion(selectedCity.lat, selectedCity.lng);
    const starId = generateStarId(region);

    const newCapsule: Capsule = {
      id: starId,
      timestamp: Date.now(),
      cityName: selectedCity.name,
      country: selectedCity.country,
      lat: selectedCity.lat + (Math.random() - 0.5) * 0.35,
      lng: selectedCity.lng + (Math.random() - 0.5) * 0.35,
      region,
      leavingBehind: leavingBehind.trim() || 'The doubts that kept me small.',
      takingWith: takingWith.trim() || 'Courage, kindness, and quiet hope.',
      hopeChanges: hopeChanges.trim() || 'A gentler world for everyone.',
      futureSelfRemember: futureSelfRemember.trim() || 'You made it through the storm.',
      strangerSentence:
        strangerSentence.trim() ||
        'I don’t know who you are, but I hope next year is kinder to you.',
      colorHex: '#fbbf24', // golden star for user-placed lights
      isUser: true,
    };

    setTimeout(() => {
      setIsSealing(false);
      setSealedCapsule(newCapsule);
      setStep(6);
      onCapsuleSealed(newCapsule);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#38bdf8', '#818cf8', '#ffffff'],
        disableForReducedMotion: true,
      });
    }, 1400);
  };

  const getRandomInspiration = (pool: string[], setter: (val: string) => void) => {
    sound.playStarHover();
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setter(pick);
  };

  const filteredCities = GLOBAL_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(customCitySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(customCitySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-[#040814]/95 border border-cyan-500/25 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(56,189,248,0.2)] flex flex-col justify-between min-h-[530px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Bar */}
        {step < 6 && (
          <div className="flex items-center gap-2 mb-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]'
                    : i < step
                    ? 'w-3 bg-cyan-600/60'
                    : 'w-3 bg-slate-800'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 0: Choose Location */}
        <div className="my-auto">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium">Step 1 of 6</span>
                <h2 className="font-cinzel text-3xl sm:text-4xl text-white font-light tracking-wide mt-2">
                  Place your light.
                </h2>
                <p className="text-sm text-slate-400 font-light mt-2">
                  Choose where on Earth this light will glow. You can add lights for where you are now, where you grew up, or where someone you love lives.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl focus-within:border-cyan-400 transition-colors">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={customCitySearch}
                    onChange={(e) => setCustomCitySearch(e.target.value)}
                    placeholder="Search any global city..."
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {filteredCities.slice(0, 14).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        sound.playStarHover();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                        selectedCity.name === city.name && selectedCity.country === city.country
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{city.name}, {city.country}</span>
                      {selectedCity.name === city.name && selectedCity.country === city.country && (
                        <Check className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Leaving Behind */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium">Step 2 of 6</span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
                    What are you leaving behind?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => getRandomInspiration(LEAVING_BEHIND_POOL, setLeavingBehind)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-cyan-300 font-medium transition-colors cursor-pointer border border-white/10"
                >
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  <span>Inspiration</span>
                </button>
              </div>

              <textarea
                value={leavingBehind}
                onChange={(e) => setLeavingBehind(e.target.value)}
                placeholder="The quiet fear that I am always five years late to my own life..."
                rows={4}
                className="w-full p-4 bg-white/[0.04] border border-white/10 rounded-2xl text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/80 transition-colors resize-none font-light leading-relaxed"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Taking With */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium">Step 3 of 6</span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
                    What are you taking with you?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => getRandomInspiration(TAKING_WITH_POOL, setTakingWith)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-cyan-300 font-medium transition-colors cursor-pointer border border-white/10"
                >
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  <span>Inspiration</span>
                </button>
              </div>

              <textarea
                value={takingWith}
                onChange={(e) => setTakingWith(e.target.value)}
                placeholder="A dog-eared notebook, two honest friends, and a stubborn belief in mornings..."
                rows={4}
                className="w-full p-4 bg-white/[0.04] border border-white/10 rounded-2xl text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/80 transition-colors resize-none font-light leading-relaxed"
                autoFocus
              />
            </div>
          )}

          {/* Step 3: Hope Changes */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium">Step 4 of 6</span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
                    What do you hope changes?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => getRandomInspiration(HOPE_CHANGES_POOL, setHopeChanges)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-cyan-300 font-medium transition-colors cursor-pointer border border-white/10"
                >
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  <span>Inspiration</span>
                </button>
              </div>

              <textarea
                value={hopeChanges}
                onChange={(e) => setHopeChanges(e.target.value)}
                placeholder="That gentleness stops being mistaken for weakness..."
                rows={4}
                className="w-full p-4 bg-white/[0.04] border border-white/10 rounded-2xl text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/80 transition-colors resize-none font-light leading-relaxed"
                autoFocus
              />
            </div>
          )}

          {/* Step 4: Future Self */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium">Step 5 of 6</span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
                    Write something your future self should remember.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => getRandomInspiration(FUTURE_SELF_POOL, setFutureSelfRemember)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-cyan-300 font-medium transition-colors cursor-pointer border border-white/10"
                >
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  <span>Inspiration</span>
                </button>
              </div>

              <textarea
                value={futureSelfRemember}
                onChange={(e) => setFutureSelfRemember(e.target.value)}
                placeholder="You survived the long autumn of your silence. Do not go back into hiding..."
                rows={4}
                className="w-full p-4 bg-white/[0.04] border border-white/10 rounded-2xl text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/80 transition-colors resize-none font-light leading-relaxed"
                autoFocus
              />
            </div>
          )}

          {/* Step 5: Stranger Sentence */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium">Step 6 of 6</span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
                    Leave one sentence for a stranger.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => getRandomInspiration(STRANGER_SENTENCE_POOL, setStrangerSentence)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-cyan-300 font-medium transition-colors cursor-pointer border border-white/10"
                >
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  <span>Inspiration</span>
                </button>
              </div>

              <textarea
                value={strangerSentence}
                onChange={(e) => setStrangerSentence(e.target.value)}
                placeholder="“I don't know who you are, but I hope next year is kinder to you.”"
                rows={4}
                className="w-full p-4 bg-white/[0.04] border border-white/10 rounded-2xl text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/80 transition-colors resize-none font-light leading-relaxed"
                autoFocus
              />
            </div>
          )}

          {/* Step 6: Confirmation Screen */}
          {step === 6 && sealedCapsule && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,0.6)]">
                <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.4em] font-mono-num text-amber-300 font-medium">
                  {sealedCapsule.id}
                </span>
                <h2 className="font-cinzel text-3xl sm:text-4xl text-white font-light tracking-wider uppercase glow-text">
                  Your light is here.
                </h2>
                <p className="text-sm text-slate-300 font-light tracking-wide">
                  Your light is shining over {sealedCapsule.cityName}, {sealedCapsule.country}. It has been broadcast to every connected globe worldwide.
                </p>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl max-w-md mx-auto text-left space-y-2">
                <div className="text-[11px] uppercase tracking-widest text-slate-400">Your gift to a stranger:</div>
                <p className="text-sm italic text-amber-200">
                  "{sealedCapsule.strangerSentence}"
                </p>
              </div>

              {/* Action Buttons: View or Add Another */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium text-xs tracking-[0.2em] uppercase rounded-full transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer"
                >
                  View on the Globe
                </button>

                <button
                  onClick={handleResetForAnotherLight}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs tracking-[0.2em] uppercase rounded-full transition-colors border border-white/15 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Another Light</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step navigation buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
            {step > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSealCapsule}
                disabled={isSealing}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_30px_rgba(251,191,36,0.5)] cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSealing ? 'Sealing Light...' : 'Seal My Light'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
