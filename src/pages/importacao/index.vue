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
            <v-col cols="12">
              <v-alert type="info" variant="tonal" class="mb-4">
                Selecione o período, bandeira, empresa e processos que deseja
                executar
              </v-alert>
            </v-col>

            <!-- Mês e Ano -->
            <v-col cols="12" md="3">
              <v-select
                v-model="mesExportacao"
                :items="meses"
                label="Mês *"
                item-title="nome"
                item-value="valor"
                variant="outlined"
                density="comfortable"
                @update:model-value="carregarProcessosExportacao"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="anoExportacao"
                :items="anos"
                label="Ano *"
                variant="outlined"
                density="comfortable"
                @update:model-value="carregarProcessosExportacao"
              />
            </v-col>

            <!-- Bandeira -->
            <v-col cols="12" md="6">
              <v-select
                v-model="filtroBandeira"
                :items="bandeiras"
                label="Bandeira *"
                item-title="nome"
                item-value="codigo"
                variant="outlined"
                density="comfortable"
                @update:model-value="onBandeiraChange"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.raw.nome">
                    <template #prepend>
                      <v-chip :color="item.raw.cor" size="x-small" class="mr-2">
                        {{ item.raw.codigo }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <!-- Empresa -->
            <v-col cols="12" md="6">
              <v-select
                v-model="filtroEmpresa"
                :items="empresasFiltradas"
                :loading="carregandoEmpresas"
                :disabled="!filtroBandeira"
                label="Empresa *"
                item-title="label"
                item-value="sigla"
                variant="outlined"
                density="comfortable"
                clearable
                @update:model-value="onEmpresaChangeExportacao"
                hint="Selecione 'Todas' para exportar todas as empresas da bandeira"
                persistent-hint
              />
            </v-col>

            <!-- Colaborador -->
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filtroColaborador"
                :items="colaboradoresExportacao"
                :loading="carregandoColaboradores"
                :disabled="filtroEmpresa === 'T'"
                label="Colaborador (opcional)"
                item-title="label"
                item-value="cpf"
                variant="outlined"
                density="comfortable"
                clearable
                hint="Requer empresa específica (não funciona com 'Todas')"
                persistent-hint
              />
            </v-col>
          </v-row>

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
                Nenhum processo disponível. Selecione mês, ano e bandeira para
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
                    <v-radio-group
                      v-model="processoSelecionado"
                      hide-details
                      density="compact"
                    >
                      <v-radio :value="processo.codigo" density="compact" />
                    </v-radio-group>
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
            {{ logsExportacao.length > 0 ? "Fechar" : "Cancelar" }}
          </v-btn>
          <v-btn
            v-if="logsExportacao.length === 0"
            color="success"
            :loading="carregandoExportacao"
            :disabled="
              !processoSelecionado ||
              !filtroEmpresa ||
              !filtroBandeira ||
              !mesExportacao ||
              !anoExportacao
            "
            @click="executarExportacao"
          >
            <v-icon left>mdi-cloud-upload</v-icon>
            Exportar para TOTVS
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
const filtroBandeira = ref<string | null>(null);
const filtroEmpresa = ref<string | null>(null);
const filtroColaborador = ref<string | null>(null);

// Processos e opções (UM processo por vez via radio button)
const processosExportacao = ref<ProcessoParaExportacao[]>([]);
const processoSelecionado = ref<string | null>(null);
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

const anos = computed(() => {
  const anoAtual = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(anoAtual - i));
});

// Bandeiras disponíveis (replicando npd-legacy)
const bandeiras = [
  { codigo: "U", nome: "Unimed", cor: "green" },
  { codigo: "G", nome: "GSV", cor: "blue" },
  { codigo: "S", nome: "SAN", cor: "orange" },
];

