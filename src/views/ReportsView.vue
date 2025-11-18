<!-- src/views/ReportsView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.push(`/conteo/${inventoryId}`)"
              class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver al Conteo</span>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Reportes de Inventario</h1>
              <p class="text-sm text-gray-500">{{ inventory?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="exportReport"
              class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
              <span>Exportar Reporte</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Producto</label>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              placeholder="Código o nombre..."
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              v-model="statusFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="all">Todos</option>
              <option value="counted">Contados</option>
              <option value="not-counted">No Contados</option>
              <option value="excess">Exceso</option>
              <option value="shortage">Faltante</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="difference">Diferencia</option>
              <option value="product_name">Nombre</option>
              <option value="barcode">Código</option>
              <option value="expected_stock">Stock Esperado</option>
              <option value="counted_stock">Stock Contado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <select
              v-model="sortDirection"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="desc">Mayor a Menor</option>
              <option value="asc">Menor a Mayor</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ summary.totalProducts }}</div>
          <p class="text-sm text-gray-600">Total Productos</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-green-600">{{ summary.countedProducts }}</div>
          <p class="text-sm text-gray-600">Productos Contados</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ summary.productsWithExcess }}</div>
          <p class="text-sm text-gray-600">Con Exceso</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-2xl font-bold text-red-600">{{ summary.productsWithShortage }}</div>
          <p class="text-sm text-gray-600">Con Faltante</p>
        </div>
      </div>

      <!-- Tabla de reportes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <AppTable
          :data="filteredProducts"
          :headers="tableHeaders"
          :pageSize="pageSize"
          :pageCurrent="currentPage"
          :totalItems="filteredProducts.length"
          :loading="loading"
          :showPaginator="true"
          :multipleSelection="false"
          :tableSize="'small'"
          :stripedRows="true"
        >
          <!-- Slot para diferencia -->
          <template #custom-difference="{ data }">
            <div class="flex flex-col items-center">
              <span 
                :class="[
                  'text-sm font-medium px-2 py-1 rounded',
                  getDifferenceClass(data.difference)
                ]"
              >
                {{ data.difference > 0 ? '+' : '' }}{{ data.difference }}
              </span>
              <span class="text-xs text-gray-500 mt-1">
                {{ data.difference_percentage > 0 ? '+' : '' }}{{ data.difference_percentage }}%
              </span>
            </div>
          </template>

          <!-- Slot para estado -->
          <template #custom-status="{ data }">
            <span 
              :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                getStatusClass(data.status)
              ]"
            >
              {{ getStatusText(data.status) }}
            </span>
          </template>

          <!-- Slot para cuando no hay datos -->
          <template #empty>
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
              <p class="text-gray-500 mb-4">No se encontraron productos para mostrar en el reporte.</p>
            </div>
          </template>
        </AppTable>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import AppTable from '@/components/atoms/AppTable.vue'

const route = useRoute()
const inventoryId = route.params.id
const { success, error } = useNotifications()

// Refs principales
const inventory = ref(null)
const products = ref([])
const loading = ref(false)

// Filtros y ordenamiento
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('difference')
const sortDirection = ref('desc')

// Paginación
const pageSize = ref(20)
const currentPage = ref(1)

// Configuración de la tabla
const tableHeaders = ref([
  { field: 'barcode', header: 'Código', width: '150px' },
  { field: 'product_name', header: 'Producto', width: '200px' },
  { field: 'expected_stock', header: 'Stock Esperado', width: '120px' },
  { field: 'counted_stock', header: 'Stock Contado', width: '120px' },
  { field: 'difference', header: 'Diferencia', width: '120px' },
  { field: 'status', header: 'Estado', width: '120px' },
  { field: 'last_counted_at', header: 'Último Conteo', width: '150px' }
])

// Computed para resumen
const summary = computed(() => {
  const totalProducts = products.value.length
  const countedProducts = products.value.filter(p => p.counted_stock > 0).length
  const productsWithExcess = products.value.filter(p => p.difference > 0).length
  const productsWithShortage = products.value.filter(p => p.difference < 0).length

  return {
    totalProducts,
    countedProducts,
    productsWithExcess,
    productsWithShortage
  }
})

// Computed para productos filtrados
const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.barcode?.toLowerCase().includes(query) ||
      product.product_name?.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(product => {
      switch (statusFilter.value) {
        case 'counted':
          return product.counted_stock > 0
        case 'not-counted':
          return product.counted_stock === 0
        case 'excess':
          return product.difference > 0
        case 'shortage':
          return product.difference < 0
        default:
          return true
      }
    })
  }

  // Ordenar
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    if (sortBy.value === 'difference') {
      aValue = Math.abs(aValue)
      bValue = Math.abs(bValue)
    }

    if (sortDirection.value === 'desc') {
      return bValue - aValue
    } else {
      return aValue - bValue
    }
  })

  return filtered
})

// Funciones de utilidad
function getDifferenceClass(difference) {
  if (difference > 0) {
    return 'bg-green-100 text-green-800'
  } else if (difference < 0) {
    return 'bg-red-100 text-red-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'excess':
      return 'bg-green-100 text-green-800'
    case 'shortage':
      return 'bg-red-100 text-red-800'
    case 'exact':
      return 'bg-blue-100 text-blue-800'
    case 'not-counted':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'excess':
      return 'Exceso'
    case 'shortage':
      return 'Faltante'
    case 'exact':
      return 'Exacto'
    case 'not-counted':
      return 'No Contado'
    default:
      return 'No Contado'
  }
}

// Funciones principales
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
    }
  } catch (err) {
    error('Error', 'No se pudo cargar la información del inventario')
  }
}

async function fetchProducts() {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/inventories/${inventoryId}/products/report`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      products.value = await response.json()
    } else {
      error('Error', 'No se pudieron cargar los productos')
    }
  } catch (err) {
    error('Error', 'Error al cargar los productos')
  } finally {
    loading.value = false
  }
}

async function exportReport() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `http://localhost:3000/api/inventories/${inventoryId}/export-report?format=excel`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `reporte_${inventory.value.name}_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      success('Éxito', 'Reporte exportado exitosamente')
    } else {
      error('Error', 'Error al exportar el reporte')
    }
  } catch (err) {
    error('Error', 'Error al exportar el reporte')
  }
}

onMounted(() => {
  fetchInventory()
  fetchProducts()
})
</script>