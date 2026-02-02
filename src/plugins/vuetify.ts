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
          primary: "#fb6b5b",
          secondary: "#fb6b5b",
          accent: "#82B1FF",
          background: "#EEF5F9",
          surface: "#FFFFFF",
          error: "#FF5252",
          info: "#fb6b5b",
          success: "#4CAF50",
          warning: "#FB8C00",
          orquestrador: "#3b02a5",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#fb6b5b",
          secondary: "#fb6b5b",
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
