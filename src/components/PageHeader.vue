<template>
  <v-card flat class="mb-6">
    <v-card-text class="px-3 py-3">
      <div class="d-flex align-center">
        <v-avatar
          v-if="icon"
          :color="iconColor || 'primary'"
          size="48"
          class="mr-3"
        >
          <v-icon color="white" size="28">{{ icon }}</v-icon>
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold mb-0">{{ title }}</h1>
          <p v-if="subtitle" class="text-body-2 text-medium-emphasis ma-0">
            {{ subtitle }}
          </p>
        </div>
        <v-spacer />
        <slot name="actions"></slot>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
}>();
</script>
