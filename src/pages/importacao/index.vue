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
          <span>Processamento de Importação</span>
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
          <span>
            <v-icon class="mr-2">mdi-cloud-upload</v-icon>
            Processamento de Exportação
          </span>
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
          <!-- Campos de Período e Filtros -->
          <v-row v-if="!carregandoExportacao && logsExportacao.length === 0">
            <!-- Seguimento (Bandeiras) - CORRIGIDO: Dropdown real -->
            <v-col cols="12" md="4">
              <v-select
                v-model="filtroBandeira"
                :items="bandeirasFiltradas"
                :loading="carregandoBandeiras"
                label="Seguimento"
                item-title="descricao"
                item-value="codBand"
                variant="outlined"
                density="comfortable"
                @update:model-value="onBandeiraChange"
              />
            </v-col>

            <!-- Empresa (Filtrada por Bandeira) -->
            <v-col cols="12" md="4">
              <v-select
                v-model="filtroEmpresa"
                :items="empresasFiltradas"
                :loading="carregandoEmpresas"
                label="Empresa"
                item-title="apelido"
                item-value="codEmpresa"
                variant="outlined"
                density="comfortable"
                clearable
                @update:model-value="onEmpresaChangeExportacao"
              />
            </v-col>

            <!-- Colaborador -->
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filtroColaborador"
                :items="colaboradoresExportacao"
                :loading="carregandoColaboradores"
                :disabled="filtroEmpresa === 'T'"
                label="Colaborador(a)"
                item-title="label"
                item-value="cpf"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>

            <!-- Mês -->
            <v-col cols="12" md="6">
              <v-select
                v-model="mesExportacao"
                :items="meses"
                label="Mês"
                item-title="nome"
                item-value="valor"
                variant="outlined"
                density="comfortable"
                @update:model-value="carregarProcessosExportacao"
              />
            </v-col>

            <!-- Ano -->
            <v-col cols="12" md="6">
              <v-select
                v-model="anoExportacao"
                :items="anos"
                label="Ano"
                variant="outlined"
                density="comfortable"
                @update:model-value="carregarProcessosExportacao"
              />
            </v-col>
          </v-row>

          <!-- Divisão para Processos -->
          <v-divider class="my-4" v-if="logsExportacao.length === 0" />

          <!-- Lista de Processos -->
          <div v-if="!carregandoExportacao && logsExportacao.length === 0">
            <div v-if="carregandoProcessos" class="text-center py-8">
              <v-progress-circular indeterminate color="success" size="48" />
              <p class="text-body-2 text-grey-darken-1 mt-4">
                Carregando processos disponíveis...
              </p>
            </div>

            <div v-else-if="processosExportacao.length === 0" class="py-4">
              <v-alert type="warning" variant="tonal">
                Nenhum processo disponível. Selecione mês, ano e empresa para
                carregar os processos.
              </v-alert>
            </div>

            <div v-else>
              <h3 class="text-h6 mb-3">
                Processos Disponíveis
                <v-chip size="small" color="info" class="ml-2">
                  {{ processosExportacao.length }}
                </v-chip>
              </h3>

              <v-list density="compact" class="mb-4">
                <v-list-item
                  v-for="processo in processosExportacao"
                  :key="processo.codigo"
                  class="processo-item"
                >
                  <template #prepend>
                    <!-- ✅ CORRIGIDO: Checkboxes para seleção múltipla (como no npd-legacy) -->
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
                      {{ processo.dataUltimaExecucao }}
                      {{ processo.usuario ? `(${processo.usuario})` : "" }}
                    </v-chip>
                    <v-chip v-else size="x-small" color="grey" variant="flat">
                      <v-icon start size="x-small">mdi-clock-outline</v-icon>
                      Nunca executado
                    </v-chip>
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      icon="mdi-eye"
                      size="x-small"
                      variant="text"
                      color="warning"
                      @click="verHistoricoProcesso(processo.codigo)"
                      title="Ver histórico"
                    />
                  </template>
                </v-list-item>
              </v-list>

              <v-divider class="my-4" />

              <!-- Opções de Execução -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="previa"
                    label="Gerar Prévia (não confirma no TOTVS)"
                    hint="Útil para validar antes da exportação definitiva"
                    persistent-hint
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="apagarDados"
                    label="Apagar dados antigos antes de exportar"
                    hint="⚠️ Requer permissão ADMIN"
                    persistent-hint
                    density="comfortable"
                    color="error"
                  />
                </v-col>
              </v-row>
            </div>
          </div>

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
            {{ logsExportacao.length > 0 ? "Fechar" : "Sair" }}
          </v-btn>
          <v-btn
            v-if="logsExportacao.length === 0"
            color="success"
            :loading="carregandoExportacao"
            :disabled="!podeExecutar"
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
import ColaboradoresHttp from "@/services/http/Colaboradores";
import ExportacaoHttp from "@/services/http/Exportacao";
import { bandeirasService, type TipoBandeira } from "@/services/http/Bandeiras";
import type { ProcessoParaExportacao } from "@/services/http/Exportacao";

