import { defineStore } from "pinia";

type Permissions = {
  permissions: {
    [key: string]: string[];
  };
  roles: Array<string>;
  rolesSystem: Array<string>;
};

export const permissions = defineStore("permissionStore", {
  state: (): Permissions => {
    return {
      permissions: {},
      roles: [],
      rolesSystem: ["ADMIN", "DP", "COLABORADOR"],
    };
  },

  actions: {
    setPermissions(data: Permissions) {
      this.permissions = data.permissions;
      this.roles = data.roles;
    },
  },
  getters: {
    getState(state): Permissions {
      return {
        permissions: state.permissions,
        roles: state.roles,
        rolesSystem: state.rolesSystem,
      };
    },
    getRoles(state): Array<string> {
      return state.roles;
    },
    getRolesSystem(state): Array<string> {
      return state.rolesSystem;
    },
    getPermissions(state) {
      return state.permissions;
    },
  },
});
export type { Permissions };
