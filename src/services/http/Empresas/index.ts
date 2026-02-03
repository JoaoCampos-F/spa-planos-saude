import BaseHttp from "../BaseHttp";

export interface EmpresaUnimedResponse {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  codBand: number;
  cnpj: string;
}

export interface BuscarEmpresasResponse {
  sucesso: boolean;
  dados: EmpresaUnimedResponse[];
  total: number;
  timestamp: string;
}

export default class EmpresasHttp extends BaseHttp<BuscarEmpresasResponse> {
  resource(): string {
    return "/importacao/empresas-unimed";
  }

  async buscarEmpresasUnimed() {
    return this.http.get<BuscarEmpresasResponse>(this.resource());
  }
}
