<template>
    <v-container class="pa-0">
        <v-row>
            <v-col :cols="12" :offset="0">
                <v-row>
                    <v-col cols="auto" class="d-flex flex-column justify-center">
                        <h3 class="breadcrumb-title">{{ lastBreadcrumb }}</h3>
                        <nav class="breadcrumb-nav">
                            <span v-for="(crumb, index) in breadcrumbList" :key="index"
                                  :style="{ color: `rgba(136, 136, 136, ${1 - (index / (breadcrumbList.length - 1)) * 0.3})` }">
                                <span>{{ crumb }}</span>
                                <span v-if="index < breadcrumbList.length - 1">
                                    <v-icon size="15" class="mx-1 mb-1">solar:alt-arrow-right-bold-duotone</v-icon>
                                </span>
                            </span>
                        </nav>
                    </v-col>
                    <v-spacer v-if="!vuetify.display.mobile.value" />
                    <v-col cols="auto" class="h-100" width="250px" v-if="!vuetify.display.mobile.value">
                        <KpiCard 
                            label="2025" 
                            amount="R$ 00,00" 
                            :values="[50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]"
                        />
                    </v-col>
                    <v-col cols="auto" class="h-100" width="250px" v-if="!vuetify.display.mobile.value">
                        <KpiCard 
                            label="2024" 
                            amount="R$ 00,00" 
                            :values="[50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]"
                            secondary
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container class="pa-0">
    <v-row>
      <v-col class="mt-1">
        <slot />
      </v-col>
    </v-row>
</template>

<script setup>
import { computed } from 'vue';
import vuetify from '@/plugins/vuetify';

const props = defineProps({
    breadcrumbs: {
        type: Object,
        required: true
    }
});

const breadcrumbList = computed(() =>
    Object.keys(props.breadcrumbs)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => props.breadcrumbs[key])
);

const lastBreadcrumb = computed(() => {
    const keys = Object.keys(props.breadcrumbs).map(Number);
    const maxKey = Math.max(...keys);
    return props.breadcrumbs[maxKey];
});
</script>

<style scoped>


.breadcrumb-title {
    font-weight: 450;
}

.breadcrumb-nav {
    font-size: 1rem;
    color: #888;
}
</style>
