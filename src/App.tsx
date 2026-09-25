/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CosmicUser } from './types/cosmic';
import { PRESET_USERS, cosmicAudio } from './data/cosmicData';
import { CosmicBackground } from './components/CosmicBackground';
import { CosmicLogin } from './components/CosmicLogin';
import { SolarSystemDashboard } from './components/SolarSystemDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<CosmicUser>(PRESET_USERS[0]);
  const [viewState, setViewState] = useState<'login' | 'transitioning' | 'dashboard'>('login');
  
  // Accessibility: prefers-reduced-motion check
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Listen to OS reduced motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleLoginSuccess = (user: CosmicUser) => {
    setCurrentUser(user);
    setViewState('transitioning');

    const duration = reducedMotion ? 250 : 800;
    setTimeout(() => {
      setViewState('dashboard');
    }, duration);
  };

  const handleLogout = () => {
    setViewState('transitioning');
    const duration = reducedMotion ? 200 : 600;
    setTimeout(() => {
      setViewState('login');
    }, duration);
  };

  const handleSwitchUser = (newUser: CosmicUser) => {
    setCurrentUser(newUser);
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* Persistent Calm Cosmic Background */}
      <CosmicBackground
        reducedMotion={reducedMotion}
        intensity={viewState === 'transitioning' ? 1.2 : 1.0}
      />

      {/* Cinematic Warp Transition Overlay */}
      {viewState === 'transitioning' && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div
            className={`w-72 h-72 rounded-full bg-radial from-white via-white/40 to-transparent blur-3xl opacity-60 ${
              reducedMotion ? 'opacity-30' : 'animate-ping'
            }`}
            style={{ animationDuration: '0.8s' }}
          />
        </div>
      )}

      {/* View 1: Parallax Login Universe */}
      {viewState !== 'dashboard' && (
        <div className={`transition-opacity duration-500 ease-in-out ${viewState === 'transitioning' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
          <CosmicLogin
            onLoginSuccess={handleLoginSuccess}
            isTransitioning={viewState === 'transitioning'}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {/* View 2: Solar System Planetary Dashboard */}
      {viewState === 'dashboard' && (
        <div className="transition-opacity duration-700 ease-in-out animate-in fade-in zoom-in-95">
          <SolarSystemDashboard
            user={currentUser}
            onLogout={handleLogout}
            onSwitchUser={handleSwitchUser}
            reducedMotion={reducedMotion}
            onToggleReducedMotion={toggleReducedMotion}
          />
        </div>
      )}
    </div>
  );
}
