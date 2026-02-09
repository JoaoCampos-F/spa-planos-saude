<template>
  <v-container fluid class="pa-0">
    <!-- Header -->
    <PageHeader
      title="Processos de Exportação"
      subtitle="Gerencie e monitore os processos de exportação para TOTVS"
      icon="mdi-cog-sync"
    />

    <!-- Formulário de Exportação -->
    <v-card
      elevation="2"
      class="mb-6"
      style="
        border-radius: 12px;
        background: rgb(var(--v-theme-surface-container));
      "
    >
      <v-card-title
        class="d-flex align-center pa-6"
        style="background: rgb(var(--v-theme-surface-container-high))"
      >
        <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
          <v-icon color="primary" size="24">mdi-cloud-upload</v-icon>
        </v-avatar>
        <span class="text-h6">Exportação para TOTVS</span>
      </v-card-title>

      <v-card-text class="pa-8">
        <!-- Filtros Principais -->
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filtros.codEmpresa"
              :items="empresas"
              :loading="carregandoEmpresas"
              label="Empresa *"
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
              v-model="filtros.mesRef"
              :items="meses"
              label="Mês Referência *"
              item-title="nome"
              item-value="valor"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="carregarProcessos"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="filtros.anoRef"
              :items="anos"
              label="Ano Referência *"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="carregarProcessos"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filtros.cpf"
              :items="colaboradores"
              :loading="carregandoColaboradores"
              label="Colaborador (opcional)"
              item-title="label"
              item-value="cpf"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <!-- Lista de Processos -->
        <v-row v-if="carregandoProcessos" class="my-4">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="48" />
            <p class="text-body-2 text-grey-darken-1 mt-4">
              Carregando processos disponíveis...
            </p>
          </v-col>
        </v-row>

        <v-row v-else-if="processos.length === 0" class="my-4">
          <v-col cols="12">
            <v-alert type="warning" variant="tonal">
              Nenhum processo disponível para o período selecionado. Selecione
              uma empresa, mês e ano para carregar os processos.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="bg-blue-grey-lighten-5">
                <v-icon class="mr-2">mdi-format-list-checks</v-icon>
                Processos Disponíveis
                <v-chip
                  v-if="processosSelecionados.length > 0"
                  class="ml-2"
                  size="small"
                  color="success"
                >
                  {{ processosSelecionados.length }} selecionado(s)
                </v-chip>
              </v-card-title>

              <v-card-text class="pa-4">
                <v-list>
                  <v-list-item
                    v-for="processo in processos"
                    :key="processo.codigo"
                    class="processo-item"
                  >
                    <template #prepend>
                      <v-checkbox
                        v-model="processosSelecionados"
                        :value="processo.codigo"
                        hide-details
                        density="compact"
                      />
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ processo.descricao }}
                    </v-list-item-title>

                    <v-list-item-subtitle>
                      <v-chip
                        v-if="processo.dataUltimaExecucao"
                        size="x-small"
                        color="info"
                        variant="flat"
                        class="mr-2"
                      >
                        <v-icon start size="x-small">mdi-clock-outline</v-icon>
                        Última: {{ formatarData(processo.dataUltimaExecucao) }}
                        {{ processo.usuario ? `(${processo.usuario})` : "" }}
                      </v-chip>
                      <v-chip
                        v-else
                        size="x-small"
                        color="grey"
                        variant="flat"
                        class="mr-2"
                      >
                        <v-icon start size="x-small">mdi-clock-outline</v-icon>
                        Nunca executado
                      </v-chip>
                    </v-list-item-subtitle>

                    <template #append>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click="verHistorico(processo.codigo)"
                      >
                        <v-icon>mdi-history</v-icon>
                        <v-tooltip activator="parent" location="top">
                          Ver histórico
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Opções de Exportação -->
        <v-row v-if="processos.length > 0" class="mt-4">
          <v-col cols="12" md="6">
            <v-checkbox
              v-model="opcoes.previa"
              label="Gerar Prévia (não confirma no TOTVS)"
              hint="Útil para validar antes da exportação definitiva"
              persistent-hint
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-checkbox
              v-model="opcoes.apagar"
              label="Apagar dados antigos antes de exportar"
              hint="Requer permissão especial (ADMIN)"
              persistent-hint
              density="compact"
              :disabled="!temPermissaoApagar"
            />
          </v-col>
        </v-row>

        <!-- Botões de Ação -->
        <v-row v-if="processos.length > 0" class="mt-4">
          <v-col cols="12" class="d-flex justify-end gap-2">
            <v-btn
              color="grey-darken-1"
              variant="outlined"
              @click="limparSelecao"
            >
              <v-icon left>mdi-refresh</v-icon>
              Limpar Seleção
            </v-btn>

            <v-btn
              color="success"
              :disabled="
                processosSelecionados.length === 0 || !filtros.codEmpresa
              "
              :loading="exportando"
              @click="confirmarExportacao"
            >
              <v-icon left>mdi-cloud-upload</v-icon>
              Exportar para TOTVS
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Dialog de Confirmação -->
    <v-dialog v-model="dialogConfirmacao" max-width="600">
      <v-card>
        <v-card-title class="bg-warning text-white">
          <v-icon class="mr-2">mdi-alert</v-icon>
          Confirmar Exportação
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">
            Você está prestes a exportar os seguintes processos para o TOTVS:
          </p>

          <v-list density="compact">
            <v-list-item
              v-for="codigo in processosSelecionados"
              :key="codigo"
              :title="
                processos.find((p) => p.codigo === codigo)?.descricao || codigo
              "
              prepend-icon="mdi-check-circle"
            />
          </v-list>

          <v-divider class="my-4" />

          <v-alert
            v-if="opcoes.apagar"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            <strong>ATENÇÃO:</strong> Os dados antigos do período serão
            <strong>apagados</strong> antes da exportação.
          </v-alert>

          <v-alert
            v-if="opcoes.previa"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            Modo <strong>PRÉVIA</strong> ativado. Os dados não serão confirmados
            no TOTVS.
          </v-alert>

          <p class="text-body-2 text-grey-darken-1">
            <strong>Período:</strong> {{ getMesNome(filtros.mesRef) }}/{{
              filtros.anoRef
            }}
            <br />
            <strong>Empresa:</strong>
            {{
              empresas.find((e) => e.codEmpresa === filtros.codEmpresa)?.label
            }}
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirmacao = false">
            Cancelar
          </v-btn>
          <v-btn color="success" variant="flat" @click="executarExportacao">
            Confirmar Exportação
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Histórico -->
    <v-dialog v-model="dialogHistorico" max-width="900">
      <v-card>
        <v-card-title class="bg-info text-white">
          <v-icon class="mr-2">mdi-history</v-icon>
          Histórico do Processo
        </v-card-title>

        <v-card-text class="pa-4">
          <p class="text-body-2 mb-4">
            Implementação futura: Histórico detalhado de execuções do processo
            <strong>{{ historicoProcessoCodigo }}</strong>
          </p>

          <v-alert type="info" variant="tonal">
            Esta funcionalidade será implementada na próxima fase. Por enquanto,
            consulte a página de Histórico de Processos.
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogHistorico = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import EmpresasHttp from "@/services/http/Empresas";
import ColaboradoresHttp from "@/services/http/Colaboradores";
import ExportacaoHttp from "@/services/http/Exportacao";
import type {
  EmpresaCompleta,
  ColaboradorSimplificado,
} from "@/interfaces/api.interfaces";
import type { ProcessoParaExportacao } from "@/services/http/Exportacao";

