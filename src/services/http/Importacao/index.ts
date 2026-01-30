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

export default class ImportacaoHttp extends BaseHttp<ImportacaoResponse> {
  resource(): string {
    return "/importacao";
  }

  /**
   * POST /importacao/cnpj
   * Importa dados por CNPJ
   */
  async importarPorCnpj(params: ImportarCnpjParams) {
    return this.http.post<ImportacaoResponse>(
      `${this.resource()}/cnpj`,
      params,
    );
  }

  /**
   * POST /importacao/contrato
   * Importa dados por Contrato
   */
  async importarPorContrato(params: ImportarContratoParams) {
    return this.http.post<ImportacaoResponse>(
      `${this.resource()}/contrato`,
      params,
    );
  }

  /**
   * POST /importacao/resumo
   * Importa resumo geral
   */
  async importarResumo(params: any) {
    return this.http.post<ImportacaoResponse>(
      `${this.resource()}/resumo`,
      params,
    );
  }
}
