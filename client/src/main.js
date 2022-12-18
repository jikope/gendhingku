import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? "https://gendhing-bimakope.xyz/api/" : "http://localhost:3000/api/";
// axios.defaults.baseURL = "http://localhost:3000/api/";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
