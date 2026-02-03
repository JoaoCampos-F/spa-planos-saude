import BaseHttp from "../BaseHttp";
import type { RelatorioParams } from "@/interfaces/api.interfaces";

export default class RelatoriosHttp extends BaseHttp<Blob> {
  resource(): string {
    return "/relatorios";
  }

  /**
   * Gera relatório de colaborador(es)
   * Pode filtrar por CPF específico
   */
  async gerarRelatorioColaborador(params: RelatorioParams) {
    return this.http.get(`${this.resource()}/colaborador`, {
      params,
      responseType: "blob",
    });
  }

  /**
   * Gera relatório resumo da empresa
   * Sem filtro por CPF, traz todos colaboradores
   */
  async gerarRelatorioEmpresa(params: Omit<RelatorioParams, "cpf">) {
    return this.http.get(`${this.resource()}/empresa`, {
      params,
      responseType: "blob",
    });
  }

  /**
   * Gera relatório de colaboradores com lançamento (EXPORTA=S)
   */
  async gerarRelatorioPagamento(params: Omit<RelatorioParams, "cpf">) {
    return this.http.get(`${this.resource()}/pagamento`, {
      params,
      responseType: "blob",
    });
  }

  /**
   * Gera relatório de colaboradores sem lançamento (EXPORTA=N)
   */
  async gerarRelatorioNaoPagamento(params: Omit<RelatorioParams, "cpf">) {
    return this.http.get(`${this.resource()}/nao-pagamento`, {
      params,
      responseType: "blob",
    });
  }

  /**
   * Gera resumo por departamento
   * Agrupamento por colaborador e centro de custo
   */
  async gerarResumoDepto(params: Omit<RelatorioParams, "cpf">) {
    return this.http.get(`${this.resource()}/resumo-depto`, {
      params,
      responseType: "blob",
    });
  }

  /**
   * Gera totalização por centro de custo
   * Totais agregados por centro de custo
   */
  async gerarResumoCentroCusto(params: Omit<RelatorioParams, "cpf">) {
    return this.http.get(`${this.resource()}/resumo-centro-custo`, {
      params,
      responseType: "blob",
    });
  }

  /**
   * Helper para abrir PDF em nova aba
   */
  abrirPdfNovaAba(blob: Blob, nomeArquivo: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
