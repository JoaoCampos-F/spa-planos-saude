<!-- 📁 src/pages/importacao/index.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1>Importação Unimed Cuiabá</h1>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="mes"
              :items="meses"
              label="Mês"
              item-title="nome"
              item-value="valor"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="ano"
              :items="anos"
              label="Ano"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          size="large"
          :loading="carregando"
          @click="importarPeriodoCompleto"
        >
          <v-icon left>mdi-cloud-download</v-icon>
          Importar Unimed Cuiabá
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Progress/Log -->
    <v-card v-if="logs.length > 0" class="mt-4">
      <v-card-title>📋 Log de Importação</v-card-title>
      <v-card-text>
        <v-timeline density="compact">
          <v-timeline-item
            v-for="(log, index) in logs"
            :key="index"
            :color="log.tipo === 'erro' ? 'error' : 'success'"
            size="small"
          >
            {{ log.mensagem }}
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ImportacaoHttp from "@/services/http/Importacao";

const importacaoHttp = new ImportacaoHttp();

const mes = ref("02"); // Fevereiro (atual)
const ano = ref("2026");
const carregando = ref(false);
const logs = ref<Array<{ tipo: string; mensagem: string }>>([]);

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

async function importarPeriodoCompleto() {
  carregando.value = true;
  logs.value = [];

  try {
    // ✅ SE API TIVER ENDPOINT UNIFICADO (Opção A)
    logs.value.push({ tipo: "info", mensagem: "📥 Iniciando importação..." });

    const resultado = await importacaoHttp.importarPeriodoCompleto({
      mes: mes.value,
      ano: ano.value,
    });

    logs.value.push({
      tipo: "sucesso",
      mensagem: `✅ CNPJ: ${resultado.resumo.cnpj.totalImportado} registros importados`,
    });

    logs.value.push({
      tipo: "sucesso",
      mensagem: `✅ Contrato: ${resultado.resumo.contrato.totalImportado} registros importados`,
    });

    logs.value.push({
      tipo: "sucesso",
      mensagem: `🎉 Total: ${resultado.resumo.totalGeral} registros importados com sucesso!`,
    });

    // Erros (se houver)
    [
      ...resultado.resumo.cnpj.erros,
      ...resultado.resumo.contrato.erros,
    ].forEach((erro) => {
      logs.value.push({ tipo: "erro", mensagem: `⚠️ ${erro}` });
    });
  } catch (error: any) {
    logs.value.push({
      tipo: "erro",
      mensagem: `❌ Erro: ${error.response?.data?.message || error.message}`,
    });
  } finally {
    carregando.value = false;
  }
}
</script>
