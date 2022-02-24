<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-12 col-xs-12 col-sm-12 col-md-8" id="left-side" style="height: 100vh">
        <div class="video-container">
          <!-- Youtube player -->
          <div id="player" allow="autoplay"></div>
        </div>
      </v-col>
      <!-- Right sidebar -->
      <v-col class="col-12 col-xs-12 col-sm-12 col-md-4" id="right-side" style="height: 75vh">
        <v-card class="py-0">
          <v-card-title class="py-5 text-xs-1 text-sm-3">{{ playlist.name }}</v-card-title>
          <v-card-subtitle style="padding-bottom: 0" v-if="playlist.createdBy"
            >Dibuat oleh {{ playlist.createdBy.name }}</v-card-subtitle
          >
          <v-card-actions style="padding-top: 0; padding-bottom: 5">
            <v-btn icon v-model="playerOptions.random" @click="playerOptions.random = !playerOptions.random">
              <v-icon>mdi-shuffle-variant</v-icon>
            </v-btn>
            <v-btn icon @click="action('edit')" v-if="!isEditingSequence">
              <v-icon>mdi-drag-variant</v-icon>
            </v-btn>
            <v-btn icon @click="action('done')" v-if="isEditingSequence">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn icon @click="action('undo')" v-if="isEditingSequence">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
            <div>
              <!-- Add track dialog -->
              <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn plain outlined v-bind="attrs" v-on="on">Tambah Track</v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">{{ isEditingTrack ? "Edit" : "Tambah" }} Track</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="newTrack.name" label="Nama Track" required></v-text-field>
                          <v-text-field v-model="newTrack.videoId" label="URL youtube" required></v-text-field>
                          <v-text-field
                            v-model="newTrack.startTime"
                            label="Waktu mulai"
                            hint="Biarkan jika tidak memakai waktu mulai dan selesai"
                          ></v-text-field>
                          <v-text-field
                            v-model="newTrack.endTime"
                            label="Waktu selesai"
                            hint="Biarkan jika tidak memakai waktu mulai dan selesai"
                          ></v-text-field>
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
                        isEditingTrack = false;
                        newTrack = {
                          name: null,
                          videoId: null,
                          startTime: '00:00:00',
                          endTime: '00:00:00',
                        };
                      "
                      >Batal</v-btn
                    >
                    <v-btn v-if="isEditingTrack" color="green darken-1" text @click="updateTrack">Simpan</v-btn>
                    <v-btn v-else color="green darken-1" text @click="createTrack">Simpan</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-actions>
        </v-card>
        <!-- Playlist items -->
        <v-list two-line outlined style="position: relative; height: 100%; padding: 0; overflow-y: scroll">
          <v-list-item-group v-model="selectedItem">
            <draggable :options="options" v-model="playlist.tracks">
              <template v-for="(item, index) in playlist.tracks">
                <v-list-item :key="item._id" v-on:click="loadVideoById(item, index)">
                  <template>
                    <div class="subtitle mr-5">{{ index + 1 }}</div>
                    <v-list-item-content>
                      <v-list-item-title class="text-wrap" v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text v-text="secondToTimestamp(item.duration)"></v-list-item-action-text>
                      <v-list-item-action-text class="text-weight-medium">
                        <v-btn icon @click.stop="editTrack(item, index)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click.stop="deleteTrack(item, index)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
            </draggable>
          </v-list-item-group>
        </v-list>
      </v-col>
      <ConfirmDialog ref="confirm" />
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import ConfirmDialog from "../components/ConfirmDialog";

