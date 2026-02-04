import BaseHttp from "../BaseHttp";
import type {
  ColaboradorSimplificado,
  ApiResponseColaboradores,
} from "@/interfaces/api.interfaces";
import type { AxiosResponse } from "axios";

export interface ColaboradorResumo {
  apelido: string;
  colaborador: string;
  ativo: "S" | "N";
  exporta: "S" | "N";
  mesRef: string;
  anoRef: string;
  mTitular: string;
  mDependente: string;
  valorConsumo: string;
  percEmpresa: string;
  valorTotal: string;
  valorLiquido: string;
  codigoCpf: string;
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  codBand: number;
}

export interface ListarColaboradoresParams {
  codEmpresa?: number;
  codColigada?: number;
  mesRef?: string;
  anoRef?: string;
  cpf?: string;
  nome?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface ListarColaboradoresResponse {
  sucesso: boolean;
  dados: ColaboradorResumo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  timestamp: string;
}

export interface AtualizarExportaParams {
  codigoCpf: string;
  mesRef: string;
  anoRef: string;
  exporta: "S" | "N";
}

export interface AtualizarExportaResponse {
  sucesso: boolean;
  mensagem: string;
  registrosAfetados: number;
  timestamp: string;
}

export default class ColaboradoresHttp extends BaseHttp<ApiResponseColaboradores> {
  resource(): string {
    return "/common/colaboradores";
  }

  async listarColaboradores(codEmpresa?: number, codColigada?: number) {
    const params: any = {};
    if (codEmpresa) params.codEmpresa = codEmpresa;
    if (codColigada) params.codColigada = codColigada;

    return this.http.get<ApiResponseColaboradores>(this.resource(), {
      params,
    });
  }

  /**
   * GET /colaboradores/listar
   * Lista colaboradores com paginação e filtros
   * Para tela de gestão de colaboradores
   */
  async listarColaboradoresPaginado(
    params: ListarColaboradoresParams,
  ): Promise<AxiosResponse<ListarColaboradoresResponse>> {
    const queryParams: any = {};

    if (params.codEmpresa) queryParams.codEmpresa = params.codEmpresa;
    if (params.codColigada) queryParams.codColigada = params.codColigada;
    if (params.mesRef) queryParams.mesRef = params.mesRef;
    if (params.anoRef) queryParams.anoRef = params.anoRef;
    if (params.cpf) queryParams.cpf = params.cpf;
    if (params.nome) queryParams.nome = params.nome;
    if (params.page) queryParams.page = params.page;
    if (params.pageSize) queryParams.pageSize = params.pageSize;
    if (params.orderBy) queryParams.orderBy = params.orderBy;
    if (params.orderDirection)
      queryParams.orderDirection = params.orderDirection;

    return this.http.get<ListarColaboradoresResponse>("/colaboradores/listar", {
      params: queryParams,
    });
  }

  /**
   * PATCH /colaboradores/atualizar-exporta
   * Atualiza flag exporta (S/N) de um colaborador
   */
  async atualizarExporta(
    params: AtualizarExportaParams,
  ): Promise<AxiosResponse<AtualizarExportaResponse>> {
    return this.http.patch<AtualizarExportaResponse>(
      "/colaboradores/atualizar-exporta",
      params,
    );
  }
}
