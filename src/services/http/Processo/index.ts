import BaseHttp from "../BaseHttp";

export interface Processo {
  codigo: string;
  nome: string;
  descricao: string;
  ativo: "S" | "N";
  dataUltimaExecucao?: string;
  statusUltimaExecucao?: string;
}

export interface ProcessoResponse {
  data: Processo[];
}

export interface HistoricoProcesso {
  codigo: string;
  dataExecucao: string;
  horaInicio: string;
  horaFim?: string;
  status: "EXECUTANDO" | "CONCLUIDO" | "ERRO";
  mensagem?: string;
  registrosProcessados?: number;
}

export interface ExecutarProcessoParams {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  mesRef: string;
  anoRef: string;
}

export default class ProcessoHttp extends BaseHttp<ProcessoResponse> {
  resource(): string {
    return "/processos";
  }

  /**
   * GET /processos/disponiveis
   * Lista processos ativos disponíveis
   */
  async listarDisponiveis() {
    return this.http.get<ProcessoResponse>(`${this.resource()}/disponiveis`);
  }

  /**
   * GET /processos/historico
   * Lista histórico de todas as execuções
   */
  async listarHistorico(params?: any) {
    return this.http.get<{ data: HistoricoProcesso[] }>(
      `${this.resource()}/historico`,
      { params },
    );
  }

  /**
   * POST /processos/:codigo/executar
   * Executa um processo específico
   */
  async executar(codigo: string, params: ExecutarProcessoParams) {
    return this.http.post(`${this.resource()}/${codigo}/executar`, params);
  }
}
