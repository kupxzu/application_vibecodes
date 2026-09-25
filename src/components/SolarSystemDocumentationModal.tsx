import React from 'react';
import {
  Accessibility,
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Gamepad2,
  MessageSquare,
  MousePointer2,
  Orbit,
  Radio,
  X,
} from 'lucide-react';

interface SolarSystemDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolarSystemDocumentationModal: React.FC<SolarSystemDocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="solar-system-documentation-title"
      onClick={onClose}
    >
      <div
        className="glass-panel-glow flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-white p-2 text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50">
                Astraea Operations Manual
              </p>
              <h2
                id="solar-system-documentation-title"
                className="mt-1 font-orbitron text-lg font-extrabold tracking-wide sm:text-2xl"
              >
                Solar System Dashboard
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/65 sm:text-sm">
                A quick reference for exploring worlds, reading telemetry, and using the interactive 3D orrery.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close documentation"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <Orbit className="h-4 w-4 text-white" />
                <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider">Dashboard modes</h3>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-white/70 sm:text-sm">
                <p><strong className="text-white">Worlds menu:</strong> Browse each planet’s purpose, telemetry, community size, and available channels.</p>
                <p><strong className="text-white">3D mode:</strong> Explore the live orbital view, inspect nodes, change projections, and open radio communications.</p>
                <p><strong className="text-white">Full hub:</strong> Enter a planet to open its community dashboard with channels and crew conversations.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <MousePointer2 className="h-4 w-4 text-white" />
                <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider">World navigation</h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70" />Select a planet with Prev / Next or the planet dock.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70" />Use the arrow keys to switch planets and Enter to join the selected world.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70" />Select a planet’s sphere or Join button to enter its community.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-white" />
                <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider">3D orrery controls</h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                <li><strong className="text-white">Rotate:</strong> Click and drag across empty space.</li>
                <li><strong className="text-white">Zoom:</strong> Scroll with the mouse wheel or trackpad.</li>
                <li><strong className="text-white">Inspect:</strong> Hover over a planet for a summary, or click it for telemetry and controls.</li>
                <li><strong className="text-white">Playback:</strong> Pause orbit animation or choose 0.5×, 1×, or 2× speed.</li>
                <li><strong className="text-white">Projection:</strong> Switch between 3D Oblique, Top-Down, and Horizon views.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <Radio className="h-4 w-4 text-white" />
                <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider">Comms & telemetry</h3>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-white/70 sm:text-sm">
                <p><strong className="text-white">Planet telemetry:</strong> Review status, distance, velocity, and the module’s primary metric.</p>
                <p><strong className="text-white">3D Comms:</strong> Open the radio drawer, choose a world and channel, then transmit a message.</p>
                <p><strong className="text-white">Audio:</strong> Use Soundscapes to manage ambient audio and interface effects.</p>
              </div>
            </section>
          </div>

          <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-white" />
              <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider">Accessibility & support</h3>
            </div>
            <div className="mt-3 grid gap-3 text-xs leading-relaxed text-white/70 sm:grid-cols-3 sm:text-sm">
              <p><strong className="text-white">Reduced motion:</strong> Turn Motion off in the 3D HUD to reduce orbital and interface animation.</p>
              <p><strong className="text-white">Large text:</strong> Use A+ in the Worlds menu to increase reading size.</p>
              <p><strong className="text-white">Need a reminder?</strong> Use the nearby Help or Orbit Controls button for contextual tips.</p>
            </div>
          </section>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-mono-tech uppercase tracking-wider text-white/40">
            <CircleHelp className="h-3.5 w-3.5" />
            <span>Documentation is available from the Worlds menu and 3D mode.</span>
            <ArrowLeftRight className="ml-1 h-3.5 w-3.5" />
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
        </div>

        <footer className="flex justify-end border-t border-white/10 px-5 py-3 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white/90"
          >
            Return to dashboard
          </button>
        </footer>
      </div>
    </div>
  );
};
