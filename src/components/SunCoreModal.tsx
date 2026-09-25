import React, { useState } from 'react';
import { CosmicUser } from '../types/cosmic';
import { PRESET_USERS, cosmicAudio } from '../data/cosmicData';
import { X, Sun, Zap, LogOut, Disc3 } from 'lucide-react';

interface SunCoreModalProps {
  user: CosmicUser;
  isOpen: boolean;
  onClose: () => void;
  onSwitchUser: (newUser: CosmicUser) => void;
  onLogout: () => void;
  onOpenSound: () => void;
}

export const SunCoreModal: React.FC<SunCoreModalProps> = ({
  user,
  isOpen,
  onClose,
  onSwitchUser,
  onLogout,
  onOpenSound,
}) => {
  if (!isOpen) return null;

  const [output, setOutput] = useState(user.coreOutputMW);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel-glow rounded-2xl border border-white/20 p-6 shadow-2xl text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_white]">
              <Sun className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-widest">
                SOLAR BARYCENTER
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">
                Core Operator Hub
              </h3>
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

        {/* Current Operator Profile */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-4 mb-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-white/30"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-orbitron font-semibold text-sm text-white truncate">{user.name}</h4>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                {user.callsign}
              </span>
            </div>
            <div className="text-xs font-mono-tech text-white/50 mt-0.5">{user.rank}</div>
            <div className="text-[11px] font-mono-tech text-white/40">{user.clearance}</div>
          </div>
        </div>

        {/* Core Output Slider */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-4 space-y-2">
          <div className="flex justify-between text-xs font-mono-tech">
            <span className="text-white/60">Solar Core Output</span>
            <span className="font-bold text-white">{output} MW</span>
          </div>
          <input
            type="range"
            min="2000"
            max="6000"
            step="50"
            value={output}
            onChange={(e) => setOutput(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        {/* Switch Operator */}
        <div className="mb-4">
          <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider mb-2">
            Switch Station Operator
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  cosmicAudio.playClick();
                  onSwitchUser(u);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  user.id === u.id
                    ? 'bg-white/15 border-white text-white'
                    : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-6 h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold truncate">{u.name.split(' ')[0]}</div>
                  <div className="text-[10px] font-mono-tech text-white/40 truncate">{u.callsign}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSound();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono-tech text-white transition-colors"
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>Soundscapes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              cosmicAudio.playWarp();
              onLogout();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-tech text-white/60 hover:text-white hover:bg-white/10 transition-colors ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
