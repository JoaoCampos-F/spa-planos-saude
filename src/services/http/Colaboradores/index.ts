import BaseHttp from "../BaseHttp";
import type {
  ColaboradorSimplificado,
  ApiResponseColaboradores,
} from "@/interfaces/api.interfaces";

export default class ColaboradoresHttp extends BaseHttp<ApiResponseColaboradores> {
  resource(): string {
    return "/common/colaboradores";
  }

  async listarColaboradores(codEmpresa: number, codColigada: number) {
    return this.http.get<ApiResponseColaboradores>(this.resource(), {
      params: {
        codEmpresa,
        codColigada,
      },
    });
  }
}
