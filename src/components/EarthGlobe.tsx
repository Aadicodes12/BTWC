import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RealParticipantCapsule } from '../server/db.ts';
import { MAJOR_CITIES, MajorCity } from '../data/majorCities.ts';
import { COUNTRY_BORDER_POLYLINES } from '../data/countryBordersData.ts';
import { latLngToVector3, createArcPoints } from '../utils/coordinates.ts';
import { createStylizedEarthTexture, createCloudTexture, AtmosphereShader } from '../utils/earthTexture.ts';
import { sound } from '../utils/audio.ts';

interface EarthGlobeProps {
  participants: RealParticipantCapsule[];
  selectedParticipant: RealParticipantCapsule | null;
  onSelectParticipant: (participant: RealParticipantCapsule | null) => void;
  onSelectCity?: (city: MajorCity) => void;
  activeConnection?: { from: [number, number]; to: [number, number] } | null;
  viewMode: 'landing' | 'explore' | 'ritual';
  targetLocation?: { lat: number; lng: number } | null;
  sealingAnimationTarget?: { lat: number; lng: number; starId: string } | null;
  isBlackout?: boolean;
  isBurst?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  participants,
  selectedParticipant,
  onSelectParticipant,
  onSelectCity,
  activeConnection,
  viewMode,
  targetLocation,
  sealingAnimationTarget,
  isBlackout = false,
  isBurst = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Tooltip hover state
  const [hoveredInfo, setHoveredInfo] = useState<{
    type: 'participant' | 'city';
    title: string;
    subtitle: string;
    details?: string;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const instancedLightsRef = useRef<THREE.InstancedMesh | null>(null);
  const cityMarkersGroupRef = useRef<THREE.Group | null>(null);
  const countryBordersGroupRef = useRef<THREE.Group | null>(null);
  const sealingShockwaveRef = useRef<THREE.Mesh | null>(null);
  const connectionArcGroupRef = useRef<THREE.Group | null>(null);

  // Camera & Interaction
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const cameraTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 3.8));
  const cameraCurrentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 3.8));
  const autoRotateSpeedRef = useRef(0.0006);
  const isInteractingRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  // Normals lookup
  const participantNormalsRef = useRef<{ participant: RealParticipantCapsule; normal: THREE.Vector3 }[]>([]);
  const cityNormalsRef = useRef<{ city: MajorCity; normal: THREE.Vector3 }[]>([]);

  useEffect(() => {
    participantNormalsRef.current = participants.map((p) => ({
      participant: p,
      normal: latLngToVector3(p.lat, p.lng, 1.0).normalize(),
    }));
  }, [participants]);

  useEffect(() => {
    cityNormalsRef.current = MAJOR_CITIES.map((c) => ({
      city: c,
      normal: latLngToVector3(c.lat, c.lng, 1.0).normalize(),
    }));
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const isMobile = window.innerWidth < 768;
    const initialDist = isMobile ? 4.8 : 3.8;
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, viewMode === 'landing' ? -0.2 : 0, initialDist);
    cameraTargetPosRef.current.copy(camera.position);
    cameraCurrentPosRef.current.copy(camera.position);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Sparse cosmic starfield
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 45 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorMix = Math.random();
      if (colorMix > 0.8) {
        starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1.0;
      } else if (colorMix > 0.6) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.88; starColors[i * 3 + 2] = 0.7;
      } else {
        starColors[i * 3] = 0.9; starColors[i * 3 + 1] = 0.92; starColors[i * 3 + 2] = 0.98;
      }
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starfield = new THREE.Points(starsGeo, starsMat);
    scene.add(starfield);

    // 5. Earth Parent Group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.y = -1.4;
    earthGroup.rotation.x = 0.2;
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // 6. Base Earth Sphere with Real Realistic Geography Texture
    const earthRadius = 1.0;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

    // Texture loader with instant stylized fallback
    const fallbackTexture = createStylizedEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 0.7,
      metalness: 0.15,
      color: 0xffffff,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/textures/earth_dark_2048.jpg',
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = loadedTex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback already assigned
      }
    );

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 7. Subtle Atmospheric Clouds
    const cloudTexture = createCloudTexture();
    const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.006, 48, 48);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // 8. Soft Atmospheric Rim Glow
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.12, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(0x38bdf8) },
        coefficient: { value: 0.85 },
        power: { value: 3.5 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 9. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1424, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    sunLight.position.set(4, 2.2, 3.5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-4, -1.2, -3);
    scene.add(rimLight);

    // 9.5 3D Geopolitical Country Boundaries Group
    const countryBordersGroup = new THREE.Group();
    earthGroup.add(countryBordersGroup);
    countryBordersGroupRef.current = countryBordersGroup;

    const borderMat = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Populate curated borders immediately
    COUNTRY_BORDER_POLYLINES.forEach((border) => {
      if (border.points.length < 2) return;
      const pts = border.points.map(([lat, lng]) => latLngToVector3(lat, lng, earthRadius * 1.0025));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, borderMat);
      countryBordersGroup.add(line);
    });

    // Dynamically fetch detailed country boundary polygons
    fetch('/data/world_borders.json')
      .then((res) => res.json())
      .then((rings: [number, number][][]) => {
        if (!countryBordersGroupRef.current) return;
        const subGroup = new THREE.Group();
        const detailedBorderMat = new THREE.LineBasicMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        for (const ring of rings) {
          if (ring.length < 3) continue;
          const pts = ring.map(([lat, lng]) => latLngToVector3(lat, lng, earthRadius * 1.002));
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          const line = new THREE.Line(geo, detailedBorderMat);
          subGroup.add(line);
        }
        countryBordersGroupRef.current.add(subGroup);
      })
      .catch(() => {});

    // 10. Major City Markers
    const cityMarkersGroup = new THREE.Group();
    earthGroup.add(cityMarkersGroup);
    cityMarkersGroupRef.current = cityMarkersGroup;

    const cityDotGeo = new THREE.RingGeometry(0.004, 0.008, 16);
    const cityDotMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });

    MAJOR_CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius * 1.003);
      const marker = new THREE.Mesh(cityDotGeo, cityDotMat);
      marker.position.copy(pos);
      marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      cityMarkersGroup.add(marker);
    });

    // 11. Sealing shockwave mesh
    const shockwaveGeo = new THREE.RingGeometry(0.01, 0.03, 32);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.visible = false;
    earthGroup.add(shockwaveMesh);
    sealingShockwaveRef.current = shockwaveMesh;

    // 12. Connection Arc Group
    const connectionArcGroup = new THREE.Group();
    earthGroup.add(connectionArcGroup);
    connectionArcGroupRef.current = connectionArcGroup;

    // Interaction Listeners: Smooth Cursor Dragging with Full Left/Right Inertia
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const onPointerDown = (e: PointerEvent) => {
      // Don't drag if clicking a modal/button
      if ((e.target as HTMLElement)?.closest('button, input, textarea, a')) return;

      isDraggingRef.current = true;
      isInteractingRef.current = true;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!earthGroupRef.current) return;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePosRef.current.x;
        const deltaY = e.clientY - previousMousePosRef.current.y;

        // Cursor dragging left/right rotates Earth in exact direction
        const vx = deltaX * 0.007;
        const vy = deltaY * 0.007;

        earthGroupRef.current.rotation.y += vx;
        earthGroupRef.current.rotation.x = Math.max(-1.1, Math.min(1.1, earthGroupRef.current.rotation.x + vy));

        velocityRef.current = { x: vx, y: vy };
        previousMousePosRef.current = { x: e.clientX, y: e.clientY };
        isInteractingRef.current = true;

        if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = window.setTimeout(() => {
          isInteractingRef.current = false;
        }, 3000);
      } else {
        checkHoverRaycast(e.clientX, e.clientY);
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = Math.max(2.4, Math.min(6.5, cameraTargetPosRef.current.z + e.deltaY * 0.003));
      cameraTargetPosRef.current.z = newZ;
      isInteractingRef.current = true;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
      }, 3000);
    };

    const onCanvasClick = (e: MouseEvent) => {
      // Ignore if user was actively dragging
      if (Math.abs(velocityRef.current.x) > 0.003 || Math.abs(velocityRef.current.y) > 0.003) return;

      const hit = findHitAtScreenPoint(e.clientX, e.clientY);
      if (hit?.type === 'participant' && hit.participant) {
        sound.playStarBirth();
        onSelectParticipant(hit.participant);
      } else if (hit?.type === 'city' && hit.city && onSelectCity) {
        sound.playStarHover();
        onSelectCity(hit.city);
      } else if (viewMode === 'explore' && selectedParticipant) {
        onSelectParticipant(null);
      }
    };

    // Attach drag events to window and container
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onCanvasClick);

    // Animation loop with silky smooth inertia damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Inertia rotation when cursor is released
      if (earthGroupRef.current) {
        if (!isDraggingRef.current) {
          if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
            earthGroupRef.current.rotation.y += velocityRef.current.x;
            earthGroupRef.current.rotation.x = Math.max(
              -1.1,
              Math.min(1.1, earthGroupRef.current.rotation.x + velocityRef.current.y)
            );
            velocityRef.current.x *= 0.94;
            velocityRef.current.y *= 0.94;
          } else if (!isInteractingRef.current) {
            // Gentle majestic cosmic drift when idle
            earthGroupRef.current.rotation.y += autoRotateSpeedRef.current;
          }
        }
      }

      cloudMesh.rotation.y += 0.00015;

      // Camera lerp
      if (cameraRef.current) {
        cameraCurrentPosRef.current.lerp(cameraTargetPosRef.current, 0.05);
        cameraRef.current.position.copy(cameraCurrentPosRef.current);
      }

      starfield.rotation.y = time * 0.002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onCanvasClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Raycast helper to find either participant or major city
  const findHitAtScreenPoint = (clientX: number, clientY: number): {
    type: 'participant' | 'city';
    participant?: RealParticipantCapsule;
    city?: MajorCity;
  } | null => {
    if (!rendererRef.current || !cameraRef.current || !earthMeshRef.current || !earthGroupRef.current) return null;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObject(earthMeshRef.current, false);
    if (intersects.length === 0) return null;

    const hitPoint = intersects[0].point;
    const localHit = hitPoint.clone();
    earthGroupRef.current.worldToLocal(localHit);
    localHit.normalize();

    // 1. Check participants
    let bestParticipantDot = 0.996;
    let bestParticipant: RealParticipantCapsule | null = null;

    for (const item of participantNormalsRef.current) {
      const dot = item.normal.dot(localHit);
      if (dot > bestParticipantDot) {
        bestParticipantDot = dot;
        bestParticipant = item.participant;
      }
    }

    if (bestParticipant) {
      return { type: 'participant', participant: bestParticipant };
    }

    // 2. Check major cities
    let bestCityDot = 0.995;
    let bestCity: MajorCity | null = null;

    for (const item of cityNormalsRef.current) {
      const dot = item.normal.dot(localHit);
      if (dot > bestCityDot) {
        bestCityDot = dot;
        bestCity = item.city;
      }
    }

    if (bestCity) {
      return { type: 'city', city: bestCity };
    }

    return null;
  };

  const checkHoverRaycast = (clientX: number, clientY: number) => {
    const hit = findHitAtScreenPoint(clientX, clientY);
    if (hit?.type === 'participant' && hit.participant) {
      setHoveredInfo({
        type: 'participant',
        title: hit.participant.id,
        subtitle: `${hit.participant.cityName}, ${hit.participant.country}`,
        details: `Left behind: "${hit.participant.leavingConcept}"`,
        screenX: clientX,
        screenY: clientY,
      });
      document.body.style.cursor = 'pointer';
      return;
    }

    if (hit?.type === 'city' && hit.city) {
      const nearbyLightsCount = participants.filter((p) => {
        const dLat = p.lat - hit.city!.lat;
        const dLng = p.lng - hit.city!.lng;
        return dLat * dLat + dLng * dLng < 4.0;
      }).length;

      setHoveredInfo({
        type: 'city',
        title: hit.city.name.toUpperCase(),
        subtitle: hit.city.country,
        details: nearbyLightsCount > 0 ? `${nearbyLightsCount} LIGHTS` : undefined,
        screenX: clientX,
        screenY: clientY,
      });
      document.body.style.cursor = 'pointer';
      return;
    }

    setHoveredInfo(null);
    document.body.style.cursor = 'default';
  };

  // Instanced Participant Lights (Spread evenly across all continents + mega-cities)
  useEffect(() => {
    const earthGroup = earthGroupRef.current;
    if (!earthGroup) return;

    if (instancedLightsRef.current) {
      earthGroup.remove(instancedLightsRef.current);
      instancedLightsRef.current.dispose();
      instancedLightsRef.current = null;
    }

    const count = participants.length;
    if (count === 0) return;

    // Soft celestial star geometry
    const dotGeo = new THREE.SphereGeometry(0.0125, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    const instancedMesh = new THREE.InstancedMesh(dotGeo, dotMat, count);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const earthRadius = 1.0;

    participants.forEach((p, i) => {
      const pos = latLngToVector3(p.lat, p.lng, earthRadius * 1.004);
      dummy.position.copy(pos);
      dummy.scale.setScalar(1.0);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (p.colorHex) {
        color.set(p.colorHex);
      } else {
        color.setHex(0xfbbf24);
      }
      instancedMesh.setColorAt(i, color);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    earthGroup.add(instancedMesh);
    instancedLightsRef.current = instancedMesh;
  }, [participants]);

  // Sealing sequence animation
  useEffect(() => {
    if (!sealingAnimationTarget || !earthGroupRef.current || !sealingShockwaveRef.current) return;

    const shockwave = sealingShockwaveRef.current;
    const pos = latLngToVector3(sealingAnimationTarget.lat, sealingAnimationTarget.lng, 1.007);
    shockwave.position.copy(pos);
    shockwave.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
    shockwave.visible = true;

    cameraTargetPosRef.current.set(0, 0, 4.4);

    let startTime = performance.now();
    const duration = 2800;

    const animateShockwave = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      const scale = 1.0 + progress * 6.5;
      shockwave.scale.set(scale, scale, scale);
      (shockwave.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - progress) * 0.9);

      if (progress < 1) {
        requestAnimationFrame(animateShockwave);
      } else {
        shockwave.visible = false;
        cameraTargetPosRef.current.set(0, 0, 3.8);
      }
    };

    requestAnimationFrame(animateShockwave);
  }, [sealingAnimationTarget]);

  // Camera Target Rotation
  useEffect(() => {
    if (!targetLocation || !earthGroupRef.current) return;
    const targetY = -(targetLocation.lng * (Math.PI / 180)) - Math.PI / 2;
    const targetX = targetLocation.lat * (Math.PI / 180) * 0.5;

    earthGroupRef.current.rotation.y = targetY;
    earthGroupRef.current.rotation.x = Math.max(-0.8, Math.min(0.8, targetX));
    isInteractingRef.current = true;
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 4500);
  }, [targetLocation]);

  // Connection Arc Animation
  useEffect(() => {
    const group = connectionArcGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!activeConnection) return;

    const earthRadius = 1.0;
    const v1 = latLngToVector3(activeConnection.from[0], activeConnection.from[1], earthRadius * 1.006);
    const v2 = latLngToVector3(activeConnection.to[0], activeConnection.to[1], earthRadius * 1.006);

    const curvePoints = createArcPoints(v1, v2, 60, 0.28);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    group.add(arcLine);

    const pGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending });
    const particle = new THREE.Mesh(pGeo, pMat);
    group.add(particle);

    let progress = 0;
    const step = () => {
      progress += 0.02;
      const idx = Math.min(curvePoints.length - 1, Math.floor(progress * curvePoints.length));
      particle.position.copy(curvePoints[idx]);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          while (group.children.length > 0) {
            group.remove(group.children[0]);
          }
        }, 1200);
      }
    };
    requestAnimationFrame(step);
  }, [activeConnection]);

  // Blackout and Burst
  useEffect(() => {
    if (!earthGroupRef.current) return;
    earthGroupRef.current.visible = !isBlackout;
  }, [isBlackout]);

  useEffect(() => {
    if (!rendererRef.current) return;
    if (isBurst) {
      rendererRef.current.toneMappingExposure = 2.4;
      const timer = setTimeout(() => {
        if (rendererRef.current) rendererRef.current.toneMappingExposure = 1.2;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isBurst]);

  return (
    <div className="relative w-full h-full select-none touch-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Minimal Hover Tooltip */}
      {hoveredInfo && !isDraggingRef.current && (
        <div
          className="fixed pointer-events-none z-40 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-xl bg-[#03060f]/90 backdrop-blur-md border border-white/10 text-left shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          style={{
            left: `${hoveredInfo.screenX}px`,
            top: `${hoveredInfo.screenY}px`,
          }}
        >
          <div className="text-xs font-cinzel text-slate-100 font-medium tracking-wide">
            {hoveredInfo.title}
          </div>
          <div className="text-[10px] text-slate-400 font-mono-num">
            {hoveredInfo.subtitle}
          </div>
          {hoveredInfo.details && (
            <div className="text-[10px] text-amber-300/90 font-mono-num mt-1 pt-1 border-t border-white/[0.06]">
              {hoveredInfo.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
