<template>
  <v-menu
    offset-y
    rounded="lg"
  >
    <template #activator="{ props }">
      <v-btn class="ma-1" density="comfortable" icon v-bind="props">
        <v-icon icon="solar:bell-bing-line-duotone" size="21" />
      </v-btn>
    </template>

    <v-card width="330" class="pa-4" rounded="lg">
      <v-row>
        <!-- Left side apps -->
        <v-col cols="12">
          <v-row>
            <v-col
              v-for="(app, i) in apps"
              :key="i"
              cols="12"
              class="d-flex align-center py-3"
              style="cursor:pointer"
            >
              <v-btn :color="app.color" variant="tonal" icon density="comfortable" class="mr-3">
                <Icon :icon="app.icon" size="22" />
              </v-btn>

              <div>
                <div class="text-body-1 font-weight-medium">{{ app.title }}</div>
                <div class="text-caption text-grey">{{ app.subtitle }}</div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <div class="d-flex align-center justify-space-between px-1">
            <span class="text-body-2 font-weight-medium">Mais notificações</span>
            <v-btn class="my-3 mt-4" size="small" color="blue" variant="flat" rounded="rounded">Ver</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script setup>
import { Icon } from '@iconify/vue'

// Lista de apps
const apps = [
  {
    icon: 'solar:chat-round-money-bold',
    title: 'Módulo PPLR',
    subtitle: 'Novo relatório disponível',
    color: 'primary'
  },
  {
    icon: 'solar:health-bold',
    title: 'Plano de Saúde',
    subtitle: 'Periodo de adesão iniciado',
    color: 'success'
  },
  {
    icon: 'solar:face-scan-circle-broken',
    title: 'Orquestrador',
    subtitle: 'Novo robô cadastrado',
    color: 'orquestrador'
  },
  {
    icon: 'logos:salesforce',
    title: 'SalesForce',
    subtitle: 'Meta de vendas alcançada, veja ...',
    color: 'success'
  },
  {
    icon: 'solar:chat-square-arrow-bold',
    title: 'Entrevista Desligamento',
    subtitle: 'Colaborador desligado em EC',
    color: 'primary'
  },
]

</script>

<style scoped>
.text-grey {
  color: #6b7280;
}
</style>