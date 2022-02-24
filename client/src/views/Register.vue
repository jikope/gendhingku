<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <h1 class="mb-4">Buat Akun Baru</h1>
        <form action="#">
          <v-text-field v-model="name" label="Nama" outlined></v-text-field>
          <v-text-field v-model="username" label="Username (nama untuk login)" outlined></v-text-field>
          <v-text-field v-model="email" label="Email" outlined></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" outlined></v-text-field>
          <v-text-field v-model="passwordRepeat" label="Ulangi Password" type="password" outlined></v-text-field>
          <div class="d-flex justify-space-between align-center w-100">
            <v-btn outlined>Buat Akun</v-btn>
            <router-link href="/login">Silahkan log-in jika sudah punya akun</router-link>
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
      name: "Bima Jikope",
      username: "bimakope",
      email: "bimakope@gmail.com",
      password: "bimakope",
      passwordRepeat: "bimakope"
    };
  }
};
</script>

<style lang="scss" scoped></style>
