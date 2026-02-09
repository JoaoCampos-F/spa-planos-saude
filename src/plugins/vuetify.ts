import "vuetify/styles";
import { createVuetify, type IconSet } from "vuetify";
import { h } from "vue";
import { Icon } from "@iconify/vue";

const customIconSet: IconSet = {
  component: (props) =>
    h(Icon, {
      icon: props.icon ?? "",
    }),
};

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#0B7FBF",

          secondary: "#10B981",

          accent: "#14B8A6",

          background: "#F7FAFC",
          surface: "#FFFFFF",

          error: "#DC2626",
          info: "#0EA5E9",
          success: "#059669",
          warning: "#F59E0B",

          "health-blue": "#0B7FBF",
          "health-green": "#10B981",
          "health-teal": "#14B8A6",
          "health-purple": "#7C3AED",
          "wellness-light": "#E0F2FE",
          "care-soft": "#D1FAE5",

          "medical-gray": "#64748B",
          "clinical-slate": "#475569",
        },
      },
      dark: {
        dark: true,
        colors: {
          // Azul Médico - Versão Dark
          primary: "#3B82F6", // Azul mais claro para contraste

          // Verde Saúde - Versão Dark
          secondary: "#34D399", // Verde mais claro

          // Turquesa - Versão Dark
          accent: "#2DD4BF", // Teal mais claro

          // Fundos Dark - Tom Azulado Profissional
          background: "#0F172A", // Azul escuro profundo
          surface: "#1E293B", // Slate escuro

          // Estados e Feedbacks - Dark
          error: "#F87171", // Vermelho suave
          info: "#38BDF8", // Azul claro
          success: "#4ADE80", // Verde claro
          warning: "#FBBF24", // Amarelo suave

          // Cores Complementares de Saúde - Dark
          "health-blue": "#3B82F6",
          "health-green": "#34D399",
          "health-teal": "#2DD4BF",
          "health-purple": "#A78BFA",
          "wellness-light": "#1E3A8A",
          "care-soft": "#064E3B",

          // Tons Neutros Médicos - Dark
          "medical-gray": "#94A3B8",
          "clinical-slate": "#CBD5E1",
        },
      },
    },
  },

  defaults: {
    global: {
      style: {
        fontFamily: "Poppins, Roboto, Open Sans, sans-serif",
      },
    },
    VTextField: {
      variant: "outlined",
      density: "compact",
      hideDetails: "auto",
      color: "primary",
    },
    VSelect: {
      variant: "outlined",
      density: "compact",
      hideDetails: "auto",
      color: "primary",
    },
    VAutocomplete: {
      variant: "outlined",
      density: "compact",
      hideDetails: "auto",
      color: "primary",
    },
    VTextarea: {
      variant: "outlined",
      density: "compact",
      hideDetails: "auto",
      color: "primary",
    },
    VBtn: {
      rounded: "lg",
    },
    VCard: {
      elevation: 2,
    },
  },

  icons: {
    defaultSet: "custom",
    sets: {
      custom: customIconSet,
    },
  },
});
