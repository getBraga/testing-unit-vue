<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <form>
    <h1>Sign Up</h1>

    <label for="username">Username</label>
    <input id="username" v-model="username" />
    <label for="e-mail">E-mail</label>
    <input id="e-mail" v-model="email" />
    <label for="password">Password</label>
    <input id="password" type="password" v-model="password" autocomplete="on" />
    <label for="password-repeat">Password Repeat</label>
    <input
      id="password-repeat"
      type="password"
      v-model="passwordRepeat"
      autocomplete="on"
    />
    <button :disabled="btnDisabled" @click.prevent="submit">Sign Up</button>
  </form>
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
