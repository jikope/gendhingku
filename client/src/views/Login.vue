<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <h1 class="mb-4">Login</h1>
        <form action="#">
          <v-text-field 
            v-model="username" 
            :error-messages="usernameError" 
            :rules="rules"
            label="Username atau Email" 
            outlined></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" outlined></v-text-field>
          <div class="d-flex justify-space-between align-center w-100">
            <v-btn @click="login" outlined>Login</v-btn>
            <p>Silahkan <a href="/register" style="text-decoration: underline;">register</a> jika belum punya akun </p>
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
      username: "",
      password: "",
      usernameError: ""
    };
  },
  created: async function() {
    await this.$http.get("auth/isLoggedIn").then(res => {
      if (res.data.isLoggedIn) {
        window.location.href = "/playlist";
      }
    });
  },
  methods: {
    login: function(e) {
      e.preventDefault();
      this.$http
        .post("auth/login", {
          username: this.username,
          password: this.password
        })
        .then(() => {
          // t.$router.go("/playlist");
          window.location.href = "/playlist";
        }).catch((err) => {
          console.error("Error occured : " + err);
        });
    }
  },
  computed: {
      rules () {
        const rules = [];
        const rule = v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed';
        rules.push(rule);

        return rules;
      }
  },
};
</script>

<style lang="scss" scoped></style>
