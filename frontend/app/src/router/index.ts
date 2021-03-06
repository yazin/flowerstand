import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import(/* webpackChunkName: "create" */ '../views/Create.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  },
  {
    path: '/update/:id',
    name: 'Update',
    component: () => import(/* webpackChunkName: "update" */ '../views/Update.vue')
  },
  {
    path: '/participate/:id',
    name: 'Participate',
    component: () => import(/* webpackChunkName: "participate" */ '../views/Participate.vue')
  },
  {
    path: '/participantmanage/:id',
    name: 'ManageParticipant',
    component: () => import(/* webpackChunkName: "participantmanage" */ '../views/ParticipantManage.vue')
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: () => import(/* webpackChunkName: "error" */ '../views/ErrorPage.vue')
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import(/* webpackChunkName: "error" */ '../views/Error404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

export default router
