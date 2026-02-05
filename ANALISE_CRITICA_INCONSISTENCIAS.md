# 🚨 ANÁLISE CRÍTICA - INCONSISTÊNCIAS NOS MÓDULOS DE PROCESSOS E EXPORTAÇÃO

## ⚠️ RESUMO EXECUTIVO

Após análise profunda do módulo uni do npd-legacy versus implementações no api-unimed e spa-planos-saude, foram identificadas **GRAVES INCONSISTÊNCIAS** que comprometem a funcionalidade. Este documento lista todos os problemas encontrados.

**Data**: 5 de Fevereiro de 2026  
**Escopo**: Análise completa de inconsistências  
**Status**: 🔴 CRÍTICO - Múltiplos erros identificados

---

## 🔍 ANÁLISE DA TABELA GC.MCW_PROCESSO

### ✅ CAMPOS REAIS (npd-legacy)

Baseado na query do `UnimedDAO.php`, linha 785-810:

```sql
SELECT
  a.codigo,         -- VARCHAR2(10)  - PK: Ex: '90000001'
  a.categoria,      -- VARCHAR2(10)  - Ex: 'UNI', 'DIRF', 'GSV'
  a.procedure,      -- VARCHAR2(100) - Nome da procedure
  a.descricao,      -- VARCHAR2(200) - Ex: 'Exporta Unimed para Folha'
  a.ordem,          -- NUMBER        - Ordem de execução
  a.dias,           -- NUMBER        - Dias limite para execução
  a.usuario,        -- VARCHAR2(50)  - Último usuário que executou
  a.tipo_empresa,   -- CHAR(1)       - Tipo empresa (?)
  a.tipo_dado,      -- CHAR(1)       - 'S' ou 'C'
  a.ativo,          -- CHAR(1)       - 'S' ou 'N'
  -- + data_proc via subquery da mcw_processo_log
FROM gc.mcw_processo a
WHERE
  a.ativo = 'S'
  AND a.categoria = 'UNI'
  AND a.tipo_dado = 'C'
ORDER BY a.ordem_procedure
```

### ❌ CAMPOS INCORRETOS (api-unimed)

**Arquivo**: `src/infrastructure/repositories/processo.repository.ts`

```typescript
// ERRO 1: Interface ProcessoRow tem campo inexistente
interface ProcessoRow {
  TIPO_DE_DADO: 'S' | 'C';  // ❌ CAMPO NÃO EXISTE!
}

// ERRO 2: Query usa campo inexistente
SELECT tipo_de_dado  // ❌ CAMPO CORRETO: tipo_dado
FROM gc.mcw_processo

// ERRO 3: Campos ausentes importantes
// ❌ FALTA: procedure
// ❌ FALTA: usuario
// ❌ FALTA: tipo_empresa
```

### 🔧 CORREÇÃO NECESSÁRIA

```typescript
interface ProcessoRow {
  CODIGO: string;
  CATEGORIA: string;
  PROCEDURE: string; // ✅ ADICIONAR
  DESCRICAO: string;
  ORDEM: number;
  DIAS: number;
  USUARIO: string; // ✅ ADICIONAR
  TIPO_EMPRESA: string; // ✅ ADICIONAR
  TIPO_DADO: "S" | "C"; // ✅ CORRIGIR NOME
  ATIVO: "S" | "N";
}
```

---

## 🚨 DESCOBERTA CRÍTICA: ESTRUTURA REAL DO MODAL

### ✅ ESTRUTURA REAL DO NPD-LEGACY

**Arquivo**: `npd-legacy/js/com/uni/Unimed.js`, linha 78-106

