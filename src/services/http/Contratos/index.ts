import BaseHttp from "../BaseHttp";
import type {
  Contrato,
  ApiResponseContratos,
} from "@/interfaces/api.interfaces";

export default class ContratosHttp extends BaseHttp<ApiResponseContratos> {
  resource(): string {
    return "/importacao/listar-contratos";
  }

  async listarContratos() {
    return this.http.get<ApiResponseContratos>(this.resource());
  }
}
