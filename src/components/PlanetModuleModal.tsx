import React, { useState } from 'react';
import { PlanetModule, ModuleId } from '../types/cosmic';
import { PLANET_COMMUNITIES, cosmicAudio } from '../data/cosmicData';
import { X, ArrowRight, RotateCcw, Users, Hash, Radio, Orbit } from 'lucide-react';

interface PlanetModuleModalProps {
  planet: PlanetModule | null;
  onClose: () => void;
  onJoinPlanet?: (planetId: ModuleId) => void;
}

export const PlanetModuleModal: React.FC<PlanetModuleModalProps> = ({
  planet,
  onClose,
  onJoinPlanet,
}) => {
  if (!planet) return null;

  const [calibrated, setCalibrated] = useState(false);
  const community = PLANET_COMMUNITIES[planet.id];

  const handleCalibrate = () => {
    cosmicAudio.playClick();
    setCalibrated(true);
    setTimeout(() => setCalibrated(false), 2000);
  };

  const handleJoin = () => {
    cosmicAudio.playWarp();
    if (onJoinPlanet) {
      onJoinPlanet(planet.id);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg glass-panel-glow rounded-3xl border border-white/25 p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Planet Orb & Category */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-full border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.4)] shrink-0"
              style={{
                backgroundColor: planet.color,
                background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${planet.color} 55%, #000000 100%)`,
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-tech text-white/60 uppercase tracking-widest">
                  {planet.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono-tech text-white border border-white/20">
                  {planet.status}
                </span>
              </div>
              <h3 className="font-orbitron font-extrabold text-2xl text-white tracking-wide">
                {planet.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Planet Full Description */}
        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider block mb-1">
              Planet Profile &amp; Mission Overview
            </span>
            <p className="text-sm font-body text-white/90 leading-relaxed">
              {planet.description}
            </p>
            {community && (
              <p className="text-xs font-mono-tech text-white/60 mt-1 italic">
                &quot;{community.bannerText}&quot;
              </p>
            )}
          </div>

          {/* Key Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono-tech">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-white/50 block text-[10px] uppercase">Orbit Radius</span>
              <span className="text-white font-bold text-base mt-0.5 block tabular-nums">{planet.orbitRadius} AU</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-white/50 block text-[10px] uppercase">Orbital Velocity</span>
              <span className="text-white font-bold text-base mt-0.5 block tabular-nums">{(planet.orbitSpeed * 10).toFixed(1)} km/s</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-white/50 block text-[10px] uppercase">{planet.metricLabel}</span>
              <span className="text-white font-bold text-base mt-0.5 block tabular-nums">
                {planet.metricValue} <span className="text-[10px] font-normal text-white/60">{planet.metricUnit}</span>
              </span>
            </div>
          </div>

          {/* Online Crew & Rooms Count */}
          {community && (
            <div className="flex items-center justify-between text-xs font-mono-tech py-2 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-white" />
                <span>{community.onlineCount} Crew Online</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-white" />
                <span>{community.channels.length} Comms Rooms</span>
              </span>
              <span>Latency: {planet.latencyMs}</span>
            </div>
          )}

          {/* Action Row: Prominent "Join planets?" Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handleJoin}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-white text-black hover:bg-white/90 active:scale-[0.98] font-orbitron font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.6)] cursor-pointer border-2 border-white"
            >
              <span>Join planets?</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCalibrate}
              className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono-tech text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Calibrate 3D orbital trajectory"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{calibrated ? 'Synchronized' : 'Calibrate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
