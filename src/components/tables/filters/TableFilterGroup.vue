<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="top right">
    <template v-slot:activator="{ props }">
      <v-row class="flex-nowrap row-filter">
        <div class="mr-3">
          {{ title }}
        </div>
        <v-badge v-if="filterActive" color="orange-lighten-1" dot>
          <v-icon color="blue-lighten-2" v-bind="props"> solar:filter-bold-duotone </v-icon>
        </v-badge>
        <v-icon
          v-if="!filterActive"
          :color="'blue-lighten-3'"
          class="mr-1"
          v-bind="props"
        >
          solar:filter-bold-duotone
        </v-icon>
      </v-row>
    </template>

    <v-card min-width="250" class="pa-3 py-3" rounded="lg">
      <slot name="items"></slot>
    </v-card>
  </v-menu>
</template>
<script lang="ts" setup>
import { ref } from "vue";

let menu = ref(false);
const props = defineProps({
  title: {
    type: String,
  },
  filterActive: {
    type: Boolean,
    default: false,
  },
  uppercase: {
    type: Boolean,
    default: false,
  },
  modelModifiers: {
    type: Object,
    default: () => ({}),
  },
});


</script>

<style scoped>
.row-filter {
  margin: initial;
  display: flex;
}

.v-input .v-input__details {
  display: none !important;
}
</style>
