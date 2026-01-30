import { defineStore } from "pinia";
import type { InterfaceList as InterfaceListColaborador } from "@/services/http/Colaborador/Colaboradores/Interface";

import { colaboradores } from "@/services/http/Colaborador/Colaboradores";

type LocalEmpresa = {
  apelido: string;
  cod_empresa: number;
  codcoligada: number;
  codfilial: number;
};

type LocalDepartamento = {
  cod_depto: number;
  cod_band: number;
  departamento: string;
  bandeira: string;
};

type LocalFuncoes = {
  cod_funcao: string;
  funcao: string;
  cod_band?: number;
  bandeira?: string;
};

type ColaboradorStore = {
  colaboradores: InterfaceListColaborador[];
  empresas?: LocalEmpresa[];
  departamentos?: LocalDepartamento[];
  grupoFuncoes?: { title: string; value: string }[];
  funcoes?: LocalFuncoes[];
};

export const colaboradorStore = defineStore("colaboradorStore", {
  state: (): ColaboradorStore => {
    return {
      colaboradores: [],
    };
  },

  getters: {
    get: (state) => state.colaboradores,
    getEmpresas: (state) => state.empresas,
    getDepartamento: (state) => state.departamentos,
    getGrupoFuncao: (state) => state.grupoFuncoes,
    getFuncao: (state) => state.funcoes,
  },

  actions: {
    // ⚠️ DESATIVADO - Carregava todos os colaboradores automaticamente
    // Agora deve ser chamado manualmente quando necessário
    async set() {
      // const { data } = await colaboradores.list({});
      // const list = data.data.sort((a, b) =>
      //   a.colaborador.localeCompare(b.colaborador),
      // );
      // this.colaboradores = list;
      console.warn(
        "colaboradorStore.set() está desativado - use carregamento sob demanda",
      );
    },

    filterEmpresa() {
      const list = this.colaboradores;

      const unique = Array.from(
        new Map(list.map((item) => [item.apelido, item])).values(),
      );

      // Ordena em ordem alfabética pelo apelido
      unique.sort((a, b) => a.apelido.localeCompare(b.apelido));

      this.empresas = unique.map((item) => ({
        apelido: item.apelido,
        cod_empresa: item.cod_empresa,
        codcoligada: item.codcoligada,
        codfilial: item.codfilial,
      }));
    },

    // ⚠️ DESATIVADO - filterDepartamento() não está implementado
    // filterDepartamento() {
    //   // Implementação pendente
    // },

    filterFuncao() {
      const list = this.colaboradores;

      const unique = Array.from(
        new Map(list.map((item) => [item.cod_funcao, item])).values(),
      );

      unique.sort((a, b) => a.funcao.localeCompare(b.funcao));

      this.funcoes = unique.map((item) => ({
        cod_funcao: item.cod_funcao,
        funcao: item.funcao,
        cod_band: item.cod_band,
        bandeira: item.cod_band + " Rodas",
      }));
    },
  },
});
