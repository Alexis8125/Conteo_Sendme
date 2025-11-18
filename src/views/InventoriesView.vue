<!-- src/views/InventoriesView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-600 text-white p-2 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Sistema de Inventario</h1>
              <p class="text-sm text-gray-500">Gestión de inventarios</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Hola, {{ user?.full_name }}</span>
            <button
              @click="handleLogout"
              class="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Crear inventario -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Crear Nuevo Inventario
        </h2>
        <form @submit.prevent="createInventory" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Inventario *</label>
            <input
              v-model="newInventory.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Ej: Inventario General 2024"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <input
              v-model="newInventory.description"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Descripción opcional"
            >
          </div>
          <div class="flex items-end">
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Crear Inventario
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de inventarios -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg class="w-5 h-5 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Mis Inventarios
          </h2>
          <span class="text-sm text-gray-500">{{ inventories.length }} inventario(s)</span>
        </div>

        <div v-if="inventories.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay inventarios</h3>
          <p class="text-gray-500 mb-4">Crea tu primer inventario para comenzar</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="inventory in inventories"
            :key="inventory.id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Header con título y botones de acción -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ inventory.name }}</h3>
                  <div class="flex space-x-2">
                    <!-- Botón Editar -->
                    <button
                      @click="editInventory(inventory)"
                      class="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 py-1 px-2 rounded-md text-sm transition-colors duration-200"
                      title="Editar inventario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      <span class="hidden sm:inline">Editar</span>
                    </button>
                    
                    <!-- Botón Eliminar -->
                    <button
                      @click="deleteInventory(inventory)"
                      class="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 py-1 px-2 rounded-md text-sm transition-colors duration-200"
                      title="Eliminar inventario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span class="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
                
                <p class="text-sm text-gray-600 mb-2">{{ inventory.description }}</p>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Creado por: {{ inventory.created_by_name }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Productos: {{ inventory.total_products }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Contados: {{ inventory.counted_products }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Creado: {{ formatDate(inventory.created_at) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Barra de progreso -->
            <div class="mt-4 mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso del conteo</span>
                <span class="font-medium">{{ Math.round(inventory.progress_percentage) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${inventory.progress_percentage}%` }"
                ></div>
              </div>
            </div>

            <!-- Botones de acción principales -->
            <div class="flex flex-wrap gap-2">
              <button
                @click="uploadProducts(inventory)"
                class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span>Cargar Excel</span>
              </button>
              <button
                @click="startCounting(inventory)"
                class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Iniciar Conteo</span>
              </button>
              <button
                @click="exportInventory(inventory)"
                class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Edición con animaciones -->
    <transition name="modal">
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <transition name="modal-content">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Editar Inventario</h3>
            
            <form @submit.prevent="updateInventory">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    v-model="editingInventory.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Nombre del inventario"
                    ref="editNameInput"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    v-model="editingInventory.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Descripción del inventario"
                  ></textarea>
                </div>
              </div>

              <div class="flex space-x-3 mt-6">
                <button
                  type="button"
                  @click="showEditModal = false"
                  class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Modal de Confirmación de Eliminación con animaciones -->
    <transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <transition name="modal-content">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex items-center space-x-3 mb-4">
              <div class="bg-red-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
            </div>
            
            <p class="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el inventario "<strong>{{ deletingInventory?.name }}</strong>"? 
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>

            <div class="flex space-x-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                @click="confirmDelete"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { success, error, info } = useNotifications()

const inventories = ref([])
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// Estados para modales
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingInventory = ref({ id: null, name: '', description: '' })
const deletingInventory = ref(null)
const editNameInput = ref(null)

const newInventory = ref({
  name: '',
  description: ''
})

// Funciones de formato
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Funciones CRUD
async function fetchInventories() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/api/inventories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      inventories.value = await response.json()
    } else {
      error('Error', 'No se pudieron cargar los inventarios')
    }
  } catch (err) {
    error('Error de conexión', 'No se pudo conectar con el servidor')
  }
}

async function createInventory() {
  if (!newInventory.value.name.trim()) {
    error('Error', 'El nombre del inventario es requerido')
    return
  }
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/api/inventories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newInventory.value)
    })
    
    const data = await response.json()
    if (response.ok) {
      newInventory.value = { name: '', description: '' }
      fetchInventories()
      success('Éxito', 'Inventario creado exitosamente')
    } else {
      error('Error', data.error || 'Error al crear el inventario')
    }
  } catch (err) {
    error('Error', 'Error al crear el inventario')
  }
}

function editInventory(inventory) {
  editingInventory.value = {
    id: inventory.id,
    name: inventory.name,
    description: inventory.description || ''
  }
  showEditModal.value = true
  nextTick(() => {
    editNameInput.value?.focus()
  })
}

async function updateInventory() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/inventories/${editingInventory.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: editingInventory.value.name,
        description: editingInventory.value.description
      })
    })
    
    const data = await response.json()
    if (response.ok) {
      showEditModal.value = false
      fetchInventories()
      success('Éxito', 'Inventario actualizado exitosamente')
    } else {
      error('Error', data.error || 'Error al actualizar el inventario')
    }
  } catch (err) {
    error('Error', 'Error al actualizar el inventario')
  }
}

function deleteInventory(inventory) {
  deletingInventory.value = inventory
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/inventories/${deletingInventory.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json()
    if (response.ok) {
      showDeleteModal.value = false
      fetchInventories()
      success('Éxito', 'Inventario eliminado exitosamente')
    } else {
      error('Error', data.error || 'Error al eliminar el inventario')
    }
  } catch (err) {
    error('Error', 'Error al eliminar el inventario')
  }
}

function uploadProducts(inventory) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx, .xls'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadFile(inventory.id, file)
    }
  }
  input.click()
}

// En el script setup, reemplaza la función uploadFile con esta:

async function uploadFile(inventoryId, file) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error('Error de autenticación', 'No se encontró el token. Por favor, inicia sesión nuevamente.')
      handleLogout()
      return
    }

    console.log('📤 Uploading file to inventory:', inventoryId)
    
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`http://localhost:3000/api/inventories/${inventoryId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // NO incluir 'Content-Type': el navegador lo establecerá automáticamente con el boundary para FormData
      },
      body: formData
    })

    console.log('📨 Response status:', response.status)

    if (response.status === 403) {
      error('Error de autenticación', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      handleLogout()
      return
    }

    if (response.status === 500) {
      const errorText = await response.text()
      console.error('💥 Server error:', errorText)
      error('Error del servidor', 'Hubo un problema procesando el archivo. Verifica la consola para más detalles.')
      return
    }

    const data = await response.json()
    
    if (response.ok) {
      success('Éxito', data.message)
      if (data.errorDetails && data.errorDetails.length > 0) {
        info('Advertencias', `Algunas filas tuvieron errores: ${data.errorDetails.join(', ')}`)
      }
      fetchInventories()
    } else {
      error('Error', data.error || 'Error al cargar el archivo')
    }
  } catch (err) {
    console.error('💥 Upload error:', err)
    error('Error de conexión', 'No se pudo conectar con el servidor. Verifica que esté ejecutándose.')
  }
}

function startCounting(inventory) {
  router.push(`/conteo/${inventory.id}`)
}

function exportInventory(inventory) {
  info('Información', 'Función de exportación en desarrollo')
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  fetchInventories()
})
</script>