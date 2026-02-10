# 🛠️ PLANO DE IMPLEMENTAÇÃO - CORREÇÃO MÓDULO UNI

## 📋 VISÃO GERAL

**Data**: 5 de Fevereiro de 2026  
**Escopo**: Correção completa das inconsistências identificadas no módulo UNI  
**Projetos**: api-unimed + spa-planos-saude  
**Prioridade**: 🔴 CRÍTICA - Sistema não funciona corretamente

---

## 🔍 ANÁLISE DO ESTADO ATUAL

### ✅ BACKEND (api-unimed) - STATUS ATUAL

#### **Arquivos Identificados**:

- `src/domain/entities/processo.entity.ts` ✅ **CORRETO** (já tem campos certos)
- `src/infrastructure/repositories/processo.repository.ts` ❌ **INCORRETO**
- `src/presentation/controllers/processo.controller.ts` ✅ **OK** (não precisa alteração)

#### **Problemas Críticos Encontrados**:

1. **Interface ProcessoRow (linha 7-14)**:

   ```typescript
   // ❌ ATUAL (INCORRETO)
   interface ProcessoRow {
     CODIGO: string;
     DESCRICAO: string;
     CATEGORIA: string;
     ORDEM: number;
     DIAS: number;
     ATIVO: "S" | "N";
     TIPO_DE_DADO: "S" | "C"; // ❌ CAMPO INEXISTENTE
   }
   ```

2. **Query SQL (linha 60-70)**:

   ```sql
   -- ❌ ATUAL (INCORRETO)
   SELECT codigo, descricao, categoria, ordem, dias, ativo, tipo_de_dado
   FROM gc.mcw_processo
   ```

3. **Mapeamento Entity (linha 114-127)**:
   ```typescript
   // ❌ ATUAL (INCORRETO)
   new Processo(
     row.CODIGO,
     row.CATEGORIA,
     "", // ❌ procedure - não disponível nesta query
     row.DESCRICAO,
     row.ORDEM,
     row.DIAS,
     "", // ❌ usuario - não disponível nesta query
     "", // ❌ tipoEmpresa - não disponível nesta query
     row.TIPO_DE_DADO, // ❌ CAMPO INEXISTENTE
     row.ATIVO,
     null,
   );
   ```

### ✅ FRONTEND (spa-planos-saude) - STATUS ATUAL

#### **Arquivo Identificado**:

- `src/pages/importacao/index.vue` ❌ **MÚLTIPLOS ERROS**

#### **Problemas Críticos Encontrados**:

1. **Bandeiras Inventadas (linha 517-521)**:

   ```javascript
   // ❌ ATUAL (INCORRETO)
   const bandeiras = [
     { codigo: "U", nome: "Unimed", cor: "green" },
     { codigo: "G", nome: "GSV", cor: "blue" }, // ❌ NÃO EXISTE
     { codigo: "S", nome: "SAN", cor: "orange" }, // ❌ NÃO EXISTE
   ];
   ```

2. **Tipo Incorreto (linha 623)**:

   ```javascript
   // ❌ ATUAL (INCORRETO)
   tipoDado: "C", // ❌ DEVERIA SER "U" PARA UNI
   ```

3. **Radio Buttons vs Checkboxes (linha 315-322)**:

   ```vue
   <!-- ❌ ATUAL (INCORRETO) - Radio (um processo) -->
   <v-radio-group v-model="processoSelecionado">
     <v-radio :value="processo.codigo" />
   </v-radio-group>
   ```

4. **Fluxo Incorreto de Filtros (linha 230-280)**:
   - ❌ Bandeira → Empresa (incorreto)
   - ✅ Deveria ser: Empresa → Bandeira

---

## 🎯 PLANO DE EXECUÇÃO

### **FASE 1: CORREÇÕES CRÍTICAS BACKEND (30 min)**

#### 1.1. Corrigir Interface ProcessoRow