```javascript
$(".btnadm").click(function () {
  $("#modalProcessos").html("Processamento de Exportação");
  Unimed.ModalProcessar();
  $("#categoria").val("UNI"); // ✅ CATEGORIA FIXA = 'UNI'
  $("#tipo").val("U"); // ✅ TIPO FIXO = 'U' (NÃO 'C'!)
});

function ModalProcessar() {
  // 1. Campos básicos
  Funcoes._dropDown(
    "proc_mes",
    "npd_mes",
    "cod_mes",
    "curto",
    "",
    Funcoes.mesAtual,
    "cod_mes",
    "",
  );
  Funcoes._dropDown(
    "proc_ano",
    "npd_ano",
    "cod_ano",
    "cod_ano",
    "",
    Funcoes.anoAtual,
    "cod_ano",
    "",
  );

  // 2. ESTRUTURA REAL: Empresa → Bandeira (automático)
  Empresas._loadEmpresaGCBand("proc_emp", "", "", "", "", "");
  Empresas._loadBandeiraGC("proc_band", "", "", "", "");

  // 3. ORDEM CORRETA: Bandeira altera empresas disponíveis
  $("#proc_band").change(function () {
    Empresas._loadEmpresaGCBand("proc_emp", "", "", "", "", $(this).val());
  });

  // 4. Empresa altera colaboradores disponíveis
  $("#proc_emp").click(function () {
    Empresas._loadColaboradoresBandGC(
      $(this).val(),
      "proc_colab",
      "",
      "",
      "S",
      "",
      "",
      "",
    );
  });

  // 5. Carrega processos com parâmetros FIXOS
  setTimeout(function () {
    Unimed.carregarDadosMCW(); // categoria='UNI', tipo='U'
  }, 2000);
}
```

### ✅ FUNÇÃO carregarDadosMCW (REAL)

**Arquivo**: `npd-legacy/js/com/uni/Unimed.js`, linha 131-185

```javascript
function carregarDadosMCW() {
  $.ajax({
    type: "POST",
    url: Unimed.url,
    data: {
      acao: "Buscarprocesso",
      categ: $("#categoria").val(), // SEMPRE 'UNI'
      mes: $("#proc_mes").val(),
      ano: $("#proc_ano").val(),
      tipo: $("#tipo").val(), // SEMPRE 'U' (NÃO 'C'!)
    },
    success: function (json) {
      // Cria checkboxes para MÚLTIPLOS processos
      $.each(json.dados, function (i, obj) {
        if (obj.PROCEDURE != "---") {
          // ✅ CAMPO 'PROCEDURE' EXISTE
          div +=
            '<input type="checkbox" name="processo[]" value="' +
            obj.CODIGO +
            '">';
          div += "<label>" + obj.DESCRICAO + "</label>";
        }

        // ✅ EXIBE: DATA_PROC e USUARIO
        if (obj.DATA_PROC !== null) {
          div += "Alterado em " + obj.DATA_PROC + " Usuario: " + obj.USUARIO;
        }
      });
    },
  });
}
```

### 🚨 ERROS CRÍTICOS IDENTIFICADOS

#### 1. **TIPO DE DADO INCORRETO**

- ❌ **Nossa implementação**: `tipo = 'C'`
- ✅ **NPD-Legacy real**: `tipo = 'U'`

#### 2. **FLUXO DE FILTROS INVERTIDO**

- ❌ **Nossa implementação**: Bandeira → Empresa
- ✅ **NPD-Legacy real**: Bandeira → Empresa (bandeira altera empresas)

#### 3. **CHECKBOXES vs RADIO**

- ❌ **Nossa implementação**: Radio buttons (um processo)
- ✅ **NPD-Legacy real**: Checkboxes (múltiplos processos)

#### 4. **CAMPOS AUSENTES CRÍTICOS**

- ❌ **Nossa implementação**: Falta campo `procedure`
- ❌ **Nossa implementação**: Falta campo `usuario`
- ✅ **NPD-Legacy**: Tem ambos os campos

---

### ❌ IMPLEMENTAÇÃO INCORRETA (spa-planos-saude)

**Arquivo**: `src/pages/importacao/index.vue`

