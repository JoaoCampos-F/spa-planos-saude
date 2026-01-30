import BaseHttp from "../BaseHttp";

import { InterfaceListUsers } from "./interface";

class Users extends BaseHttp<InterfaceListUsers> {
  resource(): string {
    return "users";
  }
}

export default (id?: string | number) => new Users(id);
export const users = new Users();
export type { Users };
