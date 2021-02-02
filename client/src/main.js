import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";

// Register global FormAlert component
Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  request: (operation) => {
    // if no token exists, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }

    // add token to an authorization header and send it to the backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
      }
    }
  },
});

const apolloProvider = new VueApollo({
  defaultClient,
});

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  },
}).$mount("#app");