```typescript
// ERRO: Bandeiras inventadas que não existem
const bandeiras = [
  { codigo: "U", nome: "Unimed", cor: "green" }, // ❌ NÃO EXISTE
  { codigo: "G", nome: "GSV", cor: "blue" }, // ❌ NÃO EXISTE
  { codigo: "S", nome: "SAN", cor: "orange" }, // ❌ NÃO EXISTE
];
```

### ✅ REALIDADE DO NPD-LEGACY

**Arquivo**: `npd-legacy/js/com/uni/Unimed.js`, linha 93

```javascript
// Único campo de bandeira encontrado
Empresas._loadBandeiraGC("proc_band", "", "", "", "");
```

**Análise**: O campo `proc_band` carrega bandeiras das empresas via `_loadBandeiraGC()`, mas **NÃO há bandeiras hardcoded U/G/S**. As bandeiras são **códigos numéricos das empresas** (1, 2, 3, etc.).

**Controller**: `UnimedController.php`, linha 601

```php
$bandeira = empty($_POST['proc_band']) === true ? 'T' : $_POST['proc_band'];
```

**Conclusão**: Bandeiras são **códigos de banda das empresas**, não siglas U/G/S inventadas.

---

## 🚨 PROBLEMA 2: CATEGORIA INCORRETA

### ❌ IMPLEMENTAÇÃO INCORRETA (api-unimed)

**Arquivo**: `src/services/http/Exportacao/index.ts`

```typescript
// ERRO: Mapeamento inventado
if (filtroBandeira.value === "G") categoria = "GSV"; // ❌ INVENTADO
if (filtroBandeira.value === "S") categoria = "SAN"; // ❌ INVENTADO
```

### ✅ REALIDADE DO NPD-LEGACY

**Análise da tabela gc.mcw_processo**:

```sql
-- Categorias reais encontradas no npd-legacy
a.categoria = 'UNI'   -- ✅ ÚNICA CATEGORIA PARA UNIMED
-- Não há 'GSV', 'SAN' na tabela
```

**JavaScript**: `Unimed.js`, linha 141

```javascript
data: {
  acao: 'Buscarprocesso',
  categ: $("#categoria").val(),  // Sempre 'UNI' para módulo uni
  mes: $("#proc_mes").val(),
  ano: $("#proc_ano").val(),
  tipo: $("#tipo").val()         // 'C' ou 'S'
}
```

**Conclusão**: Categoria é **SEMPRE 'UNI'** no módulo uni. Não existem GSV/SAN.

---

## 🚨 PROBLEMA 3: INTERFACE EXPORTAÇÃO INCORRETA

### ❌ IMPLEMENTAÇÃO INCORRETA (spa-planos-saude)

**Arquivo**: `src/services/http/Exportacao/index.ts`

```typescript
// ERRO: Interface não corresponde ao backend
export interface ExportarTotvsParams {
  codigoProcesso: string; // ✅ CORRETO
  mesRef: number; // ❌ DEVERIA SER STRING
  anoRef: number; // ❌ DEVERIA SER STRING
  bandeira?: string; // ❌ CAMPO INEXISTENTE NO BACKEND
  empresa?: string; // ❌ CAMPO INEXISTENTE NO BACKEND
  // ❌ FALTA: codEmpresa (number)
  // ❌ FALTA: codColigada (number)
}
```

### ✅ REALIDADE DO BACKEND (api-unimed)

**Arquivo**: `src/application/dtos/exportacao/exportar-para-totvs.dto.ts`

```typescript
export class ExportarParaTOTVSDto {
  @IsInt()
  mesRef: number; // ✅ É NUMBER no backend

  @IsInt()
  anoRef: number; // ✅ É NUMBER no backend

  @IsString()
  codigoProcesso: string; // ✅ CORRETO

  @IsOptional()
  @IsString()
  bandeira?: string; // ❌ EXISTE MAS NÃO USADO NO USE CASE

  @IsOptional()
  @IsString()
  empresa?: string; // ❌ EXISTE MAS NÃO USADO NO USE CASE

  // ❌ INTERFACE FRONTEND NÃO TEM CAMPOS OBRIGATÓRIOS
}
```

