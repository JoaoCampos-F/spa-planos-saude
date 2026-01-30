interface InterfaceList {
  colaborador: {
    id_colaborador: string;
    nome: string;
    cpf: string;
    rg: string;
    chapa: string;
    ativo: string;
    data_cadastro: string;
    data_alteracao: string;
    email: string;
    data_nascimento: string;
  };
  segmentos: Array<string>;
  empresas: Array<string>;
  departamentos: Array<string>;
  funcoes: Array<string>;
  equipes: Array<string>;
}

export type { InterfaceList };
