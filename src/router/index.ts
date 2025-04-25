import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/Home.vue'
import LoginView from '@/components/Login.vue'
import RegView from '@/components/Reg.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/reg',
      name: 'reg',
      component: RegView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
      const token = window.localStorage.getItem('token')
      if (token) {
          next({ path: '/' })
      } else {
          next()
      }
  } else {
      if (to.meta.requiresAuth) {
          const token = window.localStorage.getItem('token')
          if (!token) {
              next('/login')
              localStorage.removeItem('name')
          } else {
              next()
          }
      } else {
          next()
      }
  }
})

export default router