---

## 🚨 PROBLEMA 4: LÓGICA DE EMPRESAS INCORRETA

### ❌ IMPLEMENTAÇÃO INCORRETA (spa-planos-saude)

```typescript
// ERRO: Filtro por bandeira inventada
const empresasDaBandeira = empresas.value.filter((emp) => {
  const bandeiraCod = emp.codBand?.toString();
  if (filtroBandeira.value === "U") return bandeiraCod === "3"; // ❌ INVENTADO
  if (filtroBandeira.value === "G") return bandeiraCod === "1"; // ❌ INVENTADO
  if (filtroBandeira.value === "S") return bandeiraCod === "2"; // ❌ INVENTADO
  return false;
});
```

### ✅ REALIDADE DO NPD-LEGACY

**Arquivo**: `UnimedController.php`, linha 618-627

```php
// Lógica real do legacy
if ($empresa != 'T') {
  @$Empresa->setSigla($empresa);  // Empresa por SIGLA (AF, BM, etc)
  $Unimed->setCodempresa($EmpresaDAO->_isCodEmpresaGC());
  $Unimed->setCodband($EmpresaDAO->_isGetBandeiraGC());  // Bandeira VEM DA EMPRESA
} else {
  $Unimed->setCodband($bandeira);  // Bandeira informada pelo usuário
}
```

**Conclusão**: Bandeira é **OBTIDA DA EMPRESA SELECIONADA**, não filtro principal.

---

## 🚨 PROBLEMA 5: CHAMADA DE PROCEDURE INCORRETA

### ❌ IMPLEMENTAÇÃO INCORRETA (api-unimed)

**Arquivo**: `src/application/use-cases/exportacao/exportar-para-totvs.use-case.ts`

```typescript
// ERRO: Parâmetros incorretos ou ausentes
await this.databaseService.executeQuery(query, {
  codigo: codigoProcesso,
  mesRef,
  anoRef,
  previa: flagPrevia,
  apagar: flagApagar,
  usuario,
  todas: "N", // ❌ HARDCODED - DEVERIA SER DINÂMICO
  codEmpresa: String(codEmpresa),
  bandeira,
  tipo, // ❌ CAMPO AUSENTE NO DTO
  categoria, // ❌ CAMPO AUSENTE NO DTO
  cpf: cpf || null,
});
```

### ✅ REALIDADE DO NPD-LEGACY

**Arquivo**: `UnimedDAO.php`, linha 824-838

```php
$query = "begin GC.PGK_GLOBAL.P_MCW_FECHA_COMISSAO_GLOBAL(
  '{$value}',                                  // :codigo
  '" . $this->Unimed->getMesref() . "',        // :mesRef (STRING!)
  '" . $this->Unimed->getAnoref() . "',        // :anoRef (STRING!)
  'N',                                          // :previa (HARDCODED 'N')
  '" . $this->Unimed->getApaga() . "',         // :apaga
  '" . $this->Unimed->getUser() . "',          // :usuario
  '" . $this->Unimed->getTodasEmpresas() . "', // :todas (DINÂMICO!)
  '" . $this->Unimed->getCodempresa() . "',    // :codEmpresa
  '" . $this->Unimed->getCodband() . "',       // :bandeira
  '" . $this->Unimed->getTipodeDado() . "',    // :tipo
  '" . $this->Unimed->getCategoria() . "',     // :categoria
  '" . $this->Unimed->getCpf() . "'            // :cpf
); end;";
```

**Diferenças críticas**:

- ❌ `mesRef`/`anoRef` são **STRINGS** no legacy, **NUMBERS** no NestJS
- ❌ `todas` é **HARDCODED 'N'** no NestJS, **DINÂMICO** no legacy
- ❌ `tipo` e `categoria` **AUSENTES** no DTO do NestJS

---

## 🚨 PROBLEMA 6: ESTRUTURA DE DADOS INCORRETA

