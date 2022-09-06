<template>
  <div class="container"><SignUpPage /></div>
</template>

<script>
import SignUpPage from "./pages/SignUpPage.vue";
export default {
  name: "App",
  components: {
    SignUpPage,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}
</style>
