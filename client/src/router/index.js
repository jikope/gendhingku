import Vue from "vue";
import VueMeta from "vue-meta";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueMeta);
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Landing.vue"),
  },
  {
    path: "/playlist",
    name: "MyPlaylist",
    component: Home,
    meta: {
      auth: true,
    },
  },
  {
    path: "/playlist/:playlistId",
    name: "Playlist",
    component: () => import("../views/Player.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/forbidden",
    name: "forbidden",
    component: () => import("../views/Forbidden.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
        Vue.prototype.$http.get("auth/isLoggedIn").then(res => {
            if (!res.data.isLoggedIn) {
                next('/forbidden');
            }
        });
    }
    next();
});

export default router;
