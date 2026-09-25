import { CosmicUser } from '../types/cosmic';
import { PRESET_USERS } from '../data/cosmicData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const AUTH_TOKEN_KEY = 'astraea_auth_token';

interface ApiUser {
  id?: string | number;
  name?: string;
  callsign?: string;
  email?: string;
  rank?: string;
  station?: string;
  clearance?: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  core_output_mw?: number | string;
  coreOutputMW?: number;
}

interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: ApiUser;
  data?: {
    token?: string;
    access_token?: string;
    user?: ApiUser;
  };
  message?: string;
  errors?: Record<string, string[] | string>;
}

const getApiError = (payload: LoginResponse | null, status: number) => {
  if (payload?.errors) {
    const firstError = Object.values(payload.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }

  return payload?.message || `Login failed (${status}).`;
};

const toCosmicUser = (apiUser: ApiUser, identifier: string): CosmicUser => {
  const fallbackUser = PRESET_USERS[0];
  const name = apiUser.name || apiUser.callsign || apiUser.email || identifier;
  const callsign = apiUser.callsign || apiUser.email || identifier;
  const coreOutput = Number(apiUser.core_output_mw ?? apiUser.coreOutputMW ?? fallbackUser.coreOutputMW);

  return {
    id: String(apiUser.id ?? callsign),
    name,
    callsign,
    rank: apiUser.rank || 'Station Operator',
    station: apiUser.station || fallbackUser.station,
    clearance: apiUser.clearance || 'Clearance Pending',
    avatarUrl: apiUser.avatar_url || apiUser.avatarUrl || apiUser.avatar || fallbackUser.avatarUrl,
    coreOutputMW: Number.isFinite(coreOutput) ? coreOutput : fallbackUser.coreOutputMW,
  };
};

export const loginWithApi = async (identifier: string, password: string): Promise<CosmicUser> => {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/v1/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: identifier,
      callsign: identifier,
      password,
    }),
  });

  let payload: LoginResponse | null = null;
  try {
    payload = await response.json() as LoginResponse;
  } catch {
    // Keep the status-based error when the API does not return JSON.
  }

  if (!response.ok) {
    throw new Error(getApiError(payload, response.status));
  }

  const responseData = payload?.data || payload || {};
  const apiUser = responseData.user || payload?.user || responseData as ApiUser;
  const token = responseData.token || responseData.access_token || payload?.token || payload?.access_token;

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  return toCosmicUser(apiUser, identifier);
};

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const clearAuthToken = () => window.localStorage.removeItem(AUTH_TOKEN_KEY);
