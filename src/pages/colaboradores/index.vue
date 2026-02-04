<template>
  <div class="pa-6">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Colaboradores</h1>
        <p class="text-body-2 text-medium-emphasis">
          Gestão de colaboradores - Controle de exportação para pagamento
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6" elevation="1">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="filtros.codEmpresa"
              :items="empresasData"
              item-title="apelido"
              item-value="codEmpresa"
              label="Empresa"
              clearable
              density="comfortable"
              @update:model-value="onEmpresaChange"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="filtros.mesRef"
              :items="meses"
              label="Mês"
              clearable
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="filtros.anoRef"
              :items="anos"
              label="Ano"
              clearable
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.nome"
              label="Nome do Colaborador"
              clearable
              density="comfortable"
              @keyup.enter="buscar"
            />
          </v-col>

          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn color="primary" block :loading="carregando" @click="buscar">
              <v-icon start>mdi-magnify</v-icon>
              Buscar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabela -->
    <v-card elevation="1">
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
              <div class="font-weight-medium">{{ item.colaborador }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ item.apelido }}
              </div>
            </div>
          </template>

          <!-- Status Ativo -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import ColaboradoresHttp, {
  type ColaboradorResumo,
} from "@/services/http/Colaboradores";
import EmpresasHttp from "@/services/http/Empresas";
import type { EmpresaSimplificada } from "@/interfaces/api.interfaces";

const colaboradoresHttp = new ColaboradoresHttp();
const empresasHttp = new EmpresasHttp();

// Dados
const colaboradores = ref<ColaboradorResumo[]>([]);
const empresasData = ref<EmpresaSimplificada[]>([]);
const carregando = ref(false);
const atualizando = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Filtros
const filtros = reactive({
  codEmpresa: undefined as number | undefined,
  codColigada: undefined as number | undefined,
  mesRef: "02",
  anoRef: "2026",
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

// Headers da tabela
const headers = [
  { title: "Colaborador", key: "colaborador", sortable: true, width: "200px" },
  { title: "Status", key: "ativo", sortable: true, width: "120px" },
  {
    title: "Mês/Ano",
    key: "mesRef",
    sortable: true,
    width: "100px",
    value: (item: ColaboradorResumo) => `${item.mesRef}/${item.anoRef}`,
  },
  { title: "Exportar", key: "exporta", sortable: false, width: "120px" },
  { title: "Titular", key: "mTitular", sortable: true, align: "end" as const },
  {
    title: "Dependente",
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
  },
  { title: "Total", key: "valorTotal", sortable: true, align: "end" as const },
  {
    title: "Líquido",
    key: "valorLiquido",
    sortable: true,
    align: "end" as const,
  },
];

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
    const empresa = empresasData.value.find((e) => e.codEmpresa === codEmpresa);
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
  await buscar();
});
</script>
