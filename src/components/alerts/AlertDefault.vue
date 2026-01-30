<template>
  <v-alert
    v-model="notifySnake.show"
    :type="notifySnake.type"
    rounded="lg"
    :title="notifySnake.title"
    max-width="400px"
    class="p-absolute"
  >
    {{ notifySnake.message }}
  </v-alert>
</template>

<script setup>
import { notifySnake } from "@/stores/notifySnake";
</script>

<style scoped>
.p-absolute {
  position: fixed !important;
  z-index: 20 !important;
  top: 4.5rem !important;
  right: 0.5rem !important;
  opacity: 0.9 !important;
}
</style>
