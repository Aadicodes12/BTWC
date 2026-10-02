import * as THREE from 'three';
import { COUNTRY_BORDER_POLYLINES } from '../data/countryBordersData.ts';

/**
 * Creates an exquisite stylized dark Earth texture using an offscreen canvas.
 * Renders dark navy oceans, slate continents with bioluminescent coastline glows,
 * geopolitical country boundaries, and delicate celestial coordinate lines.
 */
export function createStylizedEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const w = canvas.width;
  const h = canvas.height;

  // 1. Deep ocean base gradient with subtle radial lighting
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#02050c'); // polar dark
  oceanGrad.addColorStop(0.25, '#030817');
  oceanGrad.addColorStop(0.5, '#040d22'); // equator deep sapphire
  oceanGrad.addColorStop(0.75, '#030817');
  oceanGrad.addColorStop(1, '#02050c');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // Helper to map lat/lng (-90..90, -180..180) to canvas x/y (0..w, 0..h)
  const mapPoint = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * w;
    const y = ((90 - lat) / 180) * h;
    return [x, y];
  };

  // Draw landmass polygon with smooth coastline glow
  const drawLandmass = (coords: [number, number][], fill = '#0a1424', stroke = 'rgba(56, 189, 248, 0.45)') => {
    if (coords.length < 3) return;
    ctx.beginPath();
    const [startX, startY] = mapPoint(coords[0][0], coords[0][1]);
    ctx.moveTo(startX, startY);

    for (let i = 1; i < coords.length; i++) {
      const [px, py] = mapPoint(coords[i][0], coords[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();

    // Bioluminescent coastline stroke
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = stroke;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.45)';
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
  };

  // World continents
  // North America
  drawLandmass([
    [70, -165], [72, -130], [70, -85], [60, -65], [47, -53], [44, -65], [30, -80],
    [25, -80], [15, -92], [9, -78], [15, -95], [20, -105], [30, -115], [38, -123],
    [50, -128], [60, -145], [65, -168]
  ]);

  // South America
  drawLandmass([
    [12, -72], [10, -60], [5, -52], [-5, -35], [-12, -37], [-23, -42], [-35, -55],
    [-54, -68], [-52, -74], [-40, -73], [-20, -70], [-5, -80], [5, -77]
  ]);

  // Europe & West Russia
  drawLandmass([
    [71, 28], [60, 30], [55, 38], [45, 38], [40, 28], [36, -5], [43, -9],
    [48, -4], [55, 8], [58, 5], [64, 10], [70, 20]
  ]);

  // Great Britain & Ireland
  drawLandmass([[58, -3], [52, 1], [50, -5], [55, -5]]);
  drawLandmass([[54, -6], [51, -10], [55, -9]]);

  // Scandinavia
  drawLandmass([[71, 28], [68, 15], [60, 5], [58, 12], [65, 22]]);

  // Africa
  drawLandmass([
    [36, -5], [37, 10], [32, 32], [22, 37], [12, 51], [5, 48], [-12, 40],
    [-25, 33], [-34, 19], [-30, 16], [-15, 12], [4, 9], [5, 2], [5, -10],
    [15, -17], [30, -10]
  ]);

  // Asia
  drawLandmass([
    [70, 40], [73, 80], [75, 120], [70, 165], [60, 170], [55, 140], [45, 145],
    [38, 120], [22, 120], [15, 108], [10, 104], [22, 88], [25, 68], [12, 44],
    [25, 35], [38, 45], [45, 50], [55, 60], [60, 50]
  ]);

  // India subcontinent
  drawLandmass([[25, 68], [24, 88], [15, 80], [8, 77], [15, 73], [22, 70]]);

  // Japan
  drawLandmass([[45, 142], [35, 140], [32, 130], [37, 137]]);

  // Australia & New Zealand
  drawLandmass([
    [-11, 136], [-12, 142], [-20, 148], [-32, 152], [-38, 145], [-35, 115],
    [-22, 114], [-15, 125]
  ]);
  drawLandmass([[-35, 173], [-42, 175], [-46, 168], [-40, 173]]);

  // Antarctica
  drawLandmass([
    [-65, -160], [-68, -100], [-65, -40], [-68, 20], [-65, 80], [-68, 140],
    [-75, 180], [-85, 0], [-85, -180]
  ], '#0b1626', 'rgba(56, 189, 248, 0.2)');

  // Greenland
  drawLandmass([[83, -30], [75, -20], [60, -45], [70, -55], [80, -60]]);

  // 2. Geopolitical Country Boundaries (Clean, elegant hairline borders)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
  ctx.lineWidth = 1.3;
  ctx.setLineDash([3, 2]); // delicate dotted boundary style

  for (const border of COUNTRY_BORDER_POLYLINES) {
    if (border.points.length < 2) continue;
    ctx.beginPath();
    const [sx, sy] = mapPoint(border.points[0][0], border.points[0][1]);
    ctx.moveTo(sx, sy);

    for (let i = 1; i < border.points.length; i++) {
      const [px, py] = mapPoint(border.points[i][0], border.points[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]); // reset dash

  // 3. Subtle celestial coordinate grid (30° latitude, 45° longitude)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;

  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = mapPoint(lat, 0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  for (let lng = -180; lng <= 180; lng += 45) {
    const [x] = mapPoint(0, lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Equator line
  const [, eqY] = mapPoint(0, 0);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.beginPath();
  ctx.moveTo(0, eqY);
  ctx.lineTo(w, eqY);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates subtle wispy cloud texture
 */
export function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 280; i++) {
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    const radius = 25 + Math.random() * 60;
    const alpha = 0.02 + Math.random() * 0.06;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(220, 240, 255, ${alpha})`);
    grad.addColorStop(0.6, `rgba(180, 210, 240, ${alpha * 0.5})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Atmospheric Fresnel Glow Shader
 */
export const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 glowColor;
    uniform float coefficient;
    uniform float power;
    void main() {
      vec3 viewDirection = normalize(-vPosition);
      float intensity = pow(coefficient - dot(vNormal, viewDirection), power);
      intensity = clamp(intensity, 0.0, 1.0);
      gl_FragColor = vec4(glowColor, intensity * 0.7);
    }
  `
};
