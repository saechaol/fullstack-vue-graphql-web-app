<template>
  <v-container class="text-xs-center">
    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.username }}</div>
                <div>Joined {{ user.registerDate }}</div>
                <div class=".hidden-xs-only font-weight-regular">
                  {{ user.likes.length }} Likes
                </div>
                <div class=".hidden-xs-only font-weight-regular">
                  2 Posts Added
                </div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts favorited by this user -->
    <v-container v-if="!userLikes.length">
      <v-layout row-wrap>
        <v-flex xs12>
          <h2>You don't have any 'liked' posts. Check some out!</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Likes
          <span class="font-weight-regular">{{ userLikes.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="likes in userLikes" :key="likes._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" :src="likes.imageUrl"></v-img>
            <v-card-text>{{ likes.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user", "userLikes"]),
  },
};
</script>
