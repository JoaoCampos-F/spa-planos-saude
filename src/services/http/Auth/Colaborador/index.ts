import BaseHttp from "../../BaseHttp";

import type { InterfaceList } from "./Interface";

class Auth extends BaseHttp<InterfaceList> {
  resource(): string {
    return "auth/colaborador";
  }
}

export default (id?: string | number) => new Auth(id);
export const auth = new Auth();
export type { Auth };
