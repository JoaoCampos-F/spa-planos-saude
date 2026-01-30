import { defineStore } from "pinia";
import Keycloak from "keycloak-js";

type SsoStore = {
  keycloak?: Keycloak | null;
};

export const ssoStore = defineStore("SsoStore", {
  state: (): SsoStore => {
    return {
      keycloak: null,
    };
  },

  getters: {
    getToken: (state) => state.keycloak?.token,
    getUser: (state) => state.keycloak?.tokenParsed,
    getKeycloak: (state) => state.keycloak,
  },

  actions: {
    setKeyCloak(keycloak: Keycloak) {
      this.keycloak = keycloak;
    },
  },
});

export type { SsoStore };
