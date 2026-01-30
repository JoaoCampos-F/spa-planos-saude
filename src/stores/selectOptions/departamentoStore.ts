import { defineStore } from "pinia";
import type { InterfaceList as InterfaceListDepartamentos } from "@/services/http/Departamentos/Interface";
import { departamentos } from "@/services/http/Departamentos";

type DepartamentoStore = {
  departamentos: InterfaceListDepartamentos[];
};
export const departamentoStore = defineStore("departamentosStore", {
  state: (): DepartamentoStore => {
    return {
      departamentos: [],
    };
  },

  getters: {
    get: (state) => state.departamentos,
  },

  actions: {
    async set() {
      const { data } = await departamentos.list({ per_page: -1 });
        const list = data.data;

        const unique = Array.from(
          new Map(
            list.map(item => [`${item.cod_depto}-${item.cod_band}`, item])
          ).values()
        );

        this.departamentos = unique;
    },
  },
});
