<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <PageHeader
      title="Relatórios"
      subtitle="Gere relatórios detalhados de colaboradores, empresas e departamentos"
      icon="mdi-file-chart"
    />

    <!-- Formulário de Parâmetros -->
    <v-card elevation="2" class="mb-6" style="border-radius: 12px">
      <v-card-title class="pa-6">
        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
            <v-icon color="primary" size="24">mdi-tune</v-icon>
          </v-avatar>
          <span class="text-h6">Parâmetros dos Relatórios</span>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="2">
            <v-autocomplete
              v-model="parametros.codEmpresa"
              :items="empresas"
              :loading="carregandoEmpresas"
              label="Empresa"
              item-title="label"
              item-value="codEmpresa"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @update:model-value="onEmpresaChange"
              :class="{ 'field-highlighted': isFieldHighlighted('empresa') }"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="parametros.codContrato"
              :items="contratos"
              :loading="carregandoContratos"
              label="Contrato"
              item-title="label"
              item-value="contrato"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              :class="{ 'field-highlighted': isFieldHighlighted('contrato') }"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="parametros.cpf"
              :items="colaboradores"
              :loading="carregandoColaboradores"
              label="Colaborador"
              item-title="label"
              item-value="cpf"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              :class="{ 'field-highlighted': isFieldHighlighted('cpf') }"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="parametros.mesRef"
              :items="meses"
              label="Mês ref."
              item-title="nome"
              item-value="valor"
              variant="outlined"
              density="compact"
              hide-details
              :class="{ 'field-highlighted': isFieldHighlighted('mes') }"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="parametros.anoRef"
              :items="anos"
              label="Ano ref."
              variant="outlined"
              density="compact"
              hide-details
              :class="{ 'field-highlighted': isFieldHighlighted('ano') }"
            />
          </v-col>
          <v-col cols="12" md="1" class="d-flex align-center">
            <v-btn
              color="primary"
              variant="tonal"
              @click="limparParametros"
              block
              size="large"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Cards de Relatórios -->
    <v-card elevation="2" style="border-radius: 12px">
      <v-card-title
        class="pa-6"
        style="background: rgb(var(--v-theme-surface-container-high))"
      >
        <div class="d-flex align-center">
          <v-avatar color="health-blue" variant="tonal" size="40" class="mr-3">
            <v-icon color="health-blue" size="24"
              >mdi-file-document-multiple</v-icon
            >
          </v-avatar>
          <span class="text-h6">Selecione o relatório desejado</span>
        </div>
      </v-card-title>
      <v-card-text class="pa-6">
        <!-- Cards de Relatórios -->
        <v-row>
          <!-- Relatório de Colaborador -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="2"
              hover
              @click="gerarRelatorio('colaborador')"
              @mouseenter="hoveredReport = 'colaborador'"
              @mouseleave="hoveredReport = null"
              style="border-radius: 12px; cursor: pointer"
            >
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    color="health-blue"
                    variant="tonal"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="health-blue" size="28"
                      >mdi-account-details</v-icon
                    >
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Relatório Colaborador
                    </div>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Dados detalhados de colaborador(es). Pode filtrar por CPF
                  específico.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatório Resumo Empresa -->
          <v-col v-can:role="['DP', 'ADMIN']" cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="2"
              hover
              @click="gerarRelatorio('empresa')"
              @mouseenter="hoveredReport = 'empresa'"
              @mouseleave="hoveredReport = null"
              style="border-radius: 12px; cursor: pointer"
            >
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    color="health-green"
                    variant="tonal"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="health-green" size="28"
                      >mdi-office-building</v-icon
                    >
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Resumo Empresa
                    </div>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Resumo de todos colaboradores da empresa (sem filtro por CPF).
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatório Com Lançamento -->
          <v-col v-can:role="['DP', 'ADMIN']" cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="2"
              hover
              @click="gerarRelatorio('pagamento')"
              @mouseenter="hoveredReport = 'pagamento'"
              @mouseleave="hoveredReport = null"
              style="border-radius: 12px; cursor: pointer"
            >
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    color="success"
                    variant="tonal"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="success" size="28">mdi-check-circle</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Com Lançamento
                    </div>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Colaboradores que tem EXPORTA=S (com lançamento para folha).
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatório Sem Lançamento -->
          <v-col v-can:role="['DP', 'ADMIN']" cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="2"
              hover
              @click="gerarRelatorio('nao-pagamento')"
              @mouseenter="hoveredReport = 'nao-pagamento'"
              @mouseleave="hoveredReport = null"
              style="border-radius: 12px; cursor: pointer"
            >
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    color="warning"
                    variant="tonal"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="warning" size="28">mdi-alert-circle</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Sem Lançamento
                    </div>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Colaboradores que tem EXPORTA=N (sem lançamento para folha).
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Resumo por Departamento -->
          <v-col v-can:role="['DP', 'ADMIN']" cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="2"
              hover
              @click="gerarRelatorio('resumo-depto')"
              @mouseenter="hoveredReport = 'resumo-depto'"
              @mouseleave="hoveredReport = null"
              style="border-radius: 12px; cursor: pointer"
            >
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    color="health-purple"
                    variant="tonal"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="health-purple" size="28"
                      >mdi-file-tree</v-icon
                    >
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Resumo Departamento
                    </div>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Agrupamento por colaborador e centro de custo.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Resumo Centro de Custo -->
          <v-col v-can:role="['DP', 'ADMIN']" cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="2"
              hover
              @click="gerarRelatorio('resumo-centro-custo')"
              @mouseenter="hoveredReport = 'resumo-centro-custo'"
              @mouseleave="hoveredReport = null"
              style="border-radius: 12px; cursor: pointer"
            >
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar
                    color="health-teal"
                    variant="tonal"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="health-teal" size="28">mdi-chart-box</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Totalização Centro Custo
                    </div>
                  </div>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Totais agregados por centro de custo.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Snackbar de Mensagens -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Dialog de Loading -->
    <v-dialog v-model="dialogCarregando" persistent max-width="400">
      <v-card style="border-radius: 16px">
        <v-card-text class="text-center pa-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          />
          <p class="text-h6 mb-2 font-weight-bold">Gerando Relatório</p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Aguarde enquanto processamos os dados...
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import EmpresasHttp from "@/services/http/Empresas";
import ContratosHttp from "@/services/http/Contratos";
import ColaboradoresHttp from "@/services/http/Colaboradores";
import RelatoriosHttp from "@/services/http/Relatorios";
import type {
  EmpresaCompleta,
  Contrato,
  ColaboradorSimplificado,
} from "@/interfaces/api.interfaces";

