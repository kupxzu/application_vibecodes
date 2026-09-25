export interface CosmicUser {
  id: string;
  name: string;
  callsign: string;
  rank: string;
  station: string;
  clearance: string;
  avatarUrl: string;
  coreOutputMW: number;
}

export type ModuleId = 'telemetry' | 'fleet' | 'comms' | 'observatory' | 'security' | 'archives';

export type AmbientSoundscape = 'void-drone' | 'pulsar-resonance' | 'solar-wind' | 'subspace-drift';

export interface SoundSettings {
  ambientEnabled: boolean;
  ambientTrack: AmbientSoundscape;
  volume: number; // 0.0 to 1.0
  sfxEnabled: boolean;
}

export interface PlanetModule {
  id: ModuleId;
  name: string;
  category: string;
  sectionTitle: string; // Detailed section metadata e.g. 'Settings: System Configuration'
  description: string;
  orbitRadius: number; // 3D units distance from sun
  orbitSpeed: number; // orbital angular velocity
  initialAngle: number;
  size: number; // 3D radius
  color: string; // monochrome hex (white, silver, slate, charcoal)
  roughness: number;
  metalness: number;
  textureType: 'craters' | 'bands' | 'rings' | 'faceted' | 'ice' | 'grid';
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  metricLabel: string;
  metricValue: string;
  metricUnit: string;
  status: string;
  latencyMs: string;
  activeProcesses: string;
}

export interface OrbitControlsConfig {
  speed: number;
  paused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  projection: 'perspective' | 'top-down' | 'horizon';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  channelId: string;
  isSystem?: boolean;
  reactions?: Record<string, number>;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  topic?: string;
  unreadCount?: number;
}

export interface DirectConversation {
  id: string;
  partner: CosmicUser;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
}

export interface PlanetWorldCommunity {
  planetId: ModuleId;
  name: string;
  tagline: string;
  bannerText: string;
  population: number;
  onlineCount: number;
  channels: ChatChannel[];
  defaultChannelId: string;
  roles: string[];
}

