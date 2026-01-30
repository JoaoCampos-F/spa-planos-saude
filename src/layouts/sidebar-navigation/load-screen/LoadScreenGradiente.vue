<template>
    <div class="loading-container">
        <v-progress-circular
          class="loading-progress"
          :size="70"
          :width="5"
          color="primary"
          indeterminate
        >
          <img src="../../../assets/icon.svg" alt="Logo" width="45" height="45" class="loading-progress" />
        </v-progress-circular>
      </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.loading-progress {
  color: rgba(var(--v-theme-primary), 0.7) !important;
}

</style>