const empresasHttp = new EmpresasHttp();
const colaboradoresHttp = new ColaboradoresHttp();
const exportacaoHttp = new ExportacaoHttp();

// Estados de carregamento
const carregandoEmpresas = ref(false);
const carregandoColaboradores = ref(false);
const carregandoProcessos = ref(false);
const exportando = ref(false);

// Dados
const empresasData = ref<EmpresaCompleta[]>([]);
const colaboradoresData = ref<ColaboradorSimplificado[]>([]);
const processos = ref<ProcessoParaExportacao[]>([]);

// Filtros (mesma estrutura da página de relatórios)
const filtros = ref({
  codEmpresa: undefined as number | undefined,
  codColigada: undefined as number | undefined,
  codFilial: undefined as number | undefined,
  codBand: undefined as number | undefined,
  cpf: undefined as string | undefined,
  mesRef: "02",
  anoRef: "2026",
});

// Seleções
const processosSelecionados = ref<string[]>([]);

// Opções
const opcoes = ref({
  previa: false,
  apagar: false,
});

// Dialogs
const dialogConfirmacao = ref(false);
const dialogHistorico = ref(false);
const historicoProcessoCodigo = ref("");

// Snackbar
const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

// Dados para selects (mesma estrutura da página de relatórios)
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

// Mesmo padrão da página de relatórios
const empresas = computed(() => {
  if (empresasData.value.length === 0) return [];
  return empresasData.value.map((emp) => ({
    ...emp,
    label: `${emp.apelido}`,
  }));
});

