import { 
  CosmicUser, PlanetModule, AmbientSoundscape, ModuleId, 
  PlanetWorldCommunity, ChatMessage, DirectConversation, ChatChannel 
} from '../types/cosmic';

export const COMMANDER_AVATAR = '/src/assets/images/avatar_commander_profile_1790301141817.jpg';
export const ASTROPHYSICIST_AVATAR = '/src/assets/images/avatar_astrophysicist_1790301155856.jpg';

export const PRESET_USERS: CosmicUser[] = [
  {
    id: 'commander_vance',
    name: 'Marcus Vance',
    callsign: 'Apex 1',
    rank: 'Station Commander',
    station: 'Astraea Orbital Bastion',
    clearance: 'Clearance Alpha',
    avatarUrl: COMMANDER_AVATAR,
    coreOutputMW: 4850,
  },
  {
    id: 'dr_aria_thorne',
    name: 'Aria Thorne',
    callsign: 'Echo 7',
    rank: 'Lead Astrometrician',
    station: 'Deep Sky Array II',
    clearance: 'Clearance Omega',
    avatarUrl: ASTROPHYSICIST_AVATAR,
    coreOutputMW: 3920,
  },
  {
    id: 'kira_sol',
    name: 'Kira Sol',
    callsign: 'Vanguard 3',
    rank: 'Flight Navigator',
    station: 'Ares Bastion',
    clearance: 'Clearance Beta',
    avatarUrl: COMMANDER_AVATAR,
    coreOutputMW: 2600,
  },
  {
    id: 'eliot_tate',
    name: 'Eliot Tate',
    callsign: 'Forge Master',
    rank: 'Systems Engineer',
    station: 'Solar Citadel Hub',
    clearance: 'Clearance Delta',
    avatarUrl: ASTROPHYSICIST_AVATAR,
    coreOutputMW: 3100,
  },
  {
    id: 'station_ai',
    name: 'Astraea Station Core',
    callsign: 'SYNTH-9',
    rank: 'Station Intelligence',
    station: 'Subspace Barycenter',
    clearance: 'Superuser Core',
    avatarUrl: COMMANDER_AVATAR,
    coreOutputMW: 9999,
  },
];

