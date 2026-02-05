import http from "./http";

export interface TipoBandeira {
  codBand: number;
  descricao: string;
  azTipoComVeic: string;
  azProcessa: "S" | "N";
}

interface BandeirasResponse {
  sucesso: boolean;
  dados: TipoBandeira[];
  total: number;
  timestamp: string;
}

export class BandeirasService {
  private readonly baseUrl = "/common";

  async listarBandeiras(): Promise<TipoBandeira[]> {
    const response = await http.get<BandeirasResponse>(
      `${this.baseUrl}/bandeiras`,
    );
    return response.data.dados;
  }
}

export const bandeirasService = new BandeirasService();