### ❌ IMPLEMENTAÇÃO INCORRETA (api-unimed)

**Arquivo**: `src/application/dtos/exportacao/listar-processos.dto.ts`

```typescript
export class ProcessoResponseDto {
  // ❌ CAMPOS AUSENTES:
  // procedure: string;
  // usuario: string;
  // tipoEmpresa: string;

  // ❌ CAMPO COM NOME INCORRETO:
  tipoDado: string; // DEVERIA SER: tipoDeDado (underscore)
}
```

---

## 🚨 PROBLEMA 7: MODAL DE EXPORTAÇÃO COMPLETAMENTE ERRADO

### ❌ IMPLEMENTAÇÃO INCORRETA (spa-planos-saude)

**Problemas identificados**:

1. **Bandeiras inventadas** (U/G/S não existem)
2. **Filtro por bandeira como primary** (deveria ser empresa)
3. **Radio buttons** (legacy permite múltiplos processos)
4. **Campos ausentes**: tipo de dado, categoria
5. **Validações incorretas**

### ✅ ESTRUTURA CORRETA DO LEGACY

**Interface real**: `npd-legacy/js/com/uni/Unimed.js`, linha 86-106

```javascript
function ModalProcessar() {
  // 1. Mês e Ano
  Funcoes._dropDown(
    "proc_mes",
    "npd_mes",
    "cod_mes",
    "curto",
    "",
    Funcoes.mesAtual,
    "cod_mes",
    "",
  );
  Funcoes._dropDown(
    "proc_ano",
    "npd_ano",
    "cod_ano",
    "cod_ano",
    "",
    Funcoes.anoAtual,
    "cod_ano",
    "",
  );

  // 2. Empresa (PRIMARY FILTER)
  Empresas._loadEmpresaGCBand("proc_emp", "", "", "", "", "");

  // 3. Bandeira (SECONDARY - depends on empresa)
  Empresas._loadBandeiraGC("proc_band", "", "", "", "");

  // 4. Colaboradores (depends on empresa)
  $("#proc_emp").click(function () {
    Empresas._loadColaboradoresBandGC(
      $(this).val(),
      "proc_colab",
      "",
      "",
      "S",
      "",
      "",
      "",
    );
  });

  // 5. Carrega processos baseado em categoria fixa
  setTimeout(function () {
    Unimed.carregarDadosMCW(); // categoria='UNI', tipo='C'
  }, 2000);
}
```

**Fluxo correto**:

1. Empresa → Bandeira (automático)
2. Empresa → Colaboradores (opcional)
3. Categoria = 'UNI' (fixo)
4. Tipo = 'C' (fixo)
5. Lista processos com checkboxes (múltiplos)

---

## 📋 LISTA DE CORREÇÕES NECESSÁRIAS

### 🔧 API-UNIMED (Backend)

#### 1. Corrigir Processo Repository

- [ ] ✅ Corrigir nome do campo: `tipo_de_dado` → `tipo_dado`
- [ ] ✅ Adicionar campos ausentes: `procedure`, `usuario`, `tipo_empresa`
- [ ] ✅ Atualizar interface `ProcessoRow`
- [ ] ✅ Corrigir query de seleção

#### 2. Corrigir DTO de Exportação

- [ ] ✅ Remover campos inventados: `bandeira`, `empresa`
- [ ] ✅ Adicionar campos obrigatórios: `categoria`, `tipo`
- [ ] ✅ Manter `mesRef`/`anoRef` como `number` (conversão no Use Case)

#### 3. Corrigir Use Case de Exportação

- [ ] ✅ Implementar lógica de `todas` dinâmico
- [ ] ✅ Converter `mesRef`/`anoRef` para string na procedure
- [ ] ✅ Adicionar parâmetros `categoria` e `tipo`
- [ ] ✅ Remover validação de empresa por sigla (usar código)

#### 4. Corrigir Controller de Exportação

- [ ] ✅ Atualizar swagger documentation
- [ ] ✅ Corrigir exemplo de request/response

