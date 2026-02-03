<!-- 📁 src/pages/importacao/index.vue -->
<template>
  <v-container fluid>
    <v-row>
      <!-- ========== CARD IMPORTAÇÃO ========== -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100 d-flex flex-column">
          <v-card-title class="bg-primary">
            <v-icon class="mr-2">mdi-cloud-download</v-icon>
            Importar Unimed Cuiabá
          </v-card-title>

          <v-card-text class="pa-6 flex-grow-1">
            <h3 class="text-h6 mb-3">Processo de Importação</h3>
            <p class="text-body-1 mb-3">
              Busca dados de mensalidades diretamente da API da Unimed Cuiabá e
              traz para o sistema local.
            </p>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <v-btn
              color="primary"
              size="large"
              @click="abrirModalImportacao"
              block
            >
              <v-icon left>mdi-cloud-download</v-icon>
              Iniciar Importação
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- ========== CARD EXPORTAÇÃO ========== -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100 d-flex flex-column">
          <v-card-title class="bg-success">
            <v-icon class="mr-2">mdi-cloud-upload</v-icon>
            Exportar Totvs
          </v-card-title>

          <v-card-text class="pa-6 flex-grow-1">
            <h3 class="text-h6 mb-3">Processo de Exportação</h3>
            <p class="text-body-1 mb-3">
              Processa os dados importados e exporta para a folha de pagamento
              do sistema Totvs RM.
            </p>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <v-btn
              color="success"
              size="large"
              @click="abrirModalExportacao"
              block
            >
              <v-icon left>mdi-cloud-upload</v-icon>
              Iniciar Exportação
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- ========== MODAL IMPORTAÇÃO ========== -->
    <v-dialog v-model="modalImportacao" max-width="800" persistent>
      <v-card>
        <v-card-title
          class="bg-primary d-flex justify-space-between align-center"
        >
          <span>📥 Processamento de Importação</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="fecharModalImportacao"
            :disabled="carregandoImportacao"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Campos de Mês e Ano -->
          <v-row v-if="!carregandoImportacao && logsImportacao.length === 0">
            <v-col cols="12">
              <v-alert type="info" variant="tonal" class="mb-4">
                Selecione o período que deseja importar da API Unimed
              </v-alert>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="mesImportacao"
                :items="meses"
                label="Mês"
                item-title="nome"
                item-value="valor"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="anoImportacao"
                :items="anos"
                label="Ano"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <!-- Logs -->
          <v-timeline v-if="logsImportacao.length > 0" density="compact">
            <v-timeline-item
              v-for="(log, index) in logsImportacao"
              :key="index"
              :color="
                log.tipo === 'erro'
                  ? 'error'
                  : log.tipo === 'info'
                    ? 'info'
                    : 'success'
              "
              size="small"
            >
              {{ log.mensagem }}
            </v-timeline-item>
          </v-timeline>

          <!-- Loading State -->
          <div
            v-if="carregandoImportacao && logsImportacao.length === 0"
            class="text-center py-8"
          >
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-grey-darken-1">Iniciando importação...</p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            v-if="!carregandoImportacao && logsImportacao.length === 0"
            color="grey"
            variant="text"
            @click="fecharModalImportacao"
          >
            Cancelar
          </v-btn>
          <v-btn
            v-if="!carregandoImportacao && logsImportacao.length === 0"
            color="primary"
            @click="executarImportacao"
          >
            <v-icon left>mdi-play</v-icon>
            Executar Importação
          </v-btn>
          <v-btn
            v-if="logsImportacao.length > 0"
            color="primary"
            variant="text"
            @click="fecharModalImportacao"
            :disabled="carregandoImportacao"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ========== MODAL EXPORTAÇÃO ========== -->
    <v-dialog v-model="modalExportacao" max-width="900" persistent>
      <v-card>
        <v-card-title
          class="bg-success d-flex justify-space-between align-center"
        >
          <span>📤 Processamento de Exportação</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="fecharModalExportacao"
            :disabled="carregandoExportacao"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Campos de Mês e Ano -->
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="mesExportacao"
                :items="meses"
                label="Mês"
                item-title="nome"
                item-value="valor"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="anoExportacao"
                :items="anos"
                label="Ano"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Filtros -->
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="filtroSeguimento"
                :items="seguimentos"
                label="Seguimento"
                item-title="nome"
                item-value="id"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="filtroEmpresa"
                :items="empresasDisponiveis"
                :loading="carregandoEmpresas"
                label="Empresa"
                item-title="label"
                item-value="codEmpresa"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filtroColaborador"
                :items="colaboradores"
                label="Colaborador(a)"
                item-title="nome"
                item-value="id"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Processos Unimed -->
          <div class="mb-4">
            <h3 class="text-h6 mb-3">-----------Unimed-----------</h3>
            <v-checkbox
              v-model="processoSelecionado"
              label="Exporta Unimed para Folha"
              value="exporta_unimed_folha"
              density="comfortable"
              hide-details
            />
          </div>

          <v-divider class="my-4" />

          <!-- Outras Opções -->
          <v-row>
            <v-col cols="12" md="6">
              <v-checkbox
                v-model="previa"
                label="Prévia"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-checkbox
                v-model="apagarDados"
                label="Apagar Dados"
                density="comfortable"
                hide-details
              />
            </v-col>
          </v-row>

          <!-- Logs de Exportação -->
          <v-timeline
            v-if="logsExportacao.length > 0"
            density="compact"
            class="mt-6"
          >
            <v-timeline-item
              v-for="(log, index) in logsExportacao"
              :key="index"
              :color="
                log.tipo === 'erro'
                  ? 'error'
                  : log.tipo === 'info'
                    ? 'info'
                    : 'success'
              "
              size="small"
            >
              {{ log.mensagem }}
            </v-timeline-item>
          </v-timeline>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="fecharModalExportacao"
            :disabled="carregandoExportacao"
          >
            Sair
          </v-btn>
          <v-btn
            color="success"
            :loading="carregandoExportacao"
            @click="executarExportacao"
          >
            <v-icon left>mdi-content-save</v-icon>
            Salvar Dados
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ImportacaoHttp from "@/services/http/Importacao";
import EmpresasHttp from "@/services/http/Empresas";