export const PLANET_COMMUNITIES: Record<ModuleId, PlanetWorldCommunity> = {
  telemetry: {
    planetId: 'telemetry',
    name: 'Aethelgard World',
    tagline: 'Scientific Observation & Telemetry Grid',
    bannerText: 'Welcome to Aethelgard: The primary telemetry nexus monitoring real-time solar flux and deep-space bandwidth.',
    population: 2480,
    onlineCount: 312,
    defaultChannelId: 'telemetry-general',
    roles: ['Chief Scientist', 'Telemetry Engineer', 'Data Analyst', 'Observer'],
    channels: [
      { id: 'telemetry-announcements', name: 'announcements', type: 'text', topic: 'Important updates regarding orbital sensor array and flux shifts' },
      { id: 'telemetry-general', name: 'general-chatter', type: 'text', topic: 'General scientific discussion and station greetings' },
      { id: 'telemetry-flux', name: 'flux-diagnostics', type: 'text', topic: 'Sub-light harmonic readings and live sensor streams' },
      { id: 'telemetry-lab-voice', name: 'Laboratory Voice Deck', type: 'voice', topic: 'Live audio channel for telemetry operators' },
    ],
  },
  fleet: {
    planetId: 'fleet',
    name: 'Ares IV Garrison',
    tagline: 'Deep Space Fleet & Orbital Defense Bastion',
    bannerText: 'Ares IV Command: Coordinates battlecruisers, reconnaissance probes, and defense perimeter alerts.',
    population: 3150,
    onlineCount: 428,
    defaultChannelId: 'fleet-general',
    roles: ['Admiral', 'Squadron Leader', 'Cruiser Pilot', 'Naval Cadet'],
    channels: [
      { id: 'fleet-briefing', name: 'fleet-briefing', type: 'text', topic: 'Daily orbital patrol assignments and vessel readiness' },
      { id: 'fleet-general', name: 'flight-deck-chat', type: 'text', topic: 'Pilots and navigators open frequency discussion' },
      { id: 'fleet-hangar', name: 'hangar-bay-4', type: 'text', topic: 'Maintenance logs, shuttle readiness, and warp fuel levels' },
      { id: 'fleet-bridge-voice', name: 'Bridge Tactical Comms', type: 'voice', topic: 'Open radio tactical voice channel' },
    ],
  },
  comms: {
    planetId: 'comms',
    name: 'Celestia Haven',
    tagline: 'Subspace Relays & Interstellar Social Terminal',
    bannerText: 'Celestia: The open communications capital of Astraea where all spacefarers share stories and packets.',
    population: 4620,
    onlineCount: 780,
    defaultChannelId: 'comms-general',
    roles: ['Relay Officer', 'Communications Envoy', 'Station Traveler'],
    channels: [
      { id: 'comms-dispatches', name: 'packet-dispatches', type: 'text', topic: 'Incoming interstellar letters and public frequency broadcasts' },
      { id: 'comms-general', name: 'interstellar-lounge', type: 'text', topic: 'The heart of Astraea! Talk about life in orbit, star maps, or say hello' },
      { id: 'comms-mess-hall', name: 'crew-mess-hall', type: 'text', topic: 'Casual coffee banter, relaxation, and questions for new travelers' },
      { id: 'comms-subspace-voice', name: 'Subspace Audio Lounge', type: 'voice', topic: 'Cozy voice space with ambient starlight audio' },
    ],
  },
  observatory: {
    planetId: 'observatory',
    name: 'Kronos Observatory',
    tagline: 'Deep Sky Astrometry & Exoplanet Catalog',
    bannerText: 'Kronos Prime: Scanning the outer rim for new exoplanets, radio anomalies, and gravitational ripple data.',
    population: 1890,
    onlineCount: 205,
    defaultChannelId: 'observatory-general',
    roles: ['Astrometrician', 'Exoplanet Cartographer', 'Spectroscopist'],
    channels: [
      { id: 'observatory-announcements', name: 'astronomy-news', type: 'text', topic: 'New star catalogs, pulsar detections, and sky survey notes' },
      { id: 'observatory-general', name: 'stargazer-chat', type: 'text', topic: 'Discussions on constellations, telescope calibration, and deep sky' },
      { id: 'observatory-exoplanets', name: 'exoplanet-hunting', type: 'text', topic: 'Habitable zone discoveries and spectroscopic breakdown' },
      { id: 'observatory-dome-voice', name: 'Stargazer Dome Voice', type: 'voice', topic: 'Quiet voice observatory channel' },
    ],
  },
  security: {
    planetId: 'security',
    name: 'Vespera Citadel',
    tagline: 'System Settings, Deflector Shields & Security Matrix',
    bannerText: 'Vespera: Station configuration, quantum encryption, firewall nodes, and deflector power grid controls.',
    population: 1540,
    onlineCount: 164,
    defaultChannelId: 'security-general',
    roles: ['Security Director', 'Cryptographer', 'Shield Specialist'],
    channels: [
      { id: 'security-bulletin', name: 'security-bulletin', type: 'text', topic: 'Station status, maintenance schedules, and access protocols' },
      { id: 'security-general', name: 'system-operations', type: 'text', topic: 'General technical discussion and terminal support' },
      { id: 'security-firewall', name: 'deflector-grid-status', type: 'text', topic: 'Harmonic shield resonance and emergency contingency logs' },
      { id: 'security-voice', name: 'Security Council Voice', type: 'voice', topic: 'Restricted security voice conference' },
    ],
  },
  archives: {
    planetId: 'archives',
    name: 'Nix Archive Vault',
    tagline: 'Historical Logs, Flight Manifests & Station Lore',
    bannerText: 'Nix: The immutable memory of Astraea holding centuries of space flight logs and science monographs.',
    population: 1210,
    onlineCount: 98,
    defaultChannelId: 'archives-general',
    roles: ['Chief Archivist', 'Historical Scribe', 'Research Scholar'],
    channels: [
      { id: 'archives-manifest', name: 'archive-manifest', type: 'text', topic: 'Directory of newly digitized flight logs and historical records' },
      { id: 'archives-general', name: 'reading-room', type: 'text', topic: 'Discussions on early deep space expeditions and space lore' },
      { id: 'archives-expeditions', name: 'ancient-transmissions', type: 'text', topic: 'Decoded transmission fragments from the 21st century' },
      { id: 'archives-voice', name: 'Silent Vault Audio', type: 'voice', topic: 'Quiet ambient listening room' },
    ],
  },
};

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'telemetry-general': [
    {
      id: 'm-t1',
      senderId: 'dr_aria_thorne',
      senderName: 'Dr. Aria Thorne',
      senderAvatar: ASTROPHYSICIST_AVATAR,
      senderRole: 'Lead Astrometrician',
      content: 'Good day operators! Sensor array 4 just completed calibration against the solar core. Flux variance is holding under 0.002%.',
      timestamp: 'Today at 09:14',
      channelId: 'telemetry-general',
    },
    {
      id: 'm-t2',
      senderId: 'eliot_tate',
      senderName: 'Eliot Tate',
      senderAvatar: ASTROPHYSICIST_AVATAR,
      senderRole: 'Systems Engineer',
      content: 'Confirmed, Dr. Thorne. The cooling loops in sub-rack B are operating at peak efficiency. Ready for increased data ingest.',
      timestamp: 'Today at 09:22',
      channelId: 'telemetry-general',
    },
    {
      id: 'm-t3',
      senderId: 'station_ai',
      senderName: 'Astraea Station Core',
      senderAvatar: COMMANDER_AVATAR,
      senderRole: 'Station Intelligence',
      content: '[SYSTEM]: Daily telemetry throughput has crossed 48.6 TB/s. All planetary node channels are synchronized.',
      timestamp: 'Today at 09:30',
      channelId: 'telemetry-general',
      isSystem: true,
    },
  ],
  'fleet-general': [
    {
      id: 'm-f1',
      senderId: 'commander_vance',
      senderName: 'Marcus Vance',
      senderAvatar: COMMANDER_AVATAR,
      senderRole: 'Station Commander',
      content: 'Attention squadron leaders: Cruiser Hyperion has concluded docking maneuvers. Hangar bay 4 is cleared for standard ingress.',
      timestamp: 'Today at 08:45',
      channelId: 'fleet-general',
    },
    {
      id: 'm-f2',
      senderId: 'kira_sol',
      senderName: 'Kira Sol',
      senderAvatar: COMMANDER_AVATAR,
      senderRole: 'Flight Navigator',
      content: 'Copy that, Commander! Reconnaissance flight Delta-9 is returning from the asteroid rim. Fuel reserves are at 88%. All nominal.',
      timestamp: 'Today at 08:52',
      channelId: 'fleet-general',
    },
  ],
  'comms-general': [
    {
      id: 'm-c1',
      senderId: 'dr_aria_thorne',
      senderName: 'Aria Thorne',
      senderAvatar: ASTROPHYSICIST_AVATAR,
      senderRole: 'Lead Astrometrician',
      content: 'Welcome to the Celestia Haven lounge! Whether you are a veteran explorer or visiting our station for the first time, feel free to share your thoughts here.',
      timestamp: 'Today at 07:30',
      channelId: 'comms-general',
    },
    {
      id: 'm-c2',
      senderId: 'commander_vance',
      senderName: 'Marcus Vance',
      senderAvatar: COMMANDER_AVATAR,
      senderRole: 'Station Commander',
      content: 'Greetings everyone. The solar barycenter looks magnificent today. All public comms relay beacons are operating smoothly.',
      timestamp: 'Today at 08:10',
      channelId: 'comms-general',
    },
    {
      id: 'm-c3',
      senderId: 'kira_sol',
      senderName: 'Kira Sol',
      senderAvatar: COMMANDER_AVATAR,
      senderRole: 'Flight Navigator',
      content: 'Just grabbed a hot tea from the crew galley ☕ The view of Kronos rings from the observation window is stunning!',
      timestamp: 'Today at 08:24',
      channelId: 'comms-general',
    },
  ],
  'observatory-general': [
    {
      id: 'm-o1',
      senderId: 'dr_aria_thorne',
      senderName: 'Dr. Aria Thorne',
      senderAvatar: ASTROPHYSICIST_AVATAR,
      senderRole: 'Lead Astrometrician',
      content: 'Aperture sweep #1420 has locked onto candidate star TRAPPIST-1. Exoplanet spectroscopy indicates water vapor absorption lines in the upper atmosphere!',
      timestamp: 'Today at 06:40',
      channelId: 'observatory-general',
    },
  ],
  'security-general': [
    {
      id: 'm-s1',
      senderId: 'eliot_tate',
      senderName: 'Eliot Tate',
      senderAvatar: ASTROPHYSICIST_AVATAR,
      senderRole: 'Systems Engineer',
      content: 'All deflector quadrants (Fore, Aft, Port, Starboard) are calibrated to 99.8% harmonic stability. Key rotation schedule is set to automatic.',
      timestamp: 'Today at 05:15',
      channelId: 'security-general',
    },
  ],
  'archives-general': [
    {
      id: 'm-a1',
      senderId: 'station_ai',
      senderName: 'Astraea Station Core',
      senderAvatar: COMMANDER_AVATAR,
      senderRole: 'Station Intelligence',
      content: 'Welcome to the Nix Archive Reading Room. 8.4 Petabytes of verified historical logs are indexed and available for retrieval.',
      timestamp: 'Today at 04:00',
      channelId: 'archives-general',
      isSystem: true,
    },
  ],
};

