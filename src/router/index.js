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
  },
  {
    path: '/user',
    component: () => import(/* webpackChunkName:"User" */ '@/views/user')
  },

  {
    path: '/detail/:articleId',
    component: () => import('@/views/detail'),
    props: true // 开启路由传参  把组件得路由传的参数映射到props上
  }
]

const router = new VueRouter({
  routes
})

export default router
