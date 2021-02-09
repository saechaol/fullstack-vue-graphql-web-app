<template>
  <v-container text-center mt-5 pt-5>
    <!-- Registration Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Get started here!</h1>
      </v-flex>
    </v-layout>

    <!-- Error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Registration Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="alternate" dark>
          <v-container>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="handleRegisterUser"
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
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="email"
                    label="Email"
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

              <v-layout row class="justify-center">
                <v-flex xs11>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="passwordConfirmation"
                    prepend-icon="gavel"
                    label="Confirm Password"
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
                    color="info"
                    type="submit"
                  >
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Register</v-btn
                  >
                  <h3>
                    Already have an account?
                    <router-link to="/login">Log in</router-link>
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
  name: "Register",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        (username) => !!username || "Username is required",
        (username) =>
          username.length < 12 || "Username must be less than 12 characters",
      ],

      emailRules: [
        (email) => !!email || "Email is required",

        // regular expression to check email validity
        (email) => /.@+./.test(email) || "Email must be valid",
      ],

      passwordRules: [
        (password) => !!password || "Password is required",
        (password) =>
          password.length >= 8 || "Password must be at least 8 characters",
        (confirmation) =>
          confirmation === this.password || "Passwords must match",
      ],
    };
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home
      if (value) {
        this.$router.push("/");
      }
    },
  },
  computed: {
    ...mapGetters(["loading", "error", "user"]),
  },
  methods: {
    handleRegisterUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("registerUser", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
      }
    },
  },
};
</script>
