<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card mt-5">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input class="form-control" id="username" v-model="username" />
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
            :disabled="btnDisabled || disabled"
            @click.prevent="submit"
          >
            <span class="spinner-border spinner-border-sm" role="status"></span>
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      disabled: false,
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
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
      this.disabled = true;
      axios.post("/api/1.0/users", {
        username: this.username,
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<style></style>
