<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
          <h1 class="text-2xl font-bold text-white mb-2">Sistema de Inventario</h1>
          <p class="text-blue-100 text-sm">Control y gestión de inventarios</p>
        </div>
        
        <div class="p-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200"
                placeholder="Ingresa tu usuario"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200"
                placeholder="Ingresa tu contraseña"
              >
            </div>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>
          
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> admin / password
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { success, error, info } = useNotifications()

const credentials = ref({
  username: '',
  password: ''
})
const isLoading = ref(false)

// Test de notificaciones al cargar el componente
import { onMounted } from 'vue'
onMounted(() => {
  console.log('🔔 LoginView montado - probando notificaciones...')
  // Mostrar una notificación de prueba después de 1 segundo
  setTimeout(() => {
    info('Sistema listo', 'Bienvenido al sistema de inventario')
  }, 1000)
})

async function handleLogin() {
  isLoading.value = true
  
  try {
    console.log('🔐 Intentando login...')
    
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials.value)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      success('¡Éxito!', 'Inicio de sesión exitoso')
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Pequeño delay para que se vea la notificación
      setTimeout(() => {
        router.push('/inventarios')
      }, 1000)
    } else {
      error('Error de inicio de sesión', data.error || 'Credenciales incorrectas')
    }
  } catch (err) {
    console.error('💥 Error de conexión:', err)
    error('Error de conexión', 'No se pudo conectar con el servidor')
  } finally {
    isLoading.value = false
  }
}
</script>