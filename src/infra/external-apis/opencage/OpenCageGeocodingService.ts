import axios from "axios";
import config from "@/infra/config"; // Nosso ficheiro de configuração centralizado
import { IGeocodingService, GeocodingResult } from "@/domains/geolocation/interfaces/IGeocodingService";


// (Opcional) Interface para tipar a resposta esperada da API do OpenCage
interface OpenCageResponseComponent {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
  // ... outros campos que o OpenCage retorna em 'components'
}

interface OpenCageResult {
  components: OpenCageResponseComponent;
  formatted: string;
  // ... outros campos
}

interface OpenCageApiResponse {
  results: OpenCageResult[];
  // ... outros campos
}

export class OpenCageGeocodingService implements IGeocodingService {
  private apiKey: string;
  private baseUrl = "https://api.opencagedata.com/geocode/v1/json";

  constructor() {
    if (!config.opencage.apiKey) { // Validação já existe no config/index.ts, mas é bom ter redundância ou injetar diretamente
      throw new Error("OpenCage API key is not defined.");
    }
    this.apiKey = config.opencage.apiKey;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null> {
    try {
      const params = {
        q: `<span class="math-inline">\{latitude\}\+</span>{longitude}`,
        key: this.apiKey,
        language: "pt", // Poderíamos tornar configurável
        pretty: 1, // Para facilitar a leitura da resposta durante o desenvolvimento
        no_annotations: 1, // Para simplificar a resposta
      };

      const response = await axios.get<OpenCageApiResponse>(this.baseUrl, { params });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];

        // Mapeamento da resposta do OpenCage para o nosso GeocodingResult
        const geocodingResult: GeocodingResult = {
          city: firstResult.components.city || firstResult.components.town || firstResult.components.village || firstResult.components.county,
          country: firstResult.components.country,
          fullAddress: firstResult.formatted,
          // Mapear outros campos se necessário
        };
        return geocodingResult;
      }
      return null;
    } catch (error) {
      console.error("Error calling OpenCage API:", error);
      // @TODO: Lançar um erro mais específico do domínio/aplicação ou tratar melhor
      // Por agora, retornamos null, mas poderíamos lançar um erro que seria apanhado pelo error handler global.
      return null;
    }
  }
}