<template>
  <v-container>
    <v-row class="mt-4">
      <v-col class="col-md-8 col-xs-12 col-sm-12">
        <h2>Latar Belakang</h2>
        <p>
          Aplikasi ini saya buat karena kesulitan saya untuk memutar gendhing yang saya suka secara otomatis. Suatu
          pagelaran uyon-uyon atau wayang biasanya berdurasi 2 jam lebih, jika hanya ingin mendengarkan gendhing singkat
          maka harus dilakukan navigasi manual.
        </p>

        <h2>Fitur</h2>
        <ol>
          <li>Login <s>dengan akun google</s> dan Register tanpa email.</li>
          <li>Membuat playlist dengan waktu mulai dan waktu selesai</li>
          <li>Edit, hapus playlist atau track</li>
        </ol>

        <h2>Cara menggunakan aplikasi ini</h2>
        <ol>
          <li>
            Sebelum menggunakan aplikasi ini anda diharuskan untuk login terlebih dahulu. <s>menggunakan akun google anda</s>.
          </li>
          <li>Jika sudah login maka click tombol navigasi <b>'PLAYLISTKU'</b> pada bar diatas.</li>
          <li>Tambahkan playlist dengan meng-click tombol <b>'BUAT PLAYLIST'</b></li>
          <img alt="Buat playlist" src="../assets/buat_playlist.png" />
          <li>Masuk pada player dengan meng-click nama playlist yang sudah anda buat pada tabel</li>
          <li>
            Tambahkan lagu(track) dengan meng-click tombol <b>'TAMBAH TRACK'</b>
            <div class="w-100">
              <img alt="Buat playlist" src="../assets/tambah_track.png" />
            </div>
          </li>

          <li>
            Setelah anda click maka akan muncul form seperti dibawah ini
            <img alt="Buat playlist" src="../assets/contoh_track.png" />
          </li>
          <li>
            Maka track yang dibuat akan muncul di daftar track pada playlist
            <img alt="Buat playlist" src="../assets/tertambahkan.png" />
          </li>
        </ol>
      </v-col>
      <v-col class="col-xs-12 col-sm-12 col-md-4">
        <div id="about">
          <h2 class="text-center">CONTACT</h2>
          <p>Segala suatu tentang aplikasi bisa ditanyakan ke salah satu kontak dibawah</p>
          <ul>
            <li>
              <v-icon>mdi-github</v-icon>
              Repository:
              <a href="https://github.com/jikope/gendhingku" target="_blank">https://github.com/jikope/gendhingku</a>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
#about {
  border: 3px solid #f0f0f0;
  padding: 10px;
}

a {
  color: red;
  font-size: 0.9rem;
}
li {
  margin-bottom: 5px;
}
h2 {
  margin-bottom: 0.5rem;
}
img {
  display: block;
  margin: auto;
  max-width: 100%;
  margin-top: 5px;
  padding: 5px;
  border: 3px solid #f0f0f0;
}
</style>
