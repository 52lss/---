import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
/* webpack魔法注释: /* webpackChunkName:"新名字" */
const routes = [
  {
    path: '/',
    // 路由懒加载 提示首屏加载速度
    component: () => import('@/views/layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/video',
        component: () => import(/* webpackChunkName:"base" */ '@/views/Video')
      },
      {
        path: '/qa',
        component: () => import(/* webpackChunkName:"base" */ '@/views/Qa')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName:"Search" */ '@/views/search')
  }
]

const router = new VueRouter({
  routes
})

export default router
