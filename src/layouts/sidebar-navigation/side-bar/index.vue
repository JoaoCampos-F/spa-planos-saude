<template>
  <v-navigation-drawer
    class="position-fixed"
    :location="vuetify.display.mobile ? 'left' : undefined"
    :model-value="isDrawer()"
    :permanent="!vuetify.display.mobile.value"
    :rail="isRail()"
    rail-width="75"
    :temporary="isTemporary()"
    width="255"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <ProfileBox :hovering="!isRail()" />

    <!-- MÓDULO IMPORTAÇÃO -->
    <SubheaderGroup name="módulos" :rail="isRail()">
      <MenuItemSidebar
        v-can:role="['ADMIN', 'DP']"
        icon="mdi-cloud-download"
        name="Dados para Importação"
        :rail="isRail()"
        to="/importacao"
      />

      <MenuItemSidebar
        v-can:role="['COLABORADOR', 'ADMIN', 'DP']"
        icon="mdi-view-dashboard"
        name="Meu Dashboard"
        :rail="isRail()"
        to="/dashboard"
      />

      <MenuItemSidebar
        v-can:role="['ADMIN', 'DP']"
        icon="mdi-account-multiple"
        name="Beneficiários"
        :rail="isRail()"
        to="/beneficiarios"
      />

      <MenuItemSidebar
        icon="mdi-chart-box-outline"
        name="Relatórios"
        :rail="isRail()"
        to="/relatorios"
      />
    </SubheaderGroup>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import MenuItemSidebar from "@/layouts/sidebar-navigation/side-bar/MenuItemSidebar.vue";
import ProfileBox from "@/layouts/sidebar-navigation/side-bar/profile-box/index.vue";
import vuetify from "@/plugins/vuetify";
import { ref } from "vue";
import SubheaderGroup from "./SubheaderGroup.vue";

const hovering = ref(vuetify.display.mobile.value);

const props = defineProps({
  drawer: {
    type: Boolean,
    default: !vuetify.display.mobile.value,
  },
});

function isRail(): boolean {
  if (vuetify.display.mobile.value) return false;
  if (!props.drawer && !hovering.value) return true;

  return false;
}

function isDrawer(): boolean {
  if (!vuetify.display.mobile.value) return true;
  if (props.drawer) return true;

  return false;
}

function isTemporary(): boolean {
  return vuetify.display.mobile.value ? true : false;
}
</script>

<style>
.v-navigation-drawer__content {
  overflow: hidden;
}
.v-navigation-drawer__content::-webkit-scrollbar {
  /* Tamanhos da scroll */
  width: 0px;
}
.v-navigation-drawer__content:hover::-webkit-scrollbar {
  /* Tamanhos da scroll */
  width: 6px;
}
.v-navigation-drawer__content::-webkit-scrollbar-track {
  /* Background da scroll */
  background: rgba(0, 0, 0, 0);
}
.v-navigation-drawer__content::-webkit-scrollbar-track:hover {
  /* Background da scroll */
  background: rgba(140, 141, 143, 0.1);
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  /* Estilo da scrol, cord borda arredondada */
  background: rgba(200, 201, 203, 0.3);
  border-radius: 3px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb:hover {
  /* Cor da scroll quando hover */
  background: rgba(200, 201, 203, 0.6);
}
</style>
