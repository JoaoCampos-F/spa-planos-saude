<template>
  <!-- Appbar para Desktop -->
  <v-app-bar
    v-if="!vuetify.display.mobile.value"
    class="pa-0 position-fixed"
    color="primary"
    elevation="0"
    height="60"
  >
    <v-container height="65" :width="drawer ? 260 : 90">
      <img
        alt="logo do sistema"
        class="ml-2"
        src="@/assets/icon-grey-scale.svg"
        width="30"
      />
      <img
        v-if="drawer"
        alt="logo do sistema"
        class="logo"
        src="@/assets/logo-texto-grey-scale.svg"
        width="80"
      />
    </v-container>

    <v-btn
      class="ma-1"
      density="comfortable"
      icon
      @click="$emit('toggle-drawer'), toggleDrawer()"
    >
      <v-icon icon="solar:list-bold" size="22" />
    </v-btn>

    <!-- <v-btn class="ma-1" density="comfortable" icon>
      <v-icon icon="solar:magnifer-outline" size="21" />
    </v-btn> -->

    <app-launcher />

    <v-toolbar-title class="d-flex justify-end mr-5">
      <v-btn class="ma-1" density="comfortable" icon>
        <v-icon icon="cif:br" size="21" />
      </v-btn>

      <v-btn class="ma-1" density="comfortable" icon @click="toggleTheme">
        <v-icon
          :icon="isDarkTheme ? 'solar:sun-line-duotone' : 'solar:moon-broken'"
          size="21"
        />
      </v-btn>

      <notification-box />

      <v-btn class="ma-1" density="comfortable" icon disabled>
        <v-icon icon="solar:inbox-line-line-duotone" size="21" />
      </v-btn>

      <!-- <v-btn class="ma-1" density="comfortable" icon>
        <v-icon icon="solar:cart-large-line-duotone" size="21" />
      </v-btn> -->
    </v-toolbar-title>

    <v-menu :close-on-back="true" :close-on-content-click="false" offset-y>
      <template #activator="{ props }">
        <v-avatar
          class="mr-4 cursor-pointer border-lg border-light"
          elevation="5"
          size="40"
          variant="outlined"
          v-bind="props"
        >
          <img
            alt="Imagem de Perfil"
            v-if="base64Image"
            :src="base64Image"
            width="100%"
          />
          <img
            alt="Imagem de Perfil"
            v-else
            :src="`https://ui-avatars.com/api/?name=${user?.name}&background=155AA9&color=FFF&size=128&length=2`"
            width="100%"
          />
        </v-avatar>
      </template>

      <v-card
        class="pa-3 dropdown-card perfil-personalziado"
        elevation="1"
        height="auto"
        width="300"
      >
        <div class="text-center mb-1">
          <v-card class="elevation-0">
            <template #title>
              <v-avatar
                class="mb-2 mx-3 border-lg border-primary"
                elevation="5"
                size="60"
                variant="outlined"
              >
                <img
                  alt="Imagem de Perfil"
                  :src="`https://ui-avatars.com/api/?name=${user?.name}&background=155AA9&color=FFF&size=128&length=2`"
                  width="100%"
                />
              </v-avatar>
              <h4>{{ user?.name || "User" }}</h4>
            </template>
            <template #subtitle>
              <p>{{ user?.email || "email" }}</p>
            </template>
          </v-card>
        </div>
        <v-divider />
        <v-card-text>
          <v-switch v-model="isDarkTheme" label="Tema" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="tonal" width="100%" @click="logout()"
            >SAIR</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-app-bar>

  <!-- Appbar para Mobile -->
  <v-app-bar
    v-if="vuetify.display.mobile.value"
    class="pa-0 d-flex justify-space-between"
    color="#1B84FF"
    elevation="0"
    height="60"
  >
    <v-container class="d-flex align-center justify-start">
      <v-btn
        class="ma-1 ml-4"
        density="comfortable"
        icon
        @click="$emit('toggle-drawer'), toggleDrawer()"
      >
        <v-icon icon="solar:list-bold" size="22" />
      </v-btn>
    </v-container>

    <v-container class="d-flex align-center justify-center">
      <v-btn class="ma-1" density="comfortable" icon disabled>
        <v-icon icon="solar:magnifer-outline" size="21" />
      </v-btn>
    </v-container>

    <v-container class="d-flex align-center justify-center" height="65">
      <img
        alt="logo do sistema"
        class="ml-2"
        src="@/assets/icon-grey-scale.svg"
        width="30"
      />
    </v-container>

    <v-container class="d-flex align-center justify-center">
      <v-btn class="ma-1" density="comfortable" icon @click="toggleTheme">
        <v-icon
          :icon="
            isDarkTheme ? 'solar:sun-line-duotone' : 'solar:moon-broken'
          "
          size="21"
        />
      </v-btn>
    </v-container>

    <v-container class="d-flex align-center justify-end">
      <v-menu :close-on-back="true" :close-on-content-click="false" offset-y>
        <template #activator="{ props }">
          <v-btn class="ma-1 mr-4" density="comfortable" v-bind="props" icon>
            <v-icon
              icon="solar:menu-dots-bold-duotone"
              size="21"
              style="transform: rotate(90deg)"
            />
          </v-btn>
        </template>

        <v-card
          class="pa-3 dropdown-card perfil-personalziado"
          elevation="1"
          height="auto"
          width="300"
        >
          <div class="text-center mb-1">
            <v-card class="elevation-0">
              <template #title>
                <v-avatar
                  class="mb-2 mx-3 border-lg border-primary"
                  elevation="5"
                  size="60"
                  variant="outlined"
                >
                  <img
                    alt="Imagem de Perfil"
                    :src="`https://ui-avatars.com/api/?name=${user?.name}&background=155AA9&color=FFF&size=128&length=2`"
                    width="100%"
                  />
                </v-avatar>
                <h4>{{ user?.name || "Usuario" }}</h4>
              </template>
              <template #subtitle>
                <p>{{ user?.email || "user.email@viacometa.com.br" }}</p>
              </template>
            </v-card>
          </div>
          <v-divider />
          <v-card-actions>
            <v-btn
              color="primary"
              variant="tonal"
              width="100%"
              @click="logout()"
              >SAIR</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import vuetify from "@/plugins/vuetify";