export const INITIAL_DIRECT_CHATS: DirectConversation[] = [
  {
    id: 'dm-aria',
    partner: PRESET_USERS[1], // Dr. Aria Thorne
    lastMessage: 'Let me know if you would like me to pull the latest spectrum scans.',
    lastTimestamp: '12m ago',
    unread: true,
  },
  {
    id: 'dm-kira',
    partner: PRESET_USERS[2], // Kira Sol
    lastMessage: 'Ready for the next orbital patrol when you are, Commander!',
    lastTimestamp: '1h ago',
    unread: false,
  },
  {
    id: 'dm-core-ai',
    partner: PRESET_USERS[4], // Astraea Core AI
    lastMessage: 'All planetary barycenter parameters are holding optimal equilibrium.',
    lastTimestamp: '3h ago',
    unread: false,
  },
];

export const PLANETS_DATA: PlanetModule[] = [
  {
    id: 'telemetry',
    name: 'Aethelgard',
    category: 'Telemetry',
    sectionTitle: 'Telemetry: Orbital Stream & Diagnostics',
    description: 'Real-time telemetry feeds, sub-light flux ingestion, and bandwidth allocation.',
    orbitRadius: 34,
    orbitSpeed: 0.42,
    initialAngle: 0.5,
    size: 3.6,
    color: '#E2E8F0',
    roughness: 0.8,
    metalness: 0.2,
    textureType: 'craters',
    metricLabel: 'Throughput',
    metricValue: '48.6',
    metricUnit: 'TB/s',
    status: 'Nominal',
    latencyMs: '0.4 ms',
    activeProcesses: '16 Parallel Threads',
  },
  {
    id: 'fleet',
    name: 'Ares IV',
    category: 'Fleet',
    sectionTitle: 'Fleet: Battle Group & Vessel Readiness',
    description: 'Orbital patrol cruisers, reconnaissance probes, and warp-gate deployment.',
    orbitRadius: 50,
    orbitSpeed: 0.32,
    initialAngle: 2.2,
    size: 4.4,
    color: '#94A3B8',
    roughness: 0.9,
    metalness: 0.3,
    textureType: 'craters',
    metricLabel: 'Vessels',
    metricValue: '18',
    metricUnit: 'Active',
    status: 'Sector Ready',
    latencyMs: '1.2 ms',
    activeProcesses: '4 Patrol Groups',
  },
  {
    id: 'comms',
    name: 'Celestia',
    category: 'Comms',
    sectionTitle: 'Comms: Subspace Carrier & Relays',
    description: 'Tachyon burst receivers, encrypted quantum packets, and relay transceivers.',
    orbitRadius: 68,
    orbitSpeed: 0.24,
    initialAngle: 4.1,
    size: 5.6,
    color: '#CBD5E1',
    roughness: 0.5,
    metalness: 0.4,
    textureType: 'bands',
    metricLabel: 'Signal SNR',
    metricValue: '42.8',
    metricUnit: 'dB',
    status: 'Carrier Locked',
    latencyMs: '0.2 ms',
    activeProcesses: '12 Relay Nodes',
  },
  {
    id: 'observatory',
    name: 'Kronos',
    category: 'Observatory',
    sectionTitle: 'Observatory: Astrometric Sky Survey',
    description: 'Deep-sky astrometric survey catalog, exoplanet spectroscopy, and gravitational waves.',
    orbitRadius: 88,
    orbitSpeed: 0.17,
    initialAngle: 1.4,
    size: 6.8,
    color: '#F1F5F9',
    roughness: 0.6,
    metalness: 0.3,
    textureType: 'rings',
    hasRings: true,
    ringInnerRadius: 8.5,
    ringOuterRadius: 14.5,
    metricLabel: 'Catalog',
    metricValue: '1,420',
    metricUnit: 'Stars',
    status: 'Scanning',
    latencyMs: '2.1 ms',
    activeProcesses: 'Aperture Synchronized',
  },
  {
    id: 'security',
    name: 'Vespera',
    category: 'Security',
    sectionTitle: 'Settings: System Configuration & Shield Matrix',
    description: 'Quantum deflector field harmonics, intrusion firewalls, and 256-qubit key rotation.',
    orbitRadius: 108,
    orbitSpeed: 0.12,
    initialAngle: 3.6,
    size: 4.8,
    color: '#94A3B8',
    roughness: 0.3,
    metalness: 0.8,
    textureType: 'faceted',
    metricLabel: 'Shield Grid',
    metricValue: '99.8',
    metricUnit: '%',
    status: 'Deflector Solid',
    latencyMs: '0.1 ms',
    activeProcesses: '256-Qubit Enclave',
  },
  {
    id: 'archives',
    name: 'Nix',
    category: 'Archives',
    sectionTitle: 'Archives: Station Ledger & Monographs',
    description: 'Historical mission logs, astrophysical expedition records, and station telemetry archive.',
    orbitRadius: 128,
    orbitSpeed: 0.09,
    initialAngle: 5.2,
    size: 3.8,
    color: '#FFFFFF',
    roughness: 0.7,
    metalness: 0.1,
    textureType: 'ice',
    metricLabel: 'Storage',
    metricValue: '8.4',
    metricUnit: 'PB',
    status: 'Encrypted',
    latencyMs: '0.8 ms',
    activeProcesses: 'Immutable Ledger',
  },
];