const importacaoHttp = new ImportacaoHttp();
const empresasHttp = new EmpresasHttp();
const colaboradoresHttp = new ColaboradoresHttp();
const exportacaoHttp = new ExportacaoHttp();

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

// Filtros Exportação
const filtroBandeira = ref<number | "T" | null>("T"); // Todas as bandeiras por padrão
const filtroEmpresa = ref<number | "T" | null>("T"); // Todas as empresas por padrão
const filtroColaborador = ref<string | null>(null);

// Dados das bandeiras
const bandeiras = ref<TipoBandeira[]>([]);
const carregandoBandeiras = ref(false);

// Processos e opções (UM processo por vez via radio button)
const processosExportacao = ref<ProcessoParaExportacao[]>([]);
// ✅ CORRIGIDO: Array para múltiplos processos (como npd-legacy)
const processosSelecionados = ref<string[]>([]);
const carregandoProcessos = ref(false);
const previa = ref(false);
const apagarDados = ref(false);

// ========== DADOS DA API ==========
const empresas = ref<any[]>([]);
const carregandoEmpresas = ref(false);
const colaboradoresExportacao = ref<any[]>([]);
const carregandoColaboradores = ref(false);

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

// ========== COMPUTED ==========
const anos = computed(() => {
  const anoAtual = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(anoAtual - i));
});

// Bandeiras filtradas (com opção "Todas")
const bandeirasFiltradas = computed(() => {
  const opcoes = [{ codBand: "T", descricao: "Todas as bandeiras" }];
  return [...opcoes, ...bandeiras.value];
});

// Empresas filtradas por bandeira selecionada
const empresasFiltradas = computed(() => {
  const opcoes = [{ codEmpresa: "T", apelido: "Todas as empresas" }];

  if (empresas.value.length === 0) {
    return opcoes;
  }

  // Se bandeira = 'T', mostrar todas as empresas
  if (filtroBandeira.value === "T") {
    return [...opcoes, ...empresas.value];
  }

  // Filtrar empresas pela bandeira selecionada
  const empresasFiltradasPorBandeira = empresas.value.filter(
    (emp) => emp.codBand === filtroBandeira.value,
  );

  return [...opcoes, ...empresasFiltradasPorBandeira];
});

// Validação do botão salvar (só mês, ano e processos obrigatórios)
const podeExecutar = computed(() => {
  return (
    mesExportacao.value &&
    anoExportacao.value &&
    processosSelecionados.value.length > 0
  );
});

// ========== LIFECYCLE ==========
onMounted(() => {
  carregarBandeiras();
  carregarEmpresas();
});

// ========== FUNÇÕES API ==========
async function carregarBandeiras() {
  carregandoBandeiras.value = true;
  try {
    bandeiras.value = await bandeirasService.listarBandeiras();
  } catch (error: any) {
    console.error("Erro ao carregar bandeiras:", error);
  } finally {
    carregandoBandeiras.value = false;
  }
}

async function carregarEmpresas() {
  carregandoEmpresas.value = true;
  try {
    // Filtrar por bandeira se selecionada
    const codBand =
      filtroBandeira.value !== "T" ? Number(filtroBandeira.value) : undefined;
    const response = await empresasHttp.listarEmpresas(codBand);
    empresas.value = response.data.dados || [];
  } catch (error: any) {
    console.error("Erro ao carregar empresas:", error);
  } finally {
    carregandoEmpresas.value = false;
  }
}

async function carregarColaboradores() {
  // Só carrega se tiver empresa específica selecionada (não "T")
  if (!filtroEmpresa.value || filtroEmpresa.value === "T") {
    colaboradoresExportacao.value = [];
    filtroColaborador.value = null;
    return;
  }

  // Buscar empresa real pelos dados
  const empresaReal = empresas.value.find(
    (e) => e.codEmpresa === filtroEmpresa.value,
  );

  if (!empresaReal || !empresaReal.codEmpresa) {
    colaboradoresExportacao.value = [];
    return;
  }

  carregandoColaboradores.value = true;
  try {
    const response = await colaboradoresHttp.listarColaboradores(
      Number(empresaReal.codEmpresa),
      empresaReal.codColigada,
    );

    colaboradoresExportacao.value = (response.data.dados || []).map(
      (colab: any) => ({
        ...colab,
        label: `${colab.nome} - ${colab.cpf}`,
      }),
    );
  } catch (error: any) {
    console.error("Erro ao carregar colaboradores:", error);
    colaboradoresExportacao.value = [];
  } finally {
    carregandoColaboradores.value = false;
  }
}

// Função para mudança de bandeira (fluxo correto Bandeira → Empresa)
function onBandeiraChange() {
  // Resetar empresa e colaborador quando bandeira mudar
  filtroEmpresa.value = "T";
  filtroColaborador.value = null;
  colaboradoresExportacao.value = [];

  // Recarregar empresas filtradas pela nova bandeira
  carregarEmpresas();
}

