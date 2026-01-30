import BaseHttp from "../BaseHttp";

import type {
  InterfaceList,
} from "./Interface";

class Departamentos extends BaseHttp<
  InterfaceList
> {
  resource(): string {
    return "empresas/departamentos";
  }
}

export default (id?: string | number) => new Departamentos(id);
export const departamentos = new Departamentos();
export type { Departamentos };
