export interface CityLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Capsule {
  id: string; // e.g. "STAR #7F29A"
  timestamp: number;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  region?: 'australia' | 'africa' | 'north_america' | 'south_america' | 'europe' | 'other';
  leavingBehind: string;
  takingWith: string;
  hopeChanges: string;
  futureSelfRemember: string;
  strangerSentence: string;
  colorHex?: string;
  isUser?: boolean;
}

export interface StrangerConnection {
  from: [number, number, number]; // 3D sphere coordinate
  to: [number, number, number];
  progress: number;
  color: string;
}

export type TimelinePhase = '30_days' | '7_days' | '24_hours' | '1_hour' | 'countdown_10s' | 'post_event';

export interface GlobalStats {
  totalLights: number;
  countriesCount: number;
  citiesCount: number;
  capsulesToday: number;
}