const empresasHttp = new EmpresasHttp();
const contratosHttp = new ContratosHttp();
const colaboradoresHttp = new ColaboradoresHttp();
const relatoriosHttp = new RelatoriosHttp();

// Estados
const dialogCarregando = ref(false);
const carregandoEmpresas = ref(false);
const carregandoContratos = ref(false);
const carregandoColaboradores = ref(false);

const empresasData = ref<EmpresaCompleta[]>([]);
const contratosData = ref<Contrato[]>([]);
const colaboradoresData = ref<ColaboradorSimplificado[]>([]);

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

// Parâmetros do relatório
const parametros = ref({
  codEmpresa: undefined as number | undefined,
  codColigada: undefined as number | undefined,
  codFilial: undefined as number | undefined,
  codBand: undefined as number | undefined,
  codContrato: undefined as string | undefined,
  cpf: undefined as string | undefined,
  mesRef: "02",
  anoRef: "2026",
});

// Dados para selects
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

const hoveredReport = ref<string | null>(null);

const isFieldHighlighted = (fieldName: string) => {
  if (!hoveredReport.value) return false;

  const reportFields: Record<string, string[]> = {
    colaborador: ["empresa", "contrato", "cpf", "mes", "ano"],
    empresa: ["empresa", "contrato", "mes", "ano"],
    pagamento: ["empresa", "contrato", "mes", "ano"],
    "nao-pagamento": ["empresa", "contrato", "mes", "ano"],
    "resumo-depto": ["empresa", "mes", "ano"],
    "resumo-centro-custo": ["empresa", "mes", "ano"],
  };

  return reportFields[hoveredReport.value]?.includes(fieldName) || false;
};

const empresas = computed(() => {
  if (empresasData.value.length === 0) return [];

  return [
    { codEmpresa: undefined, label: "Todas" },
    ...empresasData.value.map((emp) => ({
      ...emp,
      label: `${emp.apelido}`,
    })),
  ];
});

const contratos = computed(() => {
  if (contratosData.value.length === 0) return [];

  return [
    { contrato: undefined, label: "Todos" },
    ...contratosData.value.map((c) => ({
      ...c,
      label: `${c.contrato}`,
    })),
  ];
});

const colaboradores = computed(() => {
  if (colaboradoresData.value.length === 0) return [];

  return [
    { cpf: undefined, label: "Todos" },
    ...colaboradoresData.value.map((c) => ({
      ...c,
      label: `${c.nome}`,
    })),
  ];
});

onMounted(() => {
  carregarEmpresas();
  carregarContratos();
});

// Funções
async function carregarEmpresas() {
  carregandoEmpresas.value = true;
  try {
    const response = await empresasHttp.listarEmpresas();
    empresasData.value = response.data.dados || [];
  } catch (error: any) {
    mostrarErro("Erro ao carregar empresas");
    console.error("Erro ao carregar empresas:", error);
  } finally {
    carregandoEmpresas.value = false;
  }
}

