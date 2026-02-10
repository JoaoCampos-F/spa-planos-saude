# 📥 ANÁLISE: Importação Unificada - Sistema Antigo vs Novo

## 🎯 Contexto

**Sistema Antigo (NPD-Legacy):**

- ✅ **1 único botão de importação**
- ✅ Usuário informa apenas: **Mês + Ano**
- ✅ Sistema faz **TUDO automaticamente**: Importa por CNPJ + Importa por Contrato

**Sistema Novo (API-Unimed + Front Atual):**

- ❌ **2 endpoints separados**:
  - `POST /importacao/cnpj` - Importa por CNPJ
  - `POST /importacao/contrato` - Importa por Contrato
- ❌ **3 páginas no front**: index, cnpj, contrato
- ⚠️ Usuário teria que executar 2 operações separadas

---

## 📊 Comparativo Detalhado

### Sistema Antigo (NPD-Legacy)

```
┌─────────────────────────────────────────────────────┐
│  TELA DE IMPORTAÇÃO (1 botão)                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  DADOS PARA IMPORTAÇÃO                              │
│  ┌───────────┐  ┌───────────┐                      │
│  │ Mês: FEV  │  │ Ano: 2026 │                      │
│  └───────────┘  └───────────┘                      │
│                                                      │
│  [🔵 Importar Unimed Cuiabá]  ← 1 ÚNICO BOTÃO      │
│                                                      │
│  (Faz automaticamente: CNPJ + Contrato)            │
└─────────────────────────────────────────────────────┘

Backend (PHP):
case 'saveUnimedCnpj':     ← Executa automaticamente
case 'saveUnimedContrato': ← Executa automaticamente
```

### Sistema Novo (Atual)

```
┌─────────────────────────────────────────────────────┐
│  /importacao                                        │
├─────────────────────────────────────────────────────┤
│  Escolha o tipo:                                    │
│  • /importacao/cnpj     ← Página separada          │
│  • /importacao/contrato ← Página separada          │
└─────────────────────────────────────────────────────┘

API (NestJS):
POST /importacao/cnpj     ← Usuário executa manualmente
POST /importacao/contrato ← Usuário executa manualmente
```

**Problema:** ❌ Usuário tem que executar 2 operações em vez de 1

---

## 🔧 Mudanças Necessárias

### 1️⃣ **Backend (API-Unimed)**

#### Opção A: Criar Novo Endpoint Unificado (RECOMENDADO)

```typescript
// 📁 src/presentation/controllers/importacao.controller.ts

@Post('importar-periodo') // ← NOVO ENDPOINT
@Roles('DP', 'ADMIN')
async importarPeriodoCompleto(@Body() dto: ImportarPeriodoDto) {
  return await this.importarPeriodoCompletoUseCase.execute(dto);
}
```

**DTO:**

```typescript
// 📁 src/application/dtos/importacao/importar-periodo.dto.ts

export class ImportarPeriodoDto {
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: "Mês inválido (01-12)" })
  mes: string; // "01", "02", ..., "12"

  @IsString()
  @Matches(/^\d{4}$/, { message: "Ano inválido" })
  ano: string; // "2026"
}
```

**Use Case (Novo):**

```typescript
// 📁 src/application/use-cases/importacao/importar-periodo-completo.use-case.ts

@Injectable()
export class ImportarPeriodoCompletoUseCase {
  constructor(
    private readonly importarPorCnpjUseCase: ImportarUnimedPorCnpjUseCase,
    private readonly importarPorContratoUseCase: ImportarUnimedPorContratoUseCase,
    private readonly executarResumoUseCase: ExecutarResumoUnimedUseCase,
  ) {}

  async execute(dto: ImportarPeriodoDto): Promise<ImportacaoCompletaResult> {
    const logger = new Logger("ImportarPeriodoCompleto");

    // 1️⃣ Importar por CNPJ
    logger.log("📥 Iniciando importação por CNPJ...");
    const resultadoCnpj = await this.importarPorCnpjUseCase.execute({
      mes: dto.mes,
      ano: dto.ano,
    });

    // 2️⃣ Importar por Contrato
    logger.log("📥 Iniciando importação por Contrato...");
    const resultadoContrato = await this.importarPorContratoUseCase.execute({
      mes: dto.mes,
      ano: dto.ano,
    });

    // 3️⃣ Executar Resumo (Procedure)
    logger.log("🔄 Executando procedure de resumo...");
    await this.executarResumoUseCase.execute({
      mes: dto.mes,
      ano: dto.ano,
    });

    // 📊 Consolidar resultados
    return {
      sucesso: true,
      periodo: `${dto.mes}/${dto.ano}`,
      resumo: {
        cnpj: {
          totalImportado: resultadoCnpj.totalImportado,
          empresasProcessadas: resultadoCnpj.empresasProcessadas,
          erros: resultadoCnpj.erros,
        },
        contrato: {
          totalImportado: resultadoContrato.totalImportado,
          contratosProcessados: resultadoContrato.empresasProcessadas,
          erros: resultadoContrato.erros,
        },
        totalGeral:
          resultadoCnpj.totalImportado + resultadoContrato.totalImportado,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// Interface de retorno
export interface ImportacaoCompletaResult {
  sucesso: boolean;
  periodo: string; // "01/2026"
  resumo: {
    cnpj: {
      totalImportado: number;
      empresasProcessadas: number;
      erros: string[];
    };
    contrato: {
      totalImportado: number;
      contratosProcessados: number;
      erros: string[];
    };
    totalGeral: number;
  };
  timestamp: string;
}
```

