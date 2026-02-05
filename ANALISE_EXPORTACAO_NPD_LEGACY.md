# 🔍 ANÁLISE PROFUNDA - EXPORTAÇÃO NPD-LEGACY VS IMPLEMENTAÇÃO ATUAL

## 📋 RESUMO EXECUTIVO

**Data**: 5 de Fevereiro de 2026  
**Escopo**: Análise detalhada da exportação Unimed no npd-legacy  
**Status**: 🔴 MÚLTIPLAS INCONSISTÊNCIAS IDENTIFICADAS

---

## 🕵️ DESCOBERTAS CRÍTICAS DO NPD-LEGACY

### ✅ **1. ESTRUTURA REAL DOS CAMPOS OBRIGATÓRIOS**

**Arquivo**: `UnimedController.php`, caso 'Execute' (linha 588-650)

#### **Campos Obrigatórios REAL**:

- ✅ **Mês** (`proc_mes`) - Obrigatório
- ✅ **Ano** (`proc_ano`) - Obrigatório
- ✅ **Processo(s)** (`processo[]`) - Obrigatório (array de processos)

#### **Campos Opcionais REAL**:

- 🟡 **Bandeira** (`proc_band`) - Opcional (padrão: 'T' = Todas)
- 🟡 **Empresa** (`proc_emp`) - Opcional (padrão: 'T' = Todas)
- 🟡 **Colaborador** (`proc_colab`) - Opcional (padrão: '' = Todos)

```php
// ✅ VALIDAÇÃO REAL DO NPD-LEGACY
$erro .= $Unimed->getMesRef() === 0 ? "Necessario selecionar o mes<br>" : "";
$erro .= $Unimed->getAnoRef() === 0 ? "Necessario selecionar o ano<br>" : "";
$erro .= $processo === '' ? "INDICAR  os processos que serão executados<br>" : "";

// ✅ TRATAMENTO DE CAMPOS OPCIONAIS
$bandeira = empty($_POST['proc_band']) === true ? 'T' : $_POST['proc_band'];
$empresa  = empty($_POST['proc_emp']) === true  ? 'T' : $_POST['proc_emp'];
$colab    = empty($_POST['proc_colab']) === true  ? '' : $_POST['proc_colab'];
```

### ✅ **2. SEGUIMENTO (BANDEIRAS) - TABELA gc.TIPO_BANDEIRA**

**Arquivo**: `EmpresaController.php`, caso 'CarregarBandeiraGC' (linha 1031)

#### **Query Real**:

```sql
SELECT cod_band, descricao
FROM gc.tipo_bandeira
```

#### **Estrutura da Tabela** (conforme imagem 2):

- `COD_BAND`: Código da bandeira (2, 4, 6, etc.)
- `DESCRICAO`: Descrição (2 Rodas, 4 Rodas, Fazenda(s), Seguradora)
- `AZ_TIPO_COM_VEIC`: Tipo relacionado ao veículo
- `AZ_PROCESSA`: Flag se processa (S/N)

#### **Como Funciona**:

1. **Seguimento** = Bandeira (`cod_band`)
2. **Filtra empresas** por `cod_band`
3. **"Todas"** = Processar todas as bandeiras

### ✅ **3. FLUXO REAL BANDEIRA → EMPRESA → COLABORADOR**

**Arquivo**: `Unimed.js`, função `ModalProcessar()` (linha 92-106)

```javascript
// ✅ FLUXO CORRETO NPDATA-LEGACY
Empresas._loadBandeiraGC("proc_band", "", "", "", ""); // 1º Carrega bandeiras
Empresas._loadEmpresaGCBand("proc_emp", "", "", "", "", ""); // 2º Carrega empresas

$("#proc_band").change(function () {
  // ✅ Bandeira altera empresas disponíveis
  Empresas._loadEmpresaGCBand("proc_emp", "", "", "", "", $(this).val());
});

$("#proc_emp").click(function () {
  // ✅ Empresa altera colaboradores disponíveis
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
```

### ✅ **4. PRÉVIA E APAGAR DADOS**

#### **Prévia** (`checkPrevia`):

```php
$previa = isset($_POST['checkPrevia']) == true ? $_POST['checkPrevia'] : "N";
```

- ✅ **Função**: Apenas validação/simulação - não grava dados finais
- ✅ **Valor**: 'S' ou 'N'
- ✅ **Comportamento**: Se 'S', executa mas não confirma no TOTVS

#### **Apagar Dados** (`checkAPAGA`):

```php
$apagar = isset($_POST['checkAPAGA']) == true ? $_POST['checkAPAGA'] : "N";
```

- ✅ **Função**: Remove dados anteriores antes de processar
- ✅ **Valor**: 'S' ou 'N'
- ✅ **Comportamento**: Se 'S', limpa dados do período antes de exportar

### ✅ **5. MÚLTIPLOS PROCESSOS**