- **Arquivo**: `processo.repository.ts` linha 7-14
- **Ação**: Corrigir campos da interface
- **Prioridade**: 🔴 CRÍTICA

#### 1.2. Corrigir Query SQL

- **Arquivo**: `processo.repository.ts` linha 60-70
- **Ação**: Adicionar campos ausentes na query
- **Prioridade**: 🔴 CRÍTICA

#### 1.3. Corrigir Mapeamento Entity

- **Arquivo**: `processo.repository.ts` linha 110-130
- **Ação**: Mapear campos corretos do banco
- **Prioridade**: 🔴 CRÍTICA

### **FASE 2: CORREÇÕES CRÍTICAS FRONTEND (45 min)**

#### 2.1. Remover Bandeiras Inventadas

- **Arquivo**: `importacao/index.vue` linha 517-521
- **Ação**: Implementar estrutura real do npd-legacy
- **Prioridade**: 🔴 CRÍTICA

#### 2.2. Corrigir Tipo de Dado

- **Arquivo**: `importacao/index.vue` linha 623
- **Ação**: Alterar de "C" para "U"
- **Prioridade**: 🔴 CRÍTICA

#### 2.3. Implementar Checkboxes Múltiplos

- **Arquivo**: `importacao/index.vue` linha 315-322
- **Ação**: Radio → Checkboxes
- **Prioridade**: 🟠 ALTA

#### 2.4. Corrigir Fluxo de Filtros

- **Arquivo**: `importacao/index.vue` linha 230-280
- **Ação**: Empresa → Bandeira (igual npd-legacy)
- **Prioridade**: 🟠 ALTA

### **FASE 3: VALIDAÇÃO E TESTES (15 min)**

#### 3.1. Teste Manual da Query

- **Ação**: Executar query no banco Oracle
- **Prioridade**: 🟡 MÉDIA

#### 3.2. Teste do Endpoint

- **Ação**: Testar API via curl/Postman
- **Prioridade**: 🟡 MÉDIA

#### 3.3. Teste do Modal

- **Ação**: Validar funcionamento frontend
- **Prioridade**: 🟡 MÉDIA

---

## 📝 IMPLEMENTAÇÕES DETALHADAS

### 🔧 **BACKEND - CORREÇÕES**

#### **1. Interface ProcessoRow CORRETA**:

```typescript
interface ProcessoRow {
  CODIGO: string;
  CATEGORIA: string;
  PROCEDURE: string; // ➕ NOVO CAMPO
  DESCRICAO: string;
  ORDEM: number;
  DIAS: number;
  USUARIO: string; // ➕ NOVO CAMPO
  TIPO_EMPRESA: string; // ➕ NOVO CAMPO
  TIPO_DADO: "S" | "C" | "U"; // ✅ CORRIGIDO (não tipo_de_dado)
  ATIVO: "S" | "N";
}
```

#### **2. Query SQL CORRETA**:

```sql
SELECT
  codigo,
  categoria,
  procedure,      -- ➕ NOVO CAMPO
  descricao,
  ordem,
  dias,
  usuario,        -- ➕ NOVO CAMPO
  tipo_empresa,   -- ➕ NOVO CAMPO
  tipo_dado,      -- ✅ CORRIGIDO (não tipo_de_dado)
  ativo
FROM gc.mcw_processo
WHERE ativo = 'S'
  AND categoria = :categoria
  AND tipo_dado = :tipoDado  -- ✅ CORRIGIDO
ORDER BY ordem
```

#### **3. Mapeamento Entity CORRETO**:

```typescript
return rows.map(
  (row) =>
    new Processo(
      row.CODIGO,
      row.CATEGORIA,
      row.PROCEDURE, // ✅ CORRIGIDO
      row.DESCRICAO,
      row.ORDEM,
      row.DIAS,
      row.USUARIO, // ✅ CORRIGIDO
      row.TIPO_EMPRESA, // ✅ CORRIGIDO
      row.TIPO_DADO, // ✅ CORRIGIDO
      row.ATIVO,
      null, // dataUltimaExecucao - buscar de processo-log
    ),
);
```

