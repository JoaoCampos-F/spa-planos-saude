import BaseHttp from "../BaseHttp";

export interface ImportarCnpjParams {
  cnpj: string;
  mesRef: string;
  anoRef: string;
}

export interface ImportarContratoParams {
  contrato: string;
  mesRef: string;
  anoRef: string;
}

export interface ImportacaoResponse {
  sucesso: boolean;
  mensagem: string;
  registrosImportados: number;
}

export interface ImportarPeriodoParams {
  mes: string; // "01", "02"
  ano: string; // "2026"
}

export interface ImportacaoCompletaResponse {
  sucesso: boolean;
  periodo: string;
  resumo: {
    cnpj: {
      totalImportado: number;
      empresasProcessadas: number;
      erros: string[];
    };
    contrato: {
      totalImportado: number;
      contratosProcessados: number;
      erros: string[];
    };
    totalGeral: number;
  };
  timestamp: string;
}

export default class ImportacaoHttp extends BaseHttp<ImportacaoCompletaResponse> {
  resource(): string {
    return "/importacao";
  }

  /**
   * POST /importacao/importar-periodo
   * Importa dados completos (CNPJ + Contrato) de um período
   */
  async importarPeriodoCompleto(params: ImportarPeriodoParams) {
    return this.http.post<ImportacaoCompletaResponse>(
      `${this.resource()}/importar-periodo`,
      params,
    );
  }

  async importarPorCnpj(params: ImportarCnpjParams) {
    return this.http.post(`${this.resource()}/cnpj`, params);
  }

  async importarPorContrato(params: ImportarContratoParams) {
    return this.http.post(`${this.resource()}/contrato`, params);
  }

  async importarResumo(params: any) {
    return this.http.post(`${this.resource()}/resumo`, params);
  }
}
