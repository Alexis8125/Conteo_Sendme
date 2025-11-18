import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InventoriesView from '../views/InventoriesView.vue'
import CountingView from '../views/CountingView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/inventarios',
      name: 'inventarios',
      component: InventoriesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/conteo/:id',
      name: 'conteo',
      component: CountingView,
      meta: { requiresAuth: true }
    }
  ]
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/inventarios')
  } else {
    next()
  }
})

export default router