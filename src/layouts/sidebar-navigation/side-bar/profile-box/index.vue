<template>
    <v-list 
      :class="'d-flex align-center justify-center profile-box-bg flex-column'"
      height="150"
      width="100%"
    >
        <v-list-item class="w-100 mb-6 ">
            <v-img
              max-height="80"
              max-width="80"
              src="../../../../assets/logo-texto.svg"
            />
        </v-list-item>
        
        <v-btn class="v-btn--readonly mb-0 bg-semitransparent text-capitalize" width="100vw" height="30px" rounded="0" style="position: absolute; bottom: 0; left: 0; right: 0;">
            <p v-if="hovering">{{ $t('bemvindos') }} {{ hovering ? user?.name : '' }}</p>
            <v-icon v-else>solar:subtitles-line-duotone</v-icon>
        </v-btn>
    </v-list>

    <v-divider />
</template>

<script lang="ts" setup>
// import { colaboradorStore } from '@/stores/selectOptions';
import { ssoStore } from '@/stores/sso';
import { hasOnlyExpressionInitializer } from 'typescript';
const base64Image = ref('');

  const user = ssoStore().getUser;

defineProps<{
    hovering: boolean;
}>() 

</script>

<style>
  .profile-box-bg {
    background-image: url('../../../../assets/img/sidebar/profile-box-bg.svg') !important;
    background-size: cover !important;
    background-position: center !important;
    background-position: left !important;
  }

  .bg-semitransparent{
    background-color: rgb(var(--v-theme-surface), 0.75) !important;
  }
</style>