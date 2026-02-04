import BaseHttp from "../BaseHttp";
import type {
  Contrato,
  ApiResponseContratos,
} from "@/interfaces/api.interfaces";

export default class ContratosHttp extends BaseHttp<ApiResponseContratos> {
  resource(): string {
    return "/common/contratos";
  }

  async listarContratos(codEmpresa?: number) {
    return this.http.get<ApiResponseContratos>(this.resource(), {
      params: codEmpresa ? { codEmpresa } : {},
    });
  }
}
