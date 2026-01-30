<template>
  <v-app>
    <v-main>
      <!-- Tela de loading -->
      <!-- <LoadScreenCircular v-if="isLoading" /> -->
      <LoadScreenGradiente v-if="isLoading" />

      <router-view v-else />
      <AlertDefault />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import initilizeSelectOption from "./stores/selectOptions/initilize";
// @ts-ignore: Vue SFC lacks a declaration file; add a 'shims-vue.d.ts' with "declare module '*.vue'" to fix properly
import AlertDefault from "./components/alerts/AlertDefault.vue";
import LoadScreenCircular from "./layouts/sidebar-navigation/load-screen/LoadScreenCircular.vue";
import LoadScreenGradiente from "./layouts/sidebar-navigation/load-screen/LoadScreenGradiente.vue";

const isLoading = ref(true);

onMounted(async () => {
  try {
    await initilizeSelectOption();
  } finally {
    isLoading.value = false;
  }
});
</script>
