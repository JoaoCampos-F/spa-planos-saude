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
          primary: "#1B84FF",
          secondary: "#43CED7",
          accent: "#82B1FF",
          background: "#EEF5F9",
          surface: "#FFFFFF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          orquestrador: "#3b02a5",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#166ACC",
          secondary: "#0A949E",
          accent: "#FF4081",
          background: "#192838",
          surface: "#152332",
          error: "#CF6679",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
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
  },

  icons: {
    defaultSet: "custom",
    sets: {
      custom: customIconSet,
    },
  },
});
