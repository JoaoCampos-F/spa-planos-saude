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

    <!-- <SubheaderGroup name="Geral" :rail="isRail()">
      <MenuItemSidebar
        icon="solar:chart-broken"
        name="Dashboard"
        :rail="isRail()"
        to="/dashboard"
      />
    </SubheaderGroup> -->

    <SubheaderGroup :name="$t('relatorios')" :rail="isRail()">
      <MenuItemSidebar
        icon="solar:chart-square-broken"
        :name="$t('dados')"
        :rail="isRail()"
        to="/relatorios/dados"
        v-if="vCanPermission('relatorios-dados#list')"
      />
      <MenuItemSidebar
        icon="solar:document-add-broken"
        :name="$t('notas')"
        :rail="isRail()"
        to="/relatorios/notas"
        v-if="vCanPermission('relatorios-notas#list')"
      />
      <MenuItemSidebar
        icon="solar:money-bag-broken"
        :name="$t('valores-possiveis')"
        :rail="isRail()"
        to="/relatorios/valores-possiveis"
        v-if="vCanPermission('relatorios-valores-possiveis#list')"
      />
      <MenuItemSidebar
        icon="solar:documents-broken"
        :name="$t('final')"
        :rail="isRail()"
        to="/relatorios/final"
        v-if="vCanPermission('relatorios-final#list')"
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
import { vCanPermission } from "@/support/directives/can";

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
