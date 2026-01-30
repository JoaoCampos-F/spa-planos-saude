interface InterfaceList {
  id_funcao: string;
  cod_funcao: string;
  id_band: string;
  descricao: string;
  ativo: string;
  data_cad: null;
  data_alt: string;
  id_funcao_nivel: null;
  id_cargo: string;
  tem_gratificacao: string;
  pec_gratificacao: string;
  soma_equipe: string;
  soma_entrega: string;
  loca_automatico: string;
  calcula_horas_vend: string;
  calcula_horas_funilaria: string;
  soma_novo: string;
  soma_usado: string;
  soma_cotas: string;
  integra_flyvendas: string;
  papel_flyvendas: string;
  ativa_campanha: string;
  id_tipo_meta: string;
  id_papel_campanha: string;
  fraciona_ferias: string;
}

interface InterfaceParamnsQueryString { }

interface InterfaceStore {
  id_funcao?: string | number;
  id_tipo_meta: string | number;
  cod_funcao: string;
  id_band: string | number;
  descricao: string;
  ativo: string;
  data_cad?: string;
  data_alt?: string;
  id_funcao_nivel: string;
  id_cargo?: string | number;
  tem_gratificacao: string;
  pec_gratificacao: number;
  soma_equipe: string;
  soma_entrega: string;
  loca_automatico: string;
  calcula_horas_vend: string;
  calcula_horas_funilaria: string;
  soma_novo: string;
  soma_usado: string;
  soma_cotas: string;
  fraciona_ferias: string;
}
interface InterfaceUpdate {
  id_funcao?: string | number;
  id_tipo_meta?: string | number;
  cod_funcao?: string;
  id_band?: string | number;
  descricao?: string;
  ativo?: string;
  data_cad?: string;
  data_alt?: string;
  id_funcao_nivel?: string;
  id_cargo?: string | number;
  tem_gratificacao?: string;
  pec_gratificacao?: number;
  soma_equipe?: string;
  soma_entrega?: string;
  loca_automatico?: string;
  calcula_horas_vend?: string;
  calcula_horas_funilaria?: string;
  soma_novo?: string;
  soma_usado?: string;
  soma_cotas?: string;
  fraciona_ferias?: string;
}
export type {
  InterfaceList,
  InterfaceParamnsQueryString,
  InterfaceStore,
  InterfaceUpdate,
};
