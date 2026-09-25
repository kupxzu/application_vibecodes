import React, { useState, useEffect } from 'react';
import { CosmicUser, ModuleId, ChatChannel } from '../types/cosmic';
import { PLANETS_DATA, PLANET_COMMUNITIES, cosmicAudio } from '../data/cosmicData';
import { 
  ChevronLeft, ChevronRight, ArrowRight, Orbit, Disc3, 
  Users, Hash, Volume2, HelpCircle,
  ZoomIn, ZoomOut, Info, Radio
} from 'lucide-react';

interface PlanetWorldSelectorProps {
  user: CosmicUser;
  onJoinWorld: (planetId: ModuleId) => void;
  onOpen3DOrrery: () => void;
  onOpenSunHub: () => void;
  onOpenSoundModal: () => void;
  onLogout: () => void;
}

export const PlanetWorldSelector: React.FC<PlanetWorldSelectorProps> = ({
  user,
  onJoinWorld,
  onOpen3DOrrery,
  onOpenSunHub,
  onOpenSoundModal,
  onLogout,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [largeTextMode, setLargeTextMode] = useState<boolean>(false);
  const [showTooltipGuide, setShowTooltipGuide] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  
  // Transition animation state for smooth planet switching
  const [transitionState, setTransitionState] = useState<'idle' | 'morphing'>('idle');

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const currentPlanet = PLANETS_DATA[selectedIndex];
  const currentCommunity = PLANET_COMMUNITIES[currentPlanet.id];

  const triggerPlanetSwitch = (newIndex: number) => {
    if (newIndex === selectedIndex) return;
    cosmicAudio.playClick();
    setTransitionState('morphing');
    
    setTimeout(() => {
      setSelectedIndex(newIndex);
      setTransitionState('idle');
    }, 180);
  };

  const handlePrev = () => {
    const nextIdx = selectedIndex === 0 ? PLANETS_DATA.length - 1 : selectedIndex - 1;
    triggerPlanetSwitch(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = selectedIndex === PLANETS_DATA.length - 1 ? 0 : selectedIndex + 1;
    triggerPlanetSwitch(nextIdx);
  };

  const handleEnterWorld = (planetId: ModuleId) => {
    cosmicAudio.playWarp();
    setIsJoining(true);
    setTimeout(() => {
      onJoinWorld(planetId);
      setIsJoining(false);
    }, 450);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Enter') {
        handleEnterWorld(currentPlanet.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, currentPlanet.id]);

  // Touch Swipe Handlers for mobile gestures
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    // Minimum swipe threshold of 40px and predominantly horizontal
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`relative h-screen max-h-screen w-full overflow-hidden flex flex-col justify-between select-none bg-transparent text-white px-2.5 sm:px-6 py-2 sm:py-3 ${largeTextMode ? 'text-base' : 'text-sm'}`}
    >
      
      {/* 1. TOP HEADER (Responsive, compact single-row on mobile and desktop) */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 py-1.5 sm:py-2 px-3 sm:px-6 glass-panel rounded-2xl border border-white/20 shadow-xl z-20 shrink-0">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white text-black flex items-center justify-center font-orbitron font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            A
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-orbitron font-extrabold text-sm sm:text-lg tracking-wider text-white">
              ASTRAEA
            </span>
            <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 rounded-full bg-white/10 text-[9px] sm:text-[10px] font-mono-tech text-white/80 border border-white/20">
              WORLDS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* HIGHLIGHTED VIEW 3D MODE BUTTON */}
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onOpen3DOrrery();
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-white/90 active:scale-95 font-orbitron font-extrabold text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.7)] animate-highlight-glow cursor-pointer border-2 border-white"
            title="View 3D Mode: Real-time 3D planetary space"
          >
            <Orbit className="w-3.5 h-3.5 text-black animate-spin" style={{ animationDuration: '12s' }} />
            <span>3D Mode</span>
          </button>

          {/* Large Text Toggle (Desktop / Tablet) */}
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setLargeTextMode(!largeTextMode);
            }}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer ${
              largeTextMode
                ? 'bg-white text-black border-white font-bold shadow-md'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
            }`}
            title="Toggle Large Text"
          >
            {largeTextMode ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span>{largeTextMode ? 'Normal' : 'A+'}</span>
          </button>

          {/* Guide Tooltip Popover Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                cosmicAudio.playClick();
                setShowTooltipGuide(!showTooltipGuide);
              }}
              className={`p-1.5 sm:p-2 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer ${
                showTooltipGuide 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
              }`}
              title="Click for Instructions Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Instruction Tooltip */}
            {showTooltipGuide && (
              <div className="absolute right-0 top-10 w-68 sm:w-80 p-3 rounded-2xl glass-panel-glow border border-white/30 text-white text-xs font-mono-tech shadow-2xl z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/15 font-bold font-orbitron text-xs">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-white" />
                    Quick Guide
                  </span>
                  <button 
                    onClick={() => setShowTooltipGuide(false)}
                    className="text-white/60 hover:text-white text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1 text-white/80 leading-relaxed text-[11px]">
                  <p>• <strong>Mobile Swipe:</strong> Swipe left or right anywhere to switch planets.</p>
                  <p>• <strong>Rotating Planet:</strong> Continuously rotating planetary sphere with axial drift.</p>
                  <p>• <strong>View 3D Mode:</strong> Switch to full interactive 3D space simulation.</p>
                  <p>• <strong>Join World:</strong> Tap to enter that planet&apos;s active frequency room.</p>
                </div>
              </div>
            )}
          </div>

          {/* Soundscapes Button */}
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onOpenSoundModal();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
            title="Soundscapes & Space Audio"
          >
            <Disc3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Operator Profile */}
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onOpenSunHub();
            }}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-mono-tech text-white transition-all cursor-pointer"
            title="Operator Profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover border border-white/40"
              referrerPolicy="no-referrer"
            />
            <span className="hidden md:inline font-bold text-xs">{user.callsign}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN VIEWPORT (LEFT: ROTATING ANIMATED PLANET, RIGHT: PLANET DESCRIPTION & ACTIONS) */}
      {/* Engineered to fit 100% of desktop and mobile screens without vertical scroll */}
      <main className="flex-1 min-h-0 flex items-center justify-center w-full max-w-7xl mx-auto my-auto px-1 sm:px-4 py-1 sm:py-2 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-8 items-center w-full h-full max-h-[calc(100vh-125px)] sm:max-h-[calc(100vh-140px)]">
          
          {/* ================= LEFT SIDE: ANIMATED CONTINUOUSLY ROTATING PLANET ================= */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-1 lg:py-0">
            
            {/* Outer Planet Floating Rig (Wobble & Floating Orbit) */}
            <div className={`relative flex items-center justify-center animate-planet-float transition-all duration-400 ${
              transitionState === 'morphing' ? 'scale-90 opacity-60 blur-sm' : 'scale-100 opacity-100 blur-0'
            }`}>
              
              {/* Celestial Atmospheric Backlight Glow */}
              <div 
                className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full blur-2xl sm:blur-3xl opacity-40 transition-colors duration-700 pointer-events-none"
                style={{ backgroundColor: currentPlanet.color }}
              />

              {/* Orbit Guide Starlight Ring */}
              <div 
                className="absolute w-44 h-44 sm:w-64 sm:h-64 md:w-88 md:h-88 rounded-full border border-white/20 animate-spin pointer-events-none" 
                style={{ animationDuration: '50s' }} 
              />
              <div 
                className="absolute w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72 rounded-full border border-dashed border-white/15 pointer-events-none" 
              />

              {/* ANIMATED ROTATING PLANET BODY SPHERE */}
              <div
                className="w-28 h-28 sm:w-44 sm:h-44 md:w-56 lg:w-64 md:h-56 lg:h-64 rounded-full relative shadow-[0_0_50px_rgba(255,255,255,0.35)] flex items-center justify-center border-2 border-white/70 overflow-hidden cursor-pointer group transition-all"
                style={{
                  backgroundColor: currentPlanet.color,
                  background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${currentPlanet.color} 55%, #000000 100%)`,
                }}
                onClick={() => handleEnterWorld(currentPlanet.id)}
                title={`Click or tap to enter ${currentPlanet.name} World`}
              >
                {/* Surface Feature Layer with Continuous Axial Motion */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  
                  {/* Planetary Texture Patterns: Continuous drift animation */}
                  {currentPlanet.textureType === 'craters' && (
                    <div className="absolute inset-0 opacity-45 animate-surface-slide w-[200%] flex">
                      <div className="w-1/2 h-full relative">
                        <div className="absolute w-6 h-6 sm:w-9 sm:h-9 rounded-full border-2 border-black/40 top-3 sm:top-5 left-4 sm:left-6" />
                        <div className="absolute w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-black/35 bottom-6 sm:bottom-9 right-5 sm:right-8" />
                        <div className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-black/40 bottom-10 sm:bottom-14 left-7 sm:left-10" />
                        <div className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/25 top-8 sm:top-12 right-8 sm:right-12" />
                      </div>
                      <div className="w-1/2 h-full relative">
                        <div className="absolute w-6 h-6 sm:w-9 sm:h-9 rounded-full border-2 border-black/40 top-3 sm:top-5 left-4 sm:left-6" />
                        <div className="absolute w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-black/35 bottom-6 sm:bottom-9 right-5 sm:right-8" />
                        <div className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-black/40 bottom-10 sm:bottom-14 left-7 sm:left-10" />
                        <div className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/25 top-8 sm:top-12 right-8 sm:right-12" />
                      </div>
                    </div>
                  )}

                  {currentPlanet.textureType === 'bands' && (
                    <div className="absolute inset-0 flex flex-col justify-around opacity-40 animate-surface-slide w-[200%]">
                      <div className="h-1.5 sm:h-2.5 w-full bg-gradient-to-r from-white/40 via-black/30 to-white/40" />
                      <div className="h-2.5 sm:h-4 w-full bg-gradient-to-r from-black/50 via-white/30 to-black/50" />
                      <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-white/40 via-black/40 to-white/40" />
                      <div className="h-3 sm:h-5 w-full bg-gradient-to-r from-black/60 via-white/20 to-black/60" />
                    </div>
                  )}

                  {/* Spherical Shadow Depth Overlay */}
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, transparent 40%, rgba(0,0,0,0.85) 90%)',
                    }}
                  />
                </div>

                {/* Saturn-like rings for Kronos */}
                {currentPlanet.hasRings && (
                  <div className="absolute w-[230%] h-[35%] rounded-[100%] border-2 border-white/70 rotate-[-28deg] shadow-[0_0_25px_white] pointer-events-none" />
                )}
              </div>

              {/* Orbit Distance AU Badge */}
              <div className="absolute -bottom-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/30 text-[10px] sm:text-[11px] font-mono-tech text-white font-bold shadow-lg">
                {currentPlanet.orbitRadius} AU
              </div>
            </div>

            {/* Quick Next / Prev Controls below the Planet on the Left */}
            <div className="flex items-center gap-2 sm:gap-3 mt-2.5 sm:mt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-mono-tech font-bold text-[11px] sm:text-xs uppercase transition-all cursor-pointer shadow-sm min-h-[38px] sm:min-h-[44px]"
                title="Previous Planet (or swipe right)"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Prev</span>
              </button>

              <span className="text-[11px] sm:text-xs font-mono-tech text-white/50 px-1">
                {selectedIndex + 1} / {PLANETS_DATA.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-mono-tech font-bold text-[11px] sm:text-xs uppercase transition-all cursor-pointer shadow-sm min-h-[38px] sm:min-h-[44px]"
                title="Next Planet (or swipe left)"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* ================= RIGHT SIDE: COMPLETE PLANET DESCRIPTION & TELEMETRY ================= */}
          <div className={`lg:col-span-7 flex flex-col justify-center space-y-2 sm:space-y-3 transition-all duration-300 ${
            transitionState === 'morphing' ? 'opacity-50 translate-y-1' : 'opacity-100 translate-y-0'
          }`}>
            
            {/* Sector / Category Tag */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-mono-tech text-white/80 uppercase tracking-widest font-semibold">
                {currentPlanet.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-mono-tech uppercase font-bold tracking-wider">
                {currentCommunity.tagline}
              </span>
            </div>

            {/* Planet Name */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-orbitron font-extrabold text-white tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] leading-tight">
              {currentPlanet.name}
            </h2>

            {/* Full Planet Description */}
            <div className="space-y-0.5 sm:space-y-1 text-white/85">
              <p className="text-xs sm:text-sm font-body leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
                {currentPlanet.description}
              </p>
              <p className="hidden sm:block text-[11px] font-mono-tech text-white/60 italic max-w-xl">
                &quot;{currentCommunity.bannerText}&quot;
              </p>
            </div>

            {/* Key Telemetry Grid */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 text-xs font-mono-tech max-w-xl">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/15">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-white/50 uppercase truncate">
                  <Users className="w-3 h-3 text-white shrink-0" />
                  <span>Crew</span>
                </div>
                <div className="text-xs sm:text-base font-mono-tech font-bold text-white mt-0.5 tabular-nums">
                  {currentCommunity.onlineCount} <span className="hidden sm:inline text-[10px] font-normal text-white/50">/ {currentCommunity.population}</span>
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/15">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-white/50 uppercase truncate">
                  <Radio className="w-3 h-3 text-white shrink-0" />
                  <span>Rooms</span>
                </div>
                <div className="text-xs sm:text-base font-mono-tech font-bold text-white mt-0.5">
                  {currentCommunity.channels.length} Rooms
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/15">
                <div className="text-[9px] sm:text-[10px] text-white/50 uppercase truncate">
                  {currentPlanet.metricLabel}
                </div>
                <div className="text-xs sm:text-base font-mono-tech font-bold text-white mt-0.5 tabular-nums truncate">
                  {currentPlanet.metricValue} <span className="text-[9px] sm:text-[10px] font-normal text-white/50">{currentPlanet.metricUnit}</span>
                </div>
              </div>
            </div>

            {/* Available Chat Channels (Pills) */}
            <div className="hidden xs:block">
              <span className="text-[9px] sm:text-[10px] font-mono-tech text-white/50 uppercase tracking-wider block mb-1">
                Active Frequencies:
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {currentCommunity.channels.slice(0, 3).map((ch: ChatChannel) => (
                  <span
                    key={ch.id}
                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-white/10 border border-white/20 text-[10px] sm:text-xs font-mono-tech text-white flex items-center gap-1 cursor-default"
                    title={`Channel: #${ch.name}`}
                  >
                    {ch.type === 'text' ? <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70" /> : <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70" />}
                    <span>{ch.name}</span>
                  </span>
                ))}
                {currentCommunity.channels.length > 3 && (
                  <span className="px-2 py-0.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono-tech text-white/50">
                    +{currentCommunity.channels.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* PROMINENT JOIN PLANET ACTION BUTTON */}
            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={() => handleEnterWorld(currentPlanet.id)}
                disabled={isJoining}
                className="w-full sm:w-auto px-5 sm:px-9 py-2.5 sm:py-3.5 rounded-2xl bg-white text-black hover:bg-white/90 active:scale-[0.98] font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2 cursor-pointer group border-2 border-white min-h-[44px]"
                title={`Join ${currentPlanet.name} World and open chat`}
              >
                <span>{isJoining ? 'Transporting...' : `JOIN ${currentPlanet.name.toUpperCase()} & OPEN CHAT`}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. BOTTOM COMPACT PLANET SELECTOR DOCK (1-CLICK ROTATION, FITS WITHIN 100vh) */}
      <footer className="w-full max-w-5xl mx-auto pt-1 sm:pt-2 border-t border-white/10 z-20 shrink-0">
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {PLANETS_DATA.map((planet, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={planet.id}
                type="button"
                onClick={() => triggerPlanetSwitch(idx)}
                className={`py-1 sm:py-1.5 px-1 sm:px-2 rounded-xl transition-all flex items-center justify-center sm:justify-start gap-1 sm:gap-2 cursor-pointer min-h-[38px] sm:min-h-[44px] ${
                  isSelected
                    ? 'bg-white/25 border-2 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-102'
                    : 'bg-white/[0.04] hover:bg-white/15 border border-white/10 text-white/70 hover:text-white'
                }`}
                title={`Switch to ${planet.name}`}
              >
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/40 shrink-0 shadow-sm"
                  style={{
                    backgroundColor: planet.color,
                    background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${planet.color} 60%, #000000 100%)`,
                  }}
                />
                <div className="hidden sm:block overflow-hidden min-w-0 text-left">
                  <div className="text-[11px] font-bold truncate text-white leading-tight">{planet.name}</div>
                  <div className="text-[9px] font-mono-tech text-white/50 truncate leading-none">{planet.orbitRadius} AU</div>
                </div>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
