import { RealParticipantCapsule } from '../server/db.ts';

// Mega cities (min 10 to 25 lights each) + evenly spread global locations
interface CityHub {
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  count: number;
}

export const MEGA_CITIES_AND_REGIONS: CityHub[] = [
  // --- MEGA CITIES (Min 10-25 lights each) ---
  { cityName: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, count: 24 },
  { cityName: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, count: 24 },
  { cityName: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, count: 22 },
  { cityName: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, count: 20 },
  { cityName: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, count: 20 },
  { cityName: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, count: 20 },
  { cityName: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, count: 18 },
  { cityName: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, count: 16 },
  { cityName: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, count: 20 },
  { cityName: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, count: 18 },
  { cityName: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, count: 18 },
  { cityName: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, count: 18 },
  { cityName: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437, count: 18 },
  { cityName: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, count: 16 },
  { cityName: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, count: 16 },
  { cityName: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, count: 15 },
  { cityName: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, count: 15 },
  { cityName: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, count: 14 },
  { cityName: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, count: 14 },
  { cityName: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, count: 14 },
  { cityName: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, count: 14 },
  { cityName: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, count: 14 },
  { cityName: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, count: 14 },
  { cityName: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298, count: 14 },
  { cityName: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, count: 14 },
  { cityName: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, count: 14 },
  { cityName: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, count: 14 },
  { cityName: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, count: 14 },
  { cityName: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, count: 14 },
  { cityName: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, count: 12 },
  { cityName: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, count: 12 },
  { cityName: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, count: 12 },
  { cityName: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, count: 12 },
  { cityName: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0721, count: 12 },
  { cityName: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, count: 12 },
  { cityName: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, count: 11 },

  // --- EVEN REGIONAL GLOBAL DISTRIBUTION ---
  // North America regional
  { cityName: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194, count: 8 },
  { cityName: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321, count: 8 },
  { cityName: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, count: 8 },
  { cityName: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673, count: 8 },
  { cityName: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918, count: 7 },
  { cityName: 'Denver', country: 'United States', lat: 39.7392, lng: -104.9903, count: 6 },
  { cityName: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666, count: 6 },

  // South America regional
  { cityName: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645, count: 6 },
  { cityName: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678, count: 6 },
  { cityName: 'Medellín', country: 'Colombia', lat: 6.2442, lng: -75.5812, count: 6 },
  { cityName: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036, count: 6 },
  { cityName: 'La Paz', country: 'Bolivia', lat: -16.4897, lng: -68.1193, count: 5 },

  // Europe regional
  { cityName: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, count: 8 },
  { cityName: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, count: 8 },
  { cityName: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, count: 8 },
  { cityName: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, count: 8 },
  { cityName: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, count: 7 },
  { cityName: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, count: 7 },
  { cityName: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, count: 7 },
  { cityName: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, count: 6 },
  { cityName: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, count: 6 },
  { cityName: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517, count: 6 },

  // Asia regional
  { cityName: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, count: 8 },
  { cityName: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946, count: 8 },
  { cityName: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, count: 8 },
  { cityName: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654, count: 7 },
  { cityName: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, count: 7 },
  { cityName: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, count: 7 },
  { cityName: 'Almaty', country: 'Kazakhstan', lat: 43.2220, lng: 76.8512, count: 5 },
  { cityName: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lng: 69.2401, count: 5 },

  // Africa regional
  { cityName: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, count: 7 },
  { cityName: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870, count: 7 },
  { cityName: 'Addis Ababa', country: 'Ethiopia', lat: 9.0300, lng: 38.7400, count: 6 },
  { cityName: 'Dakar', country: 'Senegal', lat: 14.7167, lng: -17.4677, count: 6 },
  { cityName: 'Kigali', country: 'Rwanda', lat: -1.9706, lng: 30.1044, count: 5 },
  { cityName: 'Tunis', country: 'Tunisia', lat: 36.8065, lng: 10.1815, count: 5 },

  // Oceania & Nordic/Islands
  { cityName: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, count: 8 },
  { cityName: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, count: 7 },
  { cityName: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, count: 7 },
  { cityName: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, count: 6 },
  { cityName: 'Honolulu', country: 'United States', lat: 21.3069, lng: -157.8583, count: 6 },
  { cityName: 'Suva', country: 'Fiji', lat: -18.1248, lng: 178.4501, count: 4 },
];

