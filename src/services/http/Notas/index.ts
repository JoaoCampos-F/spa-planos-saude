import BaseHttp from "../BaseHttp";

import type { InterfaceList } from "./interface";

class Notas extends BaseHttp<InterfaceList> {
  resource(): string {
    return "relatorio/notas";
  }

  async download(params: any) {
    const response = await this.http.get(this.resource() + "/download/", {
      params,
      responseType: "blob", 
    });

    const blob = new Blob([response.data], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio-notas-pplr.pdf");
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  async view(params: any) {
    const response = await this.http.get(this.resource() + "/download/", {
      params,
      responseType: "blob", 
    });

    const blob = new Blob([response.data], { type: "application/pdf" });

    return URL.createObjectURL(blob);
  }
}

export default (id?: string | number) => new Notas(id);
export const notas = new Notas();
export type { Notas, InterfaceList };
