// src/domains/geolocation/interfaces/IGeocodingService.ts
export interface GeocodingResult {
    city?: string;
    country?: string;
    fullAddress?: string;
    // Adicione outros campos que possam ser úteis do OpenCage
  }

  export interface IGeocodingService {
    reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null>;
    // Futuramente poderíamos ter:
    // geocode(address: string): Promise<{ latitude: number; longitude: number } | null>;
  }