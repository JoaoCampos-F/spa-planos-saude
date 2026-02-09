<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <PageHeader
      title="Beneficiários"
      subtitle="Gestão de beneficiários - Controle de exportação para pagamento"
      icon="mdi-account-multiple"
    />

    <!-- Filtros -->
    <v-card
      class="mb-4"
      elevation="2"
      style="background: rgb(var(--v-theme-surface-container))"
    >
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="filtros.codEmpresa"
              :items="empresasData"
              item-title="apelido"
              item-value="codEmpresa"
              label="Empresa"
              clearable
              density="compact"
              @update:model-value="onEmpresaChange"
              variant="outlined"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="filtros.mesRef"
              :items="meses"
              label="Mês"
              clearable
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="filtros.anoRef"
              :items="anos"
              label="Ano"
              variant="outlined"
              clearable
              density="compact"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.nome"
              label="Nome do Colaborador"
              variant="outlined"
              clearable
              density="compact"
              hide-details
              @keyup.enter="buscar"
            />
          </v-col>

          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="primary"
              block
              :loading="carregando"
              @click="buscar"
              size="large"
            >
              <v-icon start>mdi-magnify</v-icon>
              Buscar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabela -->
    <v-card elevation="2" style="border-radius: 12px">
      <v-card-text>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="colaboradores"
          :items-length="totalItems"
          :loading="carregando"
          loading-text="Carregando colaboradores..."
          no-data-text="Nenhum colaborador encontrado"
          @update:options="loadItems"
        >
          <!-- Nome do colaborador -->
          <template #[`item.colaborador`]="{ item }">
            <div>
              <div class="font-weight-medium">
                <v-chip
                  variant="flat"
                  size="x-small"
                  class="mx-1"
                  density="default"
                  >{{ item.apelido }}</v-chip
                >
                {{ item.colaborador }}
              </div>
              <!-- <div class="text-caption text-medium-emphasis"></div> -->
            </div>
          </template>

          <template #[`item.ativo`]="{ item }">
            <v-chip
              :color="item.ativo === 'S' ? 'success' : 'error'"
              size="small"
              label
            >
              <v-icon start size="small">
                {{
                  item.ativo === "S" ? "mdi-check-circle" : "mdi-close-circle"
                }}
              </v-icon>
              {{ item.ativo === "S" ? "Ativo" : "Inativo" }}
            </v-chip>
          </template>

          <!-- Exportar -->
          <template #[`item.exporta`]="{ item }">
            <v-switch
              v-if="isColaborador"
              :model-value="item.exporta === 'S'"
              color="primary"
              hide-details
              density="compact"
              :disabled="atualizando"
              @update:model-value="toggleExporta(item)"
            >
              <template #label>
                <span class="text-caption">
                  {{ item.exporta === "S" ? "Sim" : "Não" }}
                </span>
              </template>
            </v-switch>
          </template>

          <!-- Valores -->
          <template #[`item.mTitular`]="{ item }">
            R$ {{ item.mTitular }}
          </template>

          <template #[`item.mDependente`]="{ item }">
            R$ {{ item.mDependente }}
          </template>

          <template #[`item.valorConsumo`]="{ item }">
            R$ {{ item.valorConsumo }}
          </template>

          <template #[`item.percEmpresa`]="{ item }">
            R$ {{ item.percEmpresa }}
          </template>

          <template #[`item.valorTotal`]="{ item }">
            <span class="font-weight-bold">R$ {{ item.valorTotal }}</span>
          </template>

          <template #[`item.valorLiquido`]="{ item }">
            <span class="font-weight-bold text-primary">
              R$ {{ item.valorLiquido }}
            </span>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import { permissions } from "@/stores/permissionsStore";
import { userSystem } from "@/stores/userSystem";
import ColaboradoresHttp, {
  type ColaboradorResumo,
} from "@/services/http/Colaboradores";
import EmpresasHttp from "@/services/http/Empresas";
import type { EmpresaCompleta } from "@/interfaces/api.interfaces";

const colaboradoresHttp = new ColaboradoresHttp();
const empresasHttp = new EmpresasHttp();

// Dados
const colaboradores = ref<ColaboradorResumo[]>([]);
const empresasData = ref<EmpresaCompleta[]>([]);
const carregando = ref(false);
const atualizando = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Filtros
function getMesAnoAnterior(): { mes: string; ano: string } {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  if (mesAtual === 1) {
    return { mes: "12", ano: String(anoAtual - 1) };
  }
  return { mes: String(mesAtual - 1).padStart(2, "0"), ano: String(anoAtual) };
}

const mesAnoInicial = getMesAnoAnterior();
const filtros = reactive({
  codEmpresa: undefined as number | undefined,
  codColigada: undefined as number | undefined,
  mesRef: mesAnoInicial.mes,
  anoRef: mesAnoInicial.ano,
  nome: "",
});

// Snackbar
const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
});

// Meses e anos
const meses = [
  { title: "Janeiro", value: "01" },
  { title: "Fevereiro", value: "02" },
  { title: "Março", value: "03" },
  { title: "Abril", value: "04" },
  { title: "Maio", value: "05" },
  { title: "Junho", value: "06" },
  { title: "Julho", value: "07" },
  { title: "Agosto", value: "08" },
  { title: "Setembro", value: "09" },
  { title: "Outubro", value: "10" },
  { title: "Novembro", value: "11" },
  { title: "Dezembro", value: "12" },
];

