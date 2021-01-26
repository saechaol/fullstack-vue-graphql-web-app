import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify, {});

export default new Vuetify({
  theme: {
    themes: {
      light: true,
      light: {
        primary: "#648DE5",
        secondary: "#F4845F",
        accent: "#FF8A65",
        error: "#990D35",
        warning: "#CC8B8C",
        info: "#304C89",
        success: "#AAFAC8",
      },
      dark: {
        primary: "#648DE5",
        secondary: "#F4845F",
        accent: "#FF8A65",
        error: "#990D35",
        warning: "#CC8B8C",
        info: "#304C89",
        success: "#AAFAC8",
      },
    },
  },
});
