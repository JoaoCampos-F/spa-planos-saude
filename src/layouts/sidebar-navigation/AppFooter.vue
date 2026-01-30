<template>
  <v-footer app class="bottom" height="40">
    <a
      v-for="item in items"
      :key="item.title"
      class="d-inline-block mx-2 social-link opacity-60"
      :href="item.href"
      rel="noopener noreferrer"
      :title="item.title"
    >
      <v-icon :icon="item.icon" :size="item.icon === 'mdi-web-box' ? 24 : 16" />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px"
    >
      &copy; {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">Grupo Cometa</span>
      —
      <a
        class="text-decoration-none on-surface"
        href="#"
        rel="noopener noreferrer"
      >
        PPLR
        <v-tooltip activator="parent" location="top"> PPLR </v-tooltip>
      </a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
const items = [
  {
    title: "Grupo Cometa",
    icon: "mdi-web-box",
    href: "#",
  },
];
</script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(24, 103, 192, 1)
</style>