const anos = Array.from({ length: 5 }, (_, i) => {
  const ano = 2026 - i;
  return { title: ano.toString(), value: ano.toString() };
});

const headers = [
  {
    title: "Colaborador",
    key: "colaborador",
    sortable: true,
    minWidth: "400px",
  },
  { title: "Status", key: "ativo", sortable: true },
  {
    title: "Mês/Ano",
    key: "mesRef",
    sortable: true,
    width: "100px",
    value: (item: ColaboradorResumo) => `${item.mesRef}/${item.anoRef}`,
  },
  { title: "Exportar", key: "exporta", sortable: false, minWidth: "110px" },
  {
    title: "Mens. Titular",
    key: "mTitular",
    sortable: true,
    align: "end" as const,
    minWidth: "130px",
  },
  {
    title: "Mens. Dependente",
    key: "mDependente",
    sortable: true,
    align: "end" as const,
  },
  {
    title: "Consumo",
    key: "valorConsumo",
    sortable: true,
    align: "end" as const,
  },
  {
    title: "% Empresa",
    key: "percEmpresa",
    sortable: true,
    align: "end" as const,
    minWidth: "130px",
  },
  {
    title: "Total",
    key: "valorTotal",
    sortable: true,
    align: "end" as const,
    minWidth: "130px",
  },
  {
    title: "Líquido",
    key: "valorLiquido",
    sortable: true,
    align: "end" as const,
  },
];

// Verifica se usuário é COLABORADOR (sem ser DP ou ADMIN)
const isColaborador = computed(() => {
  const permissionStore = permissions();
  const roles = permissionStore.getRoles;
  return (
    roles.includes("COLABORADOR") &&
    !roles.includes("DP") &&
    !roles.includes("ADMIN")
  );
});

// Funções
async function carregarEmpresas() {
  try {
    const response = await empresasHttp.listarEmpresas();
    empresasData.value = response.data.dados || [];
  } catch (error) {
    mostrarErro("Erro ao carregar empresas");
    console.error(error);
  }
}

function onEmpresaChange(codEmpresa: number | undefined) {
  if (codEmpresa) {
    const empresa = empresasData.value.find(
      (e: EmpresaCompleta) => e.codEmpresa === codEmpresa,
    );
    if (empresa) {
      filtros.codColigada = empresa.codColigada;
    }
  } else {
    filtros.codColigada = undefined;
  }
}

async function loadItems(options: any) {
  if (!carregando.value) {
    await buscar();
  }
}

async function buscar() {
  carregando.value = true;
  try {
    const response = await colaboradoresHttp.listarColaboradoresPaginado({
      codEmpresa: filtros.codEmpresa,
      codColigada: filtros.codColigada,
      mesRef: filtros.mesRef,
      anoRef: filtros.anoRef,
      nome: filtros.nome || undefined,
      page: page.value,
      pageSize: itemsPerPage.value,
    });

    if (response.data.sucesso) {
      colaboradores.value = response.data.dados;
      totalItems.value = response.data.total;
    }
  } catch (error: any) {
    mostrarErro("Erro ao carregar colaboradores");
    console.error(error);
  } finally {
    carregando.value = false;
  }
}

async function toggleExporta(colaborador: ColaboradorResumo) {
  // COLABORADOR não pode editar
  if (isColaborador.value) {
    mostrarErro("Você não tem permissão para alterar este campo");
    return;
  }

  const novoValor = colaborador.exporta === "S" ? "N" : "S";

  atualizando.value = true;
  try {
    const response = await colaboradoresHttp.atualizarExporta({
      codigoCpf: colaborador.codigoCpf,
      mesRef: colaborador.mesRef,
      anoRef: colaborador.anoRef,
      exporta: novoValor,
    });

    if (response.data.sucesso) {
      colaborador.exporta = novoValor;
      mostrarSucesso(response.data.mensagem);
    } else {
      mostrarErro(response.data.mensagem);
    }
  } catch (error: any) {
    mostrarErro("Erro ao atualizar colaborador");
    console.error(error);
  } finally {
    atualizando.value = false;
  }
}

function mostrarSucesso(mensagem: string) {
  snackbar.message = mensagem;
  snackbar.color = "success";
  snackbar.show = true;
}

function mostrarErro(mensagem: string) {
  snackbar.message = mensagem;
  snackbar.color = "error";
  snackbar.show = true;
}

// Lifecycle
onMounted(async () => {
  await carregarEmpresas();

  // Se for COLABORADOR, pré-selecionar sua empresa
  if (isColaborador.value) {
    const user = userSystem();
    const colaboradorData = user.getColaborador as any;

    if (colaboradorData?.cod_empresa) {
      filtros.codEmpresa = colaboradorData.cod_empresa;
      filtros.codColigada = colaboradorData.codcoligada;

      // CPF vem do backend automaticamente, então não precisa setar aqui
    }
  }

  await buscar();
});
</script>
<style scoped>
:deep(.v-data-table) {
  border-radius: 12px;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-on-surface), 0.04) !important;
}

:deep(.v-data-table-header) {
  background-color: rgb(var(--v-theme-surface-container-high));
}
</style>
