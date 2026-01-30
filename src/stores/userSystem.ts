import { defineStore } from "pinia";

type UserSystem = {
  colaborador: {
    [key: string]: string[];
  };
  segmentos: Array<string>;
  empresas: Array<string>;
  departamentos: Array<string>;
  funcoes: Array<string>;
  equipes: Array<string>;
};

export const userSystem = defineStore("userSystem", {
  state: (): UserSystem => {
    return {
      colaborador: {},
      segmentos: [],
      empresas: [],
      departamentos: [],
      funcoes: [],
      equipes: [],
    };
  },

  actions: {
    setUserSystem(data: UserSystem) {
      this.colaborador = data.colaborador;
      this.segmentos = data.segmentos;
      this.empresas = data.empresas;
      this.departamentos = data.departamentos;
      this.funcoes = data.funcoes;
      this.equipes = data.equipes;
    },
  },

  getters: {
    getColaborador: (state) => state.colaborador,
    getSegmentos: (state) => state.segmentos,
    getEmpresas: (state) => state.empresas,
    getDepartamentos: (state) => state.departamentos,
    getFuncoes: (state) => state.funcoes,
    getEquipes: (state) => state.equipes,
  },
});
export type { UserSystem };
