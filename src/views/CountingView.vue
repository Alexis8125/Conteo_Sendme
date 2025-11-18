<!-- src/views/CountingView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.push('/inventarios')"
              class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver a Inventarios</span>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Conteo de Inventario</h1>
              <p class="text-sm text-gray-500">{{ inventory?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <!-- Progreso -->
            <div class="text-center">
              <p class="text-sm text-gray-600">Progreso</p>
              <p class="text-lg font-bold text-blue-600">{{ Math.round(inventory?.progress_percentage || 0) }}%</p>
            </div>
            
            <!-- Selector de modo -->
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700">Modo:</span>
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button
                  @click="setMode('auto')"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    mode === 'auto' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <span class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>Automático</span>
                  </span>
                </button>
                <button
                  @click="setMode('manual')"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    mode === 'manual' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <span class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Manual</span>
                  </span>
                </button>
              </div>
            </div>

            <!-- Información del usuario -->
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 font-medium text-sm">{{ userInitials }}</span>
              </div>
              <span class="text-sm text-gray-700">{{ user?.full_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Panel principal de conteo -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Modo Automático -->
        <div v-if="mode === 'auto'" class="space-y-6">
          <div class="text-center">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 inline-flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span class="text-green-700 font-medium">Modo Automático Activado</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Escaneo Automático</h2>
            <p class="text-gray-600">Escanea un código de barras y el sistema procesará automáticamente</p>
          </div>

          <!-- Campo de escaneo automático -->
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700 text-center">
              Escanear Código de Barras
            </label>
            <input
              ref="autoInput"
              v-model="autoBarcode"
              type="text"
              class="w-full px-6 py-4 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 text-center font-mono placeholder-gray-400 transition-colors duration-200"
              placeholder="Coloca el cursor aquí y escanea"
              @input="processAutoScan"
            />
            <p class="text-sm text-gray-500 text-center">
              El sistema procesará automáticamente cada escaneo
            </p>
          </div>

          <!-- Resultado del último escaneo -->
          <div v-if="lastScannedProduct" class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Último Producto Escaneado
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Código:</span>
                <p class="text-gray-900 font-mono">{{ lastScannedProduct.barcode }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Nombre:</span>
                <p class="text-gray-900">{{ lastScannedProduct.product_name || 'N/A' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">SKU:</span>
                <p class="text-gray-900">{{ lastScannedProduct.sku || 'N/A' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Stock Esperado:</span>
                <p class="text-gray-900">{{ lastScannedProduct.expected_stock || 0 }}</p>
              </div>
            </div>
            <div class="mt-4 p-3 bg-green-100 border border-green-200 rounded">
              <p class="text-green-700 text-sm font-medium flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Producto registrado correctamente. Listo para siguiente escaneo.
              </p>
            </div>
          </div>
        </div>

        <!-- Modo Manual -->
        <div v-else class="space-y-6">
          <div class="text-center">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-blue-700 font-medium">Modo Manual Activado</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Conteo Manual</h2>
            <p class="text-gray-600">Ingresa el código y la cantidad manualmente</p>
          </div>

          <!-- Formulario manual -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Código de Barras
              </label>
              <input
                ref="manualBarcodeInput"
                v-model="manualBarcode"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Ingresa o escanea código"
                @keypress.enter="searchManualProduct"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                v-model.number="manualQuantity"
                type="number"
                min="1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Cantidad contada"
              />
            </div>
          </div>

          <!-- Botones modo manual -->
          <div class="flex space-x-4 justify-center">
            <button
              @click="searchManualProduct"
              class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-8 0 7 7 0 018 0z"></path>
              </svg>
              <span>Buscar Producto</span>
            </button>
            <button
              @click="registerManualCount"
              :disabled="!manualProduct || !manualQuantity"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Registrar Conteo</span>
            </button>
          </div>

          <!-- Información del producto manual -->
          <div v-if="manualProduct" class="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Producto Encontrado</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Código:</span>
                <p class="text-gray-900 font-mono">{{ manualProduct.barcode }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Nombre:</span>
                <p class="text-gray-900">{{ manualProduct.product_name || 'N/A' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">SKU:</span>
                <p class="text-gray-900">{{ manualProduct.sku || 'N/A' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Stock Esperado:</span>
                <p class="text-gray-900">{{ manualProduct.expected_stock || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ inventory?.total_products || 0 }}</div>
          <p class="text-sm text-gray-600">Total Productos</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-green-600">{{ inventory?.counted_products || 0 }}</div>
          <p class="text-sm text-gray-600">Productos Contados</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ (inventory?.total_products || 0) - (inventory?.counted_products || 0) }}</div>
          <p class="text-sm text-gray-600">Por Contar</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const inventoryId = route.params.id
const { success, error, info } = useNotifications()

// Refs principales
const inventory = ref(null)
const mode = ref('auto') // 'auto' or 'manual'
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// Refs para modo automático
const autoInput = ref(null)
const autoBarcode = ref('')
const lastScannedProduct = ref(null)

// Refs para modo manual
const manualBarcodeInput = ref(null)
const manualBarcode = ref('')
const manualQuantity = ref(1)
const manualProduct = ref(null)

// Computed
const userInitials = computed(() => {
  if (!user.value.full_name) return 'U'
  return user.value.full_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Funciones
function setMode(newMode) {
  mode.value = newMode
  nextTick(() => {
    if (newMode === 'auto') {
      autoInput.value?.focus()
    } else {
      manualBarcodeInput.value?.focus()
    }
  })
}

// Modo Automático
async function processAutoScan() {
  if (!autoBarcode.value.trim()) return

  // Pequeño delay para asegurar que se capturó todo el código
  setTimeout(async () => {
    const barcode = autoBarcode.value.trim()
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3000/api/inventories/${inventoryId}/products/search?barcode=${encodeURIComponent(barcode)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const products = await response.json()
        if (products.length > 0) {
          const product = products[0]
          await registerCount(product.barcode, 1) // Siempre 1 en automático
          lastScannedProduct.value = product
        } else {
          // Producto no encontrado, preguntar si crear nuevo
          if (confirm(`Producto "${barcode}" no encontrado. ¿Desea crear uno nuevo?`)) {
            await registerCount(barcode, 1)
            lastScannedProduct.value = {
              barcode: barcode,
              product_name: 'Nuevo Producto',
              sku: 'N/A',
              expected_stock: 0
            }
          } else {
            info('Producto no encontrado', `El código ${barcode} no existe en el inventario`)
          }
        }
        
        // Limpiar campo para siguiente escaneo
        autoBarcode.value = ''
        nextTick(() => {
          autoInput.value?.focus()
        })
      }
    } catch (err) {
      error('Error', 'Error en el escaneo automático')
    }
  }, 100)
}

// Modo Manual
async function searchManualProduct() {
  if (!manualBarcode.value.trim()) {
    error('Error', 'Ingresa un código de barras')
    return
  }

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `http://localhost:3000/api/inventories/${inventoryId}/products/search?barcode=${encodeURIComponent(manualBarcode.value)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    
    if (response.ok) {
      const products = await response.json()
      if (products.length > 0) {
        manualProduct.value = products[0]
      } else {
        manualProduct.value = {
          barcode: manualBarcode.value,
          product_name: 'Producto no encontrado',
          sku: 'N/A',
          expected_stock: 0
        }
        error('Producto no encontrado', `El código ${manualBarcode.value} no existe`)
      }
    }
  } catch (err) {
    error('Error', 'Error al buscar el producto')
  }
}

async function registerManualCount() {
  if (!manualProduct.value || !manualQuantity.value) {
    error('Error', 'Completa todos los campos')
    return
  }
  
  await registerCount(manualProduct.value.barcode, manualQuantity.value)
  
  // Limpiar formulario
  manualBarcode.value = ''
  manualQuantity.value = 1
  manualProduct.value = null
  
  nextTick(() => {
    manualBarcodeInput.value?.focus()
  })
}

// Función común para registrar conteo
async function registerCount(barcode, quantity) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/inventories/${inventoryId}/count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        barcode: barcode,
        quantity: quantity
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      await fetchInventory() // Actualizar estadísticas
      success('Conteo registrado', `Producto ${barcode} contado: ${quantity} unidades`)
    } else {
      error('Error', data.error || 'Error al registrar el conteo')
    }
  } catch (err) {
    error('Error', 'Error al registrar el conteo')
  }
}

async function fetchInventory() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/inventories/${inventoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      inventory.value = await response.json()
    } else {
      error('Error', 'No se pudo cargar la información del inventario')
    }
  } catch (err) {
    error('Error', 'Error al cargar el inventario')
  }
}

onMounted(() => {
  fetchInventory()
  nextTick(() => {
    autoInput.value?.focus()
  })
})
</script>