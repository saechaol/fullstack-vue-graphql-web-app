import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify, {});

export default new Vuetify({
  theme: {
    themes: {
      dark: true,
      light: {
        primary: "#4557c7",
        secondary: "#7f83ff",
        accent: "#4557c7",
        error: "#990D35",
        warning: "#FF8A8C",
        info: "#698CD6",
        success: "#02b872",
        background: "#e3e3e3",
      },
      dark: {
        primary: "#6491F2",
        secondary: "#a3b8ff",
        accent: "#F29F64",
        error: "#990D35",
        warning: "#CA4F51",
        info: "#4C6EB8",
        success: "#188f5b",
        background: "#333333",
      },
    },
  },
});
