import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PlanetModule, CosmicUser } from '../types/cosmic';
import { PLANETS_DATA, cosmicAudio } from '../data/cosmicData';

export interface PlanetScreenCoords {
  x: number;
  y: number;
  visible: boolean;
}

interface ThreeSolarSystemProps {
  user: CosmicUser;
  onSelectPlanet: (planet: PlanetModule) => void;
  onSelectSun: () => void;
  onHoverPlanet: (planet: PlanetModule | null, coords?: PlanetScreenCoords) => void;
  paused: boolean;
  speed: number;
  projection: 'perspective' | 'top-down' | 'horizon';
  showOrbits: boolean;
  reducedMotion: boolean;
}

export const ThreeSolarSystem: React.FC<ThreeSolarSystemProps> = ({
  user,
  onSelectPlanet,
  onSelectSun,
  onHoverPlanet,
  paused,
  speed,
  projection,
  showOrbits,
  reducedMotion,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Keep references to all parameters and callbacks to prevent scene recreation
  const paramsRef = useRef({
    paused,
    speed,
    projection,
    showOrbits,
    reducedMotion,
  });

  const callbacksRef = useRef({
    onSelectPlanet,
    onSelectSun,
    onHoverPlanet,
  });

  useEffect(() => {
    paramsRef.current = { paused, speed, projection, showOrbits, reducedMotion };
  });

  useEffect(() => {
    callbacksRef.current = { onSelectPlanet, onSelectSun, onHoverPlanet };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    // Subtle fog so deep space stars stay crisp and clearly visible
    scene.fog = new THREE.FogExp2(0x000000, 0.0006);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1200);
    camera.position.set(0, 125, 210);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3.4, 600, 0.75);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Helper: generate soft circular glowing star particle texture
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.45, 'rgba(230, 240, 255, 0.45)');
      grad.addColorStop(0.8, 'rgba(200, 220, 255, 0.12)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const starTexture = createStarTexture();

    // 4. Background Starfields (Clearly visible, enlarged, and sparkling)
    // Layer A: Main dense starfield
    const starCountA = 1800;
    const starGeoA = new THREE.BufferGeometry();
    const starPositionsA = new Float32Array(starCountA * 3);
    for (let i = 0; i < starCountA * 3; i += 3) {
      const r = 320 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositionsA[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositionsA[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositionsA[i + 2] = r * Math.cos(phi);
    }
    starGeoA.setAttribute('position', new THREE.BufferAttribute(starPositionsA, 3));
    const starMatA = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.8,
      map: starTexture || undefined,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPointsA = new THREE.Points(starGeoA, starMatA);
    scene.add(starPointsA);

    // Layer B: Bright beacon stars (larger sparkling foreground stars)
    const starCountB = 260;
    const starGeoB = new THREE.BufferGeometry();
    const starPositionsB = new Float32Array(starCountB * 3);
    for (let i = 0; i < starCountB * 3; i += 3) {
      const r = 280 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositionsB[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositionsB[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositionsB[i + 2] = r * Math.cos(phi);
    }
    starGeoB.setAttribute('position', new THREE.BufferAttribute(starPositionsB, 3));
    const starMatB = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 5.2,
      map: starTexture || undefined,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPointsB = new THREE.Points(starGeoB, starMatB);
    scene.add(starPointsB);

    // Helper: generate procedural monochrome planet textures
    const createProceduralTexture = (type: string, baseColorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = baseColorHex;
      ctx.fillRect(0, 0, 512, 256);

      if (type === 'craters') {
        for (let i = 0; i < 60; i++) {
          const cx = Math.random() * 512;
          const cy = Math.random() * 256;
          const cr = Math.random() * 14 + 3;
          ctx.beginPath();
          ctx.arc(cx, cy, cr, 0, Math.PI * 2);
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.3)';
          ctx.fill();
        }
      } else if (type === 'bands') {
        for (let y = 0; y < 256; y += 8) {
          ctx.fillStyle = y % 16 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(0, y, 512, 8);
        }
      } else if (type === 'ice') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, Math.random() * 256);
          ctx.lineTo(Math.random() * 512, Math.random() * 256);
          ctx.stroke();
        }
      }

      return new THREE.CanvasTexture(canvas);
    };

    // 5. Central Sun 3D Object (Enlarged and Radiantly Glowing)
    const sunGroup = new THREE.Group();
    const sunRadius = 9.8;

    const sunGeo = new THREE.SphereGeometry(sunRadius, 36, 36);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData = { isSun: true };
    sunGroup.add(sunMesh);

    const coronaGeo = new THREE.IcosahedronGeometry(sunRadius * 1.35, 2);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(coronaMesh);

    scene.add(sunGroup);

    // 6. Orbiting Planets & Subtle Faint Elliptical Orbit Lines
    // Astronomical orbital profiles: subtle eccentricity, rotated orientation angles, and natural inclination
    const ORBIT_PROFILES: Record<string, { eccentricity: number; ellipseAngle: number; inclination: number }> = {
      telemetry: { eccentricity: 0.13, ellipseAngle: 0.35, inclination: 0.65 }, // Aetheris
      fleet:     { eccentricity: 0.11, ellipseAngle: 1.70, inclination: -0.55 }, // Kronos
      social:    { eccentricity: 0.15, ellipseAngle: 2.85, inclination: 0.95 },  // Veridia
      astronomy: { eccentricity: 0.14, ellipseAngle: 4.10, inclination: -1.15 }, // Solaria
      security:  { eccentricity: 0.12, ellipseAngle: 5.35, inclination: 0.45 },  // Thalassa
      archives:  { eccentricity: 0.18, ellipseAngle: 0.90, inclination: -0.85 },  // Nyx
    };

    interface Planet3DInstance {
      planet: PlanetModule;
      mesh: THREE.Mesh;
      group: THREE.Group;
      orbitLine: THREE.LineLoop;
      angle: number;
      semiMajorAxis: number;
      semiMinorAxis: number;
      ellipseAngle: number;
      inclination: number;
    }

    const planetInstances: Planet3DInstance[] = [];

    PLANETS_DATA.forEach((p) => {
      const pGroup = new THREE.Group();

      const pGeo = new THREE.SphereGeometry(p.size, 32, 32);
      const texture = createProceduralTexture(p.textureType, p.color);
      const pMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(p.color),
        map: texture || null,
        roughness: p.roughness,
        metalness: p.metalness,
      });

      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.userData = { planet: p };
      pGroup.add(pMesh);

      // Rings (e.g. Kronos)
      if (p.hasRings && p.ringInnerRadius && p.ringOuterRadius) {
        const ringGeo = new THREE.RingGeometry(p.ringInnerRadius, p.ringOuterRadius, 48);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xd1d5db,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65,
          roughness: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        pGroup.add(ringMesh);
      }

      // Subtle, faint elliptical orbit path
      const profile = ORBIT_PROFILES[p.id] || { eccentricity: 0.12, ellipseAngle: 0.5, inclination: 0.5 };
      const a = p.orbitRadius;
      const b = a * Math.sqrt(1 - profile.eccentricity * profile.eccentricity);
      const cosRot = Math.cos(profile.ellipseAngle);
      const sinRot = Math.sin(profile.ellipseAngle);

      const orbitSegments = 160;
      const orbitPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= orbitSegments; i++) {
        const theta = (i / orbitSegments) * Math.PI * 2;
        const rawX = a * Math.cos(theta);
        const rawZ = b * Math.sin(theta);
        const x = rawX * cosRot - rawZ * sinRot;
        const z = rawX * sinRot + rawZ * cosRot;
        const y = profile.inclination * Math.sin(theta);
        orbitPoints.push(new THREE.Vector3(x, y, z));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.13, // Subtle, faint elliptical path as requested
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      scene.add(orbitLine);

      scene.add(pGroup);

      planetInstances.push({
        planet: p,
        mesh: pMesh,
        group: pGroup,
        orbitLine,
        angle: p.initialAngle,
        semiMajorAxis: a,
        semiMinorAxis: b,
        ellipseAngle: profile.ellipseAngle,
        inclination: profile.inclination,
      });
    });

    // 7. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let currentHoveredPlanet: PlanetModule | null = null;
    let hoveredMesh: THREE.Mesh | null = null;

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
      if (currentHoveredPlanet) {
        currentHoveredPlanet = null;
        callbacksRef.current.onHoverPlanet(null);
      }
      if (hoveredMesh) {
        hoveredMesh.scale.set(1, 1, 1);
        hoveredMesh = null;
      }
      container.style.cursor = 'default';
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const clickableMeshes = [sunMesh, ...planetInstances.map((pi) => pi.mesh)];
      const intersects = raycaster.intersectObjects(clickableMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.isSun) {
          cosmicAudio.playClick();
          callbacksRef.current.onSelectSun();
        } else if (hit.userData.planet) {
          cosmicAudio.playClick();
          callbacksRef.current.onSelectPlanet(hit.userData.planet);
        }
      }
    };

    // Camera Orbit drag controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0;
    let cameraAngleY = 0.55;
    let cameraDist = 205;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMoveWindow = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      cameraAngleX -= dx * 0.006;
      cameraAngleY = Math.max(0.08, Math.min(Math.PI * 0.48, cameraAngleY + dy * 0.006));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      cameraDist = Math.max(60, Math.min(380, cameraDist + e.deltaY * 0.15));
    };

    // Mobile touch controls & Tap Selection
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let initialPinchDist = 0;
    let initialCameraDist = cameraDist;

    const getTouchPosInElement = (touch: Touch) => {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((touch.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((touch.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartTime = performance.now();
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        prevMouse = { x: t.clientX, y: t.clientY };
        isDragging = true;
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.sqrt(dx * dx + dy * dy);
        initialCameraDist = cameraDist;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const t = e.touches[0];
        const dx = t.clientX - prevMouse.x;
        const dy = t.clientY - prevMouse.y;
        cameraAngleX -= dx * 0.007;
        cameraAngleY = Math.max(0.08, Math.min(Math.PI * 0.48, cameraAngleY + dy * 0.007));
        prevMouse = { x: t.clientX, y: t.clientY };
        if (e.cancelable) e.preventDefault();
      } else if (e.touches.length === 2 && initialPinchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const factor = initialPinchDist / Math.max(1, dist);
        cameraDist = Math.max(60, Math.min(380, initialCameraDist * factor));
        if (e.cancelable) e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        const distMoved = Math.sqrt(
          Math.pow(t.clientX - touchStartX, 2) + Math.pow(t.clientY - touchStartY, 2)
        );
        const elapsed = performance.now() - touchStartTime;

        // If it was a quick mobile tap (< 300ms and moved < 12px)
        if (elapsed < 300 && distMoved < 12) {
          const pos = getTouchPosInElement(t);
          mouse.x = pos.x;
          mouse.y = pos.y;
          raycaster.setFromCamera(mouse, camera);
          const clickableMeshes = [sunMesh, ...planetInstances.map((pi) => pi.mesh)];
          const intersects = raycaster.intersectObjects(clickableMeshes);
          if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hit.userData.isSun) {
              cosmicAudio.playClick();
              callbacksRef.current.onSelectSun();
            } else if (hit.userData.planet) {
              cosmicAudio.playClick();
              callbacksRef.current.onSelectPlanet(hit.userData.planet);
            }
          }
        }
      }
      isDragging = false;
      initialPinchDist = 0;
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('mouseleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: true });
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('mousemove', onMouseMoveWindow);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animId: number;
    let lastTime = performance.now();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const {
        paused: isPaused,
        speed: spd,
        projection: proj,
        showOrbits: orbitsVisible,
        reducedMotion: rm,
      } = paramsRef.current;

      // Rotate Sun corona
      if (!rm) {
        coronaMesh.rotation.y += 0.003;
        coronaMesh.rotation.x += 0.001;
      }

      // Update planets along continuous subtle elliptical orbit
      planetInstances.forEach((inst) => {
        const isThisHovered = currentHoveredPlanet?.id === inst.planet.id;

        // Faint elliptical orbit line opacity highlights smoothly on hover
        const mat = inst.orbitLine.material as THREE.LineBasicMaterial;
        mat.opacity = isThisHovered ? 0.45 : 0.13;
        inst.orbitLine.visible = orbitsVisible;

        // Advance angle continuously with natural Keplerian variation along ellipse
        if (!isPaused && !rm) {
          const a = inst.semiMajorAxis;
          const b = inst.semiMinorAxis;
          const currentDist = Math.sqrt(
            Math.pow(a * Math.cos(inst.angle), 2) + Math.pow(b * Math.sin(inst.angle), 2)
          );
          const speedFactor = a / currentDist;
          inst.angle += delta * inst.planet.orbitSpeed * spd * 0.48 * Math.min(1.35, Math.max(0.75, speedFactor));
        }

        const a = inst.semiMajorAxis;
        const b = inst.semiMinorAxis;
        const rawX = a * Math.cos(inst.angle);
        const rawZ = b * Math.sin(inst.angle);
        const cosRot = Math.cos(inst.ellipseAngle);
        const sinRot = Math.sin(inst.ellipseAngle);

        const x = rawX * cosRot - rawZ * sinRot;
        const z = rawX * sinRot + rawZ * cosRot;
        const y = inst.inclination * Math.sin(inst.angle);
        inst.group.position.set(x, y, z);

        if (!rm) {
          inst.mesh.rotation.y += 0.015;
        }

        // Smooth scale target on hover
        const targetScale = isThisHovered ? 1.25 : 1.0;
        inst.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      });

      // Projection Camera Target position
      let targetPolar = cameraAngleY;
      let targetAzimuth = cameraAngleX;

      if (proj === 'top-down') {
        targetPolar = 0.05;
      } else if (proj === 'horizon') {
        targetPolar = Math.PI * 0.48;
      }

      const camX = cameraDist * Math.sin(targetPolar) * Math.sin(targetAzimuth);
      const camY = cameraDist * Math.cos(targetPolar);
      const camZ = cameraDist * Math.sin(targetPolar) * Math.cos(targetAzimuth);
      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.06);
      camera.lookAt(0, 0, 0);

      // Raycasting Hover detection
      raycaster.setFromCamera(mouse, camera);
      const candidates = [sunMesh, ...planetInstances.map((pi) => pi.mesh)];
      const hits = raycaster.intersectObjects(candidates);

      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        if (hoveredMesh !== hit) {
          hoveredMesh = hit;
          container.style.cursor = 'pointer';

          if (hit.userData.planet) {
            currentHoveredPlanet = hit.userData.planet;
            cosmicAudio.playHover();
          } else {
            currentHoveredPlanet = null;
          }
        }
      } else {
        if (hoveredMesh) {
          hoveredMesh = null;
          container.style.cursor = 'default';
          if (currentHoveredPlanet) {
            currentHoveredPlanet = null;
            callbacksRef.current.onHoverPlanet(null);
          }
        }
      }

      // If a planet is hovered, compute its 2D screen coordinates and pass to parent
      if (currentHoveredPlanet) {
        const hoveredInst = planetInstances.find((pi) => pi.planet.id === currentHoveredPlanet?.id);
        if (hoveredInst) {
          hoveredInst.group.getWorldPosition(tempVec);
          tempVec.project(camera);

          // Convert normalized device coordinates (-1 to +1) to CSS pixels
          const screenX = ((tempVec.x + 1) * width) / 2;
          const screenY = ((-tempVec.y + 1) * height) / 2;
          const isVisibleInFront = tempVec.z < 1.0;

          callbacksRef.current.onHoverPlanet(currentHoveredPlanet, {
            x: screenX,
            y: screenY,
            visible: isVisibleInFront,
          });
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMoveWindow);
      window.removeEventListener('mouseup', onMouseUp);

      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('mouseleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      starGeoA.dispose();
      starMatA.dispose();
      starGeoB.dispose();
      starMatB.dispose();
      if (starTexture) starTexture.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      planetInstances.forEach((pi) => {
        pi.mesh.geometry.dispose();
        if (Array.isArray(pi.mesh.material)) {
          pi.mesh.material.forEach((m) => m.dispose());
        } else {
          pi.mesh.material.dispose();
        }
        pi.orbitLine.geometry.dispose();
        (pi.orbitLine.material as THREE.Material).dispose();
      });
    };
  }, []); // Run ONCE on mount! Never recreate scene on state changes!

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full min-h-[550px] md:min-h-[620px] overflow-hidden select-none outline-none"
    />
  );
};
