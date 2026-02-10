# 🚨 LISTA DE CORREÇÕES NECESSÁRIAS - MÓDULO UNI

## 1. BACKEND (api-unimed) - URGENTE

### ✅ Corrigir Interface ProcessoRow

```typescript
// ANTES (INCORRETO):
interface ProcessoRow {
  CODIGO: string;
  CATEGORIA: string;
  DESCRICAO: string;
  ORDEM: number;
  DIAS: number;
  ATIVO: string;
  TIPO_DE_DADO: "S" | "C"; // ❌ CAMPO NÃO EXISTE
}

// DEPOIS (CORRETO):
interface ProcessoRow {
  CODIGO: string;
  CATEGORIA: string;
  PROCEDURE: string; // ➕ CAMPO OBRIGATÓRIO
  DESCRICAO: string;
  ORDEM: number;
  DIAS: number;
  USUARIO: string; // ➕ CAMPO OBRIGATÓRIO
  TIPO_EMPRESA: string; // ➕ CAMPO OBRIGATÓRIO
  TIPO_DADO: "S" | "C"; // ✅ CORRIGIDO: tipo_dado (não tipo_de_dado)
  ATIVO: string;
}
```

### ✅ Corrigir Query SQL

```sql
-- ANTES (INCORRETO):
SELECT codigo, categoria, descricao, ordem, dias, ativo, tipo_de_dado

-- DEPOIS (CORRETO):
SELECT codigo, categoria, procedure, descricao, ordem, dias,
       usuario, tipo_empresa, tipo_dado, ativo
```

### ✅ Corrigir Parâmetros de Busca

```typescript
// ANTES (INCORRETO):
findProcessosUni(tipo: 'C' | 'S')

// DEPOIS (CORRETO):
findProcessosUni(tipo: 'U')  // SEMPRE 'U' para UNI
```

---

## 2. FRONTEND (spa-planos-saude) - CRÍTICO

### ❌ REMOVER: Bandeiras Inventadas

```vue
<!-- REMOVER COMPLETAMENTE: -->
const bandeiras = [ { value: 'U', label: 'Unimed' }, { value: 'G', label: 'GSV'
}, { value: 'S', label: 'SAN' } ];
```

### ✅ IMPLEMENTAR: Estrutura Real

```vue
<template>
  <!-- 1. MÊS E ANO -->
  <v-select v-model="proc_mes" :items="meses" />
  <v-select v-model="proc_ano" :items="anos" />

  <!-- 2. EMPRESA (PRIMEIRO) -->
  <v-select
    v-model="proc_emp"
    :items="empresas"
    @update:model-value="onEmpresaChange"
  />

  <!-- 3. BANDEIRA (SEGUNDO, BASEADO NA EMPRESA) -->
  <v-select v-model="proc_band" :items="bandeiras" :disabled="!proc_emp" />

  <!-- 4. COLABORADOR -->
  <v-select v-model="proc_colab" :items="colaboradores" />

  <!-- 5. PROCESSOS (CHECKBOXES - NÃO RADIO) -->
  <v-checkbox
    v-for="processo in processos"
    :key="processo.codigo"
    v-model="processosSelecionados"
    :value="processo.codigo"
    :label="processo.descricao"
  />
</template>
```

### ✅ Lógica Correta dos Filtros

```typescript
// 1. Parâmetros fixos (sempre UNI)
const parametrosBusca = {
  categoria: "UNI",
  tipo: "U", // ✅ CORRETO (não 'C')
  mes: proc_mes.value,
  ano: proc_ano.value,
};

// 2. Fluxo: Empresa → Bandeira → Colaborador
const onEmpresaChange = () => {
  // Carrega bandeiras da empresa selecionada
  loadBandeiras(proc_emp.value);
};

const onBandeiraChange = () => {
  // Carrega colaboradores da bandeira
  loadColaboradores(proc_band.value);
};
```

### ✅ Múltiplos Processos

```typescript
// ANTES (INCORRETO): processo.value = string
// DEPOIS (CORRETO): processosSelecionados.value = string[]

const executarProcessos = () => {
  processosSelecionados.value.forEach((codigo) => {
    // Executa cada processo selecionado
    executeProcesso(codigo);
  });
};
```

---

## 3. TESTES E VALIDAÇÃO

### ✅ Testar Query Manualmente

```sql
-- Validar se query funciona:
SELECT codigo, categoria, procedure, descricao, ordem, dias,
       usuario, tipo_empresa, tipo_dado, ativo
FROM gc.mcw_processo
WHERE ativo = 'S'
  AND categoria = 'UNI'
  AND tipo_dado = 'U'  -- ✅ 'U' não 'C'
ORDER BY ordem;
```

### ✅ Validar Endpoint

```bash
# Testar se retorna dados corretos:
curl -X GET "http://localhost:3000/processos/uni?tipo=U"
```

### ✅ Testar Modal

1. Abrir modal de exportação
2. Verificar se carrega empresas reais
3. Selecionar empresa → deve carregar bandeiras
4. Verificar se processos aparecem como checkboxes
5. Testar seleção múltipla

---

## 4. PRIORIDADES DE IMPLEMENTAÇÃO

1. **🔴 URGENTE**: Corrigir campo `tipo_de_dado` → `tipo_dado` no backend
2. **🔴 URGENTE**: Corrigir tipo 'C' → 'U' nos parâmetros de busca
3. **🟠 ALTO**: Adicionar campos `procedure`, `usuario`, `tipo_empresa`
4. **🟠 ALTO**: Remover bandeiras inventadas do frontend
5. **🟡 MÉDIO**: Implementar checkboxes para múltiplos processos
6. **🟡 MÉDIO**: Corrigir fluxo empresa → bandeira

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Query SQL executada manualmente com sucesso
- [ ] Interface ProcessoRow corrigida
- [ ] Endpoint retorna dados corretos
- [ ] Modal carrega empresas reais
- [ ] Fluxo empresa → bandeira funciona
- [ ] Processos aparecem como checkboxes
- [ ] Seleção múltipla funciona
- [ ] Parâmetros corretos enviados (tipo='U')
- [ ] Documentação atualizada

---

## 📝 ORIGEM DOS ERROS

1. **Backend**: Baseado em assumir campos sem verificar tabela real
2. **Frontend**: Inventado bandeiras sem base no npd-legacy
3. **Tipo de Dado**: Confundido 'C'/'S' com 'U' (específico do UNI)
4. **Interface**: Radio buttons não suporta múltiplos processos

**Conclusão**: Implementação foi baseada em suposições, não na análise real do npd-legacy.
