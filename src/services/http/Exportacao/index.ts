import BaseHttp from "../BaseHttp";

export interface ExportarTotvsParams {
  codEmpresa: number;
  codColigada: number;
  mesRef: string;
  anoRef: string;
  bandeira?: string;
  cpfColaborador?: string;
  processos: string[]; // ['P_MCW_FECHA_COMISSAO_GLOBAL']
}

export interface ExportacaoResponse {
  sucesso: boolean;
  mensagem: string;
  totalExportado: number;
  erros?: string[];
}

export interface ProcessoParaExportacao {
  codigo: string;
  nome: string;
  descricao: string;
  dataUltimaExecucao?: string;
  obrigatorio: boolean;
}

export default class ExportacaoHttp extends BaseHttp<ExportacaoResponse> {
  resource(): string {
    return "/exportacao";
  }

  /**
   * POST /exportacao/totvs
   * Exporta dados para TOTVS
   */
  async exportarParaTotvs(params: ExportarTotvsParams) {
    return this.http.post<ExportacaoResponse>(
      `${this.resource()}/totvs`,
      params,
    );
  }

  /**
   * GET /exportacao/processos
   * Lista processos disponíveis para exportação (com última execução)
   */
  async listarProcessos(params?: any) {
    return this.http.get<{ data: ProcessoParaExportacao[] }>(
      `${this.resource()}/processos`,
      { params },
    );
  }

  /**
   * POST /exportacao/dirf
   * Exporta dados para DIRF (Fase 2)
   */
  async exportarParaDirf(params: any) {
    return this.http.post<ExportacaoResponse>(
      `${this.resource()}/dirf`,
      params,
    );
  }
}
