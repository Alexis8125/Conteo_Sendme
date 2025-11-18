<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
    <NotificationsContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NotificationsContainer from '@/components/NotificationsContainer.vue'

const router = useRouter()

// Verificar autenticación al cargar la app
onMounted(() => {
  const token = localStorage.getItem('token')
  const currentPath = window.location.pathname
  
  if (!token && currentPath !== '/login') {
    router.push('/login')
  }
  
  console.log('App montada correctamente')
})
</script>

<style>
/* Estilos globales */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
}

/* Mejoras para inputs en móviles */
@media (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}

/* Estilos para botones globales */
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white;
}

.btn-success {
  @apply bg-green-600 hover:bg-green-700 text-white;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white;
}

.btn-warning {
  @apply bg-yellow-600 hover:bg-yellow-700 text-white;
}
</style>
