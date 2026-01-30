import BaseHttp from "../BaseHttp";

import type {
  InterfaceList,
  InterfaceParamnsQueryString,
  InterfaceStore,
  InterfaceUpdate,
} from "./interface";

class Auth extends BaseHttp<
  InterfaceList,
  InterfaceStore,
  InterfaceUpdate,
  InterfaceParamnsQueryString
> {
  resource(): string {
    return "auth/usuarios";
  }
}

export default (id?: string | number) => new Auth(id);
export const auth = new Auth();
export type { Auth };
