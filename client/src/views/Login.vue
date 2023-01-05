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
        <v-alert
          v-if="errorMessage"
          dense
          outlined
          type="error">
          {{ errorMessage }}
        </v-alert>
        <div class="d-flex justify-space-between align-center w-100">
          <v-btn @click="login" type="submit" outlined>Login</v-btn>
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
            usernameError: "",
            errorMessage: ""
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
        login: async function(e) {
            e.preventDefault();
            this.$root.loader.show();

            this.$http
                .post("auth/login", {
                    username: this.username,
                    password: this.password
                })
                .then(() => {
                    window.location.href = "/playlist";
                }).catch((err) => {
                    this.errorMessage = err.response.data.error;
                    console.error("Error occured : " + err.response.data.error);
                    this.$root.loader.hide();
                });
        }
    },
    computed: {
        rules () {
            const rules = [];
            const rule = v => (v || '').indexOf(' ') < 0 || 'Tidak boleh ada Spasi';
        rules.push(rule);

        return rules;
      }
  },
};
</script>

<style lang="scss" scoped></style>
