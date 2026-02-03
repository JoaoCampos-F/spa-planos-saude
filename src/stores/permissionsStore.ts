import { defineStore } from "pinia";

type Permissions = {
  permissions: {
    [key: string]: string[];
  };
  roles: Array<string>;
  rolesSystem: Array<string>;
  loading: boolean;
};

export const permissions = defineStore("permissionStore", {
  state: (): Permissions => {
    return {
      permissions: {},
      roles: [],
      rolesSystem: ["ADMIN", "DP", "COLABORADOR"],
      loading: true, // Inicia como loading
    };
  },

  actions: {
    setPermissions(data: Permissions) {
      this.permissions = data.permissions;
      this.roles = data.roles;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  },
  getters: {
    getState(state): Permissions {
      return {
        permissions: state.permissions,
        roles: state.roles,
        rolesSystem: state.rolesSystem,
        loading: state.loading,
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
    isLoading(state): boolean {
      return state.loading;
    },
  },
});
export type { Permissions };
