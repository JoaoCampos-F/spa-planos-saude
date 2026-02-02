<template>
  <v-menu offset-y rounded="lg">
    <template #activator="{ props }">
      <v-btn class="ma-1" density="comfortable" icon v-bind="props">
        <v-icon icon="solar:widget-line-duotone" size="21" />
      </v-btn>
    </template>

    <v-card width="760" class="pa-2" rounded="lg">
      <v-row>
        <!-- Left side apps -->
        <v-col cols="8">
          <v-row>
            <v-col
              v-for="(app, i) in apps"
              :key="i"
              cols="6"
              class="d-flex align-center py-3"
              style="cursor: pointer"
            >
              <v-btn
                :color="app.color"
                variant="tonal"
                icon
                density="comfortable"
                class="mr-3"
              >
                <Icon :icon="app.icon" size="22" />
              </v-btn>

              <div>
                <div class="text-body-1 font-weight-medium">
                  {{ app.title }}
                </div>
                <div class="text-caption text-grey">{{ app.subtitle }}</div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <div class="d-flex align-center justify-space-between px-1">
            <span class="text-body-2 font-weight-medium"
              >Dúvidas Frequêntes de Suporte</span
            >
            <v-btn
              class="my-3"
              size="small"
              color="blue"
              variant="flat"
              rounded="rounded"
              >Ver</v-btn
            >
          </div>
        </v-col>

        <v-divider vertical inset></v-divider>

        <!-- Right side -->
        <v-col cols="3">
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Mais acessados
          </div>
          <v-divider class="my-2" />
          <div
            v-for="(item, index) in quickLinks"
            :key="index"
            class="text-body-2 py-1"
            style="cursor: pointer"
          >
            <strong>{{ item.title }}</strong>
            <br />
            <small class="text-grey">{{ item.subtitle }}</small>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Lista de apps
const apps = [
  {
    icon: "solar:chat-round-money-bold",
    title: "Módulo PPLR",
    subtitle: "Relatorios de performance",
    color: "primary",
  },
  {
    icon: "solar:health-bold",
    title: "Plano de Saúde",
    subtitle: "learn more information",
    color: "success",
  },
  {
    icon: "solar:face-scan-circle-broken",
    title: "Orquestrador",
    subtitle: "2 Unsaved Contacts",
    color: "orquestrador",
  },
  {
    icon: "solar:settings-bold",
    title: "Painel RPA",
    subtitle: "Get new Task",
    color: "success",
  },
  {
    icon: "solar:chat-square-arrow-bold",
    title: "Entrevista Desligamento",
    subtitle: "Get profile details",
    color: "primary",
  },
  {
    icon: "solar:phone-calling-bold",
    title: "Módulo Telefonia",
    subtitle: "Get dates",
    color: "success",
  },
  {
    icon: "solar:hand-money-bold",
    title: "Módulo Comissão",
    subtitle: "Get Latest Invoice",
    color: "primary",
  },
  {
    icon: "solar:add-circle-bold",
    title: "Todos os Apps",
    subtitle: "Ver todos os aplicativos",
    color: "primary",
  },
];

const quickLinks = [
  { title: "PPLR", subtitle: "Relatorios de dados" },
  { title: "Plano de Saúde", subtitle: "Lista de adesão" },
  { title: "Orquestrador", subtitle: "Monitoramento" },
  { title: "Painel RPA", subtitle: "Serviços" },
  { title: "Painel RPA", subtitle: "Portais e Logins" },
  { title: "Orquestrador", subtitle: "Novo Robô" },
];
</script>

<style scoped>
.text-grey {
  color: #6b7280;
}
</style>
