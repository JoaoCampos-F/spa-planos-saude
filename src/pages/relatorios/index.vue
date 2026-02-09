<template>
  <v-container fluid>
    <!-- Formulário de Parâmetros -->
    <v-card elevation="2" class="mb-2">
      <v-card-title> Parâmetros dos Relatórios </v-card-title>

      <v-card-text class="pa-3">
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
            />
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn
              color="grey-darken-1"
              variant="outlined"
              @click="limparParametros"
              prepend-icon="mdi-refresh"
            >
              Limpar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="2">
      <v-card-title> Selecione o relatório desejado </v-card-title>
      <v-card-text>
        <v-divider class="my-4" />

        <!-- Cards de Relatórios -->
        <v-row>
          <!-- Relatório de Colaborador -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="3"
              hover
              @click="gerarRelatorio('colaborador')"
            >
              <v-card-title class="bg-blue-lighten-4 d-flex align-center">
                <v-icon class="mr-2" color="blue-darken-2"
                  >mdi-account-details</v-icon
                >
                <span class="text-body-1">Relatório Colaborador</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 text-grey-darken-1">
                  Dados detalhados de colaborador(es). Pode filtrar por CPF
                  específico.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatório Resumo Empresa -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="3"
              hover
              @click="gerarRelatorio('empresa')"
            >
              <v-card-title class="bg-green-lighten-4 d-flex align-center">
                <v-icon class="mr-2" color="green-darken-2"
                  >mdi-office-building</v-icon
                >
                <span class="text-body-1">Resumo Empresa</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 text-grey-darken-1">
                  Resumo de todos colaboradores da empresa (sem filtro por CPF).
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatório Com Lançamento -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="3"
              hover
              @click="gerarRelatorio('pagamento')"
            >
              <v-card-title class="bg-success-lighten-4 d-flex align-center">
                <v-icon class="mr-2" color="success-darken-2"
                  >mdi-check-circle</v-icon
                >
                <span class="text-body-1">Com Lançamento</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 text-grey-darken-1">
                  Colaboradores que tem EXPORTA=S (com lançamento para folha).
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatório Sem Lançamento -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="3"
              hover
              @click="gerarRelatorio('nao-pagamento')"
            >
              <v-card-title class="bg-orange-lighten-4 d-flex align-center">
                <v-icon class="mr-2" color="orange-darken-2"
                  >mdi-alert-circle</v-icon
                >
                <span class="text-body-1">Sem Lançamento</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 text-grey-darken-1">
                  Colaboradores que tem EXPORTA=N (sem lançamento para folha).
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Resumo por Departamento -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="3"
              hover
              @click="gerarRelatorio('resumo-depto')"
            >
              <v-card-title class="bg-purple-lighten-4 d-flex align-center">
                <v-icon class="mr-2" color="purple-darken-2"
                  >mdi-file-tree</v-icon
                >
                <span class="text-body-1">Resumo Departamento</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 text-grey-darken-1">
                  Agrupamento por colaborador e centro de custo.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Resumo Centro de Custo -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              class="relatorio-card"
              elevation="3"
              hover
              @click="gerarRelatorio('resumo-centro-custo')"
            >
              <v-card-title class="bg-cyan-lighten-4 d-flex align-center">
                <v-icon class="mr-2" color="cyan-darken-2"
                  >mdi-chart-box</v-icon
                >
                <span class="text-body-1">Totalização Centro Custo</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 text-grey-darken-1">
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
      <v-card>
        <v-card-text class="text-center pa-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          />
          <p class="text-h6 mb-2">Gerando Relatório</p>
          <p class="text-body-2 text-grey-darken-1">
            Aguarde enquanto processamos os dados...
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import EmpresasHttp from "@/services/http/Empresas";
import ContratosHttp from "@/services/http/Contratos";
import ColaboradoresHttp from "@/services/http/Colaboradores";
import RelatoriosHttp from "@/services/http/Relatorios";
import type {
  EmpresaCompleta,
  Contrato,
  ColaboradorSimplificado,
} from "@/interfaces/api.interfaces";
import { V } from "vue-router/dist/index-DvGaX1AX.mjs";

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
      label: `${c.nome} `,
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
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.relatorio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.relatorio-card .v-card-title {
  font-size: 0.95rem;
  padding: 12px 16px;
}

.relatorio-card .v-card-text {
  min-height: 80px;
}
</style>
