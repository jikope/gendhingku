<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <h1 class="mb-4">Login</h1>
        <form action="#">
          <v-text-field v-model="username" label="Username atau Email" outlined></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" outlined></v-text-field>
          <div class="d-flex justify-space-between align-center w-100">
            <v-btn @click="login" outlined>Login</v-btn>
            <router-link to="/register">Silahkan register jika belum sudah punya akun</router-link>
          </div>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => {
    return {
      username: "route.test@test.com",
      password: "admin123"
    };
  },
  methods: {
    login: function(e) {
      let t = this;
      e.preventDefault();
      this.$http
        .post("http://localhost:3000/api/auth/login", {
          email: this.username,
          password: this.password
        })
        .then(function(response) {
          if (!response.error) {
            t.$router.go("/");
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
