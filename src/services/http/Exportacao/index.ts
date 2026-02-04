import BaseHttp from "../BaseHttp";

export interface ExportarTotvsParams {
  mesRef: number;
  anoRef: number;
  codigoProcesso: string; // Código do processo MCW (ex: '90000001') - UM processo por vez
  bandeira?: string; // Código da bandeira (ex: 'U' = Unimed, 'G' = GSV, 'S' = SAN)
  empresa?: string; // Sigla da empresa (ex: 'AF', 'BM') ou 'T' para todas da bandeira
  cpfColaborador?: string; // CPF do colaborador específico (requer empresa específica)
  previa?: boolean; // true = Gerar prévia, false = Definitivo
  apagar?: boolean; // true = Apagar dados antigos (requer permissão ADMIN)
}

export interface ExportacaoResponse {
  sucesso: boolean;
  mensagem: string;
  totalExportado: number;
  erros?: string[];
}

export interface ProcessoParaExportacao {
  codigo: string;
  categoria: string;
  procedure: string;
  descricao: string;
  ordem: number;
  dias: number;
  usuario: string;
  tipoEmpresa: string;
  tipoDado: string;
  ativo: string;
  dataUltimaExecucao: string | null;
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
  async listarProcessos(params: {
    categoria: string;
    tipoDado: string;
    mesRef: number;
    anoRef: number;
  }) {
    return this.http.get<ProcessoParaExportacao[]>(
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
