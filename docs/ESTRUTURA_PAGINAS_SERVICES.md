# 📁 Estrutura de Páginas e Services HTTP - spa-planos-saude

## 🎯 Baseado nos Módulos da API-Unimed

### 📄 Estrutura de Páginas Criada

```
src/pages/
├── PageNotFound.vue                        # 404
│
├── importacao/                             # 🔵 MÓDULO IMPORTAÇÃO (3 páginas)
│   ├── index.vue                          # Bem-vindo à página de Importação
│   ├── cnpj.vue                           # Bem-vindo à página de Importação por CNPJ
│   └── contrato.vue                       # Bem-vindo à página de Importação por Contrato
│
├── colaboradores/                          # 🟡 MÓDULO COLABORADORES (1 página)
│   └── index.vue                          # Bem-vindo à página de Colaboradores
│
├── processos/                              # 🟢 MÓDULO PROCESSOS (2 páginas)
│   ├── index.vue                          # Bem-vindo à página de Processos
│   └── historico.vue                      # Bem-vindo à página de Histórico de Processos
│
├── exportacao/                             # 🔴 MÓDULO EXPORTAÇÃO (1 página)
│   └── index.vue                          # Bem-vindo à página de Exportação
│
└── relatorios/                             # 🟢 MÓDULO RELATÓRIOS (7 páginas)
    ├── index.vue                          # Bem-vindo à página de Relatórios
    ├── colaborador.vue                    # Bem-vindo à página de Relatório de Colaborador
    ├── empresa.vue                        # Bem-vindo à página de Relatório de Empresa
    ├── pagamento.vue                      # Bem-vindo à página de Relatório de Pagamento
    ├── nao-pagamento.vue                  # Bem-vindo à página de Relatório de Não Pagamento
    ├── resumo-depto.vue                   # Bem-vindo à página de Resumo por Departamento
    └── centro-custo.vue                   # Bem-vindo à página de Resumo por Centro de Custo
```

**Total:** 14 páginas criadas

---

## 🌐 Rotas Configuradas

### Módulo Importação

- `GET /importacao` → PageImportacao
- `GET /importacao/cnpj` → PageImportacaoCnpj
- `GET /importacao/contrato` → PageImportacaoContrato

### Módulo Colaboradores

- `GET /colaboradores` → PageColaboradores

### Módulo Processos

- `GET /processos` → PageProcessos
- `GET /processos/historico` → PageProcessosHistorico

### Módulo Exportação

- `GET /exportacao` → PageExportacao

### Módulo Relatórios

- `GET /relatorios` → PageRelatorios (menu)
- `GET /relatorios/colaborador` → PageRelatorioColaborador
- `GET /relatorios/empresa` → PageRelatorioEmpresa
- `GET /relatorios/pagamento` → PageRelatorioPagamento
- `GET /relatorios/nao-pagamento` → PageRelatorioNaoPagamento
- `GET /relatorios/resumo-depto` → PageRelatorioResumoDepto
- `GET /relatorios/centro-custo` → PageRelatorioResumoCentroCusto

### Especiais

- `GET /404` → PageNotFound
- `GET /*` → Redirect para /404

---

## 🔌 Services HTTP Organizados

### Estrutura:

```
src/services/http/
├── BaseHttp.ts                             # Classe base (herança do spa-pplr)
├── http.ts                                 # Axios instance configurado
│
├── Importacao/
│   └── index.ts                           # ImportacaoHttp service
│
├── Colaborador/
│   └── index.ts                           # ColaboradorHttp service
│
├── Processo/
│   └── index.ts                           # ProcessoHttp service
│
├── Exportacao/
│   └── index.ts                           # ExportacaoHttp service
│
└── Relatorio/
    └── index.ts                           # RelatorioHttp service
```

---

## 📡 Mapeamento API → Services

### 1. 🔵 ImportacaoHttp

```typescript
import ImportacaoHttp from "@/services/http/Importacao";
const service = new ImportacaoHttp();

// POST /importacao/cnpj
await service.importarPorCnpj({ cnpj, mesRef, anoRef });

// POST /importacao/contrato
await service.importarPorContrato({ contrato, mesRef, anoRef });

// POST /importacao/resumo
await service.importarResumo(params);
```

**Interfaces:**

- `ImportarCnpjParams`
- `ImportarContratoParams`
- `ImportacaoResponse`

---

### 2. 🟡 ColaboradorHttp

```typescript
import ColaboradorHttp from "@/services/http/Colaborador";
const service = new ColaboradorHttp();

// GET /colaboradores (com paginação)
await service.listar({ codEmpresa, codColigada, page, pageSize, search });

// PATCH /colaboradores/atualizar
await service.atualizarExporta({ cpf, mesRef, anoRef, exporta });

// PATCH /colaboradores/atualizar-todos (Cancelar Todos)
await service.atualizarTodos({
  codEmpresa,
  codColigada,
  codFilial,
  mesRef,
  anoRef,
  exporta,
});

// PATCH /colaboradores/atualizar-valor-empresa
await service.atualizarValorEmpresa({
  codEmpresa,
  codColigada,
  codFilial,
  valor,
});
```

**Interfaces:**

- `BuscarColaboradoresParams`
- `Colaborador`
- `ColaboradorResponse` (com paginação DataTables)
- `AtualizarColaboradorParams`
- `AtualizarTodosParams`
- `AtualizarValorEmpresaParams`

---

### 3. 🟢 ProcessoHttp

```typescript
import ProcessoHttp from "@/services/http/Processo";
const service = new ProcessoHttp();

// GET /processos/disponiveis
await service.listarDisponiveis();

// GET /processos/historico
await service.listarHistorico();

// POST /processos/:codigo/executar
await service.executar("P_MCW_FECHA_COMISSAO_GLOBAL", {
  codEmpresa,
  mesRef,
  anoRef,
});
```

