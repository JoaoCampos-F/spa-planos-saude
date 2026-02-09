<template>
  <v-container fluid class="pa-0">
    <!-- Header compacto com filtros inline -->
    <v-card flat color="transparent" class="mb-6">
      <v-card-text class="px-0 py-4">
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="48" class="mr-3">
                <v-icon color="white" size="28">mdi-view-dashboard</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h5 font-weight-bold mb-0">Meu Dashboard</h1>
                <p class="text-body-2 text-medium-emphasis ma-0">
                  Acompanhe seus gastos com plano de saúde
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-row dense align="center">
              <v-col cols="12" sm="5">
                <v-select
                  v-model="filtros.mes"
                  :items="meses"
                  label="Mês"
                  item-title="nome"
                  item-value="valor"
                  prepend-inner-icon="mdi-calendar-month"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filtros.ano"
                  :items="anos"
                  label="Ano"
                  prepend-inner-icon="mdi-calendar"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-btn
                  color="primary"
                  :loading="carregando"
                  @click="buscarDados"
                  block
                  size="large"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="carregando" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="text-h6 mt-4">Carregando seus dados...</p>
    </div>

    <!-- Conteúdo Principal -->
    <template v-else-if="dados">
      <!-- HERO SECTION - Valores Principais -->
      <v-row class="mb-6">
        <!-- Card Principal - Valor Líquido -->
        <v-col cols="12" md="6">
          <v-card
            elevation="3"
            class="hero-card"
            :class="{ 'hero-card--warning': dados.status !== 'S' }"
          >
            <v-card-text class="pa-6 pa-md-8">
              <div class="d-flex align-center mb-4">
                <v-chip
                  :color="dados.status === 'S' ? 'success' : 'warning'"
                  variant="flat"
                  size="default"
                  class="px-4"
                >
                  <v-icon start size="small">
                    {{
                      dados.status === "S"
                        ? "mdi-check-circle"
                        : "mdi-alert-circle"
                    }}
                  </v-icon>
                  {{
                    dados.status === "S"
                      ? "Aprovado para desconto"
                      : "Pendente de aprovação"
                  }}
                </v-chip>
              </div>
              <div class="text-overline text-white mb-2 opacity-90">
                VALOR A DESCONTAR
              </div>
              <div class="hero-value text-white mb-3">
                {{ formatarMoeda(dados.valorLiquido) }}
              </div>
              <p class="text-body-2 text-white mb-0 opacity-80">
                Este valor será descontado do seu salário em
                {{ meta?.periodo || "breve" }}
              </p>
              <v-divider class="my-4 opacity-20" />
              <div class="user-info-compact">
                <div class="d-flex align-center">
                  <v-avatar color="white" size="40" class="mr-3">
                    <v-icon color="primary" size="24">mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium text-white">
                      {{ dados.nome }}
                    </div>
                    <div class="text-caption text-white opacity-80">
                      {{ dados.empresa }} • {{ formatarCpf(dados.cpf) }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Card Secundário - Valor Total -->
        <v-col cols="12" md="6">
          <v-card elevation="2" class="hero-card-secondary h-100">
            <v-card-text class="pa-6 pa-md-8">
              <div class="d-flex align-center mb-3">
                <v-avatar
                  color="primary"
                  variant="tonal"
                  size="48"
                  class="mr-3"
                >
                  <v-icon color="primary" size="28">mdi-calculator</v-icon>
                </v-avatar>
                <div class="text-overline text-medium-emphasis">
                  VALOR TOTAL
                </div>
              </div>
              <div class="hero-value-secondary mb-3">
                {{ formatarMoeda(dados.valorTotal) }}
              </div>
              <div class="breakdown-info">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-body-2 text-medium-emphasis"
                    >Mensalidades</span
                  >
                  <span class="text-body-2 font-weight-medium">{{
                    formatarMoeda(
                      dados.mensalidadeTitular + dados.mensalidadeDependente,
                    )
                  }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis"
                    >Coparticipação</span
                  >
                  <span class="text-body-2 font-weight-medium">{{
                    formatarMoeda(dados.consumo)
                  }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- BREAKDOWN SECTION - Detalhamento -->
      <div class="text-overline text-medium-emphasis mb-3 px-1">
        DETALHAMENTO DOS CUSTOS
      </div>
      <v-row>
        <!-- Card Titular -->
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="1" class="detail-card h-100" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-4">
                <v-avatar
                  color="primary"
                  variant="tonal"
                  size="44"
                  class="mr-3"
                >
                  <v-icon color="primary" size="24">mdi-account-circle</v-icon>
                </v-avatar>
                <div class="text-subtitle-2 text-medium-emphasis">
                  Mensalidade Titular
                </div>
              </div>
              <div class="detail-value text-primary">
                {{ formatarMoeda(dados.mensalidadeTitular) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Card Dependentes -->
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="1" class="detail-card h-100" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-4">
                <v-avatar
                  color="secondary"
                  variant="tonal"
                  size="44"
                  class="mr-3"
                >
                  <v-icon color="secondary" size="24"
                    >mdi-account-multiple</v-icon
                  >
                </v-avatar>
                <div class="text-subtitle-2 text-medium-emphasis">
                  Mensalidade Dependentes
                </div>
              </div>
              <div class="detail-value text-secondary">
                {{ formatarMoeda(dados.mensalidadeDependente) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Card Consumo -->
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="1" class="detail-card h-100" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-4">
                <v-avatar color="info" variant="tonal" size="44" class="mr-3">
                  <v-icon color="info" size="24">mdi-medical-bag</v-icon>
                </v-avatar>
                <div class="text-subtitle-2 text-medium-emphasis">
                  Coparticipação
                </div>
              </div>
              <div class="detail-value text-info">
                {{ formatarMoeda(dados.consumo) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
/* Hero Cards - Seção Principal */
.hero-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.hero-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.hero-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
}

.hero-card--warning {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
}

.hero-value {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.hero-card-secondary {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.hero-card-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
}

.hero-value-secondary {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.breakdown-info {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.user-info-compact {
  padding: 16px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Detail Cards - Seção de Breakdown */
.detail-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  height: 100%;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(0, 0, 0, 0.12);
}

.detail-value {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* Utilities */
.opacity-90 {
  opacity: 0.9;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-20 {
  opacity: 0.2;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-value {
    font-size: 2.5rem;
  }

  .hero-value-secondary {
    font-size: 2rem;
  }

  .detail-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .hero-value {
    font-size: 2rem;
  }

  .hero-value-secondary {
    font-size: 1.75rem;
  }

  .detail-value {
    font-size: 1.375rem;
  }
}
</style>
