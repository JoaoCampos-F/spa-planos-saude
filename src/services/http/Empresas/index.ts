import BaseHttp from "../BaseHttp";
import type {
  EmpresaCompleta,
  ApiResponseEmpresas,
} from "@/interfaces/api.interfaces";

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

export default class EmpresasHttp extends BaseHttp<ApiResponseEmpresas> {
  resource(): string {
    return "/importacao";
  }

  async buscarEmpresasUnimed() {
    return this.http.get<BuscarEmpresasResponse>(
      `${this.resource()}/empresas-unimed`,
    );
  }

  async listarEmpresas() {
    return this.http.get<ApiResponseEmpresas>(
      `${this.resource()}/listar-empresas`,
    );
  }
}
