import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, MapPin } from 'lucide-react';
import { MAJOR_CITIES, MajorCity } from '../data/majorCities.ts';
import { RealParticipantCapsule } from '../server/db.ts';
import { sound } from '../utils/audio.ts';

interface CapsuleExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  onSealingTriggered: (capsule: RealParticipantCapsule) => void;
  presetCity?: MajorCity | null;
  totalExistingLights: number;
}

const LEAVING_CONCEPTS = [
  'FEAR',
  'DOUBT',
  'A HABIT',
  'A CHAPTER',
  'A RELATIONSHIP',
  'EXPECTATIONS',
  'THE PAST',
  'SOMETHING ELSE',
];

const CARRYING_CONCEPTS = [
  'COURAGE',
  'CURIOSITY',
  'LOVE',
  'MEMORIES',
  'DISCIPLINE',
  'AMBITION',
  'PEACE',
  'PEOPLE',
  'HOPE',
  'SOMETHING ELSE',
];

const CHANGE_AREAS = [
  'MYSELF',
  'MY TIME',
  'MY WORK',
  'MY RELATIONSHIPS',
  'MY COMMUNITY',
  'THE WORLD',
];

const STRANGER_GIFTS: { id: 'LIGHT' | 'COURAGE' | 'HOPE' | 'SILENCE'; symbol: string; label: string }[] = [
  { id: 'LIGHT', symbol: '✦', label: 'LIGHT' },
  { id: 'COURAGE', symbol: '+', label: 'COURAGE' },
  { id: 'HOPE', symbol: '∞', label: 'HOPE' },
  { id: 'SILENCE', symbol: '○', label: 'SILENCE' },
];

