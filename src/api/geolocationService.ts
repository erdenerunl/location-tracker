// src/api/geolocationService.ts
import axios from 'axios';

// Nominatim API'ının temel adresi
const nominatimApi = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
});

// Döndürülecek verinin tipini tanımlayalım (TypeScript'in gücü!)
export interface SearchedLocation {
  coordinates: { latitude: number; longitude: number }[];
  center: { latitude: number; longitude: number };
  hasBoundary: boolean;
}

/**
 * Verilen bir şehir adını arar ve sınır koordinatlarını döndürür.
 * @param cityName - Aranacak şehrin adı (örn: "Istanbul")
 * @returns {Promise<SearchedLocation | null>} Sınırları, merkezi ve sınır verisi olup olmadığını içeren bir obje veya null döner.
 */
export const searchCityByName = async (cityName: string): Promise<SearchedLocation | null> => {
  try {
    const response = await nominatimApi.get('/search', {
      params: {
        q: cityName,
        format: 'json',
        polygon_geojson: 1, // Sınır verisini istemek için
        limit: 1, // Sadece en alakalı tek sonucu al
      },
    });

    if (!response.data || response.data.length === 0) {
      console.log('Location not found in Nominatim');
      return null;
    }

    const result = response.data[0];
    const center = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };

    let coordinates: { latitude: number; longitude: number; }[] = [];
    let hasBoundary = false;

    if (result.geojson) {
      if (result.geojson.type === 'Polygon') {
        // Tek bir poligon varsa, onu al
        coordinates = result.geojson.coordinates[0].map((coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        hasBoundary = true;
      } else if (result.geojson.type === 'MultiPolygon') {
        // Birden fazla poligon varsa, genellikle en büyüğü olan ilkini alalım
        // Veya hepsini birleştirebiliriz, ama şimdilik en dış sınırı almak yeterli.
        coordinates = result.geojson.coordinates[0][0].map((coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        hasBoundary = true;
      }
    }
    
    return { coordinates, center, hasBoundary };

  } catch (error) {
    console.error('Error fetching city data from Nominatim:', error);
    return null;
  }
};