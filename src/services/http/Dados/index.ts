import BaseHttp from "../BaseHttp";

import type { InterfaceList } from "./interface";

class Dados extends BaseHttp<InterfaceList> {
  resource(): string {
    return "relatorio/dados";
  }

  async download(params: any) {
    const response = await this.http.get(this.resource() + "/download/", {
      params,
      responseType: "blob", 
      timeout: 120000,
      headers: {
        "Content-Type": "application/pdf",
        "Accept": "application/pdf",
        
      },
    });

    const blob = new Blob([response.data], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio-dados-pplr.pdf");
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

export default (id?: string | number) => new Dados(id);
export const dados = new Dados();
export type { Dados, InterfaceList };
