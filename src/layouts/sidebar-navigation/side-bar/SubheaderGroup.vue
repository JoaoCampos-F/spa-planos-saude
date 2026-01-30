<template>
    <v-list :class="`px-3 d-flex flex-column align-${!props.rail ? 'start' : 'center'}`">
    <v-list-subheader
        class="text-uppercase font-weight-bold opacity-75 pl-0"
    >
        <h5 v-if="!props.rail" class="mx-0 mt-3 pa-0">{{ name }}</h5 class="ma-0 pa-0">
        <v-icon v-if="props.rail" size="15">solar:menu-dots-line-duotone</v-icon>
    </v-list-subheader>
        <slot />
    </v-list>
</template>

<script lang="ts" setup>

const props = defineProps<{
    name: string
    rail?: boolean
}>()

</script>

<style scoped>
/* Adicione estilos personalizados se necessário */
</style>