### 🎨 **FRONTEND - CORREÇÕES**

#### **1. Estrutura Real do NPD-Legacy**:

```vue
<template>
  <!-- 1. Mês e Ano (primeiro) -->
  <v-select v-model="proc_mes" :items="meses" label="Mês *" />
  <v-select v-model="proc_ano" :items="anos" label="Ano *" />

  <!-- 2. Empresa (segundo) - carrega primeiro -->
  <v-select
    v-model="proc_emp"
    :items="empresas"
    label="Empresa *"
    @update:model-value="onEmpresaChange"
  />

  <!-- 3. Bandeira (terceiro) - baseado na empresa -->
  <v-select
    v-model="proc_band"
    :items="bandeirasDaEmpresa"
    :disabled="!proc_emp"
    label="Bandeira *"
  />

  <!-- 4. Colaborador (quarto) - baseado na empresa -->
  <v-select
    v-model="proc_colab"
    :items="colaboradores"
    label="Colaborador (opcional)"
  />

  <!-- 5. Processos (checkboxes para múltiplos) -->
  <v-checkbox
    v-for="processo in processos"
    :key="processo.codigo"
    v-model="processosSelecionados"
    :value="processo.codigo"
    :label="processo.descricao"
  />
</template>
```

#### **2. Lógica Correta**:

```typescript
// Parâmetros CORRETOS para busca
const parametrosBusca = {
  categoria: "UNI", // ✅ FIXO
  tipoDado: "U", // ✅ CORRETO (não 'C')
  mes: proc_mes.value,
  ano: proc_ano.value,
};

// Fluxo CORRETO: Empresa → Bandeira
const onEmpresaChange = () => {
  // Carrega bandeiras disponíveis para empresa selecionada
  loadBandeirasDaEmpresa(proc_emp.value);
  // Carrega colaboradores da empresa
  loadColaboradores(proc_emp.value);
};
```

---

## ⚡ SEQUÊNCIA DE EXECUÇÃO

### **Etapa 1**: Backend Repository (15 min)

1. Corrigir interface ProcessoRow
2. Corrigir query SQL
3. Corrigir mapeamento entity
4. Testar endpoint

### **Etapa 2**: Frontend Modal (30 min)

1. Remover bandeiras U/G/S
2. Implementar estrutura real empresa→bandeira
3. Trocar radio por checkboxes
4. Corrigir tipo 'C' → 'U'

### **Etapa 3**: Validação (15 min)

1. Teste manual query
2. Teste endpoint API
3. Teste modal frontend
4. Verificação funcional completa

---

## ✅ CRITÉRIOS DE SUCESSO

- [ ] Query executa sem erro no Oracle
- [ ] Endpoint `/processos/disponiveis?categoria=UNI&tipoDado=U` retorna dados
- [ ] Modal carrega empresas reais (não bandeiras inventadas)
- [ ] Possível selecionar múltiplos processos
- [ ] Fluxo empresa → bandeira funciona
- [ ] Dados enviados para execução estão corretos

---

## 🚨 RISCOS IDENTIFICADOS

1. **Dependências**: Outros módulos podem usar ProcessoRow incorreta
2. **Cache**: Pode ter cache do frontend com dados incorretos
3. **Banco**: Query pode falhar se campos não existirem
4. **Testes**: Testes unitários podem quebrar com mudanças

---

## 📚 REFERÊNCIAS

- **NPD-Legacy**: `npd-legacy/com/modules/uni/model/UnimedDAO.php` (linha 785-810)
- **NPD-Legacy JS**: `npd-legacy/js/com/uni/Unimed.js` (linha 78-185)
- **Análise Crítica**: `ANALISE_CRITICA_INCONSISTENCIAS.md`
- **Lista Correções**: `CORRECOES_NECESSARIAS.md`

**Conclusão**: Implementação atual foi baseada em suposições. Agora temos o mapeamento real do npd-legacy para implementar corretamente.
