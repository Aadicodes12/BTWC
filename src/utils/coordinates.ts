import * as THREE from 'three';

/**
 * Converts latitude and longitude to 3D Cartesian coordinates on a sphere of radius R.
 */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates an elevated 3D arc (spline points) between two points on the sphere surface.
 */
export function createArcPoints(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  numPoints = 50,
  maxElevation = 0.25
): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const distance = v1.distanceTo(v2);

  // Elevate the midpoint proportionally to distance
  const elevation = Math.min(distance * 0.35, maxElevation);
  const normal = mid.clone().normalize();
  mid.add(normal.multiplyScalar(elevation));

  // Generate smooth quadratic Bezier curve
  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve.getPoints(numPoints);
}