const LEAVING_POOL = [
  'FEAR',
  'DOUBT',
  'A HABIT',
  'A CHAPTER',
  'A RELATIONSHIP',
  'EXPECTATIONS',
  'THE PAST',
  'SILENT REGRETS',
  'THE NEED TO PLEASE',
  'IMPOSTER SYNDROME',
  'RUSHING TIME',
  'OLD WOUNDS',
];

const CARRYING_POOL = [
  ['COURAGE', 'LOVE'],
  ['CURIOSITY', 'HOPE', 'PEACE'],
  ['DISCIPLINE', 'AMBITION'],
  ['MEMORIES', 'PEOPLE'],
  ['HOPE', 'COURAGE'],
  ['LOVE', 'PEACE', 'CURIOSITY'],
  ['AMBITION', 'DISCIPLINE', 'HOPE'],
];

const CHANGE_AREAS_POOL = [
  ['THE WORLD', 'MYSELF'],
  ['MY WORK', 'MY TIME'],
  ['MY RELATIONSHIPS'],
  ['MY COMMUNITY', 'THE WORLD'],
  ['MYSELF', 'MY TIME'],
];

const FUTURE_LINES = [
  "Remember the quiet courage it took to begin.",
  "You don't have to carry what wasn't meant for you.",
  "Look how far you came through the storm.",
  "Be gentler with yourself; you are still growing.",
  "Do not let the world harden your tender heart.",
  "The stars did not fall; you were just looking down.",
  "Live with enough space for joy to enter.",
  "Whatever broke you left room for light to enter.",
  "You survived every single day you thought you couldn't.",
  "Make the person you used to be proud of who you are.",
  "Stay curious. The horizon is always wider than you think.",
  "Keep your feet on the earth and your eyes on tomorrow.",
];

const GIFTS: ('LIGHT' | 'COURAGE' | 'HOPE' | 'SILENCE')[] = ['LIGHT', 'COURAGE', 'HOPE', 'SILENCE'];
const COLORS = ['#fbbf24', '#38bdf8', '#818cf8', '#fef08a', '#34d399', '#f472b6'];

export function generateSeedLights(): RealParticipantCapsule[] {
  const lights: RealParticipantCapsule[] = [];
  let index = 1;

  for (const hub of MEGA_CITIES_AND_REGIONS) {
    for (let i = 0; i < hub.count; i++) {
      const code = index.toString(16).toUpperCase().padStart(4, '0');
      const starId = `STAR #${code}`;

      // Realistic spatial distribution around urban / regional zones
      const angle = Math.random() * Math.PI * 2;
      // Slight gaussian-like scatter
      const dist = (0.15 + Math.pow(Math.random(), 1.5) * 2.2);
      const lat = Math.max(-80, Math.min(80, hub.lat + Math.sin(angle) * dist * 0.7));
      const lng = ((hub.lng + Math.cos(angle) * dist + 180) % 360) - 180;

      lights.push({
        id: starId,
        timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 14),
        cityName: hub.cityName,
        country: hub.country,
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        leavingConcept: LEAVING_POOL[index % LEAVING_POOL.length],
        carryingConcepts: CARRYING_POOL[index % CARRYING_POOL.length],
        changeAreas: CHANGE_AREAS_POOL[index % CHANGE_AREAS_POOL.length],
        futureSelfLine: FUTURE_LINES[index % FUTURE_LINES.length],
        strangerGift: GIFTS[index % GIFTS.length],
        colorHex: COLORS[index % COLORS.length],
      });

      index++;
    }
  }

  return lights;
}

export const SEED_LIGHTS = generateSeedLights();
