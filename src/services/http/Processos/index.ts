import BaseHttp from "../BaseHttp";
import type {
  Processo,
  ApiResponseProcessos,
} from "@/interfaces/api.interfaces";

export default class ProcessosHttp extends BaseHttp<ApiResponseProcessos> {
  resource(): string {
    return "/common/processos";
  }

  async listarProcessos(categoria?: string) {
    return this.http.get<ApiResponseProcessos>(this.resource(), {
      params: categoria ? { categoria } : {},
    });
  }
}
