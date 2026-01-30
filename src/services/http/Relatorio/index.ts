import BaseHttp from "../BaseHttp";
import type { AxiosResponse } from "axios";

export interface RelatorioParams {
  codEmpresa: number;
  codColigada: number;
  mesRef: string;
  anoRef: string;
  formato?: "pdf" | "excel";
}

export interface RelatorioColaboradorParams extends RelatorioParams {
  cpf: string;
}

export default class RelatorioHttp extends BaseHttp {
  resource(): string {
    return "/relatorios";
  }

  /**
   * GET /relatorios/colaborador
   * Gera relatório de um colaborador específico
   */
  async gerarRelatorioColaborador(
    params: RelatorioColaboradorParams,
  ): Promise<AxiosResponse<Blob>> {
    return this.http.get(`${this.resource()}/colaborador`, {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
  }

  /**
   * GET /relatorios/empresa
   * Gera relatório geral da empresa
   */
  async gerarRelatorioEmpresa(
    params: RelatorioParams,
  ): Promise<AxiosResponse<Blob>> {
    return this.http.get(`${this.resource()}/empresa`, {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
  }

  /**
   * GET /relatorios/pagamento
   * Gera relatório de colaboradores com pagamento
   */
  async gerarRelatorioPagamento(
    params: RelatorioParams,
  ): Promise<AxiosResponse<Blob>> {
    return this.http.get(`${this.resource()}/pagamento`, {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
  }

  /**
   * GET /relatorios/nao-pagamento
   * Gera relatório de colaboradores sem pagamento
   */
  async gerarRelatorioNaoPagamento(
    params: RelatorioParams,
  ): Promise<AxiosResponse<Blob>> {
    return this.http.get(`${this.resource()}/nao-pagamento`, {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
  }

  /**
   * GET /relatorios/resumo-depto
   * Gera resumo por departamento
   */
  async gerarResumoDepto(
    params: RelatorioParams,
  ): Promise<AxiosResponse<Blob>> {
    return this.http.get(`${this.resource()}/resumo-depto`, {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
  }

  /**
   * GET /relatorios/centro-custo
   * Gera resumo por centro de custo
   */
  async gerarResumoCentroCusto(
    params: RelatorioParams,
  ): Promise<AxiosResponse<Blob>> {
    return this.http.get(`${this.resource()}/centro-custo`, {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });
  }
}
