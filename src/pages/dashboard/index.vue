<template>
  <v-container fluid>
    <!-- Cabeçalho -->
    <!-- <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="0" class="bg-transparent">
          <v-card-title class="text-h4 font-weight-bold d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-view-dashboard</v-icon>
            Dashboard
          </v-card-title>
        </v-card>
      </v-col>
    </v-row> -->

    <!-- Filtros -->
    <v-card elevation="1" class="mb-2">
      <v-card-title>
        <v-icon class="mr-2">mdi-filter</v-icon>
        Período de Consulta
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filtros.mes"
              :items="meses"
              label="Mês"
              item-title="nome"
              item-value="valor"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select v-model="filtros.ano" :items="anos" label="Ano" />
          </v-col>

          <v-col cols="12" md="4" class="d-flex align-center">
            <v-btn color="primary" :loading="carregando" @click="buscarDados">
              <v-icon start>mdi-magnify</v-icon>
              Consultar uso
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="carregando" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="text-h6 mt-4">Carregando seus dados...</p>
    </div>

    <!-- Cards de Gastos -->
    <template v-else-if="dados">
      <!-- Informações do Colaborador -->
      <v-card elevation="1" class="mb-4">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center">
                <v-avatar color="primary" class="mr-4">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5">{{ dados.nome }}</h3>
                  <p class="text-body-1 text-grey-darken-1 ma-0">
                    {{ dados.empresa }} • CPF: {{ formatarCpf(dados.cpf) }}
                  </p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="text-md-right">
              <v-chip
                :color="dados.status === 'S' ? 'success' : 'warning'"
                variant="tonal"
                size="large"
              >
                <v-icon start>
                  {{
                    dados.status === "S"
                      ? "mdi-check-circle"
                      : "mdi-alert-circle"
                  }}
                </v-icon>
                {{ dados.status === "S" ? "Com Lançamento" : "Sem Lançamento" }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Cards de Valores -->
      <v-row>
        <!-- Mensalidade Titular -->
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="3" class="card-gasto titular">
            <v-card-title class="bg-blue-lighten-5 d-flex align-center">
              <v-icon class="mr-2" color="blue-darken-2" size="large"
                >mdi-account-circle</v-icon
              >
              <span class="text-h6">Mensalidade Titular</span>
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h4 font-weight-bold text-blue-darken-2">
                {{ formatarMoeda(dados.mensalidadeTitular) }}
              </div>
              <p class="text-body-2 text-grey-darken-1 mt-2">
                Valor da mensalidade do titular
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Mensalidade Dependentes -->
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="3" class="card-gasto dependentes">
            <v-card-title class="bg-green-lighten-5 d-flex align-center">
              <v-icon class="mr-2" color="green-darken-2" size="large"
                >mdi-account-multiple</v-icon
              >
              <span class="text-h6">Mensalidade Dependentes</span>
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h4 font-weight-bold text-green-darken-2">
                {{ formatarMoeda(dados.mensalidadeDependente) }}
              </div>
              <p class="text-body-2 text-grey-darken-1 mt-2">
                Valor total dos dependentes
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Consumo -->
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="3" class="card-gasto consumo">
            <v-card-title class="bg-orange-lighten-5 d-flex align-center">
              <v-icon class="mr-2" color="orange-darken-2" size="large"
                >mdi-medical-bag</v-icon
              >
              <span class="text-h6">Consumo</span>
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h4 font-weight-bold text-orange-darken-2">
                {{ formatarMoeda(dados.consumo) }}
              </div>
              <p class="text-body-2 text-grey-darken-1 mt-2">
                Consultas e procedimentos utilizados
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Valor Total -->
        <v-col cols="12" sm="6" md="6">
          <v-card elevation="3" class="card-gasto total destaque">
            <v-card-title class="bg-purple-lighten-5 d-flex align-center">
              <v-icon class="mr-2" color="purple-darken-2" size="large"
                >mdi-calculator</v-icon
              >
              <span class="text-h6">Valor Total</span>
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h3 font-weight-bold text-purple-darken-2">
                {{ formatarMoeda(dados.valorTotal) }}
              </div>
              <p class="text-body-2 text-grey-darken-1 mt-2">
                Mensalidades + Consumo
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="6">
          <v-card elevation="3" class="card-gasto liquido destaque">
            <v-card-title class="bg-red-lighten-5 d-flex align-center">
              <v-icon class="mr-2" color="red-darken-2" size="large"
                >mdi-currency-usd</v-icon
              >
              <span class="text-h6">Valor Líquido</span>
            </v-card-title>
            <v-card-text class="text-center py-6">
              <div class="text-h3 font-weight-bold text-red-darken-2">
                {{ formatarMoeda(dados.valorLiquido) }}
              </div>
              <p class="text-body-2 text-grey-darken-1 mt-2">
                Valor descontado do seu salário
              </p>
              <v-divider class="my-3" />
              <v-chip
                :color="dados.status === 'S' ? 'success' : 'warning'"
                variant="flat"
                size="small"
              >
                {{
                  dados.status === "S"
                    ? "Será descontado na folha"
                    : "Não será descontado"
                }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Informações Adicionais -->
      <!-- <v-card elevation="1" class="mt-4">
        <v-card-title>
          <v-icon class="mr-2">mdi-information</v-icon>
          Informações Adicionais
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-alert type="info" variant="tonal" class="mb-0">
                <strong>Período:</strong> {{ meta?.periodo || "Não informado" }}
              </v-alert>
            </v-col>
            <v-col cols="12" md="6">
              <v-alert
                :type="dados.status === 'S' ? 'success' : 'warning'"
                variant="tonal"
                class="mb-0"
              >
                <strong>Status:</strong>
                {{
                  dados.status === "S"
                    ? "Aprovado para desconto na folha"
                    : "Pendente de aprovação"
                }}
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card> -->
    </template>

    <!-- Estado vazio -->
    <v-card v-else-if="!carregando" elevation="1">
      <v-card-text class="text-center py-12">
        <v-icon size="80" color="grey-lighten-1" class="mb-4"
          >mdi-file-search</v-icon
        >
        <h3 class="text-h5 mb-2">Nenhum dado encontrado</h3>
        <p class="text-body-1 text-grey-darken-1">
          Não foram encontrados dados para o período selecionado. Tente
          selecionar um período diferente.
        </p>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import DashboardHttp, {
  type DashboardColaboradorData,
} from "@/services/http/Dashboard";

const dashboardService = new DashboardHttp();

// Estados
const carregando = ref(false);
const dados = ref<DashboardColaboradorData | null>(null);
const meta = ref<any>(null);

// Filtros
function getMesAnoAnterior(): { mes: number; ano: number } {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  if (mesAtual === 1) {
    return { mes: 12, ano: anoAtual - 1 };
  }
  return { mes: mesAtual - 1, ano: anoAtual };
}

const mesAnoInicial = getMesAnoAnterior();
const filtros = reactive({
  mes: mesAnoInicial.mes,
  ano: mesAnoInicial.ano,
});

// Snackbar
const snackbar = reactive({
  show: false,
  message: "",
  color: "success" as "success" | "error" | "warning" | "info",
});

// Dados dos selects
const meses = [
  { nome: "Janeiro", valor: 1 },
  { nome: "Fevereiro", valor: 2 },
  { nome: "Março", valor: 3 },
  { nome: "Abril", valor: 4 },
  { nome: "Maio", valor: 5 },
  { nome: "Junho", valor: 6 },
  { nome: "Julho", valor: 7 },
  { nome: "Agosto", valor: 8 },
  { nome: "Setembro", valor: 9 },
  { nome: "Outubro", valor: 10 },
  { nome: "Novembro", valor: 11 },
  { nome: "Dezembro", valor: 12 },
];

const anos = Array.from({ length: 10 }, (_, i) => {
  const ano = new Date().getFullYear() - 5 + i;
  return ano;
});

// Funções
async function buscarDados() {
  if (!filtros.mes || !filtros.ano) {
    mostrarSnackbar(
      "Por favor, selecione o mês e ano para consultar",
      "warning",
    );
    return;
  }

  try {
    carregando.value = true;

    const resposta = await dashboardService.buscarDashboardColaborador(
      filtros.mes,
      filtros.ano,
    );

    dados.value = resposta.data;
    meta.value = resposta.meta;
  } catch (error: any) {
    console.error("Erro ao buscar dashboard:", error);

    if (error?.response?.status === 404) {
      dados.value = null;
      mostrarSnackbar(
        "Dados não encontrados para o período selecionado",
        "warning",
      );
    } else {
      mostrarSnackbar("Erro ao carregar os dados. Tente novamente.", "error");
    }
  } finally {
    carregando.value = false;
  }
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

function formatarCpf(cpf: string): string {
  if (!cpf) return "";
  const numeros = cpf.replace(/\D/g, "");
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function mostrarSnackbar(
  message: string,
  color: "success" | "error" | "warning" | "info",
) {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
}

// Carrega dados iniciais
onMounted(() => {
  buscarDados();
});
</script>

<style scoped>
.card-gasto {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border-radius: 12px;
  height: 100%;
}

.card-gasto:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}

.card-gasto.destaque {
  border: 2px solid #e3f2fd;
}

.text-h3,
.text-h4 {
  letter-spacing: -0.02em;
}
</style>
