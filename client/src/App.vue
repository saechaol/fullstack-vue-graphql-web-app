<template>
  <v-app style="background: #E3E3EE">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-app-bar color="secondary" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link
          to="/"
          custom
          v-slot="{ navigate }"
          style="cursor: pointer"
        >
          <span @click="navigate" @keypress.enter="navigate" role="link">
            <h1 class="title pl-3">Postcards</h1>
          </span>
        </router-link>
      </v-app-bar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-item
          ripple
          v-for="item in sideNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>

        <!-- Sign Out Button -->
        <v-list-item v-if="user" ripple @click="handleSignOutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Sign Out</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-app-bar fixed color="primary" dark>
      <!-- App Title -->
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-app-bar-title class="hidden-xs-only">
        <router-link
          to="/"
          custom
          v-slot="{ navigate }"
          style="cursor: pointer;overflow: visible;display: block"
        >
          <span @click="navigate" @keypress.enter="navigate" role="link"
            >Postcards</span
          >
        </router-link>
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      ></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          text
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-icon class="hidden-sm-only" text>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Profile Button -->
        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge>
            <!-- right color="red darken-2"> -->
            <!-- <span slot="badge">1</span> -->
            Profile</v-badge
          >
        </v-btn>
        <!-- Sign Out Button -->
        <v-btn text v-if="user" @click="handleSignOutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Sign Out
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- App Content -->
    <main>
      <v-container class="mt-12">
        <transition name="fade">
          <router-view />
        </transition>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "signup" },
      ];

      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }

      return items;
    },

    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "signup" },
      ];

      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" },
        ];
      }

      return items;
    },
  },
  methods: {
    handleSignOutUser() {
      this.$store.dispatch("signoutUser");
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateX(-25px);
}
</style>