const importacaoHttp = new ImportacaoHttp();
const empresasHttp = new EmpresasHttp();

// ========== DADOS IMPORTAÇÃO ==========
const mesImportacao = ref("02");
const anoImportacao = ref("2026");
const carregandoImportacao = ref(false);
const modalImportacao = ref(false);
const logsImportacao = ref<Array<{ tipo: string; mensagem: string }>>([]);

// ========== DADOS EXPORTAÇÃO ==========
const mesExportacao = ref("02");
const anoExportacao = ref("2026");
const carregandoExportacao = ref(false);
const modalExportacao = ref(false);
const logsExportacao = ref<Array<{ tipo: string; mensagem: string }>>([]);

// Filtros
const filtroSeguimento = ref(null);
const filtroEmpresa = ref(null);
const filtroColaborador = ref(null);

// Processo e opções
const processoSelecionado = ref<string[]>([]);
const previa = ref(false);
const apagarDados = ref(false);

// ========== DADOS DA API ==========
const empresas = ref<any[]>([]);
const carregandoEmpresas = ref(false);

// ========== DADOS COMPARTILHADOS ==========
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

// Dados para dropdowns
const seguimentos = ref([
  { id: "todos", nome: "Todas" },
  { id: "administrativo", nome: "Administrativo" },
  { id: "operacional", nome: "Operacional" },
]);

const colaboradores = ref([{ id: "todos", nome: "Todos" }]);

const empresasDisponiveis = computed(() => {
  if (empresas.value.length === 0) return [];

  return [
    { codEmpresa: null, label: "Todas" },
    ...empresas.value.map((emp) => ({
      ...emp,
      label: `${emp.codEmpresa} - ${emp.cnpj}`,
    })),
  ];
});

// ========== LIFECYCLE ==========
onMounted(() => {
  carregarEmpresas();
});

// ========== FUNÇÕES API ==========
async function carregarEmpresas() {
  carregandoEmpresas.value = true;
  try {
    const response = await empresasHttp.buscarEmpresasUnimed();
    empresas.value = response.data.dados || [];
  } catch (error: any) {
    console.error("Erro ao carregar empresas:", error);
  } finally {
    carregandoEmpresas.value = false;
  }
}

// ========== FUNÇÕES IMPORTAÇÃO ==========
function abrirModalImportacao() {
  modalImportacao.value = true;
  logsImportacao.value = [];
}

function fecharModalImportacao() {
  if (!carregandoImportacao.value) {
    modalImportacao.value = false;
    logsImportacao.value = [];
  }
}

async function executarImportacao() {
  carregandoImportacao.value = true;

  try {
    logsImportacao.value.push({
      tipo: "info",
      mensagem: "📥 Iniciando importação...",
    });

    const response = await importacaoHttp.importarPeriodoCompleto({
      mes: mesImportacao.value,
      ano: anoImportacao.value,
    });

    const resultado = response.data;

    if (!resultado || !resultado.resumo) {
      throw new Error("Resposta inválida da API");
    }

    logsImportacao.value.push({
      tipo: "sucesso",
      mensagem: `✅ CNPJ: ${resultado.resumo.cnpj?.totalImportado || 0} registros importados`,
    });

    logsImportacao.value.push({
      tipo: "sucesso",
      mensagem: `✅ Contrato: ${resultado.resumo.contrato?.totalImportado || 0} registros importados`,
    });

    logsImportacao.value.push({
      tipo: "sucesso",
      mensagem: `🎉 Total: ${resultado.resumo.totalGeral || 0} registros importados com sucesso!`,
    });

    const erros = [
      ...(resultado.resumo.cnpj?.erros || []),
      ...(resultado.resumo.contrato?.erros || []),
    ];

    erros.forEach((erro) => {
      logsImportacao.value.push({ tipo: "erro", mensagem: `⚠️ ${erro}` });
    });
  } catch (error: any) {
    logsImportacao.value.push({
      tipo: "erro",
      mensagem: `❌ Erro: ${error.response?.data?.message || error.message}`,
    });
  } finally {
    carregandoImportacao.value = false;
  }
}

function abrirModalExportacao() {
  modalExportacao.value = true;
  logsExportacao.value = [];
}

function fecharModalExportacao() {
  if (!carregandoExportacao.value) {
    modalExportacao.value = false;
  }
}

async function executarExportacao() {
  carregandoExportacao.value = true;
  logsExportacao.value = [];

  try {
    logsExportacao.value.push({
      tipo: "info",
      mensagem: "📤 Iniciando exportação para Totvs...",
    });

    // TODO: Implementar chamada API de exportação
    await new Promise((resolve) => setTimeout(resolve, 2000));

    logsExportacao.value.push({
      tipo: "sucesso",
      mensagem: "✅ Exportação concluída com sucesso!",
    });
  } catch (error: any) {
    logsExportacao.value.push({
      tipo: "erro",
      mensagem: `❌ Erro: ${error.message}`,
    });
  } finally {
    carregandoExportacao.value = false;
  }
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
