<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn @click="handleToggleLike" large icon v-if="user">
              <v-icon
                large
                :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
                >favorite</v-icon
              >
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large
              >arrow_back</v-icon
            >
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img
              @click="toggleImageDialog"
              slot="activator"
              :src="getPost.imageUrl"
              id="post__image"
            ></v-img>
          </v-tooltip>

          <!-- Post Image Dialog  -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{
                category
              }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Post Comment Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleAddPostComment"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="commentRules"
                  v-model="commentBody"
                  clearable
                  :append-outer-icon="commentBody && 'send'"
                  label="Add Comment"
                  type="text"
                  @click:append-outer="handleAddPostComment"
                  prepend-icon="email"
                  required
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Comments -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Comments ({{ getPost.comments.length }})</v-subheader>

            <template v-for="comment in getPost.comments">
              <v-divider :key="comment._id"></v-divider>
              <v-list-item inset :key="comment.title">
                <v-list-item-avatar>
                  <img :src="comment.commentUser.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ comment.commentBody }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ comment.commentUser.username }}
                    <span class="grey--text tetx--lighten-1 hidden-xs-only">{{
                      comment.commentDate
                    }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="hidden-xs-only">
                  <v-icon
                    :color="checkIfOwnComment(comment) ? 'accent' : 'grey'"
                    >chat_bubble</v-icon
                  >
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  GET_POST,
  ADD_POST_COMMENT,
  LIKE_POST,
  UNLIKE_POST,
} from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      postLiked: false,
      dialog: false,
      commentBody: "",
      isFormValid: true,
      commentRules: [
        (comment) => !!comment || "Comment cannot be empty.",
        (comment) =>
          comment.length < 240 || "Comment must be less than 240 characters.",
      ],
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId,
        };
      },
    },
  },
  computed: {
    ...mapGetters(["user", "userLikes"]),
  },
  methods: {
    checkIfPostLiked(postId) {
      // check if user favorites include post with id of 'postId'
      if (
        this.userLikes &&
        this.userLikes.some((fave) => fave._id === postId)
      ) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
      console.log(this);
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username,
      };
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId },
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data,
            });
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            likes: data.likePost.favorites,
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch((err) => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username,
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          update: (cache, { data: { unlikePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId },
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data,
            });
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            likes: data.unlikePost.favorites,
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch((err) => console.error(err));
    },
    handleAddPostComment() {
      if (this.$refs.form.validate()) {
        const variables = {
          commentBody: this.commentBody,
          userId: this.user._id,
          postId: this.postId,
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_COMMENT,
            variables,
            update: (cache, { data: { addPostComment } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId },
              });
              data.getPost.comments.unshift(addPostComment);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data,
              });
            },
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addPostComment);
          })
          .catch((err) => console.error(err));
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    checkIfOwnComment(comment) {
      return this.user && this.user._id === comment.commentUser._id;
    },
  },
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
