<template>
  <v-app>
    <v-app-bar app dense flat>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title>
        <v-btn depressed>
          <a href="/">HOME</a>
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn depressed @click="$router.push({name:'MyPlaylist'})"> -->
      <v-btn depressed>
        <a href="/playlist"> <v-icon>mdi-playlist-music</v-icon>Playlistku </a>
      </v-btn>
      <v-btn depressed link>
        <div ref="authBtn" v-if="isLoggedIn" @click="logout">Logout</div>
        <div ref="authBtn" v-else @click="login">
          <!-- <a href="/login">Login</a> -->
          Login 
        </div>
      </v-btn>
    </v-app-bar>
    <!---------------------------------------------------------------------
	MAIN CONTENT
    --------------------------------------------------------------------->
    <v-main v-if="isMounted">
      <router-view />
    </v-main>

    <Toast ref="myToast" />
    <Loader ref="myLoader" />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import Toast from "./components/Toast";
import Loader from "./components/Loader";

export default {
  name: "Home",
  metaInfo: {
    title: "Home",
    titleTemplate: "%s | Gendhingku"
  },
  components: {
    Toast,
    Loader
  },
  data() {
    return {
      isLoggedIn: false,
      isMounted: false,
    };
  },
  computed: {
    ...mapState({
      auth: state => state.auth
    })
  },
  created: async function() {
    let t = this;
    await this.$http.get("auth/isLoggedIn").then(res => {
      t.isLoggedIn = res.data.isLoggedIn;
    }).catch(() => {
        console.log("Not logged in. ");
    });
  },
  mounted: function() {
    this.$root.toast = this.$refs.myToast;
    this.$root.loader = this.$refs.myLoader;
    this.$root.authBtn = this.$refs.authBtn;
    this.isMounted = true;
  },
  methods: {
    login: function() {
      window.location.href = "/login";
    },
    logout: function() {
      window.location.href = "/api/auth/logout";
    }
  }
};
</script>

<style lang="scss">
$text-color: #222222;

html,
body {
  overflow-x: hidden;
}

a {
  color: $text-color !important;
  text-decoration: none;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
}
.video-container iframe,
.video-container object,
.video-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