export default {
  name: "App",
  components: { draggable, ConfirmDialog },

  data: () => ({
    title: "MyPlaylist",
    before: null,
    isEditingTrack: false,
    isEditingSequence: false,
    indexEdited: null,
    dialog: false,
    selectedItem: 0,
    newTrack: {
      _id: null,
      name: null,
      videoId: null,
      startTime: "00:00:00",
      endTime: "00:00:00",
    },
    playerOptions: {
      random: false,
    },
    playlist: {},
  }),

  metaInfo() {
    return {
      title: this.title,
    };
  },

  methods: {
    loadVideoById: function (item) {
      window.player.loadVideoById({
        videoId: item.videoId,
        startSeconds: item.startTime,
        endSeconds: item.endTime,
      });

      window.player.playVideo();
    },
    createTrack: function () {
      let t = this;
      var startSeconds = this.timestampToSecond(this.newTrack.startTime);
      var endSeconds = this.timestampToSecond(this.newTrack.endTime);
      var duration = endSeconds - startSeconds;
      var videoId = this.youtubeVideoIdParser(this.newTrack.videoId);

      this.$http
        .post("playlist/" + this.$route.params.playlistId + "/track/store", {
          name: this.newTrack.name,
          videoId: videoId,
          startTime: startSeconds,
          endTime: endSeconds,
          duration: duration,
        })
        .then((res) => {
          t.playlist.tracks.push(res.data.newTrack);
          t.dialog = false;
          t.newTrack = {
            name: null,
            videoId: null,
            startTime: "00:00:00",
            endTime: "00:00:00",
          };
        });
    },
    editTrack: function (item, index) {
      this.dialog = true;
      this.isEditingTrack = true;
      this.indexEdited = index;

      this.newTrack = {
        _id: item._id,
        name: item.name,
        videoId: item.videoId,
        startTime: this.secondToTimestamp(item.startTime),
        endTime: this.secondToTimestamp(item.endTime),
      };
    },
    updateTrack: function () {
      let t = this;
      var startSeconds = this.timestampToSecond(this.newTrack.startTime);
      var endSeconds = this.timestampToSecond(this.newTrack.endTime);
      var duration = endSeconds - startSeconds;
      var videoId =
        this.newTrack.videoId === this.playlist.tracks[this.indexEdited].videoId
          ? this.newTrack.videoId
          : this.youtubeVideoIdParser(this.newTrack.videoId);
      this.$http
        .patch("/playlist/" + this.playlist._id + "/track/" + this.newTrack._id, {
          name: this.newTrack.name,
          videoId: videoId,
          startTime: startSeconds,
          endTime: endSeconds,
          duration: duration,
        })
        .then((res) => {
          this.$root.toast.show({ message: "Track berhasil di-edit" });
          t.playlist.tracks[t.indexEdited] = res.data.track;
          t.newTrack = {
            _id: null,
            name: null,
            videoId: null,
            startTime: "00:00:00",
            endTime: "00:00:00",
          };
        });
      this.dialog = false;
      this.isEditingTrack = false;
    },
    deleteTrack: async function (track, index) {
      if (await this.$refs.confirm.open("Hapus track", "Apakah anda yakin ingin menghapus track ini?")) {
        this.playlist.tracks.splice(index, 1);
        this.$http
          .delete("/playlist/" + this.playlist._id + "/track/" + track._id)
          .then(() => this.$root.toast.show({ message: "Track berhasil dihapus" }));
      }
    },
    timestampToSecond: function (timestamp) {
      let seconds = 0;
      const timestamp_split = timestamp.split(":");
      seconds = parseInt(timestamp_split[0]) * 3600 + parseInt(timestamp_split[1]) * 60 + parseInt(timestamp_split[2]);
      return seconds;
    },
    secondToTimestamp: function (sec) {
      if (!sec) return "";
      let hour,
        minute,
        second = 0;
      if (sec > 3600) {
        // if more than 1 hour
        hour = Math.floor(sec / 3600);
        minute = Math.floor((sec % 3600) / 60);
        second = (sec % 3600) % 60;
      } else if (sec >= 60 && sec <= 3600) {
        // if more than 1 minute
        hour = 0;
        minute = Math.floor(sec / 60);
        second = sec % 60;
      } else if (sec < 60) {
        hour = 0;
        minute = 0;
        second = sec;
      }
      let timestamp = "";
      [hour, minute, second].forEach((number, index) => {
        let formattedNumber = number.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        timestamp = index != 2 ? timestamp + formattedNumber + ":" : timestamp + formattedNumber;
      });

      return hour === 0 && minute === 0 && second === 0 ? "" : timestamp;
    },
    action(e) {
      if (e === "edit") this.before = Object.assign([], this.playlist.tracks);
      if (e === "undo") this.playlist.tracks = this.before;
      if (e === "done") {
        const trackSequence = [];
        this.playlist.tracks.forEach((t) => {
          trackSequence.push(t._id);
        });
        this.$http.patch("/playlist/" + this.playlist._id + "/updateSequence", { trackSequence: trackSequence });
      }
      this.isEditingSequence = !this.isEditingSequence;
    },
    getRandomIntInclusive: function () {
      const min = Math.ceil(0);
      const max = Math.floor(this.playlist.tracks.length - 1);

      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    },
    youtubeVideoIdParser: function (url) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    },
  },

  computed: {
    options() {
      return {
        disabled: !this.isEditingSequence,
      };
    },
  },

  mounted: function () {
    const initYoutube = (vm) => {
      let item = vm.playlist.tracks[vm.selectedItem];

      window.player = new window.YT.Player("player", {
        videoId: item.videoId,
        playerVars: {
          start: item.startTime,
          end: item.endTime,
          controls: 1,
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });

      function loadVideo() {
        // TO avoid executing this event twice
        window.player.seekTo(0);

        vm.selectedItem = vm.playerOptions.random ? vm.getRandomIntInclusive() : vm.selectedItem + 1;

        let item = vm.playlist.tracks[vm.selectedItem];
        vm.loadVideoById(item);
      }

      function onPlayerReady(event) {
        event.target.playVideo();
      }

      function onPlayerStateChange(event) {
        if (
          (vm.playlist.tracks[vm.selectedItem].endTime &&
            window.player.getCurrentTime() >= vm.playlist.tracks[vm.selectedItem].endTime) ||
          event.data === window.YT.PlayerState.ENDED
        ) {
          loadVideo();
        }
      }
    };

    var t = this;
    var playlistId = this.$route.params.playlistId;

    this.$http.get("playlist/" + playlistId).then((res) => {
      t.playlist = res.data.playlist;
      t.title = t.playlist.name;

      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initYoutube(this);
      };
    });
  },
};
</script>

<style>
.v-list-item {
  border: solid;
  border-width: 0 0 thin 0;
  border-color: rgba(0, 0, 0, 0.12);
}
</style>
