import BaseHttp from "../../BaseHttp";

import type { InterfaceList } from "./Interface";

class Colaboradores extends BaseHttp<InterfaceList> {
  resource(): string {
    return "colaborador";
  }
}

export default (id?: string | number) => new Colaboradores(id);
export const colaboradores = new Colaboradores();
export type { Colaboradores };
