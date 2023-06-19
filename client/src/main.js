import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
// import store from "./store";
import vuetify from "./plugins/vuetify";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000/api/";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  vuetify,
  router,
  // store,
  render: h => h(App)
}).$mount("#app");