/**
 * Web Audio API Engine for Ambient Space Soundscapes and UI Cues
 */
class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: { stop: () => void }[] = [];
  
  public sfxEnabled: boolean = true;
  public ambientEnabled: boolean = false;
  public currentTrack: AmbientSoundscape = 'void-drone';
  public volume: number = 0.5;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setSoundscape(track: AmbientSoundscape) {
    this.currentTrack = track;
    if (this.ambientEnabled) {
      this.stopAmbientNodes();
      this.playCurrentSoundscape();
    }
  }

  public toggleAmbient(enable?: boolean): boolean {
    this.init();
    const targetState = enable !== undefined ? enable : !this.ambientEnabled;
    this.ambientEnabled = targetState;

    if (targetState) {
      this.playCurrentSoundscape();
    } else {
      this.stopAmbient();
    }
    return this.ambientEnabled;
  }

  private stopAmbientNodes() {
    if (this.ambientNodes.length > 0) {
      this.ambientNodes.forEach(node => {
        try { node.stop(); } catch { /* ignore */ }
      });
      this.ambientNodes = [];
    }
  }

  public stopAmbient() {
    if (!this.ambientGain || !this.ctx) return;
    this.ambientGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.3);
    setTimeout(() => {
      this.stopAmbientNodes();
    }, 400);
  }

  private playCurrentSoundscape() {
    this.init();
    if (!this.ctx || !this.ambientGain) return;
    this.stopAmbientNodes();

    // Fade in ambient volume gently
    this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 1.2);

    if (this.currentTrack === 'void-drone') {
      // Deep sub-bass twin oscillators with slow pulsing filter
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // gentle beating

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // slow breathe
      lfoGain.gain.setValueAtTime(50, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);

      osc1.start();
      osc2.start();
      lfo.start();

      this.ambientNodes.push({
        stop: () => {
          try {
            osc1.stop();
            osc2.stop();
            lfo.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch { /* ignore */ }
        }
      });
    } else if (this.currentTrack === 'pulsar-resonance') {
      // Harmonic 110Hz + 220Hz with rhythmic pulse
      const osc = this.ctx.createOscillator();
      const pulseGain = this.ctx.createGain();
      const pulseLfo = this.ctx.createOscillator();
      const pulseLfoGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);

      pulseLfo.type = 'sine';
      pulseLfo.frequency.setValueAtTime(0.6, this.ctx.currentTime); // 0.6Hz cosmic pulsar
      pulseLfoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      pulseLfo.connect(pulseLfoGain);

      pulseGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      pulseLfoGain.connect(pulseGain.gain);

      osc.connect(pulseGain);
      pulseGain.connect(this.ambientGain);

      osc.start();
      pulseLfo.start();

      this.ambientNodes.push({
        stop: () => {
          try {
            osc.stop();
            pulseLfo.stop();
            osc.disconnect();
          } catch { /* ignore */ }
        }
      });
    } else if (this.currentTrack === 'solar-wind') {
      // Filtered white noise wind
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(280, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(4.0, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);

      whiteNoise.connect(bandpass);
      bandpass.connect(this.ambientGain);

      whiteNoise.start();
      lfo.start();

      this.ambientNodes.push({
        stop: () => {
          try {
            whiteNoise.stop();
            lfo.stop();
            whiteNoise.disconnect();
          } catch { /* ignore */ }
        }
      });
    } else {
      // Subspace Drift (warm sine triad)
      [73.42, 110.0, 146.83].forEach(freq => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.ambientGain);
        osc.start();
        this.ambientNodes.push({
          stop: () => {
            try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
          }
        });
      });
    }
  }

  // SFX UI Tones
  public playHover() {
    if (!this.sfxEnabled) return;
    this.playTone(1100, 'sine', 0.04, 0.015);
  }

  public playClick() {
    if (!this.sfxEnabled) return;
    this.playTone(880, 'triangle', 0.06, 0.03);
  }

  public playMessageSent() {
    if (!this.sfxEnabled) return;
    this.playTone(980, 'sine', 0.06, 0.03);
  }

  public playMessageReceived() {
    if (!this.sfxEnabled) return;
    this.playTone(660, 'sine', 0.05, 0.025);
    setTimeout(() => {
      this.playTone(880, 'triangle', 0.08, 0.03);
    }, 60);
  }

  public playWarp() {
    if (!this.sfxEnabled) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch { /* ignore */ }
  }

  private playTone(freq: number, type: OscillatorType, dur: number, vol: number) {
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch { /* ignore */ }
  }
}

export const cosmicAudio = new CosmicAudioEngine();
