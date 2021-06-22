import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Settings from '../views/Settings.vue'
import Register from '../views/Register.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/perfom',
    name: 'Perfom',
    component: () => import(/* webpackChunkName: "about" */ '../views/Perfom.vue'),
    meta: { transition: 'overlay-right' },
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue'),
    meta: { transition: 'overlay-right' },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
