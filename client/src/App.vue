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
        v-model="searchTerm"
        @input="handleSearchPosts"
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      ></v-text-field>

      <!-- Search results card -->
      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list>
          <v-list-item
            v-for="result in searchResults"
            :key="result._id"
            @click="goToSearchResult(result._id)"
          >
            <v-list-item-title>
              {{ result.title }} -
              <span class="font-weight-thin">{{
                formatDescription(result.description)
              }}</span>
            </v-list-item-title>
            <!-- Show if result has been favorited by the user -->
            <v-list-item-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          text
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Profile Button -->
        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>Profile
          <v-badge
            v-if="userLikes.length"
            right
            color="red darken-2"
            :class="{ bounce: badgeAnimated }"
          >
            <span slot="badge" v-if="userLikes.length">{{
              userLikes.length
            }}</span>
          </v-badge>
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

        <!-- Auth Snackbar -->
        <v-snackbar
          v-model="authSnackbar"
          color="success"
          :timeout="5000"
          bottom
          left
          ><h3>
            <v-icon dark left class="mr-3">check_circle</v-icon
            ><strong class="mr-6">You have successfully signed in!</strong>
            <v-btn class="ml-12 float-right" light @click="authSnackbar = false"
              >Close</v-btn
            >
          </h3>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          color="warning"
          :timeout="5000"
          bottom
          left
          ><h3>
            <v-icon dark left class="mr-3">cancel</v-icon
            >{{ authError.message }}
            <v-btn
              class="ml-3 float-right"
              light
              @click="authErrorSnackbar = false"
              to="/signin"
              >Log In</v-btn
            >
          </h3>
        </v-snackbar>
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
      searchTerm: "",
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false,
    };
  },
  watch: {
    user(newValue, oldValue) {
      // if user didn't previously exist
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // if authError is not null, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userLikes(value) {
      // if user likes value changes
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    },
  },
  computed: {
    ...mapGetters(["searchResults", "authError", "user", "userLikes"]),
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
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm,
      });
    },
    handleSignOutUser() {
      this.$store.dispatch("signoutUser");
    },
    goToSearchResult(resultId) {
      // clear search term
      this.searchTerm = "";
      // go to desired page
      this.$router.push(`/posts/${resultId}`);
      // clear search results
      this.$store.commit("clearSearchResults");
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    checkIfUserFavorite(resultId) {
      return (
        this.userLikes && this.userLikes.some((item) => item._id === resultId)
      );
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
  },
};
</script>

<style>
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}

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

/* Search Results Card */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}
/* User Likes Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }

  70% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
