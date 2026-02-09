import BaseHttp from "../BaseHttp";

export interface DashboardColaboradorData {
  cpf: string;
  nome: string;
  empresa: string;
  mesRef: number;
  anoRef: number;
  mensalidadeTitular: number;
  mensalidadeDependente: number;
  consumo: number;
  valorTotal: number;
  valorLiquido: number;
  status: "S" | "N";
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardColaboradorData;
  meta: {
    periodo: string;
    usuario: string;
    empresa: string;
  };
}

export default class DashboardHttp extends BaseHttp {
  resource(): string {
    return "/dashboard";
  }

  async buscarDashboardColaborador(
    mes: number,
    ano: number,
  ): Promise<DashboardResponse> {
    const queryParams = new URLSearchParams({
      mes: mes.toString(),
      ano: ano.toString(),
    });

    const response = await this.http.get<DashboardResponse>(
      `${this.resource()}/colaborador?${queryParams}`,
    );

    return response.data;
  }
}