import { ssoStore } from "@/stores/sso";
import axios from 'axios';

const user = ssoStore().getUser;
const keycloak = ssoStore().getKeycloak;

const drawer = ref(!vuetify.display.mobile.value);
const group = ref(null);

const base64Image = ref('');

watch(group, () => {
  drawer.value = false;
});

const isDarkTheme = computed({
  get: () => vuetify.theme.global.name.value === "dark",
  set: (val) => {
    vuetify.theme.global.name.value = val ? "dark" : "light";
    localStorage.setItem("themeDark", String(val));
  },
});

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
};

function logout() {
  keycloak?.logout();
}

function toggleDrawer() {
  drawer.value = !drawer.value;
}

onMounted(() => {
  fetchImageUser();
  const storedTheme = localStorage.getItem("themeDark");
  if (storedTheme) {
    isDarkTheme.value = storedTheme === "true";
  }
});

function formatImage(base64String: string) {
    const bytesPng =
      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC';

    if (base64String.includes(bytesPng)) {
      return 'data:image/png;base64,' + base64String;
    }

    return 'data:image/jpeg;base64,' + base64String;
  }

  function fetchImageUser() {
    axios
      .get(import.meta.env.VITE_API_BIRTHDAY, {
        params: {
          cpf: user?.cpf
        }
      })
      .then(response => {
        const { data } = response.data;
        const base64String = data[0].imagem;

        base64Image.value = formatImage(base64String);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }
</script>

<style scoped>
/* Custom styles for the card */
.dropdown-card {
  position: absolute;
  right: 15px; /* Ensures the card opens aligned to the right */
  top: 10px;
  border-radius: 15px;
  height: auto;
}

.perfil-personalziado {
  border-top: 10px solid #1867c0;
}

.logo {
  height: 30px;
  margin-right: 10px;
  margin-left: 20px;
}
</style>