export const CapsuleExperience: React.FC<CapsuleExperienceProps> = ({
  isOpen,
  onClose,
  onSealingTriggered,
  presetCity,
  totalExistingLights,
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Place
  const [selectedCity, setSelectedCity] = useState<MajorCity>(presetCity || MAJOR_CITIES[0]);
  const [citySearch, setCitySearch] = useState('');

  // Step 2: Leaving
  const [leavingChoice, setLeavingChoice] = useState<string>('THE PAST');
  const [customLeaving, setCustomLeaving] = useState<string>('');

  // Step 3: Carrying (up to 3)
  const [carryingChoices, setCarryingChoices] = useState<string[]>(['COURAGE']);
  const [customCarrying, setCustomCarrying] = useState<string>('');

  // Step 4: Change (1 or 2 areas + optional short why)
  const [changeChoices, setChangeChoices] = useState<string[]>(['THE WORLD']);
  const [changeReason, setChangeReason] = useState<string>('');

  // Step 5: Future self line (max 120)
  const [futureSelfLine, setFutureSelfLine] = useState<string>('');

  // Step 6: Stranger gift (visual action)
  const [strangerGift, setStrangerGift] = useState<'LIGHT' | 'COURAGE' | 'HOPE' | 'SILENCE'>('LIGHT');

  if (!isOpen) return null;

  const generateStarId = () => {
    const chars = '0123456789ABCDEF';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `STAR #${code}`;
  };

  const handleNext = () => {
    sound.playStarHover();
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrev = () => {
    sound.playStarHover();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleToggleCarrying = (concept: string) => {
    sound.playStarHover();
    if (carryingChoices.includes(concept)) {
      setCarryingChoices(carryingChoices.filter((c) => c !== concept));
    } else {
      if (carryingChoices.length < 3) {
        setCarryingChoices([...carryingChoices, concept]);
      }
    }
  };

  const handleToggleChange = (area: string) => {
    sound.playStarHover();
    if (changeChoices.includes(area)) {
      setChangeChoices(changeChoices.filter((c) => c !== area));
    } else {
      if (changeChoices.length < 2) {
        setChangeChoices([...changeChoices, area]);
      }
    }
  };

  const handleSeal = () => {
    sound.playStarBirth();

    const starId = generateStarId();
    const finalLeaving = leavingChoice === 'SOMETHING ELSE' && customLeaving.trim()
      ? customLeaving.trim().slice(0, 60)
      : leavingChoice;

    const finalCarrying = carryingChoices.map((c) =>
      c === 'SOMETHING ELSE' && customCarrying.trim() ? customCarrying.trim().slice(0, 60) : c
    );

    const capsule: RealParticipantCapsule = {
      id: starId,
      timestamp: Date.now(),
      cityName: selectedCity.name,
      country: selectedCity.country,
      lat: selectedCity.lat + (Math.random() - 0.5) * 0.25, // intentionally reduced-precision coordinates
      lng: selectedCity.lng + (Math.random() - 0.5) * 0.25,
      leavingConcept: finalLeaving,
      carryingConcepts: finalCarrying.length > 0 ? finalCarrying : ['HOPE'],
      changeAreas: changeChoices.length > 0 ? changeChoices : ['THE WORLD'],
      changeReason: changeReason.trim().slice(0, 60),
      futureSelfLine: futureSelfLine.trim().slice(0, 120) || 'Remember who you were before.',
      strangerGift,
      colorHex: '#fbbf24',
    };

    onSealingTriggered(capsule);
  };

  const filteredCities = MAJOR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-[#03060f] border border-white/[0.08] rounded-3xl p-6 sm:p-10 flex flex-col justify-between min-h-[500px] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          aria-label="Close ritual"
          className="absolute top-6 right-6 p-2 rounded-full text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Quiet Step Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-6 bg-amber-400'
                  : s < step
                  ? 'w-2 bg-amber-400/40'
                  : 'w-2 bg-white/[0.08]'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: YOUR PLACE */}
        {step === 1 && (
          <div className="my-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono-num uppercase tracking-[0.25em] text-amber-400/80">Step 1</span>
              <h2 className="font-cinzel text-3xl sm:text-4xl text-slate-100 font-light tracking-wide mt-2">
                WHERE ARE YOU?
              </h2>
              <p className="text-xs text-slate-400 font-light mt-2 tracking-wide">
                Only your approximate location will be stored.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl focus-within:border-amber-400/50 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Find your city or region..."
                  className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                {filteredCities.slice(0, 8).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      sound.playStarHover();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs tracking-wider transition-all cursor-pointer ${
                      selectedCity.name === city.name
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>{city.name}, {city.country}</span>
                    {selectedCity.name === city.name && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LEAVING */}
        {step === 2 && (
          <div className="my-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono-num uppercase tracking-[0.25em] text-amber-400/80">Step 2</span>
              <h2 className="font-cinzel text-3xl sm:text-4xl text-slate-100 font-light tracking-wide mt-2">
                WHAT ENDS HERE?
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1">Select one concept to leave behind.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {LEAVING_CONCEPTS.map((concept) => (
                <button
                  key={concept}
                  onClick={() => {
                    sound.playStarHover();
                    setLeavingChoice(concept);
                  }}
                  className={`py-3 px-4 rounded-xl text-xs uppercase tracking-[0.2em] font-light transition-all cursor-pointer text-center ${
                    leavingChoice === concept
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 font-medium shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                      : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </div>

            {leavingChoice === 'SOMETHING ELSE' && (
              <input
                type="text"
                maxLength={60}
                value={customLeaving}
                onChange={(e) => setCustomLeaving(e.target.value)}
                placeholder="Name it briefly (max 60 characters)..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
                autoFocus
              />
            )}
          </div>
        )}

        {/* STEP 3: CARRYING FORWARD */}
        {step === 3 && (
          <div className="my-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono-num uppercase tracking-[0.25em] text-amber-400/80">Step 3</span>
              <h2 className="font-cinzel text-3xl sm:text-4xl text-slate-100 font-light tracking-wide mt-2">
                WHAT COMES WITH YOU?
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1">Select up to three ({carryingChoices.length}/3 chosen).</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CARRYING_CONCEPTS.map((concept) => {
                const isSelected = carryingChoices.includes(concept);
                return (
                  <button
                    key={concept}
                    onClick={() => handleToggleCarrying(concept)}
                    className={`py-3 px-4 rounded-xl text-xs uppercase tracking-[0.2em] font-light transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/40 font-medium shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                    }`}
                  >
                    {concept}
                  </button>
                );
              })}
            </div>

            {carryingChoices.includes('SOMETHING ELSE') && (
              <input
                type="text"
                maxLength={60}
                value={customCarrying}
                onChange={(e) => setCustomCarrying(e.target.value)}
                placeholder="What else are you bringing? (max 60 chars)..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50"
                autoFocus
              />
            )}
          </div>
        )}

        {/* STEP 4: CHANGE */}
        {step === 4 && (
          <div className="my-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono-num uppercase tracking-[0.25em] text-amber-400/80">Step 4</span>
              <h2 className="font-cinzel text-3xl sm:text-4xl text-slate-100 font-light tracking-wide mt-2">
                WHAT SHOULD BE DIFFERENT?
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1">Select one or two areas ({changeChoices.length}/2 chosen).</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CHANGE_AREAS.map((area) => {
                const isSelected = changeChoices.includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => handleToggleChange(area)}
                    className={`py-3 px-4 rounded-xl text-xs uppercase tracking-[0.2em] font-light transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-indigo-400/15 text-indigo-300 border border-indigo-400/40 font-medium shadow-[0_0_15px_rgba(129,140,248,0.15)]'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 uppercase tracking-widest font-mono-num">
                If you want, say why (optional, max 60 chars)
              </label>
              <input
                type="text"
                maxLength={60}
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Because we cannot stay quiet forever..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-400/50"
              />
            </div>
          </div>
        )}

        {/* STEP 5: FUTURE SELF */}
        {step === 5 && (
          <div className="my-auto space-y-6">
            <div>
              <span className="text-[11px] font-mono-num uppercase tracking-[0.25em] text-amber-400/80">Step 5</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-slate-100 font-light tracking-wide mt-2">
                ONE LINE FOR THE PERSON YOU'LL BECOME.
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1">You can come back to this later.</p>
            </div>

            <div className="space-y-2">
              <textarea
                maxLength={120}
                rows={3}
                value={futureSelfLine}
                onChange={(e) => setFutureSelfLine(e.target.value)}
                placeholder="Remember..."
                className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 resize-none font-light leading-relaxed"
                autoFocus
              />
              <div className="text-right text-[10px] font-mono-num text-slate-500">
                {futureSelfLine.length}/120
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: STRANGER */}
        {step === 6 && (
          <div className="my-auto space-y-6 text-center">
            <div>
              <span className="text-[11px] font-mono-num uppercase tracking-[0.25em] text-amber-400/80">Step 6</span>
              <h2 className="font-cinzel text-xl sm:text-2xl text-slate-300 font-light tracking-wider mt-2">
                SOMEONE, SOMEWHERE, WILL BE HERE TOO.
              </h2>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-slate-100 font-normal tracking-wide mt-1">
                LEAVE THEM SOMETHING.
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {STRANGER_GIFTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    sound.playStarHover();
                    setStrangerGift(g.id);
                  }}
                  className={`py-5 px-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    strangerGift === g.id
                      ? 'bg-amber-400/15 border border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                      : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <span className="text-2xl text-amber-300 font-serif">{g.symbol}</span>
                  <span className="text-[11px] font-mono-num uppercase tracking-[0.2em] text-slate-300 font-light">
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: SEALING CONFIRMATION */}
        {step === 7 && (
          <div className="my-auto space-y-8 text-center py-4">
            <div className="space-y-3">
              <h2 className="font-cinzel text-4xl sm:text-5xl text-slate-100 font-light tracking-widest uppercase">
                THAT'S ENOUGH.
              </h2>
              <p className="text-xs text-slate-400 tracking-wider font-light max-w-sm mx-auto">
                Your light will settle over {selectedCity.name}, {selectedCity.country}.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSeal}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-medium text-xs tracking-[0.25em] uppercase rounded-full transition-all shadow-[0_0_35px_rgba(251,191,36,0.4)] cursor-pointer hover:scale-105"
              >
                POST MY LIGHT ✦
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 font-light text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
