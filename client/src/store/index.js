import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index";
import { defaultClient as apolloClient } from "../main";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "../queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearUser: (state) => (state.user = null),
    clearError: (state) => (state.error = null),
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setUser", data.getCurrentUser);
          console.log(data.getCurrentUser);
        })
        .catch((err) => {
          commit("setLoading", false);
          console.log(err);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data }) => {
          // Get data from actions to state via mutations
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch((err) => {
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit("clearUser");

      // remove token in localStorage
      localStorage.removeItem("token", "");

      // end session
      await apolloClient.resetStore();
      router.push("/");
    },
  },
  getters: {
    posts: (state) => state.posts,
    user: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
  modules: {},
});
