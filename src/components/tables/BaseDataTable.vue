<template>
  <v-card grid-list-xs class="border-sm rounded-lg pa-5" loading="false">
    <div class="d-flex align-center py-3">
      <slot name="top-actions" />
    </div>
    <v-data-table-server
      class="responsive-table"
      v-bind="$attrs"
      density="comfortable"
      :mobile="vuetify.display.mobile.value"
      :hide-default-header="vuetify.display.mdAndDown.value"
      :items-length="itemsLength"
      :items-per-page-options="[
        { value: 6, title: '6' },
        { value: 10, title: '10' },
        { value: 25, title: '25' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: -1, title: 'Tudo' },
      ]"
    >
      <template #loading>
        <v-skeleton-loader
          :type="`table-row@${$attrs.itemsLength ? $attrs.itemsLength : 6}`"
          :height="450"
        ></v-skeleton-loader>
      </template>

      <template #loader>
        <v-progress-linear
          color="blue-lighten-4"
          :v-show="true"
          :indeterminate="true"
        ></v-progress-linear>
      </template>

      <template
        v-for="header in ($attrs.headers as Header[])"
        :key="header.title"
        v-slot:[`header.${header.key}`]="{ column }"
      >
        <th :class="`font-weight-bold d-flex justify-${header.align}`">
          <slot :name="`header.${header.key}`" :column="column">
            {{ header.title }}
          </slot>
        </th>
      </template>
      <!-- Expor slots dinamicamente para cada coluna -->
      <template
        v-for="header in ($attrs.headers as Header[])"
        :key="header.title"
        v-slot:[`item.${header.key}`]="{ item }"
      >
        <td
          :data-label="header.title"
          :class="`d-flex justify-${header.align} pa-0`"
        >
          <slot :name="`item.${header.key}`" :item="item">
            {{ getValue(item, header) }}
          </slot>
        </td>
      </template>

      <template #footer.prepend>
        <slot name="footer" />
        <v-spacer></v-spacer>
      </template>
    </v-data-table-server>
  </v-card> 
</template>

<script setup lang="ts">
import vuetify from "@/plugins/vuetify";

const props = defineProps({
  itemsLength: {
    type: Number,
    default: 0,
  },
});

type Header = {
  title: string;
  key: string;
  sortable: boolean;
  align: string;
};

type Options = {
  page: number;
  itemsPerPage: number;
  sortKey?: any[];
};

function getValue(item: any, header: any) {
  return eval(`item.${header.key}`);
}

export type { Options, Header };
</script>

<style></style>