**Vantagens:**

- ✅ **Reutiliza** use-cases existentes (DRY)
- ✅ **Clean Architecture** mantida
- ✅ Compatível com endpoints antigos (não quebra nada)
- ✅ Facilita front-end (1 request em vez de 2)

---

#### Opção B: Manter Endpoints Separados + Lógica no Front (NÃO RECOMENDADO)

```typescript
// Front faria:
await importacaoHttp.importarPorCnpj({ mes, ano });
await importacaoHttp.importarPorContrato({ mes, ano });
await importacaoHttp.importarResumo({ mes, ano });
```

**Desvantagens:**

- ❌ Lógica de negócio no front
- ❌ 3 requests separados (latência)
- ❌ Tratamento de erro complexo no front
- ❌ Se 1 falhar, precisa rollback?

---

### 2️⃣ **Frontend (spa-planos-saude)**

#### Estrutura de Páginas Sugerida

**Opção 1: Página Única (RECOMENDADO - Igual ao sistema antigo)**

```
src/pages/importacao/
└── index.vue  ← ÚNICA PÁGINA
```

```vue
<!-- 📁 src/pages/importacao/index.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1>📥 Importação Unimed Cuiabá</h1>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="mes"
              :items="meses"
              label="Mês"
              item-title="nome"
              item-value="valor"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="ano"
              :items="anos"
              label="Ano"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          size="large"
          :loading="carregando"
          @click="importarPeriodoCompleto"
        >
          <v-icon left>mdi-cloud-download</v-icon>
          Importar Unimed Cuiabá
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Progress/Log -->
    <v-card v-if="logs.length > 0" class="mt-4">
      <v-card-title>📋 Log de Importação</v-card-title>
      <v-card-text>
        <v-timeline density="compact">
          <v-timeline-item
            v-for="(log, index) in logs"
            :key="index"
            :color="log.tipo === 'erro' ? 'error' : 'success'"
            size="small"
          >
            {{ log.mensagem }}
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ImportacaoHttp from "@/services/http/Importacao";

const importacaoHttp = new ImportacaoHttp();

const mes = ref("02"); // Fevereiro (atual)
const ano = ref("2026");
const carregando = ref(false);
const logs = ref<Array<{ tipo: string; mensagem: string }>>([]);

const meses = [
  { nome: "Janeiro", valor: "01" },
  { nome: "Fevereiro", valor: "02" },
  { nome: "Março", valor: "03" },
  { nome: "Abril", valor: "04" },
  { nome: "Maio", valor: "05" },
  { nome: "Junho", valor: "06" },
  { nome: "Julho", valor: "07" },
  { nome: "Agosto", valor: "08" },
  { nome: "Setembro", valor: "09" },
  { nome: "Outubro", valor: "10" },
  { nome: "Novembro", valor: "11" },
  { nome: "Dezembro", valor: "12" },
];

const anos = computed(() => {
  const anoAtual = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(anoAtual - i));
});

async function importarPeriodoCompleto() {
  carregando.value = true;
  logs.value = [];

  try {
    // ✅ SE API TIVER ENDPOINT UNIFICADO (Opção A)
    logs.value.push({ tipo: "info", mensagem: "📥 Iniciando importação..." });

    const resultado = await importacaoHttp.importarPeriodoCompleto({
      mes: mes.value,
      ano: ano.value,
    });

    logs.value.push({
      tipo: "sucesso",
      mensagem: `✅ CNPJ: ${resultado.resumo.cnpj.totalImportado} registros importados`,
    });

    logs.value.push({
      tipo: "sucesso",
      mensagem: `✅ Contrato: ${resultado.resumo.contrato.totalImportado} registros importados`,
    });

    logs.value.push({
      tipo: "sucesso",
      mensagem: `🎉 Total: ${resultado.resumo.totalGeral} registros importados com sucesso!`,
    });

    // Erros (se houver)
    [
      ...resultado.resumo.cnpj.erros,
      ...resultado.resumo.contrato.erros,
    ].forEach((erro) => {
      logs.value.push({ tipo: "erro", mensagem: `⚠️ ${erro}` });
    });
  } catch (error: any) {
    logs.value.push({
      tipo: "erro",
      mensagem: `❌ Erro: ${error.response?.data?.message || error.message}`,
    });
  } finally {
    carregando.value = false;
  }
}
</script>
```