// Empresas filtradas por bandeira + opção "Todas"
const empresasFiltradas = computed(() => {
  if (!filtroBandeira.value || empresas.value.length === 0) {
    return [{ sigla: "T", label: "Todas as empresas" }];
  }

  // Filtrar empresas pela bandeira selecionada
  const empresasDaBandeira = empresas.value.filter((emp) => {
    // Mapear codBand para letra da bandeira
    const bandeiraCod = emp.codBand?.toString();
    if (filtroBandeira.value === "U") return bandeiraCod === "3"; // Unimed
    if (filtroBandeira.value === "G") return bandeiraCod === "1"; // GSV
    if (filtroBandeira.value === "S") return bandeiraCod === "2"; // SAN
    return false;
  });

  return [
    { sigla: "T", label: "Todas as empresas" },
    ...empresasDaBandeira.map((emp) => ({
      ...emp,
      sigla: emp.apelido || emp.codEmpresa.toString(),
      label: `${emp.apelido || emp.codEmpresa} - ${emp.cnpj}`,
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
    const response = await empresasHttp.listarEmpresas();
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
  const empresaReal = empresasFiltradas.value.find(
    (e) => e.sigla === filtroEmpresa.value,
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

async function carregarProcessosExportacao() {
  if (!filtroBandeira.value || !mesExportacao.value || !anoExportacao.value) {
    processosExportacao.value = [];
    return;
  }

  carregandoProcessos.value = true;
  processoSelecionado.value = null;

  try {
    // Mapear bandeira para categoria
    let categoria = "UNI"; // Padrão Unimed
    if (filtroBandeira.value === "G") categoria = "GSV";
    if (filtroBandeira.value === "S") categoria = "SAN";

    const response = await exportacaoHttp.listarProcessos({
      categoria,
      tipoDado: "C",
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

function onBandeiraChange() {
  // Resetar filtros ao mudar bandeira
  filtroEmpresa.value = null;
  filtroColaborador.value = null;
  colaboradoresExportacao.value = [];
  processosExportacao.value = [];
  processoSelecionado.value = null;

  if (filtroBandeira.value) {
    carregarProcessosExportacao();
  }
}

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
}

function fecharModalExportacao() {
  if (!carregandoExportacao.value) {
    modalExportacao.value = false;
    logsExportacao.value = [];
    // Resetar estado
    filtroBandeira.value = null;
    filtroEmpresa.value = null;
    filtroColaborador.value = null;
    processosExportacao.value = [];
    processoSelecionado.value = null;
    previa.value = false;
    apagarDados.value = false;
  }
}

async function executarExportacao() {
  if (!processoSelecionado.value) {
    logsExportacao.value.push({
      tipo: "erro",
      mensagem: "Selecione um processo para exportar",
    });
    return;
  }

  if (!filtroBandeira.value || !filtroEmpresa.value) {
    logsExportacao.value.push({
      tipo: "erro",
      mensagem: "Selecione bandeira e empresa",
    });
    return;
  }

  carregandoExportacao.value = true;
  logsExportacao.value = [];

  try {
    logsExportacao.value.push({
      tipo: "info",
      mensagem: `Iniciando exportação para o TOTVS...`,
    });

    const payload = {
      mesRef: parseInt(mesExportacao.value),
      anoRef: parseInt(anoExportacao.value),
      codigoProcesso: processoSelecionado.value,
      bandeira: filtroBandeira.value,
      empresa: filtroEmpresa.value,
      cpfColaborador: filtroColaborador.value || undefined,
      previa: previa.value,
      apagar: apagarDados.value,
    };

    const response = await exportacaoHttp.exportarParaTotvs(payload);
    const resultado = response.data;

    if (resultado.sucesso) {
      logsExportacao.value.push({
        tipo: "sucesso",
        mensagem: resultado.mensagem || "Exportação concluída com sucesso!",
      });

      if (resultado.totalExportado > 0) {
        logsExportacao.value.push({
          tipo: "info",
          mensagem: `Total exportado: ${resultado.totalExportado} registros`,
        });
      }
    } else {
      logsExportacao.value.push({
        tipo: "erro",
        mensagem: resultado.mensagem || "Erro na exportação",
      });
    }

    if (resultado.erros && resultado.erros.length > 0) {
      resultado.erros.forEach((erro: string) => {
        logsExportacao.value.push({ tipo: "erro", mensagem: erro });
      });
    }
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
