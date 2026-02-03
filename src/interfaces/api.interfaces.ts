// Interfaces para Empresas
export interface EmpresaCompleta {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  codBand: number;
  cnpj: string;
  apelido: string;
  processaUnimed: boolean;
  ativo: boolean;
}

export interface ApiResponseEmpresas {
  sucesso: boolean;
  dados: EmpresaCompleta[];
  total: number;
  timestamp: string;
}

// Interfaces para Contratos
export interface Contrato {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  codBand: number;
  cnpj: string;
  contrato: string;
}

export interface ApiResponseContratos {
  sucesso: boolean;
  dados: Contrato[];
  total: number;
  timestamp: string;
}

// Interfaces para Colaboradores
export interface ColaboradorSimplificado {
  codEmpresa: number;
  codColigada: number;
  codFilial: number;
  codBand: number;
  cpf: string;
  nome: string;
  apelido: string;
}

export interface ApiResponseColaboradores {
  sucesso: boolean;
  dados: ColaboradorSimplificado[];
  total: number;
  timestamp: string;
}

// Interfaces para Processos
export interface Processo {
  codigo: string;
  descricao: string;
  categoria: string;
  ordem: number;
  dias: number;
  ativo: boolean;
  tipoDeDado: "S" | "C";
}

export interface ApiResponseProcessos {
  sucesso: boolean;
  dados: Processo[];
  total: number;
  timestamp: string;
}

// Interfaces para Relatórios
export interface RelatorioParams {
  codEmpresa?: number;
  codColigada?: number;
  codFilial?: number;
  mesRef: string;
  anoRef: string;
  codBand?: number;
  codContrato?: string;
  cpf?: string;
}
