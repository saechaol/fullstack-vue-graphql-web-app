import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index";
import { defaultClient as apolloClient } from "../main";
import {
  GET_POSTS,
  SEARCH_POSTS,
  ADD_POST,
  SIGNIN_USER,
  GET_CURRENT_USER,
  REGISTER_USER,
  GET_USER_POSTS,
  UPDATE_USER_POST,
} from "../queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
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
    setAuthError: (state, payloud) => {
      state.authError = payloud;
    },
    clearUser: (state) => (state.user = null),
    clearSearchResults: (state) => (state.searchResults = []),
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
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch((err) => console.error(err));
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            console.log(cache, data);
            // first read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // create updated data
            data.getPosts.unshift(addPost);
            // write updated data back to the query
            cache.writeQuery({
              query: GET_POSTS,
              data,
            });
          },
          // ensure data is immediately added to the cache
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1, // ensure it is added to the beginning of the array
              ...payload,
            },
          },
        })

        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            (post) => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1),
          ];
          commit("setUserPosts", userPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },

    registerUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: REGISTER_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.registerUser.token);
          router.go();
        })
        .catch((err) => {
          commit("setLoading", false);
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
    userPosts: (state) => state.userPosts,
    searchResults: (state) => state.searchResults,
    user: (state) => state.user,
    userLikes: (state) => state.user && state.user.likes,
    loading: (state) => state.loading,
    error: (state) => state.error,
    authError: (state) => state.authError,
  },
  modules: {},
});
