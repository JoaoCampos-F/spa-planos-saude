<template>
  <v-card class="fill-height">
    <v-layout class="fill-height">
      <AppBar @toggle-drawer="toggleDrawer" />
      <MenuDrawer :drawer="drawer" @update:drawer="toggleDrawer" />
      <v-main :class="'fill-height theme-' + vuetify.theme.name.value">
        <v-container class="px-7 mt-3" max-width="1920">
          <router-view />
        </v-container>
        <AppFooter />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import vuetify from "@/plugins/vuetify";
import AppFooter from "./AppFooter.vue";
import MenuDrawer from "./side-bar/index.vue";
import AppBar from "./app-bar/index.vue";

const drawer = ref(true);
const group = ref(null);
const background = ref("theme-light");

watch(group, () => {
  drawer.value = false;
});

function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

.fill-height {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.theme-light {
  background-color: #eef5f9;
}

.theme-dark {
  background-color: #192838;
}
</style>
