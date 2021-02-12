import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";

import AddPost from "../components/Posts/AddPost.vue";
import Posts from "../components/Posts/Posts.vue";
import Post from "../components/Posts/Post.vue";

import Login from "../components/Auth/Login.vue";
import Profile from "../components/Auth/Profile.vue";
import Register from "../components/Auth/Register.vue";

import AuthGuard from "../AuthGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts,
  },
  {
    path: "/posts/:postId",
    name: "Post",
    component: Post,
    props: true,
  },
  {
    path: "/post/add",
    name: "AddPost",
    component: AddPost,
    beforeEnter: AuthGuard,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: AuthGuard,
  },
  {
    path: "/signup",
    name: "Register",
    component: Register,
  },
  {
    path: "/signin",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  mode: "history",
  //base: process.env.BASE_URL,
  routes,
});

export default router;