**Interfaces:**

- `Processo`
- `ProcessoResponse`
- `HistoricoProcesso`
- `ExecutarProcessoParams`

---

### 4. 🔴 ExportacaoHttp

```typescript
import ExportacaoHttp from "@/services/http/Exportacao";
const service = new ExportacaoHttp();

// POST /exportacao/totvs
await service.exportarParaTotvs({
  codEmpresa,
  mesRef,
  anoRef,
  bandeira: "EC",
  processos: ["P_MCW_FECHA_COMISSAO_GLOBAL"],
});

// GET /exportacao/processos (com última execução)
await service.listarProcessos();

// POST /exportacao/dirf (Fase 2)
await service.exportarParaDirf(params);
```

**Interfaces:**

- `ExportarTotvsParams`
- `ExportacaoResponse`
- `ProcessoParaExportacao`

---

### 5. 🟢 RelatorioHttp

```typescript
import RelatorioHttp from "@/services/http/Relatorio";
const service = new RelatorioHttp();

// GET /relatorios/colaborador (PDF)
const response = await service.gerarRelatorioColaborador({
  codEmpresa,
  mesRef,
  anoRef,
  cpf,
});
const blob = new Blob([response.data], { type: "application/pdf" });
const url = window.URL.createObjectURL(blob);
window.open(url);

// GET /relatorios/empresa
await service.gerarRelatorioEmpresa({ codEmpresa, mesRef, anoRef });

// GET /relatorios/pagamento
await service.gerarRelatorioPagamento({ codEmpresa, mesRef, anoRef });

// GET /relatorios/nao-pagamento
await service.gerarRelatorioNaoPagamento({ codEmpresa, mesRef, anoRef });

// GET /relatorios/resumo-depto
await service.gerarResumoDepto({ codEmpresa, mesRef, anoRef });

// GET /relatorios/centro-custo
await service.gerarResumoCentroCusto({ codEmpresa, mesRef, anoRef });
```

**Interfaces:**

- `RelatorioParams`
- `RelatorioColaboradorParams`
- **Response:** `AxiosResponse<Blob>` (PDF)

---

## 🎨 Padrões Utilizados

### 1. **Herança BaseHttp** (do spa-pplr)

```typescript
export default class ColaboradorHttp extends BaseHttp<
  ColaboradorResponse,
  any,
  any,
  BuscarColaboradoresParams
> {
  resource(): string {
    return "/colaboradores";
  }
}
```

### 2. **Métodos Semânticos**

- `listar()` → GET com paginação
- `importarPorCnpj()` → POST específico
- `atualizarTodos()` → PATCH em massa
- `gerarRelatorioColaborador()` → GET com Blob

### 3. **TypeScript Strict**

- Todas as interfaces exportadas
- Tipos para requests e responses
- AxiosResponse tipado para PDFs

---

## 🔥 Features Implementadas nos Services

### ✅ Paginação (ColaboradorHttp)

```typescript
interface ColaboradorResponse {
  data: Colaborador[];
  totalRecords: number; // Total sem filtro
  filteredRecords: number; // Total com search
  page: number;
  pageSize: number;
}
```

### ✅ Cancelar Todos (ColaboradorHttp)

```typescript
// Cancela exportação de todos colaboradores de uma empresa/período
await service.atualizarTodos({
  codEmpresa: 1,
  codColigada: 1,
  codFilial: 1,
  mesRef: "01",
  anoRef: "2026",
  exporta: "N", // 'N' = cancela, 'S' = marca
});
```

### ✅ Download de PDFs (RelatorioHttp)

```typescript
const response = await service.gerarRelatorioColaborador(params);
const blob = new Blob([response.data], { type: "application/pdf" });
const url = window.URL.createObjectURL(blob);
window.open(url);
```

### ✅ Filtros Cascateados (ExportacaoHttp)

```typescript
await service.exportarParaTotvs({
  codEmpresa: 1,
  mesRef: "01",
  anoRef: "2026",
  bandeira: "EC", // Opcional: filtrar por bandeira
  cpfColaborador: "12345678901", // Opcional: exportar 1 colaborador
  processos: ["P_MCW_FECHA_COMISSAO_GLOBAL"],
});
```

---

## 📊 Status por Módulo

| Módulo            | Páginas | Services | Endpoints API                                | Status    |
| ----------------- | ------- | -------- | -------------------------------------------- | --------- |
| **Importação**    | 3       | ✅       | POST /cnpj, /contrato, /resumo               | ✅ Pronto |
| **Colaboradores** | 1       | ✅       | GET, 3x PATCH (com paginação)                | ✅ Pronto |
| **Processos**     | 2       | ✅       | GET /disponiveis, /historico, POST /executar | ✅ Pronto |
| **Exportação**    | 1       | ✅       | POST /totvs, GET /processos                  | ✅ Pronto |
| **Relatórios**    | 7       | ✅       | 6x GET (PDF)                                 | ✅ Pronto |

**Total:** 14 páginas + 5 services completos

---

## 🚀 Próximos Passos

1. ✅ **Estrutura criada** - Páginas e services prontos
2. ⏳ **Implementar componentes** - v-data-table, forms, modals
3. ⏳ **Integrar Keycloak** - Autenticação e roles
4. ⏳ **Implementar stores Pinia** - Estado global
5. ⏳ **Estilizar com Vuetify** - UI/UX profissional

---

**Data:** 30/01/2026  
**Baseado em:** API-Unimed (88% completa) + spa-pplr (padrão BaseHttp)