async function carregarProcessosExportacao() {
  if (!mesExportacao.value || !anoExportacao.value) {
    processosExportacao.value = [];
    return;
  }

  carregandoProcessos.value = true;
  processosSelecionados.value = [];

  try {
    // ✅ CORRIGIDO: Tipo 'U' para módulo UNI (não 'C')
    const response = await exportacaoHttp.listarProcessos({
      categoria: "UNI", // ✅ Sempre UNI para este módulo
      tipoDado: "U", // ✅ CORRETO: 'U' não 'C'
      mesRef: parseInt(mesExportacao.value),
      anoRef: parseInt(anoExportacao.value),
    });

    processosExportacao.value = response.data || [];
  } catch (error: any) {
    console.error("Erro ao carregar processos:", error);
    processosExportacao.value = [];
  } finally {
    carregandoProcessos.value = false;
  }
}

// ❌ REMOVIDO: onBandeiraChange (bandeiras inventadas não existem mais)

function onEmpresaChangeExportacao() {
  filtroColaborador.value = null;
  colaboradoresExportacao.value = [];

  if (filtroEmpresa.value && filtroEmpresa.value !== "T") {
    carregarColaboradores();
  }
}

function verHistoricoProcesso(codigoProcesso: string) {
  // TODO: Implementar modal de histórico
  console.log("Ver histórico do processo:", codigoProcesso);
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
      mensagem: "Iniciando importação...",
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
      mensagem: `CNPJ: ${resultado.resumo.cnpj?.totalImportado || 0} registros importados`,
    });

    logsImportacao.value.push({
      tipo: "sucesso",
      mensagem: `Contrato: ${resultado.resumo.contrato?.totalImportado || 0} registros importados`,
    });

    logsImportacao.value.push({
      tipo: "sucesso",
      mensagem: `Total: ${resultado.resumo.totalGeral || 0} registros importados com sucesso!`,
    });

    const erros = [
      ...(resultado.resumo.cnpj?.erros || []),
      ...(resultado.resumo.contrato?.erros || []),
    ];

    erros.forEach((erro) => {
      logsImportacao.value.push({ tipo: "erro", mensagem: erro });
    });
  } catch (error: any) {
    logsImportacao.value.push({
      tipo: "erro",
      mensagem: `Erro: ${error.response?.data?.message || error.message}`,
    });
  } finally {
    carregandoImportacao.value = false;
  }
}

// ========== FUNÇÕES EXPORTAÇÃO ==========
function abrirModalExportacao() {
  modalExportacao.value = true;
  logsExportacao.value = [];

  // ✅ Definir valores padrão como no npd-legacy
  const hoje = new Date();
  mesExportacao.value = String(hoje.getMonth() + 1).padStart(2, "0");
  anoExportacao.value = String(hoje.getFullYear());

  // Carregar empresas se ainda não foram carregadas
  if (empresas.value.length === 0) {
    carregarEmpresas();
  }

  // ✅ Carregar processos automaticamente como no npd-legacy (setTimeout de 2s como no original)
  setTimeout(() => {
    carregarProcessosExportacao();
  }, 2000);
}

function fecharModalExportacao() {
  if (!carregandoExportacao.value) {
    modalExportacao.value = false;
    logsExportacao.value = [];
    // Resetar estado
    filtroBandeira.value = "T";
    filtroEmpresa.value = "T";
    filtroColaborador.value = null;
    processosExportacao.value = [];
    processosSelecionados.value = [];
    previa.value = false;
    apagarDados.value = false;
  }
}

async function executarExportacao() {
  if (!processosSelecionados.value.length) {
    logsExportacao.value.push({
      tipo: "erro",
      mensagem: "Selecione pelo menos um processo para exportar",
    });
    return;
  }

  carregandoExportacao.value = true;
  logsExportacao.value = [];

  try {
    logsExportacao.value.push({
      tipo: "info",
      mensagem: `Iniciando exportação de ${processosSelecionados.value.length} processo(s) para o TOTVS...`,
    });

    // ✅ CORRIGIDO: Enviar múltiplos processos como no NPD-Legacy
    const payload = {
      mesRef: parseInt(mesExportacao.value),
      anoRef: parseInt(anoExportacao.value),
      processos: processosSelecionados.value, // ✅ Array de processos
      codBand:
        filtroBandeira.value !== "T" ? String(filtroBandeira.value) : "T",
      empresa: filtroEmpresa.value !== "T" ? String(filtroEmpresa.value) : "T",
      colaborador: filtroColaborador.value || "",
      previa: previa.value,
      apagar: apagarDados.value,
    };

    await exportacaoHttp.exportarParaTotvs(payload);

    logsExportacao.value.push({
      tipo: "sucesso",
      mensagem: "Todos os processos foram executados com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro ao exportar:", error);
    logsExportacao.value.push({
      tipo: "erro",
      mensagem: `Erro: ${error.response?.data?.message || error.message}`,
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

.processo-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.processo-item:last-child {
  border-bottom: none;
}

.processo-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
