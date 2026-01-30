interface InterfaceList {
  cod_empresa: number,
  codcoligada: number,
  codfilial: number,
  cod_depto: number,
  apelido: string,
  chapa: string,
  cod_funcao: string,
  codigo_cpf: number,
  colaborador: string,
  cod_band: number,
  departamento: string,
  funcao: string,
  calcula_comissao: string,
  situacao: string,
  export_totvs: string,
  ativo: string,
  dataadmissao: Date,
  data_demissao: Date,
  mes_adm: string,
  ano_adm: number,
  cod_equipe: number | null,
  tipo: number
}

export type {
  InterfaceList,
};
