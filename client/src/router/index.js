import Vue from 'vue';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueMeta);
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/playlist',
    name: 'MyPlaylist',
    component: Home
  },
  {
    path: '/playlist/:playlistId',
    name: 'Playlist',
    component: () => import('../views/Player.vue')
  },
  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
