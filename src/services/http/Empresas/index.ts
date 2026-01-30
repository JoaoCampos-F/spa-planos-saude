import BaseHttp from "../BaseHttp";

import type {
  InterfaceList,
} from "./Interface";

class Empresas extends BaseHttp<
  InterfaceList
> {
  resource(): string {
    return "empresas";
  }
}

export default (id?: string | number) => new Empresas(id);
export const empresas = new Empresas();
export type { Empresas };
