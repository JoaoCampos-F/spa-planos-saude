<template>
  <slot name="top"></slot>
  <v-autocomplete
    v-bind="$attrs"
    variant="outlined"
    density="compact"
    rounded="lg"
    color="primary"
    v-model="internalValue"
    @update:model-value="emit('update:modelValue', $event)"
    @click:clear="clearable()"
    class="my-1"
  />
  <slot name="bottom"></slot>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    required: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
});

const isSelected = computed(() => {
  if (internalValue.value === false) return true;

  if (Array.isArray(internalValue.value)) {
    return internalValue.value.length;
  }
  return !!internalValue.value;
});

const internalValue = ref(props.modelValue);
const emit = defineEmits(["update:modelValue"]);

function clearable() {
  if(props.clearable) emit("update:modelValue", undefined);
}
</script>
