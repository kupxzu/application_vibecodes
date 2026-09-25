import React, { useState } from 'react';
import { X, Hash, Volume2 } from 'lucide-react';
import { cosmicAudio } from '../data/cosmicData';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string, type: 'text' | 'voice', topic: string) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onCreateChannel,
}) => {
  if (!isOpen) return null;

  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [channelName, setChannelName] = useState('');
  const [channelTopic, setChannelTopic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = channelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) {
      setError('Please provide a channel name.');
      return;
    }
    cosmicAudio.playClick();
    onCreateChannel(cleanName, channelType, channelTopic.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md glass-panel-glow rounded-2xl border border-white/20 p-6 shadow-2xl text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="font-orbitron font-bold text-lg text-white">Create Channel</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Type */}
          <div>
            <label className="block text-xs font-mono-tech text-white/60 uppercase tracking-wider mb-2">
              Channel Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannelType('text')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  channelType === 'text'
                    ? 'bg-white/15 border-white text-white'
                    : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <Hash className="w-4 h-4 text-white" />
                <div>
                  <div className="text-xs font-bold">Text Room</div>
                  <div className="text-[10px] text-white/50">Post messages, logs &amp; links</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChannelType('voice')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  channelType === 'voice'
                    ? 'bg-white/15 border-white text-white'
                    : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <Volume2 className="w-4 h-4 text-white" />
                <div>
                  <div className="text-xs font-bold">Voice Room</div>
                  <div className="text-[10px] text-white/50">Simulated radio audio channel</div>
                </div>
              </button>
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-xs font-mono-tech text-white/60 uppercase tracking-wider mb-1.5">
              Channel Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono-tech text-sm">
                #
              </span>
              <input
                type="text"
                value={channelName}
                onChange={(e) => {
                  setChannelName(e.target.value);
                  setError('');
                }}
                placeholder="new-channel"
                className="w-full pl-8 pr-3 py-2 bg-black/70 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono-tech"
              />
            </div>
            {error && <span className="text-xs text-rose-300 mt-1 block">{error}</span>}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-mono-tech text-white/60 uppercase tracking-wider mb-1.5">
              Room Description / Topic (Optional)
            </label>
            <input
              type="text"
              value={channelTopic}
              onChange={(e) => setChannelTopic(e.target.value)}
              placeholder="What is this channel about?"
              className="w-full px-3 py-2 bg-black/70 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white font-mono-tech"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono-tech text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-mono-tech font-bold uppercase tracking-wider transition-all"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
