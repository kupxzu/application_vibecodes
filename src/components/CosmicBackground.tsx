import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  reducedMotion?: boolean;
  intensity?: number;
}

interface CalmStar {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  radius: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  reducedMotion = false,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      generateStars();
    };

    window.addEventListener('resize', handleResize);

    const stars: CalmStar[] = [];

    // Stable, realistic star distribution
    const generateStars = () => {
      stars.length = 0;
      // Fixed comfortable star density
      const count = Math.min(380, Math.floor((width * height) / 4500));

      for (let i = 0; i < count; i++) {
        // Most stars are tiny crisp pinpoints (0.6px - 1.2px)
        // A few anchor stars are 1.4px - 1.8px
        const isBright = Math.random() < 0.15;
        const radius = isBright ? Math.random() * 0.5 + 1.3 : Math.random() * 0.5 + 0.7;
        const baseAlpha = isBright ? 0.75 + Math.random() * 0.25 : 0.35 + Math.random() * 0.45;

        stars.push({
          x: Math.random(),
          y: Math.random(),
          radius,
          baseAlpha,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.008 + 0.003, // Very slow, gentle breathing
        });
      }
    };

    generateStars();

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render crisp, calm, non-jittering stars
      ctx.fillStyle = '#FFFFFF';

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!reducedMotion) {
          s.twinklePhase += s.twinkleSpeed * 60 * delta;
        }

        // Smooth cosine breathing between (baseAlpha - 0.15) and (baseAlpha + 0.15)
        const alpha = Math.max(
          0.15,
          Math.min(1.0, s.baseAlpha + Math.sin(s.twinklePhase) * 0.14)
        ) * intensity;

        const posX = s.x * width;
        const posY = s.y * height;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(posX, posY, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 bg-black">
      {/* Pure space black background */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Subtle calm vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/80 pointer-events-none" />

      {/* Stable Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
