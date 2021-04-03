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
                  {{ userPosts.length }} Posts Added
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
          <span class="font-weight-regular">({{ userLikes.length }})</span>
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

    <!-- Posts created by user -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Your Posts
          <span class="font-weight-regular">({{ userPosts.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn
              @click="handleDeleteUserPost(post)"
              color="error"
              floating
              fab
              small
              dark
            >
              <v-icon>delete</v-icon>
            </v-btn>
            <v-img height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit posts dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-container>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
          >
            <!-- Title Input-->
            <v-layout row class="justify-center">
              <v-flex xs11>
                <v-text-field
                  :rules="titleRules"
                  v-model="title"
                  prepend-icon="face"
                  label="Post Title"
                  type="text"
                  required
                >
                </v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Input -->
            <v-layout row class="justify-center">
              <v-flex xs11>
                <v-text-field
                  :rules="imageRules"
                  v-model="imageUrl"
                  prepend-icon="face"
                  label="Image URL"
                  type="text"
                  required
                >
                </v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px" />
              </v-flex>
            </v-layout>

            <!-- Categories Select -->
            <v-layout row>
              <v-flex xs12>
                <v-select
                  v-model="categories"
                  :items="[
                    'Art',
                    'Education',
                    'Food',
                    'Interior Decoration',
                    'Travel',
                    'Photography',
                    'Technology',
                  ]"
                  multiple
                  label="Categories"
                  :rules="categoriesRules"
                ></v-select>
              </v-flex>
            </v-layout>

            <!-- Description Text Area -->
            <v-layout row class="justify-center">
              <v-flex xs11>
                <v-textarea
                  :rules="descRules"
                  v-model="description"
                  prepend-icon="face"
                  label="Description"
                  type="text"
                  required
                >
                </v-textarea>
              </v-flex>
            </v-layout>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!isFormValid"
                type="submit"
                class="success--text"
                text
                >Update</v-btn
              >
              <v-btn class="error--text" text @click="editPostDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        (title) => !!title || "Title is required",
        (title) =>
          title.length < 40 || "Title must have less than 40 characters.",
      ],
      imageRules: [(image) => !!image || "Image is required"],
      categoriesRules: [
        (categories) =>
          !!categories.length >= 1 || "At least one category is required",
      ],
      descRules: [
        (desc) => !!desc || "Description is required",
        (desc) =>
          desc.length < 240 || "Description must have less than 240 characters",
      ],
    };
  },
  computed: {
    ...mapGetters(["user", "userLikes", "userPosts"]),
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id,
      });
    },
    handleUpdateUserPost() {
      // update user post action
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
        });
        this.editPostDialog = false;
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (deletePost) {
        this.$store.dispatch("deleteUserPost", {
          postId: this.postId,
        });
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    },
  },
};
</script>