#### **Estrutura Real**:

```php
$processo = isset($_POST['processo']) ? $_POST['processo'] : "";
```

- ✅ **Campo**: `processo[]` (array de códigos)
- ✅ **Formato**: Array de strings com códigos dos processos
- ✅ **Execução**: Loop executando cada processo selecionado

### ✅ **6. TODAS AS EMPRESAS / TODOS OS COLABORADORES**

#### **Lógica Real**:

```php
if ($empresa != 'T') {
  // ✅ Empresa específica
  $Unimed->setCodempresa($EmpresaDAO->_isCodEmpresaGC());
  $Unimed->setCodcoligada($EmpresaDAO->_isCodColigadaGC());
  $Unimed->setCodfilial($EmpresaDAO->_isCodFilialGC());
  $Unimed->setCodband($EmpresaDAO->_isGetBandeiraGC());
  $Unimed->setTodasEmpresas('N');
} else {
  // ✅ Todas as empresas da bandeira
  $Unimed->setTodasEmpresas('S');
  $Unimed->setCodband($bandeira);
}
```

#### **Comportamento**:

- ✅ **Empresa = "T"**: Processa todas as empresas da bandeira selecionada
- ✅ **Empresa específica**: Processa apenas a empresa selecionada
- ✅ **Colaborador vazio**: Processa todos os colaboradores da(s) empresa(s)
- ✅ **Colaborador específico**: Processa apenas o colaborador informado

### ✅ **7. ESTRUTURA DE EMPRESAS (SEM CNPJ)**

No npd-legacy, a listagem de empresas **NÃO mostra CNPJ**, apenas:

- ✅ **Apelido da empresa** (campo principal)
- ✅ **Código da empresa** (interno)

```php
// ✅ EXEMPLO REAL DE QUERY EMPRESAS
$op .= '"'.$obj->APELIDO.'",';  // Apenas APELIDO, sem CNPJ
```

---

## 🚨 PROBLEMAS IDENTIFICADOS NA NOSSA IMPLEMENTAÇÃO

### ❌ **1. Botão "Salvar Dados" Não Funciona**

- **Problema**: Condição de disabled incorreta ou evento não configurado
- **Investigação**: Verificar validação do botão

### ❌ **2. Seguimento Fixo em "Unimed"**

- **Problema**: Não há listagem de bandeiras (2 Rodas, 4 Rodas, etc.)
- **Solução**: Criar endpoint para gc.TIPO_BANDEIRA

### ❌ **3. CNPJ Indesejado na Lista**

- **Problema**: Mostrando CNPJ na listagem de empresas
- **Solução**: Exibir apenas apelido da empresa

### ❌ **4. Fluxo Empresa → Bandeira (Invertido)**

- **Problema**: Nosso fluxo está incorreto
- **Correto**: Bandeira → Empresa → Colaborador

### ❌ **5. Validação Incorreta de Campos Obrigatórios**

- **Problema**: Empresa sendo obrigatória (não é!)
- **Correto**: Apenas Mês, Ano e Processo(s) são obrigatórios

---

## 🛠️ PLANO DE IMPLEMENTAÇÃO

### **FASE 1: BACKEND - Endpoint Bandeiras (30 min)**

#### 1.1. Entity TipoBandeira

```typescript
export class TipoBandeira {
  constructor(
    public readonly codBand: number,
    public readonly descricao: string,
    public readonly azTipoComVeic: string,
    public readonly azProcessa: "S" | "N",
  ) {}
}
```

#### 1.2. Repository e Controller

```typescript
// GET /comum/bandeiras
async listarBandeiras(): Promise<TipoBandeira[]> {
  // SELECT cod_band, descricao, az_tipo_com_veic, az_processa
  // FROM gc.tipo_bandeira
}
```

#### 1.3. Filtrar Empresas por Bandeira

```typescript
// GET /comum/empresas?codBand=2
async listarEmpresas(codBand?: number): Promise<Empresa[]> {
  // WHERE cod_band = :codBand OR :codBand IS NULL
}
```

### **FASE 2: FRONTEND - Corrigir Modal (45 min)**

#### 2.1. Adicionar Serviço de Bandeiras

```typescript
// src/services/http/Bandeiras.ts
async listarBandeiras() {
  return this.http.get<TipoBandeira[]>('/comum/bandeiras');
}
```

#### 2.2. Implementar Fluxo Correto

```vue
<!-- 1. Seguimento (Bandeiras) -->
<v-select
  v-model="bandeiraSeluida"
  :items="bandeiras"
  @update:model-value="onBandeiraChange"
/>

<!-- 2. Empresa (Filtrada por Bandeira) -->
<v-select
  v-model="empresaSelecionada"
  :items="empresasFiltradas"
  item-title="apelido"
/>

<!-- 3. Colaborador (Opcional) -->
<v-select v-model="colaboradorSelecionado" />
```

#### 2.3. Corrigir Validação

