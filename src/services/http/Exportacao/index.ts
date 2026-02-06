import BaseHttp from "../BaseHttp";

export interface ExportarTotvsParams {
  mesRef: number;
  anoRef: number;
  processos: string[]; // ✅ Array de códigos de processos MCW
  codBand?: string; // Código da bandeira (2, 4, etc.) ou 'T' para todas
  empresa?: string; // Código da empresa ou 'T' para todas da bandeira
  colaborador?: string; // CPF do colaborador específico ou vazio para todos
  previa?: boolean; // true = Gerar prévia sem gravar definitivo
  apagar?: boolean; // true = Apagar dados antigos antes de processar

  // Campos deprecados (compatibilidade)
  codigoProcesso?: string; // @deprecated - Use processos[]
  bandeira?: string; // @deprecated - Use codBand
  cpfColaborador?: string; // @deprecated - Use colaborador
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

  /**
   * GET /exportacao/logs
   * Busca histórico de execuções dos processos
   */
  async buscarLogs(queryString: string) {
    return this.http.get(`${this.resource()}/logs?${queryString}`);
  }
}
