<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div>
    <h1>Sign Up</h1>

    <label for="username">Username</label>
    <input id="username" />,
    <label for="e-mail">E-mail</label>
    <input id="e-mail" />
    <label for="password">Password</label>
    <input id="password" type="password" v-model="password" />
    <label for="password-repeat">Password Repeat</label>
    <input id="password-repeat" type="password" v-model="passwordRepeat" />
    <button :disabled="btnDisabled">Sign Up</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
};
</script>

<style></style>
