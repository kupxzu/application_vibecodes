import React, { useState, useEffect, useRef } from 'react';
import { 
  CosmicUser, PlanetModule, ModuleId, ChatMessage, ChatChannel, DirectConversation 
} from '../types/cosmic';
import { 
  PLANETS_DATA, PLANET_COMMUNITIES, INITIAL_CHAT_MESSAGES, 
  INITIAL_DIRECT_CHATS, PRESET_USERS, cosmicAudio 
} from '../data/cosmicData';
import { CreateChannelModal } from './CreateChannelModal';
import { NewDirectChatModal } from './NewDirectChatModal';
import { 
  Hash, Volume2, VolumeX, Mic, MicOff, Headphones, Plus, 
  Send, Smile, Users, Search, ArrowLeft, Orbit, Disc3, 
  PhoneOff, Radio, Shield, Sparkles, Database, Check, Sun, X, MessageSquare, Menu
} from 'lucide-react';

interface PlanetCommunityDashboardProps {
  user: CosmicUser;
  activeWorldId: ModuleId;
  onChangeWorld: (newPlanetId: ModuleId) => void;
  onBackToWorldSelector: () => void;
  onOpen3DOrrery: () => void;
  onOpenSoundModal: () => void;
}

export const PlanetCommunityDashboard: React.FC<PlanetCommunityDashboardProps> = ({
  user,
  activeWorldId,
  onChangeWorld,
  onBackToWorldSelector,
  onOpen3DOrrery,
  onOpenSoundModal,
}) => {
  const currentPlanet = PLANETS_DATA.find((p) => p.id === activeWorldId) || PLANETS_DATA[0];
  const currentCommunity = PLANET_COMMUNITIES[activeWorldId] || PLANET_COMMUNITIES['telemetry'];

  // Channels state
  const [channels, setChannels] = useState<Record<ModuleId, ChatChannel[]>>(() => {
    const map: Record<string, ChatChannel[]> = {};
    Object.values(PLANET_COMMUNITIES).forEach((c) => {
      map[c.planetId] = c.channels;
    });
    return map as Record<ModuleId, ChatChannel[]>;
  });

  // Active chat state
  const [activeMode, setActiveMode] = useState<'channel' | 'dm'>('channel');
  const [activeChannelId, setActiveChannelId] = useState<string>(currentCommunity.defaultChannelId);
  const [activeDmId, setActiveDmId] = useState<string>('dm-aria');

  // Messages state
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [directChats, setDirectChats] = useState<DirectConversation[]>(INITIAL_DIRECT_CHATS);

  // New message text box
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMembers, setShowMembers] = useState(true);

  // Voice connection state simulation
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Modals
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isNewDmOpen, setIsNewDmOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Typing simulation
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll chat to bottom
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Update default channel when active world changes
  useEffect(() => {
    if (activeMode === 'channel') {
      const comm = PLANET_COMMUNITIES[activeWorldId];
      if (comm) {
        setActiveChannelId(comm.defaultChannelId);
      }
    }
  }, [activeWorldId, activeMode]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesMap, activeChannelId, activeDmId, activeMode]);

  // Current chat items
  const activeChatKey = activeMode === 'channel' ? activeChannelId : activeDmId;
  const currentMessages = messagesMap[activeChatKey] || [];

  const currentChannel = channels[activeWorldId]?.find((c) => c.id === activeChannelId);
  const currentDm = directChats.find((d) => d.id === activeDmId);

  // Send message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    cosmicAudio.playMessageSent();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      senderRole: user.rank,
      content: inputMessage.trim(),
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channelId: activeChatKey,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatKey]: [...(prev[activeChatKey] || []), newMsg],
    }));

    const sentContent = inputMessage.trim();
    setInputMessage('');

    // Simulated responsive crew reply after 1.4s
    if (activeMode === 'channel' || activeMode === 'dm') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        cosmicAudio.playMessageReceived();

        let responder = PRESET_USERS[1]; // Dr. Aria
        let replyText = `Confirmed operator ${user.name.split(' ')[0]}. Trajectory and telemetry align with your dispatch.`;

        if (activeWorldId === 'fleet') {
          responder = PRESET_USERS[2]; // Kira Sol
          replyText = `Copy that! Fleet navigation is recording your status. Sector patrol remains nominal.`;
        } else if (activeWorldId === 'security') {
          responder = PRESET_USERS[3]; // Eliot Tate
          replyText = `Deflector power grid acknowledges update. Shield harmonics holding at 99.8%.`;
        }

        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: responder.id,
          senderName: responder.name,
          senderAvatar: responder.avatarUrl,
          senderRole: responder.rank,
          content: replyText,
          timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channelId: activeChatKey,
        };

        setMessagesMap((prev) => ({
          ...prev,
          [activeChatKey]: [...(prev[activeChatKey] || []), replyMsg],
        }));
      }, 1400);
    }
  };

  // Add new channel
  const handleCreateChannel = (name: string, type: 'text' | 'voice', topic: string) => {
    const newChan: ChatChannel = {
      id: `${activeWorldId}-${name}`,
      name,
      type,
      topic: topic || `${name} channel`,
    };

    setChannels((prev) => ({
      ...prev,
      [activeWorldId]: [...(prev[activeWorldId] || []), newChan],
    }));

    if (type === 'text') {
      setActiveMode('channel');
      setActiveChannelId(newChan.id);
      // Initialize welcome message
      setMessagesMap((prev) => ({
        ...prev,
        [newChan.id]: [
          {
            id: `msg-init-${Date.now()}`,
            senderId: 'station_ai',
            senderName: 'Astraea Station Core',
            senderAvatar: user.avatarUrl,
            senderRole: 'Station Intelligence',
            content: `Welcome to the start of the #${name} channel!`,
            timestamp: 'Today',
            channelId: newChan.id,
            isSystem: true,
          },
        ],
      }));
    }
  };

  // Start new Direct Chat
  const handleStartDirectChat = (partner: CosmicUser) => {
    const existingDm = directChats.find((d) => d.partner.id === partner.id);
    if (existingDm) {
      setActiveMode('dm');
      setActiveDmId(existingDm.id);
    } else {
      const newDm: DirectConversation = {
        id: `dm-${partner.id}-${Date.now()}`,
        partner,
        lastMessage: 'Conversation opened',
        lastTimestamp: 'Just now',
        unread: false,
      };
      setDirectChats([newDm, ...directChats]);
      setActiveMode('dm');
      setActiveDmId(newDm.id);
      setMessagesMap((prev) => ({
        ...prev,
        [newDm.id]: [
          {
            id: `msg-dm-init-${Date.now()}`,
            senderId: partner.id,
            senderName: partner.name,
            senderAvatar: partner.avatarUrl,
            senderRole: partner.rank,
            content: `Direct frequency opened with ${user.name}. How can I assist with station operations?`,
            timestamp: 'Just now',
            channelId: newDm.id,
          },
        ],
      }));
    }
  };

  // Quick response chips for seniors and instant accessibility
  const QUICK_PROMPTS = [
    '👋 Hello crew!',
    '📡 Station status report?',
    '🚀 All systems nominal',
    '🛰️ Requesting orbital coordinates',
    '🌟 Clear telemetry from sector',
    '❓ Need navigation assistance',
  ];

  // Toggle reaction on a message
  const handleToggleReaction = (msgId: string, emoji: string) => {
    cosmicAudio.playClick();
    setMessagesMap((prev) => {
      const channelMsgs = prev[activeChatKey] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
        return {
          ...m,
          reactions: currentReactions,
        };
      });
      return {
        ...prev,
        [activeChatKey]: updated,
      };
    });
  };

  // Quick reply sender
  const handleQuickPromptClick = (text: string) => {
    cosmicAudio.playMessageSent();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      senderRole: user.rank,
      content: text,
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channelId: activeChatKey,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatKey]: [...(prev[activeChatKey] || []), newMsg],
    }));

    // Trigger crew reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      cosmicAudio.playMessageReceived();

      let responder = PRESET_USERS[1];
      let replyText = `Acknowledged operator ${user.name.split(' ')[0]}. Telemetry confirmed.`;
      if (activeWorldId === 'fleet') {
        responder = PRESET_USERS[2];
        replyText = `Copy that! Patrol wing standing by for vector authorization.`;
      } else if (activeWorldId === 'security') {
        responder = PRESET_USERS[3];
        replyText = `Status received. Station shields holding stable at 99.8%.`;
      }

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: responder.id,
        senderName: responder.name,
        senderAvatar: responder.avatarUrl,
        senderRole: responder.rank,
        content: replyText,
        timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channelId: activeChatKey,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeChatKey]: [...(prev[activeChatKey] || []), replyMsg],
      }));
    }, 1200);
  };

  // Filter messages by search query
  const filteredMessages = currentMessages.filter((m) =>
    searchQuery ? m.content.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="relative h-screen w-screen flex overflow-hidden select-none bg-black text-white font-body">
      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebars Container: Drawer on mobile (< md), Static on desktop (md+) */}
      <div className={`fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-out md:static md:translate-x-0 ${
        isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* 1. LEFT SERVER / WORLD RAIL (68px wide) */}
        <aside className="w-16 sm:w-18 shrink-0 bg-[#08080C] border-r border-white/10 flex flex-col items-center py-3 z-30 justify-between">
        <div className="flex flex-col items-center gap-2.5 w-full">
          {/* Back to All Worlds / Main Menu */}
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onBackToWorldSelector();
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 hover:bg-white/25 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-md group relative"
            title="All Worlds / Main Menu"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="absolute left-16 bg-white text-black text-xs font-mono-tech font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              All Worlds Menu
            </span>
          </button>

          <div className="w-8 h-[1px] bg-white/15 my-1" />

          {/* Direct Chats Home Icon */}
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setActiveMode('dm');
            }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-all flex items-center justify-center border relative group ${
              activeMode === 'dm'
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-white/[0.04] text-white/70 border-white/10 hover:bg-white/15 hover:text-white'
            }`}
            title="Direct Messages"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute left-16 bg-white text-black text-xs font-mono-tech font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              Direct Chats
            </span>
          </button>

          <div className="w-8 h-[1px] bg-white/15 my-1" />

          {/* Planet World Icons */}
          {PLANETS_DATA.map((planet) => {
            const isSelected = activeMode === 'channel' && activeWorldId === planet.id;
            return (
              <button
                key={planet.id}
                type="button"
                onClick={() => {
                  cosmicAudio.playClick();
                  setActiveMode('channel');
                  onChangeWorld(planet.id);
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-all flex items-center justify-center border relative group ${
                  isSelected
                    ? 'border-white bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/10 hover:border-white/20'
                }`}
                title={planet.name}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <span className="absolute -left-1 w-1.5 h-6 bg-white rounded-r-full shadow-sm" />
                )}

                <div
                  className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center font-orbitron font-bold text-xs"
                  style={{ backgroundColor: planet.color, color: '#000000' }}
                >
                  {planet.name[0]}
                </div>

                {/* Tooltip on hover */}
                <span className="absolute left-16 bg-white text-black text-xs font-mono-tech font-bold px-2.5 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {planet.name} ({planet.category})
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Orbit / Highlighted View 3D Mode Icon */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onOpen3DOrrery();
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white text-black hover:bg-white/90 border-2 border-white flex items-center justify-center transition-all group relative shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-highlight-glow cursor-pointer"
            title="View 3D Mode: Real-time orbital space"
          >
            <Orbit className="w-5 h-5 text-black" />
            <span className="absolute left-16 bg-white text-black text-xs font-mono-tech font-bold px-2.5 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              View 3D Mode
            </span>
          </button>
        </div>
      </aside>

      {/* 2. CHANNELS & DIRECT CHATS SIDEBAR (240px wide) */}
      <aside className="w-60 sm:w-64 shrink-0 bg-[#0E0E14] border-r border-white/10 flex flex-col justify-between z-20">
        <div className="flex-1 overflow-y-auto">
          {/* Header of Active Planet World */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="overflow-hidden">
              <h2 className="font-orbitron font-bold text-sm text-white truncate">
                {activeMode === 'channel' ? currentCommunity.name : 'Direct Frequencies'}
              </h2>
              <div className="text-[11px] font-mono-tech text-white/50 truncate">
                {activeMode === 'channel' ? `${currentCommunity.onlineCount} Online` : 'Private Station Chats'}
              </div>
            </div>

            <button
              onClick={() => {
                cosmicAudio.playClick();
                onBackToWorldSelector();
              }}
              className="text-[11px] font-mono-tech text-white/60 hover:text-white underline underline-offset-2 ml-2 shrink-0"
              title="Return to Main Menu"
            >
              Exit
            </button>
          </div>

          {/* A. TEXT CHANNELS SECTION */}
          {activeMode === 'channel' && (
            <div className="p-3 space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-white/50 uppercase tracking-wider px-1 mb-1">
                  <span>TEXT CHANNELS</span>
                  <button
                    type="button"
                    onClick={() => setIsCreateChannelOpen(true)}
                    className="p-1 hover:text-white text-white/60 transition-colors"
                    title="Create Channel"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  {channels[activeWorldId]
                    ?.filter((c) => c.type === 'text')
                    .map((ch) => {
                      const isActive = activeChannelId === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            cosmicAudio.playClick();
                            setActiveChannelId(ch.id);
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono-tech flex items-center gap-2 transition-all ${
                            isActive
                              ? 'bg-white/15 text-white font-semibold shadow-sm'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Hash className="w-3.5 h-3.5 shrink-0 opacity-60" />
                          <span className="truncate">{ch.name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* B. VOICE CHANNELS SECTION */}
              <div>
                <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider px-1 mb-1">
                  VOICE COMMS
                </div>

                <div className="space-y-0.5">
                  {channels[activeWorldId]
                    ?.filter((c) => c.type === 'voice')
                    .map((ch) => {
                      const isConnected = connectedVoiceChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            cosmicAudio.playClick();
                            if (isConnected) {
                              setConnectedVoiceChannel(null);
                            } else {
                              setConnectedVoiceChannel(ch.id);
                            }
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-mono-tech flex items-center justify-between transition-all ${
                            isConnected
                              ? 'bg-white text-black font-bold'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Volume2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{ch.name}</span>
                          </div>
                          {isConnected && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-white font-mono-tech">
                              LIVE
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Voice Connection Banner if connected */}
              {connectedVoiceChannel && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs font-mono-tech space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>Radio Connected</span>
                    </div>
                    <button
                      onClick={() => {
                        cosmicAudio.playClick();
                        setConnectedVoiceChannel(null);
                      }}
                      className="text-white/50 hover:text-white"
                      title="Disconnect Voice"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-[11px] text-white/60 truncate">
                    Frequency: RTC-720 kHz Subspace
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. DIRECT CHATS SECTION */}
          {activeMode === 'dm' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-white/50 uppercase tracking-wider px-1">
                <span>DIRECT CONVERSATIONS</span>
                <button
                  type="button"
                  onClick={() => setIsNewDmOpen(true)}
                  className="p-1 hover:text-white text-white/60 transition-colors"
                  title="New Direct Chat"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {directChats.map((dm) => {
                  const isActive = activeDmId === dm.id;
                  return (
                    <button
                      key={dm.id}
                      type="button"
                      onClick={() => {
                        cosmicAudio.playClick();
                        setActiveDmId(dm.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                        isActive
                          ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <img
                        src={dm.partner.avatarUrl}
                        alt={dm.partner.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {dm.partner.name}
                        </div>
                        <div className="text-[10px] font-mono-tech text-white/50 truncate">
                          {dm.lastMessage}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* D. BOTTOM USER STATUS BAR (Discord-style) */}
        <div className="p-2.5 bg-[#0A0A10] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-white/30"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white border border-black" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user.name.split(' ')[0]}</div>
              <div className="text-[10px] font-mono-tech text-white/40 truncate">{user.callsign}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                cosmicAudio.playClick();
                setIsMuted(!isMuted);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted ? 'text-white bg-white/20' : 'text-white/50 hover:text-white'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                cosmicAudio.playClick();
                setIsDeafened(!isDeafened);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isDeafened ? 'text-white bg-white/20' : 'text-white/50 hover:text-white'
              }`}
              title={isDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
            >
              <Headphones className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                cosmicAudio.playClick();
                onOpenSoundModal();
              }}
              className="p-1.5 rounded-lg text-white/50 hover:text-white transition-colors"
              title="Ambient Sound Settings"
            >
              <Disc3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
      </div>

      {/* 3. CENTER CHAT VIEWPORT */}
      <main className="flex-1 flex flex-col justify-between bg-black overflow-hidden relative">
        {/* Top Channel Header Bar */}
        <header className="h-14 px-3 sm:px-6 border-b border-white/10 flex items-center justify-between bg-[#08080C]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
            {/* Mobile Drawer Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white shrink-0 active:scale-95 cursor-pointer"
              title="Open Channels & Worlds Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {activeMode === 'channel' ? (
              <>
                <Hash className="w-5 h-5 text-white/50 shrink-0" />
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-white truncate">
                    {currentChannel?.name || 'chat'}
                  </h3>
                  <div className="hidden sm:block text-[11px] font-mono-tech text-white/50 truncate max-w-md">
                    {currentChannel?.topic || currentCommunity.tagline}
                  </div>
                </div>
              </>
            ) : (
              <>
                <img
                  src={currentDm?.partner.avatarUrl}
                  alt={currentDm?.partner.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-white truncate">
                    {currentDm?.partner.name}
                  </h3>
                  <div className="text-[11px] font-mono-tech text-white/50 truncate">
                    {currentDm?.partner.rank} · {currentDm?.partner.station}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search within this chat */}
            <div className="relative hidden md:block w-48">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-8 pr-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono-tech text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Toggle Member Sidebar */}
            <button
              type="button"
              onClick={() => setShowMembers(!showMembers)}
              className={`p-2 rounded-lg border text-xs font-mono-tech transition-colors ${
                showMembers ? 'bg-white/15 text-white border-white/20' : 'text-white/60 border-white/10 hover:text-white'
              }`}
              title="Toggle Member Roster"
            >
              <Users className="w-4 h-4" />
            </button>

            {/* Back to All Worlds Button */}
            <button
              type="button"
              onClick={onBackToWorldSelector}
              className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-mono-tech font-bold uppercase transition-all shadow-sm"
              title="Return to World Chooser"
            >
              All Worlds
            </button>
          </div>
        </header>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Welcome Banner for the Room */}
          <div className="pt-4 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
              {activeMode === 'channel' ? <Hash className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              {activeMode === 'channel' ? `Welcome to #${currentChannel?.name || 'chat'}!` : `Direct frequency with ${currentDm?.partner.name}`}
            </h1>
            <p className="text-xs sm:text-sm font-body text-white/60 mt-1 max-w-lg">
              {activeMode === 'channel'
                ? `This is the start of the #${currentChannel?.name} room in ${currentCommunity.name}. Post messages, telemetry logs, or say hello to the crew.`
                : `Encrypted direct channel active. Send logs and personal dispatches.`}
            </p>
          </div>

          {/* Message List */}
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-xs sm:text-sm font-mono-tech text-white/50">
              No messages found in this frequency. Start the conversation below!
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3.5 group rounded-2xl p-2.5 transition-colors relative ${
                  msg.isSystem ? 'bg-white/[0.03] border border-white/10' : 'hover:bg-white/[0.04]'
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-10 h-10 rounded-full object-cover border border-white/40 shrink-0 mt-0.5 shadow-sm"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm sm:text-base text-white">
                      {msg.senderName}
                    </span>
                    {msg.senderRole && (
                      <span className="text-[11px] font-mono-tech px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                        {msg.senderRole}
                      </span>
                    )}
                    <span className="text-xs font-mono-tech text-white/50 ml-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-body text-white leading-relaxed break-words">
                    {msg.content}
                  </p>

                  {/* Reaction Pills */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono-tech text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{emoji}</span>
                          <span className="text-[11px] font-bold text-white/80">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Quick Reaction Bar */}
                <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#161622] border border-white/20 rounded-xl px-2 py-1 flex items-center gap-1 shadow-lg">
                  {['👍', '🚀', '❤️', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleToggleReaction(msg.id, emoji)}
                      className="p-1 hover:scale-125 transition-transform text-xs"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono-tech text-white/60 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
              <span>A station crew member is transmitting a reply...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Message Input Box Bar with Quick Chips */}
        <div className="p-3 sm:p-4 bg-[#08080C] border-t border-white/15 space-y-2.5">
          {/* Quick Reply Chips (Senior & Universal Accessibility) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-tech">
            <span className="text-white/40 uppercase tracking-wider text-[11px] shrink-0 mr-1 hidden sm:inline">
              Quick dispatches:
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPromptClick(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white/90 hover:text-white transition-all shrink-0 cursor-pointer text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  activeMode === 'channel'
                    ? `Message #${currentChannel?.name || 'chat'} (Press Enter to send)...`
                    : `Message @${currentDm?.partner.name}...`
                }
                className="w-full pl-4 pr-12 py-3.5 bg-[#111118] border border-white/20 rounded-2xl text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:border-white shadow-inner font-body"
              />

              {/* Quick Emojis */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/60">
                <button
                  type="button"
                  onClick={() => setInputMessage((prev) => prev + ' 🚀')}
                  className="hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  title="Add rocket"
                >
                  🚀
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage((prev) => prev + ' 🛰️')}
                  className="hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  title="Add satellite"
                >
                  🛰️
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage((prev) => prev + ' ⚡')}
                  className="hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  title="Add energy"
                >
                  ⚡
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-5 py-3.5 rounded-2xl bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all font-mono-tech font-bold text-xs sm:text-sm uppercase flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* 4. RIGHT MEMBER LIST PANEL (Collapsible, 220px) */}
      {showMembers && (
        <aside className="w-56 sm:w-60 shrink-0 bg-[#0A0A10] border-l border-white/10 p-3 overflow-y-auto hidden lg:block z-10">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider mb-2 px-1">
                COMMAND CREW (2)
              </div>
              <div className="space-y-1">
                {PRESET_USERS.slice(0, 2).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleStartDirectChat(u)}
                    className="p-1.5 rounded-lg flex items-center gap-2 hover:bg-white/10 cursor-pointer transition-colors"
                    title={`Click to DM ${u.name}`}
                  >
                    <div className="relative">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/30"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white border border-black" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{u.name}</div>
                      <div className="text-[10px] font-mono-tech text-white/40 truncate">{u.rank}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider mb-2 px-1">
                STATION UNITS &amp; PILOTS (3)
              </div>
              <div className="space-y-1">
                {PRESET_USERS.slice(2).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleStartDirectChat(u)}
                    className="p-1.5 rounded-lg flex items-center gap-2 hover:bg-white/10 cursor-pointer transition-colors"
                    title={`Click to DM ${u.name}`}
                  >
                    <div className="relative">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/30"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white border border-black" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{u.name}</div>
                      <div className="text-[10px] font-mono-tech text-white/40 truncate">{u.rank}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Modals */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      <NewDirectChatModal
        isOpen={isNewDmOpen}
        currentUser={user}
        onClose={() => setIsNewDmOpen(false)}
        onStartChat={handleStartDirectChat}
      />
    </div>
  );
};