### 🔧 SPA-PLANOS-SAUDE (Frontend)

#### 1. Remover Sistema de Bandeiras Inventado

- [ ] ✅ Remover dropdown de bandeiras U/G/S
- [ ] ✅ Remover lógica de filtro por bandeira
- [ ] ✅ Remover mapeamento bandeira → categoria

#### 2. Corrigir Interface de Exportação

- [ ] ✅ Usar empresa como filtro principal
- [ ] ✅ Buscar bandeira automaticamente da empresa
- [ ] ✅ Categoria fixa = 'UNI'
- [ ] ✅ Tipo fixo = 'C' (ou dropdown)

#### 3. Corrigir Lista de Processos

- [ ] ✅ Usar checkboxes (múltiplos processos)
- [ ] ✅ Remover radio buttons
- [ ] ✅ Carregar baseado apenas em categoria/tipo

#### 4. Atualizar Service HTTP

- [ ] ✅ Corrigir interface `ExportarTotvsParams`
- [ ] ✅ Remover campos inventados
- [ ] ✅ Adicionar campos corretos do DTO

#### 5. Refazer Modal de Exportação

- [ ] ✅ Estrutura: Empresa → Colaborador → Processos
- [ ] ✅ Remover campo bandeira
- [ ] ✅ Checkboxes para múltiplos processos
- [ ] ✅ Categoria/tipo fixos ou configuráveis

### 🔧 DOCUMENTAÇÃO

#### 1. Atualizar Documentos

- [ ] ✅ Corrigir `DOCUMENTACAO_MODAL_EXPORTACAO.md`
- [ ] ✅ Atualizar `ANALISE_EXPORTACAO_NPD_LEGACY.md`
- [ ] ✅ Criar documentação de migração

#### 2. Criar Testes

- [ ] ✅ Testes de integração com estrutura correta
- [ ] ✅ Testes de validação de campos
- [ ] ✅ Testes de regressão

---

## 🔍 CAUSA RAIZ DOS PROBLEMAS

### 1. **Análise Superficial do Legacy**

- Foram criados campos/conceitos que não existem
- Não foi feita análise linha por linha dos arquivos
- Assumiu-se estruturas sem validar no código real

### 2. **Lack de Validação com Database Real**

- Campos de tabela não foram validados
- Estrutura assumida sem consultar DDL ou dados

### 3. **Implementação Baseada em Suposições**

- Bandeiras U/G/S inventadas sem base no legacy
- Lógica de filtros criada do zero
- Interface não seguiu o padrão real

### 4. **Falta de Testes com Dados Reais**

- Não foram realizados testes com banco real
- Validações não foram executadas

---

## ⚡ PRIORIDADE DE CORREÇÃO

### 🔴 CRÍTICO (Impede funcionamento)

1. ✅ Corrigir campo `tipo_de_dado` → `tipo_dado`
2. ✅ Remover bandeiras U/G/S inventadas
3. ✅ Corrigir interface de exportação
4. ✅ Corrigir parâmetros da procedure

### 🟡 ALTO (Funcionalidade incorreta)

1. ✅ Implementar sistema de empresas correto
2. ✅ Múltiplos processos (checkboxes)
3. ✅ Lógica de `todas` dinâmico
4. ✅ Campos ausentes na estrutura

### 🟢 MÉDIO (Melhorias)

1. ✅ Documentação atualizada
2. ✅ Testes de regressão
3. ✅ Validações adicionais

---

## 🎯 CONCLUSÃO

Os módulos de **Processos** e **Exportação** foram implementados com base em **SUPOSIÇÕES INCORRETAS** sobre o funcionamento do npd-legacy.

**Estimativa de correção**:

- Backend: ~8-12 horas
- Frontend: ~12-16 horas
- Testes: ~4-6 horas
- **Total**: 24-34 horas de retrabalho

**Recomendação**: Pausar desenvolvimento de novas features até corrigir essas inconsistências fundamentais que comprometem a funcionalidade core do sistema.
