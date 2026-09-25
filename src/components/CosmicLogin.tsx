import React, { useState } from 'react';
import { CosmicUser } from '../types/cosmic';
import { cosmicAudio } from '../data/cosmicData';
import { loginWithApi } from '../services/authApi';
import { Lock, User, ArrowRight } from 'lucide-react';

interface CosmicLoginProps {
  onLoginSuccess: (user: CosmicUser) => void;
  isTransitioning: boolean;
  reducedMotion: boolean;
}

export const CosmicLogin: React.FC<CosmicLoginProps> = ({
  onLoginSuccess,
  isTransitioning,
  reducedMotion,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    setAuthenticating(true);

    try {
      const user = await loginWithApi(identifier.trim(), password);
      cosmicAudio.playWarp();
      const transitionDelay = reducedMotion ? 300 : 700;
      setTimeout(() => onLoginSuccess(user), transitionDelay);
    } catch (error) {
      setAuthenticating(false);
      setLoginError(error instanceof Error ? error.message : 'Unable to authenticate with the station.');
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 py-8 text-white">
      <header className="glass-panel mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_white]" />
          <span className="font-orbitron text-lg font-bold tracking-widest text-white">ASTRAEA</span>
        </div>

        <nav className="hidden items-center gap-6 text-xs font-mono-tech text-white/60 sm:flex">
          <span>ORBITAL STATION</span>
          <span>·</span>
          <span>SOLAR HUB</span>
          <span>·</span>
          <span>3D TELEMETRY</span>
        </nav>

        <div className="flex items-center gap-2 text-xs font-mono-tech text-white/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          <span>GATEWAY 01</span>
        </div>
      </header>

      <main className="my-auto w-full max-w-sm">
        <div
          className={`glass-panel-glow rounded-2xl border border-white/15 p-7 transition-all duration-500 ${
            isTransitioning || authenticating ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100'
          }`}
        >
          <div className="mb-6 text-center">
            <h1 className="mb-1 font-orbitron text-xl font-bold tracking-wider text-white">Station Access</h1>
            <p className="text-xs font-mono-tech text-white/50">Authenticate with your Astraea account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-mono-tech uppercase tracking-wider text-white/60">
                Email or Operator Callsign
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  autoComplete="username"
                  required
                  placeholder="operator@example.com"
                  className="w-full rounded-xl border border-white/15 bg-black/60 py-2 pl-9 pr-3 text-xs font-mono-tech text-white placeholder-white/30 focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-mono-tech uppercase tracking-wider text-white/60">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/60 py-2 pl-9 pr-3 text-xs font-mono-tech text-white placeholder-white/30 focus:border-white focus:outline-none"
                />
              </div>
            </div>

            {loginError && (
              <p className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-xs leading-relaxed text-red-100" role="alert">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={authenticating}
              onMouseEnter={() => cosmicAudio.playHover()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-orbitron text-xs font-semibold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:bg-white/90 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            >
              {authenticating ? <span>Authenticating...</span> : <><span>Launch 3D Solar System</span><ArrowRight className="h-3.5 w-3.5" /></>}
            </button>
          </form>
        </div>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl items-center justify-between py-2 text-[11px] font-mono-tech text-white/40">
        <span>Astraea Interstellar</span>
        <span>Three.js 3D WebGL</span>
      </footer>
    </div>
  );
};
