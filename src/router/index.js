// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import InventariosView from '@/views/InventoriesView.vue' // Fixed import
import CountingView from '@/views/CountingView.vue'
import ReportsView from '@/views/ReportsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/inventarios'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/inventarios',
    name: 'Inventarios',
    component: InventariosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/conteo/:id',
    name: 'Conteo',
    component: CountingView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/reportes/:id',
    name: 'Reportes',
    component: ReportsView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/inventarios'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación (si lo tienes)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router