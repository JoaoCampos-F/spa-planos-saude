import { funcoes } from "@/services/http/Funcoes/Funcao";
import type { InterfaceList as InterfaceListFuncoes } from "@/services/http/Funcoes/Funcao/Interface";
import { defineStore } from "pinia";

type FuncaoStore = {
  funcoes: InterfaceListFuncoes[];
};
export const funcaoStore = defineStore("funcaoStore", {
  state: (): FuncaoStore => {
    return {
      funcoes: [],
    };
  },

  getters: {
    get: (state) =>
      state.funcoes.map((item) => {
        return { ...item, descricao: `${item.cod_funcao} - ${item.descricao}` };
      }),
  },

  actions: {
    async set() {
      const { data } = await funcoes.list({ per_page: -1 });
      this.funcoes = data.data;
    },
  },
});