// Mesmo padrão da página de relatórios
const colaboradores = computed(() => {
  if (colaboradoresData.value.length === 0) return [];
  return [
    { cpf: undefined, label: "Todos" },
    ...colaboradoresData.value.map((c) => ({
      ...c,
      label: `${c.nome} - ${c.cpf}`,
    })),
  ];
});

const temPermissaoApagar = computed(() => {
  // TODO: Implementar verificação real de roles via Keycloak
  return true;
});

// Lifecycle
onMounted(() => {
  carregarEmpresas();
});

// Funções (seguindo padrão da página de relatórios)
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

async function onEmpresaChange(codEmpresa: number | undefined) {
  // Limpar dados dependentes
  colaboradoresData.value = [];
  filtros.value.cpf = undefined;

  if (!codEmpresa) {
    filtros.value.codColigada = undefined;
    filtros.value.codFilial = undefined;
    filtros.value.codBand = undefined;
    processos.value = [];
    return;
  }

  const empresa = empresasData.value.find((e) => e.codEmpresa === codEmpresa);
  if (empresa) {
    filtros.value.codColigada = empresa.codColigada;
    filtros.value.codFilial = empresa.codFilial;
    filtros.value.codBand = empresa.codBand;

    // Carregar colaboradores e processos
    await Promise.all([
      carregarColaboradores(codEmpresa, empresa.codColigada),
      carregarProcessos(),
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

async function carregarProcessos() {
  if (!filtros.value.mesRef || !filtros.value.anoRef) {
    return;
  }

  carregandoProcessos.value = true;
  processos.value = [];
  processosSelecionados.value = [];

  try {
    const response = await exportacaoHttp.listarProcessos({
      categoria: "UNI",
      tipoDado: "C",
      mesRef: parseInt(filtros.value.mesRef),
      anoRef: parseInt(filtros.value.anoRef),
    });

    processos.value = response.data || [];
  } catch (error: any) {
    mostrarErro("Erro ao carregar processos");
    console.error("Erro ao carregar processos:", error);
  } finally {
    carregandoProcessos.value = false;
  }
}

function confirmarExportacao() {
  if (processosSelecionados.value.length === 0) {
    mostrarErro("Selecione pelo menos um processo");
    return;
  }

  if (!filtros.value.codEmpresa) {
    mostrarErro("Selecione uma empresa");
    return;
  }

  dialogConfirmacao.value = true;
}

async function executarExportacao() {
  dialogConfirmacao.value = false;
  exportando.value = true;

  try {
    const empresa = empresasData.value.find(
      (e) => e.codEmpresa === filtros.value.codEmpresa,
    );

    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }

    // Executar cada processo selecionado
    for (const codigoProcesso of processosSelecionados.value) {
      const response = await exportacaoHttp.exportarParaTotvs({
        codEmpresa: empresa.codEmpresa,
        codColigada: empresa.codColigada,
        mesRef: filtros.value.mesRef,
        anoRef: filtros.value.anoRef,
        bandeira: filtros.value.codBand?.toString(),
        cpfColaborador: filtros.value.cpf,
        processos: [codigoProcesso],
      });

      if (!response.data.sucesso) {
        throw new Error(
          response.data.mensagem || "Erro ao executar exportação",
        );
      }
    }

    mostrarSucesso(
      `Exportação executada com sucesso! ${processosSelecionados.value.length} processo(s) executado(s).`,
    );

    // Recarregar processos para atualizar última execução
    await carregarProcessos();
    limparSelecao();
  } catch (error: any) {
    const mensagem =
      error.response?.data?.mensagem ||
      error.message ||
      "Erro ao executar exportação";
    mostrarErro(mensagem);
    console.error("Erro ao executar exportação:", error);
  } finally {
    exportando.value = false;
  }
}

function limparSelecao() {
  processosSelecionados.value = [];
  opcoes.value.previa = false;
  opcoes.value.apagar = false;
}

function verHistorico(codigo: string) {
  historicoProcessoCodigo.value = codigo;
  dialogHistorico.value = true;
}

function formatarData(data: string | null | undefined): string {
  if (!data) return "Nunca executado";
  // Data já vem formatada do backend: "DD/MM/YYYY HH:MM:SS"
  return data;
}

function getMesNome(mesValor: string): string {
  return meses.find((m) => m.valor === mesValor)?.nome || mesValor;
}

function mostrarSucesso(message: string) {
  snackbar.value = { show: true, message, color: "success" };
}

function mostrarErro(message: string) {
  snackbar.value = { show: true, message, color: "error" };
}
</script>

<style scoped>
.processo-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.processo-item:last-child {
  border-bottom: none;
}

.processo-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
