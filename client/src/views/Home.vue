<template>
  <div class="home">
    <v-container class="my-5">
      <v-row>
        <v-col>
          <h1>Playlistku</h1>
        </v-col>
        <v-col class="text-right">
          <v-dialog v-model="dialog" max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined v-bind="attrs" v-on="on">Buat Playlist</v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">{{ isEditingPlaylist ? "Edit" : "Buat" }} Playlist</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="newPlaylist.name" label="Nama playlist" required></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    dialog = false;
                    isEditingPlaylist = false;
                  "
                  >Batal</v-btn
                >
                <v-btn v-if="isEditingPlaylist" color="green darken-1" text @click="updatePlaylist">Simpan</v-btn>
                <v-btn v-else color="green darken-1" text @click="createPlaylist">Simpan</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-data-table :headers="headers" :items="myPlaylist" :items-per-page="5" class="elevation-1">
        <template v-slot:[`item.name`]="props">
          <!-- <div class="row-pointer" @click="handleTableClick(props.item._id)">{{ props.item.name }}</div> -->
          <a class="row-pointer" :href="'/playlist/' + props.item._id">{{ props.item.name }}</a>
        </template>
        <template v-slot:[`item.createdAt`]="props">
          <!-- <div class="row-pointer" @click="handleTableClick(props.item._id)">
            {{ //formatDate(new Date(props.item.createdAt)) }}
          </div> -->
          <a class="row-pointer" :href="'/playlist/' + props.item._id">{{
            formatDate(new Date(props.item.createdAt))
          }}</a>
        </template>
        <template v-slot:[`item.controls`]="props">
          <v-btn class="mx-2" icon @click="onEditButtonClick(props.item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="mx-2" icon @click="onDeteleButtonClick(props.item._id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import ConfirmDialog from "../components/ConfirmDialog";

export default {
  name: "Home",
  metaInfo: {
    title: "Playlist ku",
  },

  components: { ConfirmDialog },

  data: () => {
    return {
      me: null,
      isEditingPlaylist: false,
      dialog: false,
      myPlaylist: [],
      newPlaylist: {
        _id: null,
        name: null,
      },
      headers: [
        { text: "Nama Playlist", value: "name" },
        { text: "Dibuat pada", value: "createdAt" },
        { text: "Action", value: "controls", sortable: false },
      ],
    };
  },
  created: function () {
    let t = this;
    this.$http.get("auth/me").then((res) => {
      t.me = res.data.me;
    });

    this.$http.get("playlist/me").then((res) => {
      t.myPlaylist = res.data.myPlaylists;
    });
  },
  methods: {
    createPlaylist: function () {
      let t = this;
      this.$http.post("playlist/store", { name: this.newPlaylist.name }).then((res) => {
        t.newPlaylist.name = null;
        t.myPlaylist.push(res.data.playlist);
      });
      this.dialog = false;
    },
    handleTableClick(value) {
      this.$router.push({
        name: "Playlist",
        params: { playlistId: value },
      });
    },
    onDeteleButtonClick: async function (props) {
      if (await this.$refs.confirm.open("Hapus playlist", "Apakah anda yakin ingin menghapus playlist ini?")) {
        this.myPlaylist.splice(
          this.myPlaylist.findIndex((p) => p._id === props),
          1
        );

        this.$http.delete("playlist/" + props + "/delete").then((res) => {
          console.log(res);
        });
      }
    },
    onEditButtonClick: function (playlist) {
      this.dialog = true;
      this.isEditingPlaylist = true;
      this.newPlaylist = playlist;
    },
    updatePlaylist: function () {
      console.log(this.newPlaylist.name);
      this.$http.patch("/playlist/" + this.newPlaylist._id + "/update", this.newPlaylist).then(() => {
        this.dialog = false;
        this.isEditingPlaylist = false;
        this.$root.toast.show({ message: "Playlist berhasil di-edit" });
      });
    },
    formatDate: function (date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var strTime = hours + ":" + minutes;
      return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    },
  },
};
</script>

<style lang="css" scoped>
.row-pointer:hover {
  cursor: pointer;
}
</style>