**Service HTTP:**

```typescript
// 📁 src/services/http/Importacao/index.ts

export interface ImportarPeriodoParams {
  mes: string; // "01", "02"
  ano: string; // "2026"
}

export interface ImportacaoCompletaResponse {
  sucesso: boolean;
  periodo: string;
  resumo: {
    cnpj: {
      totalImportado: number;
      empresasProcessadas: number;
      erros: string[];
    };
    contrato: {
      totalImportado: number;
      contratosProcessados: number;
      erros: string[];
    };
    totalGeral: number;
  };
  timestamp: string;
}

export default class ImportacaoHttp extends BaseHttp<ImportacaoCompletaResponse> {
  resource(): string {
    return "/importacao";
  }

  /**
   * POST /importacao/importar-periodo
   * Importa dados completos (CNPJ + Contrato) de um período
   */
  async importarPeriodoCompleto(params: ImportarPeriodoParams) {
    return this.http.post<ImportacaoCompletaResponse>(
      `${this.resource()}/importar-periodo`,
      params,
    );
  }

  // ✅ Manter métodos separados para casos específicos
  async importarPorCnpj(params: ImportarCnpjParams) {
    return this.http.post(`${this.resource()}/cnpj`, params);
  }

  async importarPorContrato(params: ImportarContratoParams) {
    return this.http.post(`${this.resource()}/contrato`, params);
  }

  async importarResumo(params: any) {
    return this.http.post(`${this.resource()}/resumo`, params);
  }
}
```

---

**Opção 2: Manter 3 Páginas + Adicionar Página Unificada (Transição)**

```
src/pages/importacao/
├── index.vue       ← Página unificada (NOVA - principal)
├── cnpj.vue        ← Página específica (manter para casos especiais)
└── contrato.vue    ← Página específica (manter para casos especiais)
```

**Vantagem:** Flexibilidade para importações específicas quando necessário

---

### 3️⃣ **Router**

```typescript
// 📁 src/router/index.ts

const routes = [
  {
    path: "/",
    redirect: "/importacao", // ← Redireciona para importação principal
  },
  {
    path: "/importacao",
    name: "importacao",
    component: () => import("@/pages/importacao/index.vue"), // ← Página unificada
  },
  // Páginas específicas (opcional - manter se precisar de importações individuais)
  {
    path: "/importacao/cnpj",
    name: "importacao-cnpj",
    component: () => import("@/pages/importacao/cnpj.vue"),
  },
  {
    path: "/importacao/contrato",
    name: "importacao-contrato",
    component: () => import("@/pages/importacao/contrato.vue"),
  },
  // ...outras rotas
];
```

---

## 📝 Resumo das Mudanças

### Backend (API-Unimed)

| Arquivo                                                                      | Ação      | Descrição                                              |
| ---------------------------------------------------------------------------- | --------- | ------------------------------------------------------ |
| `src/application/dtos/importacao/importar-periodo.dto.ts`                    | ✅ CRIAR  | DTO para importação completa                           |
| `src/application/use-cases/importacao/importar-periodo-completo.use-case.ts` | ✅ CRIAR  | Orquestra CNPJ + Contrato + Resumo                     |
| `src/presentation/controllers/importacao.controller.ts`                      | ✅ EDITAR | Adicionar endpoint `POST /importacao/importar-periodo` |