async function carregarContratos(codEmpresa?: number) {
  carregandoContratos.value = true;
  try {
    const response = await contratosHttp.listarContratos(codEmpresa);
    contratosData.value = response.data.dados || [];
  } catch (error: any) {
    mostrarErro("Erro ao carregar contratos");
    console.error("Erro ao carregar contratos:", error);
  } finally {
    carregandoContratos.value = false;
  }
}

async function onEmpresaChange(codEmpresa: number | undefined) {
  // Limpar dados dependentes
  colaboradoresData.value = [];
  contratosData.value = [];
  parametros.value.codContrato = undefined;
  parametros.value.cpf = undefined;

  if (!codEmpresa) {
    parametros.value.codColigada = undefined;
    parametros.value.codFilial = undefined;
    parametros.value.codBand = undefined;
    // Recarregar contratos sem filtro
    await carregarContratos();
    return;
  }

  const empresa = empresasData.value.find((e) => e.codEmpresa === codEmpresa);
  if (empresa) {
    parametros.value.codColigada = empresa.codColigada;
    parametros.value.codFilial = empresa.codFilial;
    parametros.value.codBand = empresa.codBand;

    // Carregar contratos e colaboradores filtrados por empresa
    await Promise.all([
      carregarContratos(codEmpresa),
      carregarColaboradores(codEmpresa, empresa.codColigada),
    ]);
  }
}

async function carregarColaboradores(codEmpresa: number, codColigada: number) {
  carregandoColaboradores.value = true;
  try {
    const response = await colaboradoresHttp.listarColaboradores(
      codEmpresa,
      codColigada,
    );
    colaboradoresData.value = response.data.dados || [];
  } catch (error: any) {
    mostrarErro("Erro ao carregar colaboradores");
    console.error("Erro ao carregar colaboradores:", error);
  } finally {
    carregandoColaboradores.value = false;
  }
}

function limparParametros() {
  parametros.value = {
    codEmpresa: undefined,
    codColigada: undefined,
    codFilial: undefined,
    codBand: undefined,
    codContrato: undefined,
    cpf: undefined,
    mesRef: "02",
    anoRef: "2026",
  };
  colaboradoresData.value = [];
  contratosData.value = [];
  // Recarregar contratos sem filtro
  carregarContratos();
}

async function gerarRelatorio(tipo: string) {
  if (!parametros.value.mesRef || !parametros.value.anoRef) {
    mostrarErro("Selecione o mês e ano de referência");
    return;
  }

  dialogCarregando.value = true;

  try {
    const params = {
      codEmpresa: parametros.value.codEmpresa,
      codColigada: parametros.value.codColigada,
      codFilial: parametros.value.codFilial,
      codBand: parametros.value.codBand,
      codContrato: parametros.value.codContrato,
      mesRef: parametros.value.mesRef,
      anoRef: parametros.value.anoRef,
      cpf: parametros.value.cpf,
    };

    let response;

    switch (tipo) {
      case "colaborador":
        response = await relatoriosHttp.gerarRelatorioColaborador(params);
        break;
      case "empresa":
        response = await relatoriosHttp.gerarRelatorioEmpresa(params);
        break;
      case "pagamento":
        response = await relatoriosHttp.gerarRelatorioPagamento(params);
        break;
      case "nao-pagamento":
        response = await relatoriosHttp.gerarRelatorioNaoPagamento(params);
        break;
      case "resumo-depto":
        response = await relatoriosHttp.gerarResumoDepto(params);
        break;
      case "resumo-centro-custo":
        response = await relatoriosHttp.gerarResumoCentroCusto(params);
        break;
      default:
        throw new Error("Tipo de relatório inválido");
    }

    // Abrir PDF em nova aba
    const nomeArquivo = `relatorio-${tipo}-${params.mesRef}-${params.anoRef}.pdf`;
    relatoriosHttp.abrirPdfNovaAba(response.data, nomeArquivo);

    mostrarSucesso("Relatório gerado com sucesso!");
  } catch (error: any) {
    const mensagem =
      error.response?.data?.message ||
      error.message ||
      "Erro ao gerar relatório";
    mostrarErro(mensagem);
    console.error("Erro ao gerar relatório:", error);
  } finally {
    dialogCarregando.value = false;
  }
}

function mostrarSucesso(message: string) {
  snackbar.value = { show: true, message, color: "success" };
}

function mostrarErro(message: string) {
  snackbar.value = { show: true, message, color: "error" };
}
</script>

<style scoped>
.relatorio-card {
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.relatorio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
  border-color: rgb(var(--v-theme-primary));
}

.relatorio-card:active {
  transform: translateY(-2px);
}

/* Destaque dos campos quando hover no card */
:deep(.field-highlighted .v-field) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 2px !important;
  transition: all 0.3s ease;
}

/* :deep(.field-highlighted .v-field__outline__start),
:deep(.field-highlighted .v-field__outline__notch), */
:deep(.field-highlighted) {
  box-shadow: 0px 1px 5px rgba(var(--v-theme-primary), 0.7);
}
</style>
