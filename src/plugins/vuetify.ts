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
          primary: "#2563EB",
          secondary: "#6366F1",
          accent: "#22C55E",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          error: "#EF4444",
          info: "#0EA5E9",
          success: "#16A34A",
          warning: "#F59E0B",
          orquestrador: "#3b02a5",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#60A5FA",
          secondary: "#A5B4FC",
          accent: "#34D399",
          background: "#0F172A",
          surface: "#111827",
          error: "#F87171",
          info: "#38BDF8",
          success: "#4ADE80",
          warning: "#FBBF24",
          orquestrador: "#3b02a5",
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
