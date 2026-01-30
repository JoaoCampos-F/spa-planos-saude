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
  grupoFuncoes?: {title: string, value: string}[];
  funcoes?: LocalFuncoes[];
};

export const colaboradorStore = defineStore("colaboradorStore", {
  state: (): ColaboradorStore => {
    return {
      colaboradores: [],
      empresas: [],
      departamentos: [],
      grupoFuncoes: [
        { title: 'Administrativo', value: "1" },
        { title: 'Comercial e Produtiva', value: "2" },
        { title: 'Gerentes', value: "3" },
        { title: 'Pecas e Sericos', value: "4" },
      ],
      funcoes: [],
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
    async set() {
      const { data } = await colaboradores.list({
        per_page: -1,
        ativo: "S",
      });
      const list = data.data.sort((a, b) => a.colaborador.localeCompare(b.colaborador));
      this.colaboradores = list;
    },

    filterEmpresa() {
      const list = this.colaboradores;

      const unique = Array.from(
        new Map(list.map(item => [item.apelido, item])).values()
      );

      // Ordena em ordem alfabética pelo apelido
      unique.sort((a, b) => a.apelido.localeCompare(b.apelido));

      this.empresas = unique.map(item => ({
        apelido: item.apelido,
        cod_empresa: item.cod_empresa,
        codcoligada: item.codcoligada,
        codfilial: item.codfilial
      }));
    },

    filterDepartamento() {

      const list = this.colaboradores;

      const unique = Array.from(
          new Map(
            list.map(item => [`${item.cod_depto}-${item.cod_band}`, item])
          ).values()
        );

        unique.sort((a, b) => a.departamento.localeCompare(b.departamento));

      this.departamentos = unique.map(item => ({cod_depto: item.cod_depto, cod_band: item.cod_band, departamento: item.departamento, bandeira: item.cod_band+" Rodas"}));
    },

    filterFuncao() {
      const list = this.colaboradores;

      const unique = Array.from(
        new Map(list.map(item => [item.cod_funcao, item])).values()
      );

      unique.sort((a, b) => a.funcao.localeCompare(b.funcao));

      this.funcoes = unique.map(item => ({cod_funcao: item.cod_funcao, funcao: item.funcao, cod_band: item.cod_band, bandeira: item.cod_band+" Rodas"}));
    },

    

  },

});
