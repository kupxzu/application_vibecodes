import React from 'react';
import { X, MessageSquare, Search } from 'lucide-react';
import { CosmicUser } from '../types/cosmic';
import { PRESET_USERS, cosmicAudio } from '../data/cosmicData';

interface NewDirectChatModalProps {
  isOpen: boolean;
  currentUser: CosmicUser;
  onClose: () => void;
  onStartChat: (user: CosmicUser) => void;
}

export const NewDirectChatModal: React.FC<NewDirectChatModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onStartChat,
}) => {
  if (!isOpen) return null;

  const otherUsers = PRESET_USERS.filter((u) => u.id !== currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md glass-panel-glow rounded-2xl border border-white/20 p-6 shadow-2xl text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-white" />
            <h3 className="font-orbitron font-bold text-lg text-white">Start Direct Chat</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/60 font-mono-tech mb-4">
          Select an officer, scientist, or station unit to start a 1-on-1 private channel.
        </p>

        <div className="space-y-2">
          {otherUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                cosmicAudio.playClick();
                onStartChat(u);
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/25 flex items-center justify-between transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{u.name}</div>
                  <div className="text-xs font-mono-tech text-white/50">{u.rank} · {u.station}</div>
                </div>
              </div>
              <span className="text-xs font-mono-tech px-2.5 py-1 rounded bg-white/10 border border-white/15 text-white">
                Chat
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-mono-tech text-white/60 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
