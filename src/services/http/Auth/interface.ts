interface InterfaceList {
    permissions: {
      [key: string]: Array<string>;
    };
    roles: string[];
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
  }
  interface InterfaceParamnsQueryString {}
  
  interface InterfaceStore {}
  interface InterfaceUpdate {
    id_band: number;
    descricao: string;
  }
  export type {
    InterfaceList,
    InterfaceParamnsQueryString,
    InterfaceStore,
    InterfaceUpdate,
  };
  