/**
 * Geopolitical country boundary polylines (lat/lng coordinates).
 * Provides distinct, elegant geopolitical boundaries across all continents.
 */

export interface BorderPolyline {
  name: string;
  points: [number, number][]; // [lat, lng]
}

export const COUNTRY_BORDER_POLYLINES: BorderPolyline[] = [
  // North America
  {
    name: 'USA - Canada (49th Parallel & Border)',
    points: [
      [49, -123], [49, -95], [48.7, -90], [46, -84], [43, -82], [42, -83],
      [42.8, -79], [44.9, -74.8], [45, -71.5], [47.4, -69.2], [45.2, -67.2]
    ]
  },
  {
    name: 'Alaska - Canada (141st Meridian)',
    points: [[69.6, -141], [60.3, -141], [59.5, -137], [56, -130]]
  },
  {
    name: 'USA - Mexico',
    points: [
      [32.5, -117.1], [31.3, -111], [31.8, -106.5], [29.8, -104.5],
      [29.3, -103], [28.7, -100.5], [26.0, -97.2]
    ]
  },
  {
    name: 'Mexico - Guatemala / Belize',
    points: [[17.8, -88.3], [17.8, -89.1], [17.2, -91], [15.2, -92.2], [14.6, -92.2]]
  },
  {
    name: 'Central America (Panama - Colombia)',
    points: [[8.5, -77.8], [7.7, -77.2], [7.2, -77.8]]
  },

  // South America
  {
    name: 'Chile - Argentina (Andes)',
    points: [
      [-17.6, -69.6], [-22.5, -67.2], [-27, -68.5], [-33, -70],
      [-40, -71.5], [-48, -73], [-52, -72], [-55, -67]
    ]
  },
  {
    name: 'Argentina - Uruguay / Brazil',
    points: [
      [-34, -58.3], [-33.5, -57], [-30.2, -57.5], [-27.3, -56], [-25.6, -54.5],
      [-26.5, -53.5], [-27.5, -51.8], [-28.5, -50]
    ]
  },
  {
    name: 'Brazil - Bolivia / Paraguay',
    points: [
      [-25.5, -54.6], [-24, -54.3], [-22, -57.9], [-19, -57.7],
      [-16.5, -59], [-13.5, -61], [-10.8, -65.3]
    ]
  },
  {
    name: 'Peru - Bolivia / Chile',
    points: [[-17.6, -69.6], [-16.2, -69.1], [-15, -69.3], [-12.5, -68.6]]
  },
  {
    name: 'Peru - Ecuador / Colombia',
    points: [
      [-3.4, -80.2], [-4.3, -79.9], [-4.8, -79.1], [-2.5, -76.5],
      [-0.1, -75.2], [-4.2, -69.9]
    ]
  },
  {
    name: 'Colombia - Venezuela',
    points: [
      [11.8, -71.3], [10, -72.8], [7.5, -72.2], [6, -67.5], [2, -67], [1.2, -66.8]
    ]
  },
  {
    name: 'Brazil - Venezuela / Guyanas',
    points: [[1.2, -66.8], [4.5, -61.2], [5.2, -60], [3.5, -57], [2.2, -54.5], [4.2, -51.5]]
  },

  // Europe
  {
    name: 'Portugal - Spain',
    points: [
      [41.9, -8.8], [42.1, -8.2], [41.8, -6.6], [39.7, -7.0],
      [38.7, -7.0], [37.2, -7.4]
    ]
  },
  {
    name: 'Spain - France (Pyrenees)',
    points: [[43.4, -1.8], [42.8, -0.5], [42.5, 1.5], [42.4, 3.1]]
  },
  {
    name: 'France - Italy (Alps)',
    points: [[45.9, 6.9], [45.1, 6.7], [44.2, 7.1], [43.8, 7.5]]
  },
  {
    name: 'France - Germany / Switzerland / Belgium',
    points: [
      [47.6, 7.5], [48.2, 7.6], [49, 8.2], [49.3, 6.4],
      [49.5, 5.8], [50.2, 4.8], [50.8, 3.1], [51.1, 2.5]
    ]
  },
  {
    name: 'Germany - Poland (Oder-Neisse)',
    points: [[53.9, 14.3], [52.6, 14.6], [51.5, 14.8], [50.9, 15]]
  },
  {
    name: 'Germany - Czechia / Austria',
    points: [[50.9, 14.9], [50.3, 12.3], [48.6, 13.6], [47.5, 12.9], [47.5, 10.2]]
  },
  {
    name: 'Italy - Switzerland / Austria',
    points: [[45.9, 6.9], [46.3, 9], [46.5, 10.4], [46.8, 12.1], [46.5, 13.7]]
  },
  {
    name: 'Norway - Sweden',
    points: [
      [59, 11.8], [61.2, 12.3], [63.2, 12.1], [65, 14.2],
      [68, 17.5], [69, 20.9]
    ]
  },
  {
    name: 'Sweden - Finland',
    points: [[65.8, 24.1], [67.2, 23.8], [69, 20.9]]
  },
  {
    name: 'Finland - Russia',
    points: [[69.5, 30], [67.5, 29.5], [64, 30], [61, 28.5], [60.5, 27.8]]
  },
  {
    name: 'Poland - Ukraine / Belarus',
    points: [
      [54.3, 22.8], [53.5, 23.5], [52, 23.6], [50.5, 24.1],
      [49.8, 22.8], [49, 22.6]
    ]
  },
  {
    name: 'UK - Ireland (Border)',
    points: [[54.1, -6.3], [54.3, -7.2], [54.6, -7.5], [55, -7.3]]
  },

  // Africa
  {
    name: 'Egypt - Libya (25th Meridian)',
    points: [[31.5, 25], [22, 25]]
  },
  {
    name: 'Egypt - Sudan (22nd Parallel)',
    points: [[22, 25], [22, 31.5], [22, 36.8]]
  },
  {
    name: 'Libya - Algeria / Tunisia',
    points: [[33, 11.5], [30.2, 9.5], [28, 9.8], [24, 10], [19.5, 12]]
  },
  {
    name: 'Morocco - Algeria',
    points: [[35.1, -2.2], [34, -1.8], [32, -1.2], [30, -5], [27.7, -8.7]]
  },
  {
    name: 'Nigeria - Niger / Chad / Cameroon',
    points: [
      [13.8, 4.3], [13.8, 8.5], [13.2, 13.5], [12, 14.5],
      [9.5, 13], [6.5, 9.5], [4.6, 8.5]
    ]
  },
  {
    name: 'Kenya - Tanzania / Uganda / Ethiopia',
    points: [
      [-4.7, 39.2], [-3, 37.5], [-1.5, 35], [-1, 34],
      [1, 35], [3.5, 36], [4.5, 41], [-1.6, 41.5]
    ]
  },
  {
    name: 'South Africa - Namibia / Botswana / Zimbabwe / Mozambique',
    points: [
      [-28.6, 16.5], [-24.8, 20], [-26.8, 20.7], [-22.2, 29],
      [-22.4, 31.3], [-26, 32], [-26.8, 32.8]
    ]
  },

  // Asia & Middle East
  {
    name: 'Turkey - Syria / Iraq / Iran',
    points: [
      [36, 36], [36.7, 37], [37, 41], [37.2, 42.4],
      [37.4, 44.5], [38.5, 44.3], [39.8, 44.5]
    ]
  },
  {
    name: 'Saudi Arabia - Yemen / Oman / UAE',
    points: [
      [16.5, 42.8], [17, 47], [19, 52], [20, 55], [22.5, 55.5], [24, 51.5]
    ]
  },
  {
    name: 'Iran - Iraq / Pakistan / Afghanistan',
    points: [
      [30, 48.5], [33, 46], [36, 45], [37, 44.5],
      [37, 61], [34, 60.5], [30, 61], [25.2, 61.5]
    ]
  },
  {
    name: 'India - Pakistan (Radcliffe Line)',
    points: [
      [24, 68.8], [25.5, 71], [28, 72.5], [30, 74],
      [31.5, 74.8], [32.5, 74.5], [34.5, 74.2]
    ]
  },
  {
    name: 'India - Bangladesh',
    points: [
      [21.8, 89], [23, 88.8], [25, 88.5], [26, 89],
      [25.2, 92], [24, 91.8], [21.5, 92.3]
    ]
  },
  {
    name: 'India - Nepal / Bhutan',
    points: [
      [29, 80], [28.5, 82], [27.5, 85], [26.8, 88],
      [27, 89], [27, 92]
    ]
  },
  {
    name: 'China - Russia / Mongolia / Kazakhstan',
    points: [
      [49.5, 87], [48, 88], [45, 92], [43, 98], [42, 105],
      [45, 115], [50, 119], [53.5, 124], [50, 127], [48, 131],
      [47, 134.5], [43, 131]
    ]
  },
  {
    name: 'Korean DMZ (38th Parallel)',
    points: [[37.8, 126.2], [38.1, 127.3], [38.4, 128.4]]
  },
  {
    name: 'Southeast Asia (Thailand - Myanmar - Laos - Cambodia - Vietnam)',
    points: [
      [10, 98.6], [14, 98.4], [18, 97.5], [20, 100],
      [18, 103], [15, 105], [14, 103], [12, 102.5], [11.5, 103],
      [10.5, 105], [14.5, 107.5], [21, 104], [22, 103]
    ]
  },
  {
    name: 'Malaysia - Indonesia (Borneo Border)',
    points: [[1, 109.5], [1.2, 112], [2, 115], [4.2, 117.5]]
  },

  // Australia & New Zealand (States & Divisions)
  {
    name: 'Australia (WA / NT / SA border)',
    points: [[-14, 129], [-26, 129], [-31.8, 129]]
  },
  {
    name: 'Australia (NT / QLD border)',
    points: [[-16, 138], [-26, 138]]
  },
  {
    name: 'Australia (SA / NSW / VIC border)',
    points: [[-26, 141], [-34, 141], [-37.5, 141]]
  },
  {
    name: 'Australia (NSW / VIC border)',
    points: [[-34, 141], [-36, 147], [-37.5, 150]]
  }
];
