import { defineStore } from "pinia";
import type { InterfaceList as InterfaceListEmpresa } from "@/services/http/Empresas/Interface";
import { empresas } from "@/services/http/Empresas";

type EmpresaStore = {
  empresas: InterfaceListEmpresa[];
};
export const empresaStore = defineStore("empresaStore", {
  state: (): EmpresaStore => {
    return {
      empresas: [],
    };
  },

  getters: {
    get: (state) => state.empresas,
  },

  actions: {
    async set() {
      const { data } = await empresas.list({ per_page: -1 });
      const list = data.data;

      const unique = Array.from(
        new Map(list.map(item => [item.apelido, item])).values()
      );

      this.empresas = unique;
    },

  },
});
