import axios from "axios";

import { ssoStore } from "../../stores/sso";
import { notify } from "../notify";
import keycloak from "@/config/keycloak";
const http = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
});

http.interceptors.request.use((config) => {
  const sso = ssoStore();
  const token = sso.keycloak?.token;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
      if (!keycloak.authenticated) keycloak.logout();
      notify("Acesso negado", "warning");
    }

    if (error.response?.status === 401) {
      notify("Sessão expirada, faça login novamente para continuar", "info");
      keycloak.logout();
    }
    if (axios.isAxiosError(error) && error.response) {
      notify(error.response?.data?.message || "Falha", "warning");
      return Promise.reject(error);
    }

    if (error.response?.status === 502) {
      console.warn("Erro 502 - Tentando novamente...");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(http.request(error.config));
        }, 3000);
      }).catch(() => {
        notify("Não foi possivel atender a solicitção", "info");
        keycloak.logout();
      });
    }

    return Promise.reject(error);
  }
);

export default http;
