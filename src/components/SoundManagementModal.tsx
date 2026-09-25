import React, { useState, useEffect } from 'react';
import { AmbientSoundscape } from '../types/cosmic';
import { cosmicAudio } from '../data/cosmicData';
import { X, Volume2, VolumeX, Radio, Disc3, Sparkles, Check } from 'lucide-react';

interface SoundManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundManagementModal: React.FC<SoundManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [ambientActive, setAmbientActive] = useState(cosmicAudio.ambientEnabled);
  const [selectedTrack, setSelectedTrack] = useState<AmbientSoundscape>(cosmicAudio.currentTrack);
  const [volume, setVolume] = useState(Math.round(cosmicAudio.volume * 100));
  const [sfxActive, setSfxActive] = useState(cosmicAudio.sfxEnabled);

  useEffect(() => {
    setAmbientActive(cosmicAudio.ambientEnabled);
    setSelectedTrack(cosmicAudio.currentTrack);
    setVolume(Math.round(cosmicAudio.volume * 100));
    setSfxActive(cosmicAudio.sfxEnabled);
  }, [isOpen]);

  const handleToggleAmbient = () => {
    const nextState = !ambientActive;
    cosmicAudio.toggleAmbient(nextState);
    setAmbientActive(nextState);
    cosmicAudio.playClick();
  };

  const handleSelectTrack = (track: AmbientSoundscape) => {
    setSelectedTrack(track);
    cosmicAudio.setSoundscape(track);
    cosmicAudio.playClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    cosmicAudio.setVolume(val / 100);
  };

  const handleToggleSfx = () => {
    cosmicAudio.sfxEnabled = !sfxActive;
    setSfxActive(!sfxActive);
    if (!sfxActive) cosmicAudio.playClick();
  };

  const soundscapes: { id: AmbientSoundscape; title: string; subtitle: string }[] = [
    { id: 'void-drone', title: 'Deep Void Drone', subtitle: '55Hz sub-bass binaural breathing cavity' },
    { id: 'pulsar-resonance', title: 'Pulsar Resonance', subtitle: '0.6Hz harmonic beacon pulse' },
    { id: 'solar-wind', title: 'Interstellar Solar Wind', subtitle: 'Resonant bandpass particle drift' },
    { id: 'subspace-drift', title: 'Subspace Drift', subtitle: 'Harmonic sine triad carrier' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel-glow rounded-2xl border border-white/15 p-6 shadow-2xl text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Disc3 className={`w-4 h-4 text-white ${ambientActive ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-base tracking-wide text-white">
                Space Soundscape & Audio
              </h3>
              <p className="text-xs font-mono-tech text-white/50">
                Web Audio synthesized space frequencies
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Master Toggle */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {ambientActive ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/40" />
            )}
            <div>
              <div className="text-sm font-semibold text-white">Ambient Space Soundscape</div>
              <div className="text-xs font-mono-tech text-white/50">
                {ambientActive ? 'Playing continuous generative drone' : 'Muted'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleAmbient}
            className={`px-4 py-2 rounded-lg text-xs font-mono-tech font-semibold uppercase tracking-wider transition-all border ${
              ambientActive
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-white/10 text-white/70 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            {ambientActive ? 'Stop' : 'Engage'}
          </button>
        </div>

        {/* Soundscape Tracks */}
        <div className="space-y-2 mb-5">
          <div className="text-xs font-mono-tech uppercase tracking-wider text-white/50 mb-2">
            Select Soundscape Resonance
          </div>

          {soundscapes.map((t) => {
            const isSelected = selectedTrack === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTrack(t.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-white/10 border-white/40 shadow-sm'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    <span>{t.title}</span>
                    {isSelected && ambientActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <div className="text-xs font-mono-tech text-white/45">{t.subtitle}</div>
                </div>

                <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Volume & SFX Controls */}
        <div className="space-y-4 pt-3 border-t border-white/10">
          <div>
            <div className="flex justify-between text-xs font-mono-tech text-white/70 mb-2">
              <span>MASTER SYNTH GAIN</span>
              <span className="text-white font-bold">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono-tech text-white/70">Tactile UI Sound Effects</span>
            <button
              type="button"
              onClick={handleToggleSfx}
              className={`px-3 py-1 rounded-md text-xs font-mono-tech border ${
                sfxActive ? 'bg-white/20 text-white border-white/30' : 'text-white/40 border-white/10'
              }`}
            >
              {sfxActive ? 'Enabled' : 'Muted'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-mono-tech font-bold uppercase tracking-wider transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
