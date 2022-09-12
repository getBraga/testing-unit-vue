<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card mt-5" data-testid="form-sign-up" v-if="!signUpSuccess">
      <div class="card-header">
        <h1 class="text-center">{{ $t("signUp") }}</h1>
      </div>
      <div class="card-body">
        <Input
          id="username"
          :label="$t('username')"
          :help="errors.username"
          v-model="username"
        />
        <Input
          id="email"
          :label="$t('email')"
          :help="errors.email"
          v-model="email"
        />
        <Input
          id="password"
          :label="$t('password')"
          type="password"
          :help="errors.password"
          v-model="password"
        />
        <Input
          id="password-repeat"
          :label="$t('passwordRepeat')"
          type="password"
          v-model="passwordRepeat"
          :help="hasPasswordMismatch ? 'Password mismatch' : ''"
        />

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
            {{ $t("signUp") }}
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
import Input from "./../components/Input.vue";
export default {
  components: {
    Input,
  },
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
    hasPasswordMismatch() {
      return this.password !== this.passwordRepeat;
    },
  },
  watch: {
    username() {
      delete this.errors.username;
    },
    email() {
      delete this.errors.email;
    },
    password() {
      delete this.errors.password;
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
    onChange(value) {
      this.username = value;
    },
  },
};
</script>
