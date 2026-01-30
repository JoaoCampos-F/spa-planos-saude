<template>
  <v-list-item
    :class="`my-min py-min w-100 d-flex align-center ${
      rail ? 'justify-center' : 'justify-start pl-4'
    }`"
    color="secondary"
    density="comfortable"
    rounded="xl"
    variant="flat"
    :to="props.to"
  >
    <v-icon class="" size="18">{{ icon }}</v-icon>
    <small size="22" class="ml-3 margintop-item item-font" v-if="!props.rail">{{
      name
    }}</small>
  </v-list-item>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon: string;
  name: string;
  rail?: boolean;
  to: string;
}>();
</script>

<style scoped>
.my-min {
  margin: 1px 0 !important;
}

.py-min {
  padding-bottom: -10px !important;
}

.item-font {
  font-weight: 450 !important;
  font-size: 14px !important;
}
</style>
