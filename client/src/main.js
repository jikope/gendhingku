import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
// import store from "./store";
import vuetify from "./plugins/vuetify";

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "https://www.gendhing-bimakope.xyz/api/";
axios.defaults.baseURL = "https://gendhingku.cyclic.app/api/";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  vuetify,
  router,
  // store,
  render: h => h(App)
}).$mount("#app");
