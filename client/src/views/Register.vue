<template>
<v-container>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <h1 class="mb-4">Buat Akun Baru</h1>
      <form action="#">
        <v-text-field 
          v-model="username" 
          :error-messages="usernameError" 
          :rules="rules"
          label="Username (nama untuk login)" 
          outlined></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" outlined></v-text-field>
        <v-text-field v-model="passwordRepeat" label="Ulangi Password" type="password" outlined></v-text-field>
        <v-alert
          v-if="errorMessage"
          dense
          outlined
          type="error">
          {{ errorMessage }}
        </v-alert>
        <div class="d-flex justify-space-between align-center w-100">
          <v-btn @click="register" outlined>Buat Akun</v-btn>
          <p>Silahkan <a href="/login" style="text-decoration: underline;">login</a> jika sudah punya akun </p>
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
            usernameError: "",
            password: "",
            passwordRepeat: "",
            errorMessage: ""
        };
    },
    methods: {
        register: function(e) {
            e.preventDefault();
            this.$root.loader.show();
            this.$http
                .post("auth/register", {
                    username: this.username,
                    password: this.password
                }).then(() => {
                    window.location.href = "/login";
                }).catch(err => {
                    this.usernameError = err.response.data.error;
                    console.error("Unable to create new user");
                    this.$root.loader.hide();
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
