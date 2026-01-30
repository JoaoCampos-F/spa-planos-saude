import BaseHttp from "../BaseHttp";

export interface BuscarColaboradoresParams {
  codEmpresa: number;
  codColigada: number;
  mes?: string;
  ano?: string;
  cpf?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface Colaborador {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  codBand: number;
  cpf: string;
  nome: string;
  apelido: string;
  mesRef: string;
  anoRef: string;
  valorTitular: number;
  valorDependente: number;
  valorConsumo: number;
  valorEmpresa: number;
  valorTotal: number;
  valorLiquido: number;
  exporta: "S" | "N";
  ativo: "S" | "N";
}

export interface ColaboradorResponse {
  data: Colaborador[];
  totalRecords: number;
  filteredRecords: number;
  page: number;
  pageSize: number;
}

export interface AtualizarColaboradorParams {
  cpf: string;
  mesRef: string;
  anoRef: string;
  exporta: "S" | "N";
}

export interface AtualizarTodosParams {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  mesRef: string;
  anoRef: string;
  exporta: "S" | "N";
}

export interface AtualizarValorEmpresaParams {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  valor: number;
}

export default class ColaboradorHttp extends BaseHttp<
  ColaboradorResponse,
  any,
  any,
  BuscarColaboradoresParams
> {
  resource(): string {
    return "/colaboradores";
  }

  /**
   * GET /colaboradores
   * Lista colaboradores com paginação
   */
  async listar(params: BuscarColaboradoresParams) {
    return this.list(params);
  }

  /**
   * PATCH /colaboradores/atualizar
   * Atualiza flag de exportação de um colaborador
   */
  async atualizarExporta(params: AtualizarColaboradorParams) {
    return this.http.patch(`${this.resource()}/atualizar`, params);
  }

  /**
   * PATCH /colaboradores/atualizar-todos
   * Cancela/Marca exportação de todos colaboradores
   */
  async atualizarTodos(params: AtualizarTodosParams) {
    return this.http.patch(`${this.resource()}/atualizar-todos`, params);
  }

  /**
   * PATCH /colaboradores/atualizar-valor-empresa
   * Atualiza percentual da empresa
   */
  async atualizarValorEmpresa(params: AtualizarValorEmpresaParams) {
    return this.http.patch(
      `${this.resource()}/atualizar-valor-empresa`,
      params,
    );
  }
}