```typescript
const isFormValid = computed(() => {
  return (
    mesExportacao.value &&
    anoExportacao.value &&
    processosSelecionados.value.length > 0
  );
  // ✅ NÃO validar empresa (opcional!)
});
```

#### 2.4. Remover CNPJ das Empresas

```typescript
// Exibir apenas apelido
item-title="apelido"  // ✅ Só apelido
// NÃO mostrar CNPJ
```

### **FASE 3: CORRIGIR EXECUÇÃO (30 min)**

#### 3.1. Payload Correto

```typescript
const payload = {
  mesRef: parseInt(mesExportacao.value),
  anoRef: parseInt(anoExportacao.value),
  processos: processosSelecionados.value, // ✅ Array
  codBand: bandeiraSelecionada.value || "T", // ✅ Opcional
  empresa: empresaSelecionada.value || "T", // ✅ Opcional
  colaborador: colaboradorSelecionado.value || "", // ✅ Opcional
  previa: previa.value ? "S" : "N",
  apagar: apagarDados.value ? "S" : "N",
};
```

#### 3.2. Backend Use Case

```typescript
async execute(dto: ExportarProcessoDto) {
  // Validar apenas campos obrigatórios
  if (!dto.mesRef || !dto.anoRef || !dto.processos?.length) {
    throw new Error('Campos obrigatórios: mês, ano e processos');
  }

  // Processar múltiplos processos
  for (const codigoProcesso of dto.processos) {
    await this.processarUnimed({
      ...dto,
      codigoProcesso,
      todasEmpresas: dto.empresa === 'T' ? 'S' : 'N'
    });
  }
}
```

---

## ✅ CRITÉRIOS DE VALIDAÇÃO

### **Backend**:

- [ ] Endpoint `/comum/bandeiras` funcional
- [ ] Filtro de empresas por `codBand`
- [ ] Validação apenas mês/ano/processos obrigatórios
- [ ] Suporte à execução múltiplos processos
- [ ] Parâmetros prévia e apagar implementados

### **Frontend**:

- [ ] Dropdown seguimento com bandeiras reais
- [ ] Fluxo Bandeira → Empresa → Colaborador
- [ ] Empresas sem CNPJ (apenas apelido)
- [ ] Botão "Salvar Dados" funcionando
- [ ] Validação apenas campos obrigatórios
- [ ] Prévia e Apagar Dados visíveis e funcionais

### **Integração**:

- [ ] "Todas" funciona (empresa='T', bandeira='T')
- [ ] Múltiplos processos executam em sequência
- [ ] Prévia não grava dados definitivos
- [ ] Apagar remove dados anteriores
- [ ] Logs mostram progresso de cada processo

---

## 📊 COMPARAÇÃO ANTES vs DEPOIS

| Aspecto         | ❌ Antes (Incorreto) | ✅ Depois (NPD-Legacy)     |
| --------------- | -------------------- | -------------------------- |
| **Seguimento**  | Fixo "Unimed"        | Dropdown bandeiras reais   |
| **Fluxo**       | Empresa → Bandeira   | Bandeira → Empresa → Colab |
| **Obrigatório** | Mês+Ano+Empresa      | Mês+Ano+Processo(s)        |
| **Empresas**    | Com CNPJ             | Apenas apelido             |
| **Todas**       | Não suportado        | empresa='T', bandeira='T'  |
| **Múltiplos**   | Um processo          | Array de processos         |
| **Prévia**      | ?                    | Validação sem gravar       |
| **Apagar**      | ?                    | Remove dados anteriores    |

---

## ⚡ SEQUÊNCIA DE EXECUÇÃO

### **1. Backend (30 min)**

1. Criar entity TipoBandeira
2. Criar repository bandeiras
3. Criar controller comum/bandeiras
4. Filtrar empresas por codBand
5. Corrigir validação exportação

### **2. Frontend (45 min)**

1. Criar serviço Bandeiras
2. Implementar dropdown seguimento
3. Corrigir fluxo Bandeira → Empresa
4. Remover CNPJ das empresas
5. Corrigir validação do botão
6. Testar "Todas as empresas"

### **3. Testes (15 min)**

1. Testar múltiplos processos
2. Testar "Todas" vs específica
3. Testar prévia e apagar
4. Validar logs de execução

---

## 🎯 RESULTADO ESPERADO

Modal de exportação **100% compatível** com npd-legacy:

- ✅ Seguimento = Bandeiras reais da gc.TIPO_BANDEIRA
- ✅ Fluxo Bandeira → Empresa → Colaborador
- ✅ "Todas" funciona corretamente
- ✅ Apenas apelido das empresas
- ✅ Validação apenas campos obrigatórios
- ✅ Múltiplos processos executam
- ✅ Prévia e Apagar funcionais
- ✅ Botão "Salvar Dados" ativo

**Compatibilidade**: 100% com npd-legacy! 🚀