### Frontend (spa-planos-saude)

| Arquivo                                 | Ação        | Descrição                                            |
| --------------------------------------- | ----------- | ---------------------------------------------------- |
| `src/pages/importacao/index.vue`        | ✅ EDITAR   | Transformar em página unificada (form + botão + log) |
| `src/services/http/Importacao/index.ts` | ✅ EDITAR   | Adicionar método `importarPeriodoCompleto()`         |
| `src/pages/importacao/cnpj.vue`         | ⚠️ OPCIONAL | Manter para importações específicas                  |
| `src/pages/importacao/contrato.vue`     | ⚠️ OPCIONAL | Manter para importações específicas                  |

---

## 🎯 Plano de Implementação Recomendado

### Fase 1: Backend (4-6 horas)

1. ✅ Criar `ImportarPeriodoDto` (30 min)
2. ✅ Criar `ImportarPeriodoCompletoUseCase` (2h)
3. ✅ Adicionar endpoint no `ImportacaoController` (1h)
4. ✅ Testes unitários (2h)

### Fase 2: Frontend (3-4 horas)

1. ✅ Atualizar `ImportacaoHttp` service (30 min)
2. ✅ Implementar `src/pages/importacao/index.vue` completa (2h)
3. ✅ Testes manuais (1h)

### Fase 3: Validação (1 hora)

1. ✅ Testar fluxo completo (importação CNPJ + Contrato)
2. ✅ Validar logs e mensagens de erro
3. ✅ Confirmar com usuário

---

## ✅ Resultado Final

### Fluxo do Usuário (Igual ao Sistema Antigo)

```
1. Usuário acessa /importacao
2. Seleciona: Mês = Fevereiro, Ano = 2026
3. Clica em "Importar Unimed Cuiabá"
4. Sistema faz TUDO automaticamente:
   ├─> Importa por CNPJ (todas as empresas ativas)
   ├─> Importa por Contrato (todos os contratos ativos)
   ├─> Executa resumo (procedure)
   └─> Exibe log detalhado
5. FIM ✅
```

**Tempo total:** ~8-10 horas de desenvolvimento

**Benefícios:**

- ✅ UX igual ao sistema antigo (1 botão)
- ✅ Clean Architecture mantida
- ✅ Reutilização de código
- ✅ Facilita manutenção futura
- ✅ Flexibilidade (endpoints separados ainda existem)

---

## 🔍 Considerações Técnicas

### Performance

**Sistema Antigo (PHP):**

- Importação síncrona (bloqueia request até terminar)
- Timeout de 5-10 minutos

**Sistema Novo (Sugestão):**

- ⚠️ **Importação síncrona simples** (para MVP - igual ao antigo)
- 🚀 **Futuro:** Implementar processamento assíncrono:
  - Job queue (Bull/Redis)
  - WebSocket para progresso em tempo real
  - Endpoint: `GET /importacao/status/:jobId`

### Transações

```typescript
// Use-case deve garantir:
try {
  await importarPorCnpj(); // ✅ Sucesso
  await importarPorContrato(); // ❌ Falha
  await executarResumo(); // ⚠️ Não executaria
} catch (error) {
  // ⚠️ CNPJ já foi importado, mas Contrato falhou
  // Precisa de rollback?
}
```

**Solução:**

- ✅ Usar transações no banco (begin/commit/rollback)
- ✅ Cada método de importação já limpa dados antigos antes de inserir
- ✅ Se falhar, dados antigos permanecem (seguro)

---

## 📌 Conclusão

**Recomendação:** ✅ **Implementar Opção A (Endpoint Unificado)**

**Motivos:**

1. ✅ Replica comportamento do sistema antigo (1 botão)
2. ✅ Clean Architecture mantida (use-case orquestra outros use-cases)
3. ✅ Melhor UX (usuário não precisa executar 2 operações)
4. ✅ Tratamento de erro centralizado no backend
5. ✅ Facilita auditoria e logs
6. ✅ Preparado para evolução (job queue, WebSocket)

**Estrutura Final:**

```
API:
├─ POST /importacao/importar-periodo    ← NOVO (principal)
├─ POST /importacao/cnpj               ← Mantém (casos específicos)
└─ POST /importacao/contrato           ← Mantém (casos específicos)

Frontend:
└─ /importacao (página única com form + botão + log)
```

**Tempo:** ~8-10 horas
**Impacto:** 🟢 Alto valor para usuário (simplifica workflow)
