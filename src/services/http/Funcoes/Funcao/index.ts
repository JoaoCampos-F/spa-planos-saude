import BaseHttp from "../../BaseHttp";

import type {
  InterfaceList,
  InterfaceParamnsQueryString,
  InterfaceStore,
  InterfaceUpdate,
} from "./Interface";

class Funcoes extends BaseHttp<
  InterfaceList,
  InterfaceStore,
  InterfaceUpdate,
  InterfaceParamnsQueryString
> {
  resource(): string {
    return "funcoes";
  }
}

export default (id?: string | number) => new Funcoes(id);
export const funcoes = new Funcoes();
export type { Funcoes };
