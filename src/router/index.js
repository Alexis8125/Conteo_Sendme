// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import InventariosView from '@/views/InventoriesView.vue'
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
    component: LoginView,
    meta: { title: 'Inicio de Sesión - Conteo' }
  },
  {
    path: '/inventarios',
    name: 'Inventarios',
    component: InventariosView,
    meta: { 
      requiresAuth: true,
      title: 'Inventarios - Conteo'
    }
  },
  {
    path: '/conteo/:id',
    name: 'Conteo',
    component: CountingView,
    props: true,
    meta: { 
      requiresAuth: true,
      title: 'Conteo de Inventario - Conteo'
    }
  },
  {
    path: '/reportes/:id',
    name: 'Reportes',
    component: ReportsView,
    props: true,
    meta: { 
      requiresAuth: true,
      title: 'Reportes - Conteo'
    }
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

// 🔐 Guard de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

// 📌 Cambiar el título dinámicamente según la ruta
router.afterEach((to) => {
  const defaultTitle = 'Conteo'
  document.title = to.meta.title || defaultTitle
})

export default router
