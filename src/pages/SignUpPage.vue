<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card mt-5" data-testid="form-sign-up" v-if="!signUpSuccess">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input class="form-control" id="username" v-model="username" />
          <span>{{ errors.username }}</span>
        </div>
        <div class="mb-3">
          <label class="form-label" for="e-mail">E-mail</label>
          <input class="form-control" id="e-mail" v-model="email" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input
            class="form-control"
            id="password"
            type="password"
            v-model="password"
            autocomplete="on"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password-repeat"
            >Password Repeat</label
          >
          <input
            class="form-control"
            id="password-repeat"
            type="password"
            v-model="passwordRepeat"
            autocomplete="on"
          />
        </div>
        <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="btnDisabled || apiProgress"
            @click.prevent="submit"
          >
            <span
              v-if="apiProgress"
              class="spinner-border spinner-border-sm"
              data-testid="status"
              role="status"
            ></span>
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <div v-else class="alert alert-success mt-2">
      Please check your e-mail to activate your account
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
      apiProgress: false,
      signUpSuccess: false,
      errors: {},
    };
  },
  computed: {
    btnDisabled() {
      return this.password.length && this.passwordRepeat.length
        ? this.password !== this.passwordRepeat
        : true;
    },
  },
  methods: {
    submit() {
      this.apiProgress = true;
      axios
        .post("/api/1.0/users", {
          username: this.username,
          email: this.email,
          password: this.password,
        })

        .then(() => {
          setTimeout(() => {
            this.signUpSuccess = true;
          }, 0);
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.errors = error.response.data.validationErrors;
          }
          this.apiProgress = false;
        });
    },
  },
};
</script>

<style></style>
