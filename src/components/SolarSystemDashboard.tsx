import React, { useState, useCallback } from 'react';
import { CosmicUser, PlanetModule, ModuleId, ChatMessage } from '../types/cosmic';
import { PLANETS_DATA, PLANET_COMMUNITIES, PRESET_USERS, INITIAL_CHAT_MESSAGES, cosmicAudio } from '../data/cosmicData';
import { ThreeSolarSystem, PlanetScreenCoords } from './ThreeSolarSystem';
import { PlanetWorldSelector } from './PlanetWorldSelector';
import { PlanetCommunityDashboard } from './PlanetCommunityDashboard';
import { PlanetModuleModal } from './PlanetModuleModal';
import { SunCoreModal } from './SunCoreModal';
import { SoundManagementModal } from './SoundManagementModal';
import { 
  Sun, Disc3, Play, Pause, Layers, ArrowLeft, MessageSquare, 
  Orbit, Send, Hash, HelpCircle, X, Maximize2, Radio, Info
} from 'lucide-react';

interface SolarSystemDashboardProps {
  user: CosmicUser;
  onLogout: () => void;
  onSwitchUser: (newUser: CosmicUser) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const SolarSystemDashboard: React.FC<SolarSystemDashboardProps> = ({
  user,
  onLogout,
  onSwitchUser,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  // Main view state:
  // 'world-selector': Main Menu center-stage world chooser (card-free space presentation)
  // 'planet-community': Discord-like community dashboard with channels, direct chats, voice
  // '3d-orrery': The Three.js 3D space mode
  const [dashboardView, setDashboardView] = useState<'world-selector' | 'planet-community' | '3d-orrery'>('world-selector');
  const [activeWorldId, setActiveWorldId] = useState<ModuleId>('telemetry');

  // Modals
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetModule | null>(null);
  const [isSunModalOpen, setIsSunModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  
  // 3D Orrery hover state
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetModule | null>(null);
  const [hoverCoords, setHoverCoords] = useState<PlanetScreenCoords | null>(null);

  // 3D Orrery Orbit parameters
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [projection, setProjection] = useState<'perspective' | 'top-down' | 'horizon'>('perspective');
  const [showOrbits, setShowOrbits] = useState(true);
  const [showControlsTooltip, setShowControlsTooltip] = useState(false);

  // Soundscape quick-toggle
  const [ambientPlaying, setAmbientPlaying] = useState(cosmicAudio.ambientEnabled);

  // 3D Mode Direct Comms & Chat Menu Drawer state
  const [is3DChatOpen, setIs3DChatOpen] = useState(false);
  const [chatWorldId, setChatWorldId] = useState<ModuleId>('telemetry');
  const [chatChannelId, setChatChannelId] = useState<string>('c-telemetry-1');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize messages from cosmic communities
  const [chatTransmissions, setChatTransmissions] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);

  // Stable hover handler for ThreeSolarSystem
  const handleHoverPlanet = useCallback((planet: PlanetModule | null, coords?: PlanetScreenCoords) => {
    setHoveredPlanet(planet);
    if (coords) {
      setHoverCoords(coords);
    }
  }, []);

  const handleSelectPlanet = useCallback((planet: PlanetModule) => {
    setSelectedPlanet(planet);
  }, []);

  const handleSelectSun = useCallback(() => {
    setIsSunModalOpen(true);
  }, []);

  // Join world full dashboard
  const handleJoinWorld = (planetId: ModuleId) => {
    setActiveWorldId(planetId);
    setDashboardView('planet-community');
  };

  // Open 3D Comms Menu for a specific planet
  const handleOpen3DComms = (planetId: ModuleId) => {
    cosmicAudio.playClick();
    setChatWorldId(planetId);
    const comm = PLANET_COMMUNITIES[planetId];
    if (comm && comm.channels.length > 0) {
      setChatChannelId(comm.channels[0].id);
    }
    setIs3DChatOpen(true);
  };

  // Send message inside 3D mode
  const handleSend3DMessage = (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    cosmicAudio.playMessageSent();

    const newMsg: ChatMessage = {
      id: `3d-msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      senderRole: user.rank,
      content: text,
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channelId: chatChannelId,
    };

    setChatTransmissions((prev) => ({
      ...prev,
      [chatChannelId]: [...(prev[chatChannelId] || []), newMsg],
    }));

    setChatInput('');

    // Trigger simulated crew reply right in 3D mode!
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      cosmicAudio.playMessageReceived();

      let responder = PRESET_USERS[1];
      let reply = `Transmission received from 3D orbit: Telemetry confirmed.`;
      if (chatWorldId === 'fleet') {
        responder = PRESET_USERS[2];
        reply = `Fleet relay received dispatch from 3D space: Sector patrol standing by.`;
      } else if (chatWorldId === 'security') {
        responder = PRESET_USERS[3];
        reply = `Security deflector grid registers your orbital coordinate ping.`;
      }

      const replyMsg: ChatMessage = {
        id: `3d-rep-${Date.now()}`,
        senderId: responder.id,
        senderName: responder.name,
        senderAvatar: responder.avatarUrl,
        senderRole: responder.rank,
        content: reply,
        timestamp: 'Just now',
        channelId: chatChannelId,
      };

      setChatTransmissions((prev) => ({
        ...prev,
        [chatChannelId]: [...(prev[chatChannelId] || []), replyMsg],
      }));
    }, 1200);
  };

  const QUICK_3D_CHIPS = [
    '👋 All systems nominal',
    '📡 Requesting orbital scan',
    '🚀 Coordinates verified',
    '🌟 Clear skies from orbit',
  ];

  // 1. VIEW: DISCORD-LIKE PLANET COMMUNITY DASHBOARD
  if (dashboardView === 'planet-community') {
    return (
      <PlanetCommunityDashboard
        user={user}
        activeWorldId={activeWorldId}
        onChangeWorld={(newId) => setActiveWorldId(newId)}
        onBackToWorldSelector={() => setDashboardView('world-selector')}
        onOpen3DOrrery={() => setDashboardView('3d-orrery')}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
      />
    );
  }

  // 2. VIEW: MAIN MENU / WORLD SELECTOR (Card-free deep space presentation)
  if (dashboardView === 'world-selector') {
    return (
      <>
        <PlanetWorldSelector
          user={user}
          onJoinWorld={handleJoinWorld}
          onOpen3DOrrery={() => setDashboardView('3d-orrery')}
          onOpenSunHub={() => setIsSunModalOpen(true)}
          onOpenSoundModal={() => setIsSoundModalOpen(true)}
          onLogout={onLogout}
        />

        <SunCoreModal
          user={user}
          isOpen={isSunModalOpen}
          onClose={() => setIsSunModalOpen(false)}
          onSwitchUser={onSwitchUser}
          onLogout={onLogout}
          onOpenSound={() => setIsSoundModalOpen(true)}
        />

        <SoundManagementModal
          isOpen={isSoundModalOpen}
          onClose={() => {
            setIsSoundModalOpen(false);
            setAmbientPlaying(cosmicAudio.ambientEnabled);
          }}
        />
      </>
    );
  }

  // Active community & channel for 3D Comms Menu
  const current3DCommunity = PLANET_COMMUNITIES[chatWorldId];
  const current3DChannel = current3DCommunity?.channels.find((c) => c.id === chatChannelId) || current3DCommunity?.channels[0];
  const current3DMessages = chatTransmissions[current3DChannel?.id || ''] || [];

  // 3. VIEW: 3D SPACE MODE
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden select-none bg-black text-white">
      
      {/* Floating Menu Mode Button (Clean, only menu mode as requested) */}
      <div className="fixed top-4 left-4 z-40">
        <button
          type="button"
          onClick={() => {
            cosmicAudio.playClick();
            setDashboardView('world-selector');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-black hover:bg-white/90 active:scale-95 font-orbitron font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-pointer border-2 border-white backdrop-blur-md"
          title="Return to Menu Mode"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
          <span>Menu Mode</span>
        </button>
      </div>

      {/* Main 3D Canvas Viewport */}
      <main className="flex-1 relative flex items-center justify-center w-full min-h-[550px] md:min-h-[620px]">
        {/* Three.js 3D WebGL Canvas */}
        <div className="absolute inset-0 w-full h-full">
          <ThreeSolarSystem
            user={user}
            onSelectPlanet={handleSelectPlanet}
            onSelectSun={handleSelectSun}
            onHoverPlanet={handleHoverPlanet}
            paused={paused}
            speed={speed}
            projection={projection}
            showOrbits={showOrbits}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* DETAILED HOVER-STATE TOOLTIP CARD WITH QUICK CHAT & DETAILS */}
        {hoveredPlanet && (
          <div
            className="fixed z-40 pointer-events-auto transition-all duration-100 ease-out"
            style={{
              left: hoverCoords && hoverCoords.visible
                ? `${Math.max(16, Math.min(window.innerWidth - 340, hoverCoords.x + 20))}px`
                : '50%',
              top: hoverCoords && hoverCoords.visible
                ? `${Math.max(80, Math.min(window.innerHeight - 270, hoverCoords.y - 50))}px`
                : '80px',
              transform: hoverCoords && hoverCoords.visible ? 'none' : 'translateX(-50%)',
            }}
          >
            <div className="w-80 glass-panel-glow rounded-2xl border border-white/30 p-4 shadow-[0_0_35px_rgba(255,255,255,0.15)] text-white backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white/40 shrink-0 shadow-sm"
                    style={{ backgroundColor: hoveredPlanet.color }}
                  />
                  <div className="overflow-hidden">
                    <div className="font-orbitron font-bold text-xs uppercase tracking-wider text-white truncate">
                      {hoveredPlanet.name}
                    </div>
                    <div className="text-[10px] font-mono-tech text-white/50 truncate">
                      {hoveredPlanet.sectionTitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] font-mono-tech shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{hoveredPlanet.status}</span>
                </div>
              </div>

              <p className="text-[11px] text-white/70 leading-relaxed mb-3">
                {hoveredPlanet.description}
              </p>

              {/* Grid of Key Telemetry */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech mb-3">
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">
                    {hoveredPlanet.metricLabel}
                  </span>
                  <span className="text-white font-bold text-sm block mt-0.5 tabular-nums">
                    {hoveredPlanet.metricValue} <span className="text-[10px] font-normal text-white/60">{hoveredPlanet.metricUnit}</span>
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">
                    Distance AU
                  </span>
                  <span className="text-white font-bold text-sm block mt-0.5 tabular-nums">
                    {hoveredPlanet.orbitRadius} AU
                  </span>
                </div>
              </div>

              {/* Action buttons on tooltip: Open 3D Comms or Full Community */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleOpen3DComms(hoveredPlanet.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-mono-tech font-bold uppercase transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  title="Open Comms Menu in 3D Mode"
                >
                  <Radio className="w-3 h-3" />
                  <span>3D Comms</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleJoinWorld(hoveredPlanet.id)}
                  className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-mono-tech text-white transition-all cursor-pointer"
                  title="Open Full Discord Hub"
                >
                  Full Hub
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3D MODE COMMS & CHAT FLOATING MENU DRAWER */}
        {is3DChatOpen && (
          <div className="fixed right-4 sm:right-8 top-20 sm:top-24 bottom-20 w-80 sm:w-96 z-40 glass-panel-glow rounded-3xl border border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250">
            
            {/* Header: Planet Tabs & Close */}
            <div className="p-3 border-b border-white/15 bg-white/[0.03]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-white" />
                  <span className="font-orbitron font-extrabold text-xs tracking-wider text-white">
                    3D COMMS MENU
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleJoinWorld(chatWorldId)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Expand to Full Community Dashboard"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIs3DChatOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Close Comms Menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Planet Frequency Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {PLANETS_DATA.map((p) => {
                  const isCurrent = chatWorldId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        cosmicAudio.playClick();
                        setChatWorldId(p.id);
                        const comm = PLANET_COMMUNITIES[p.id];
                        if (comm?.channels.length) {
                          setChatChannelId(comm.channels[0].id);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-mono-tech transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-white text-black font-bold shadow-sm'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                      title={`Listen to ${p.name} frequency`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Channel Pills */}
              <div className="flex items-center gap-1 mt-2">
                {current3DCommunity?.channels.map((ch) => {
                  const isChActive = current3DChannel?.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        cosmicAudio.playClick();
                        setChatChannelId(ch.id);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono-tech transition-all flex items-center gap-1 cursor-pointer ${
                        isChActive
                          ? 'bg-white/20 text-white font-bold border border-white/30'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <Hash className="w-2.5 h-2.5 opacity-60" />
                      <span>{ch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs font-mono-tech">
              {current3DMessages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-xl border ${
                      isMe
                        ? 'bg-white/15 border-white/30 text-white ml-4'
                        : 'bg-white/[0.04] border-white/10 text-white/90 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                      <span className="font-bold text-white/90">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed break-words">{msg.content}</p>
                  </div>
                );
              })}

              {isTyping && (
                <div className="text-[11px] text-white/50 italic flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                  <span>Station crew responding to orbital transmission...</span>
                </div>
              )}
            </div>

            {/* Quick Chips & Transmission Input */}
            <div className="p-3 border-t border-white/15 bg-white/[0.02]">
              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1 mb-2">
                {QUICK_3D_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend3DMessage(chip)}
                    className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-[10px] font-mono-tech text-white/80 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend3DMessage()}
                  placeholder={`Transmit to #${current3DChannel?.name || 'chat'}...`}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono-tech text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={() => handleSend3DMessage()}
                  className="p-2 rounded-xl bg-white text-black hover:bg-white/90 transition-all cursor-pointer shrink-0"
                  title="Send Transmission"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALL ADDITIONAL INSTRUCTIONS TOOLTIPPED (NO RAW CLUTTER IN SPACE) */}
        <div className="absolute bottom-4 left-6 z-20">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowControlsTooltip(!showControlsTooltip)}
              onMouseEnter={() => setShowControlsTooltip(true)}
              onMouseLeave={() => setShowControlsTooltip(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono-tech text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Click to view 3D navigation instructions"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Orbit Controls</span>
            </button>

            {/* Clean Instructions Tooltip Card */}
            {showControlsTooltip && (
              <div className="absolute bottom-10 left-0 w-72 p-3 rounded-2xl glass-panel-glow border border-white/30 text-white text-xs font-mono-tech shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="font-orbitron font-bold text-xs pb-1 mb-1.5 border-b border-white/15 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-white" />
                  3D Space Controls
                </div>
                <ul className="space-y-1 text-white/80">
                  <li>• <strong>Rotate:</strong> Click and drag anywhere in space</li>
                  <li>• <strong>Zoom:</strong> Scroll up or down with your mouse wheel</li>
                  <li>• <strong>Inspect:</strong> Hover or click any planet to open telemetry</li>
                  <li>• <strong>Comms:</strong> Click &quot;Comms &amp; Chat&quot; above to transmit messages</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom HUD Control Ribbon */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 glass-panel rounded-2xl border border-white/10 mb-3 flex flex-wrap items-center justify-between gap-3 z-30">
        
        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setPaused(!paused);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              paused ? 'bg-white text-black border-white font-bold' : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
            }`}
            title={paused ? 'Resume Orbit Animation' : 'Pause Orbit Animation'}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => {
                cosmicAudio.playClick();
                setSpeed(spd);
                setPaused(false);
              }}
              className={`px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                !paused && speed === spd
                  ? 'bg-white/20 text-white border-white/30 font-bold'
                  : 'bg-white/[0.02] text-white/50 border-white/10 hover:text-white'
              }`}
              title={`Set orbit speed to ${spd}x`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Projection Toggles */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setProjection('perspective');
            }}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              projection === 'perspective' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
            }`}
            title="Switch to 3D Oblique Perspective"
          >
            3D Oblique
          </button>
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setProjection('top-down');
            }}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              projection === 'top-down' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
            }`}
            title="Switch to Top-Down Overhead View"
          >
            Top-Down
          </button>
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setProjection('horizon');
            }}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              projection === 'horizon' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
            }`}
            title="Switch to Horizon Edge View"
          >
            Horizon
          </button>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              setShowOrbits(!showOrbits);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              showOrbits ? 'bg-white/20 text-white border-white/30' : 'text-white/40 border-white/10'
            }`}
            title="Toggle Orbital Path Lines"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              cosmicAudio.playClick();
              onToggleReducedMotion();
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-tech border transition-all cursor-pointer ${
              reducedMotion ? 'bg-white text-black border-white font-bold' : 'text-white/50 border-white/10'
            }`}
            title="Toggle Reduced Motion Accessibility Mode"
          >
            {reducedMotion ? 'Motion: Off' : 'Motion: On'}
          </button>
        </div>
      </footer>

      {/* Planet Module Modal with Description and "Join planets?" */}
      <PlanetModuleModal
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
        onJoinPlanet={handleJoinWorld}
      />

      {/* Sun Core Modal */}
      <SunCoreModal
        user={user}
        isOpen={isSunModalOpen}
        onClose={() => setIsSunModalOpen(false)}
        onSwitchUser={onSwitchUser}
        onLogout={onLogout}
        onOpenSound={() => setIsSoundModalOpen(true)}
      />

      {/* Sound Management Modal */}
      <SoundManagementModal
        isOpen={isSoundModalOpen}
        onClose={() => {
          setIsSoundModalOpen(false);
          setAmbientPlaying(cosmicAudio.ambientEnabled);
        }}
      />
    </div>
  );
};
