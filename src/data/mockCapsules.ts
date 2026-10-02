import { Capsule, CityLocation } from '../types/capsule';

// Core anchor cities per region
export const REGIONAL_CITIES = {
  australia: [
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251 },
    { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605 },
    { name: 'Adelaide', country: 'Australia', lat: -34.9285, lng: 138.6007 },
    { name: 'Hobart', country: 'Australia', lat: -42.8821, lng: 147.3272 },
    { name: 'Darwin', country: 'Australia', lat: -12.4634, lng: 130.8456 },
    { name: 'Cairns', country: 'Australia', lat: -16.9186, lng: 145.7781 },
    { name: 'Gold Coast', country: 'Australia', lat: -28.0167, lng: 153.4000 },
    { name: 'Canberra', country: 'Australia', lat: -35.2809, lng: 149.1300 },
    { name: 'Fremantle', country: 'Australia', lat: -32.0569, lng: 115.7439 },
    { name: 'Byron Bay', country: 'Australia', lat: -28.6474, lng: 153.6120 },
    { name: 'Newcastle', country: 'Australia', lat: -32.9283, lng: 151.7817 },
    { name: 'Geelong', country: 'Australia', lat: -38.1499, lng: 144.3617 },
    { name: 'Alice Springs', country: 'Australia', lat: -23.6980, lng: 133.8807 },
    { name: 'Broome', country: 'Australia', lat: -17.9614, lng: 122.2359 },
    { name: 'Wollongong', country: 'Australia', lat: -34.4278, lng: 150.8931 },
    { name: 'Sunshine Coast', country: 'Australia', lat: -26.6500, lng: 153.0667 },
    { name: 'Ballarat', country: 'Australia', lat: -37.5622, lng: 143.8503 },
    { name: 'Launceston', country: 'Australia', lat: -41.4332, lng: 147.1441 },
  ],
  africa: [
    { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219 },
    { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
    { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
    { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
    { name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870 },
    { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898 },
    { name: 'Dakar', country: 'Senegal', lat: 14.7167, lng: -17.4677 },
    { name: 'Kigali', country: 'Rwanda', lat: -1.9706, lng: 30.1044 },
    { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.0300, lng: 38.7400 },
    { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
    { name: 'Tunis', country: 'Tunisia', lat: 36.8065, lng: 10.1815 },
    { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 },
    { name: 'Luanda', country: 'Angola', lat: -8.8390, lng: 13.2894 },
    { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lng: 39.2083 },
    { name: 'Kampala', country: 'Uganda', lat: 0.3476, lng: 32.5825 },
    { name: 'Algiers', country: 'Algeria', lat: 36.7538, lng: 3.0588 },
    { name: 'Gaborone', country: 'Botswana', lat: -24.6282, lng: 25.9231 },
    { name: 'Windhoek', country: 'Namibia', lat: -22.5609, lng: 17.0658 },
    { name: 'Maputo', country: 'Mozambique', lat: -25.9692, lng: 32.5732 },
    { name: 'Lusaka', country: 'Zambia', lat: -15.3875, lng: 28.3228 },
    { name: 'Abidjan', country: 'Ivory Coast', lat: 5.3600, lng: -4.0083 },
    { name: 'Alexandria', country: 'Egypt', lat: 31.2001, lng: 29.9187 },
    { name: 'Zanzibar City', country: 'Tanzania', lat: -6.1659, lng: 39.2026 },
  ],
  north_america: [
    { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298 },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
    { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673 },
    { name: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321 },
    { name: 'Austin', country: 'United States', lat: 30.2672, lng: -97.7431 },
    { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918 },
    { name: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 },
    { name: 'Denver', country: 'United States', lat: 39.7392, lng: -104.9903 },
    { name: 'Boston', country: 'United States', lat: 42.3601, lng: -71.0589 },
    { name: 'Oaxaca', country: 'Mexico', lat: 17.0732, lng: -96.7266 },
    { name: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666 },
    { name: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719 },
    { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.3496 },
    { name: 'New Orleans', country: 'United States', lat: 29.9511, lng: -90.0715 },
    { name: 'Philadelphia', country: 'United States', lat: 39.9526, lng: -75.1652 },
    { name: 'Portland', country: 'United States', lat: 45.5152, lng: -122.6784 },
    { name: 'Nashville', country: 'United States', lat: 36.1627, lng: -86.7816 },
    { name: 'Honolulu', country: 'United States', lat: 21.3069, lng: -157.8583 },
    { name: 'Atlanta', country: 'United States', lat: 33.7490, lng: -84.3880 },
    { name: 'Mérida', country: 'Mexico', lat: 20.9674, lng: -89.5926 },
  ],
  south_america: [
    { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
    { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
    { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0721 },
    { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428 },
    { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693 },
    { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
    { name: 'Medellín', country: 'Colombia', lat: 6.2442, lng: -75.5812 },
    { name: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678 },
    { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645 },
    { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036 },
    { name: 'Valparaíso', country: 'Chile', lat: -33.0472, lng: -71.6127 },
    { name: 'Salvador', country: 'Brazil', lat: -12.9777, lng: -38.5016 },
    { name: 'Cusco', country: 'Peru', lat: -13.5319, lng: -71.9675 },
    { name: 'Cartagena', country: 'Colombia', lat: 10.3910, lng: -75.4794 },
    { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lng: -68.1193 },
    { name: 'Asunción', country: 'Paraguay', lat: -25.2637, lng: -57.5759 },
    { name: 'Mendoza', country: 'Argentina', lat: -32.8895, lng: -68.8458 },
    { name: 'Recife', country: 'Brazil', lat: -8.0476, lng: -34.8770 },
    { name: 'Córdoba', country: 'Argentina', lat: -31.4201, lng: -64.1888 },
    { name: 'Florianópolis', country: 'Brazil', lat: -27.5954, lng: -48.5480 },
    { name: 'Bariloche', country: 'Argentina', lat: -41.1335, lng: -71.3103 },
    { name: 'Cuenca', country: 'Ecuador', lat: -2.9001, lng: -79.0059 },
  ],
  europe: [
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
    { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
    { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
    { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
    { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
    { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
    { name: 'Prague', country: 'Czechia', lat: 50.0755, lng: 14.4378 },
    { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275 },
    { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603 },
    { name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522 },
    { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686 },
    { name: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122 },
    { name: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402 },
    { name: 'Reykjavík', country: 'Iceland', lat: 64.1466, lng: -21.9426 },
    { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683 },
    { name: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517 },
    { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
    { name: 'Edinburgh', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
    { name: 'Florence', country: 'Italy', lat: 43.7696, lng: 11.2558 },
    { name: 'Porto', country: 'Portugal', lat: 41.1579, lng: -8.6291 },
    { name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384 },
    { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820 },
  ],
};

// Global flatten list for search inputs
export const GLOBAL_CITIES: CityLocation[] = Object.entries(REGIONAL_CITIES).flatMap(([regionKey, cities]) =>
  cities.map((c) => ({
    id: `${regionKey}-${c.name.toLowerCase().replace(/\s+/g, '')}`,
    name: c.name,
    country: c.country,
    lat: c.lat,
    lng: c.lng,
  }))
);

// Rich pool of poignant, literary quotes and sentences
export const LEAVING_BEHIND_POOL = [
  "The quiet fear that I am always five years late to my own life.",
  "Unfinished arguments with people who no longer exist in my days.",
  "The exhausting habit of apologizing before stating what I need.",
  "The version of myself that had to survive by remaining invisible.",
  "Second-guessing my intuition whenever things turn quiet.",
  "Carrying everyone else's emotional gravity to avoid feeling my own.",
  "The ghost of who I thought I was supposed to be by thirty.",
  "Counting calories, counting likes, counting hours instead of moments.",
  "Bitterness masquerading as practical wisdom.",
  "Waiting for an external permission slip to begin living.",
  "The shame of having started over four different times.",
  "Staying in rooms where I had to bend my spine to fit.",
  "The phantom debt of feeling I owe everyone my peace.",
  "Overthinking conversations that ended eight months ago.",
  "Letting fear disguise itself as high standards.",
  "The illusion that someday there will be no risk.",
  "A grief that I wore like an overcoat in mid-July.",
  "The desperate urge to prove that I am worthy of affection.",
];

export const TAKING_WITH_POOL = [
  "A dog-eared notebook, two honest friends, and a stubborn belief in mornings.",
  "My mother's recipe for cardamom bread and her laugh.",
  "The memory of driving through the desert at sunrise with the windows down.",
  "The courage to say 'I don't know yet, but I am listening.'",
  "A box of dried wildflowers picked on a day when nothing went wrong.",
  "My grandmother's worn ring and her fierce dignity.",
  "The hard-won knowledge that grief shrinks, even when love remains.",
  "A pocketknife, a compass, and three good books.",
  "The soft patience to let things unfold without forcing the knot.",
  "Salt on my skin and the echo of cathedral bells.",
  "The promise I made to a twelve-year-old version of me.",
  "A heart that still gets astonished by the evening sky.",
  "The ability to walk out of doors that no longer open with kindness.",
  "Laughter that makes my ribs ache with gratitude.",
  "A thermos of mint tea and honest conversation.",
  "The sound of rain against glass while safe indoors.",
  "My favorite woolen jumper and an appetite for new cities.",
];

export const HOPE_CHANGES_POOL = [
  "That gentleness stops being mistaken for weakness.",
  "That we learn how to disagree without demanding each other's erasure.",
  "Clean air over our cities and quiet nights where stars return.",
  "More public gardens where strangers share fruit and benches.",
  "That no child has to wonder if their dream is illegal.",
  "Less digital noise, more human hands pressed into real soil.",
  "Dignified shelter and warmth for every single tired soul.",
  "That medicine reaches the distant hills as swiftly as the high towers.",
  "More singing in the streets after the summer rains.",
  "That we stop measuring human worth by endless output.",
  "Forgiveness becoming more common than retribution.",
  "That rivers run clear again from mountains to the open sea.",
  "A global ceasefire that lasts longer than a single news cycle.",
  "More unhurried conversations around wooden kitchen tables.",
  "That people look each other in the eye on the morning train.",
];

export const FUTURE_SELF_POOL = [
  "You survived the long autumn of your silence. Do not go back into hiding.",
  "Remember the morning you thought you couldn't stand, and then you did.",
  "Slow does not mean failing. The mountain doesn't rush to touch the sky.",
  "You are allowed to be happy without feeling like you stole it.",
  "When everything feels scattered, return to the breath in your chest.",
  "Do not trade your joy for anyone's temporary approval.",
  "The people who love you never asked you to be perfect.",
  "You rebuilt your whole life from a single spark. Respect that fire.",
  "Drink cold water. Step into the sun. Listen to the crows.",
  "You are doing better than your harshest critic says you are.",
  "Remember to look up when the starlings begin their dance at dusk.",
  "The pain was real, but so was your resurrection.",
  "You don't owe the world your exhaustion.",
  "Remember that love is not a contest of endurance.",
  "Keep your hands open. You cannot receive with clenched fists.",
];

export const STRANGER_SENTENCE_POOL = [
  "I hope I finally become brave enough to start.",
  "You don't have to have everything figured out yet.",
  "I don't know who you are, but I hope next year is kinder to you.",
  "Breathe. The dawn does not ask permission from the dark.",
  "Whatever broke you this year left space for something wilder to grow.",
  "You are worthy of the good things you never dared ask for.",
  "Even an unlit match has fire sleeping inside it.",
  "If today was heavy, tomorrow will give you back your arms.",
  "Somewhere across the ocean, someone is rooting for you.",
  "One unexpected kindness can tilt your whole universe.",
  "Be gentle with your unfinished chapters.",
  "You are so much more loved than your loneliness lets you believe.",
  "Give yourself credit for surviving the days you didn't think you could.",
  "Tomorrow is waiting with clean hands.",
  "Stop shrinking to fit into spaces you have outgrown.",
  "May your heart feel light like paper lanterns floating up into the dark.",
  "You made it this far. Keep walking.",
  "May peace find you in the quietest hours of the night.",
  "The world is wider than the room you've been crying in.",
  "You are not too late. You are arriving on your own time.",
  "A stranger in the dark is holding a lantern for you.",
  "Don't abandon yourself right before the miracle happens.",
  "Your tender heart is not a defect.",
  "Rest tonight. The morning will take care of itself.",
  "The ocean doesn't look back at the shore. Walk forward.",
];

export const REGIONAL_COLOR_PALETTES = {
  australia: ['#38bdf8', '#fef08a', '#fdba74'], // coastal ocean & sun
  africa: ['#fbbf24', '#f472b6', '#fdba74'], // rich amber, dawn coral, warm sunset
  north_america: ['#67e8f9', '#818cf8', '#ffffff'], // electric cyan, indigo, bright white
  south_america: ['#34d399', '#fde047', '#38bdf8'], // emerald canopy, gold, equatorial sky
  europe: ['#a5f3fc', '#e0e7ff', '#fcd34d'], // arctic silver-cyan, violet-slate, ancient stone gold
};

/**
 * Generates exact light counts requested by the user:
 * - Australia: 400 lights
 * - Africa: 400 lights
 * - North America: 650 lights
 * - South America: 650 lights
 * - Europe: 650 lights
 * Total: 2,750 lights with full quotes and metadata
 */
export function generateCuratedRegionalCapsules(): Capsule[] {
  const result: Capsule[] = [];

  const regionalSpecs: {
    region: 'australia' | 'africa' | 'north_america' | 'south_america' | 'europe';
    count: number;
    prefix: string;
    latSpread: number;
    lngSpread: number;
  }[] = [
    { region: 'australia', count: 400, prefix: 'AU', latSpread: 6.5, lngSpread: 10.5 },
    { region: 'africa', count: 400, prefix: 'AF', latSpread: 9.5, lngSpread: 11.0 },
    { region: 'north_america', count: 650, prefix: 'NA', latSpread: 8.5, lngSpread: 12.0 },
    { region: 'south_america', count: 650, prefix: 'SA', latSpread: 9.0, lngSpread: 8.5 },
    { region: 'europe', count: 650, prefix: 'EU', latSpread: 5.5, lngSpread: 8.0 },
  ];

  // Deterministic pseudo-random seed helper for consistent coordinates & high performance
  let seed = 42;
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Gaussian-like offset
  function randJitter(scale: number) {
    const u = seededRandom();
    const v = seededRandom();
    return Math.sqrt(-2.0 * Math.log(u || 0.001)) * Math.cos(2.0 * Math.PI * v) * scale;
  }

  regionalSpecs.forEach(({ region, count, prefix }) => {
    const cities = REGIONAL_CITIES[region];
    const colors = REGIONAL_COLOR_PALETTES[region];

    for (let i = 0; i < count; i++) {
      const city = cities[i % cities.length];
      const jitterLat = randJitter(1.8);
      const jitterLng = randJitter(2.2);

      const lat = Math.max(-85, Math.min(85, city.lat + jitterLat));
      const lng = ((city.lng + jitterLng + 540) % 360) - 180;

      const hexSuffix = ((i * 1337 + 0x1a2b) & 0xffff).toString(16).toUpperCase().padStart(4, '0');
      const starId = `STAR #${prefix}${hexSuffix}`;

      const leaving = LEAVING_BEHIND_POOL[(i * 3 + 2) % LEAVING_BEHIND_POOL.length];
      const taking = TAKING_WITH_POOL[(i * 5 + 1) % TAKING_WITH_POOL.length];
      const hope = HOPE_CHANGES_POOL[(i * 7 + 4) % HOPE_CHANGES_POOL.length];
      const future = FUTURE_SELF_POOL[(i * 11 + 3) % FUTURE_SELF_POOL.length];
      const stranger = STRANGER_SENTENCE_POOL[(i * 13 + 5) % STRANGER_SENTENCE_POOL.length];
      const color = colors[i % colors.length];

      result.push({
        id: starId,
        timestamp: Date.now() - (i * 45000 + 100000),
        cityName: city.name,
        country: city.country,
        lat,
        lng,
        region,
        leavingBehind: leaving,
        takingWith: taking,
        hopeChanges: hope,
        futureSelfRemember: future,
        strangerSentence: stranger,
        colorHex: color,
        isUser: false,
      });
    }
  });

  return result;
}

// Generate the 2,750 regional capsules once
export const ALL_REGIONAL_CAPSULES: Capsule[] = generateCuratedRegionalCapsules();

// Initial featured sample for quick landing presentation
export const INITIAL_CAPSULES: Capsule[] = ALL_REGIONAL_CAPSULES.slice(0, 50);
