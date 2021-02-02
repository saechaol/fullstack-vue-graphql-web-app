<template>
  <v-container text-center mt-5 pt-5>
    <!-- Signin Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome Back!</h1>
      </v-flex>
    </v-layout>

    <!-- Error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signin Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="handleSigninUser"
            >
              <v-layout row class="justify-center">
                <v-flex xs11>
                  <v-text-field
                    :rules="usernameRules"
                    v-model="username"
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    required
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="justify-center">
                <v-flex xs11>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="password"
                    prepend-icon="extension"
                    label="Password"
                    type="password"
                    required
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    :loading="loading"
                    :disabled="!isFormValid || loading"
                    color="accent"
                    type="submit"
                  >
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Sign In</v-btn
                  >
                  <h3>
                    Don't have an account?
                    <router-link to="/signup">Register</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      isFormValid: true,
      username: "",
      password: "",
      usernameRules: [
        // if username was provided
        (username) => !!username || "Username is cannot be empty",
        // ensure username is less than 12 characters
        (username) =>
          username.length < 12 || "Username must be less than 12 characters",
      ],
      passwordRules: [
        // if password was provided
        (password) => !!password || "Password is cannot be empty",
        // password is at least 8 characters
        (password) =>
          password.length >= 8 || "Password must be at least 8 characters",
      ],
    };
  },

  computed: {
    ...mapGetters(["loading", "error", "user"]),
  },

  watch: {
    user(value) {
      // if user value changes, redirect to home
      if (value) {
        this.$router.push("/");
      }
    },
  },

  methods: {
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password,
        });
      }
    },
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
