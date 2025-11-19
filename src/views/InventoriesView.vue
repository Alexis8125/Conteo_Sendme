<!-- src/views/InventariosView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Responsive -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-16 space-y-4 sm:space-y-0">
          <!-- Logo y título -->
          <div class="flex items-center space-x-4">
            <div class="bg-blue-600 text-white p-2 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Sistema de Inventario</h1>
              <p class="text-sm text-gray-500">Conteo de inventarios</p>
            </div>
          </div>
          
          <!-- Información de usuario y logout -->
          <div class="flex items-center justify-between sm:justify-end space-x-4">
            <span class="text-sm text-gray-700 hidden sm:block">Hola, {{ user?.full_name }}</span>
            <button
              @click="handleLogout"
              class="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors duration-200 w-full sm:w-auto justify-center"
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
      <!-- Tabla de inventarios -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header de la tabla reorganizado para móvil -->
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 border-b border-gray-200 space-y-4 lg:space-y-0">
          <!-- Título y búsqueda -->
          <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <h2 class="text-lg font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
              <svg class="w-5 h-5 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Inventarios
            </h2>
            
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm w-full"
                  placeholder="Buscar inventarios..."
                >
              </div>
              
              <button
                @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2 justify-center sm:justify-start"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Crear Inventario</span>
              </button>
            </div>
          </div>
          
          <!-- Acciones - reorganizadas para móvil -->
          <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2">
            <!-- Botón de actualizar siempre visible -->
            <button
              @click="refreshInventories"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 self-start"
              title="Actualizar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
            
            <!-- Acciones para inventario seleccionado -->
            <template v-if="selectedInventory">
              <div class="flex flex-wrap gap-2">
                <!-- Botones principales visibles -->
                <button
                  @click="editInventory(selectedInventory)"
                  class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Editar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="startCounting(selectedInventory)"
                  class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Iniciar Conteo"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
                
                <!-- Dropdown para acciones secundarias en móvil - POSICIÓN CORREGIDA -->
                <div class="relative sm:hidden">
                  <button
                    @click="toggleMobileActions"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                    </svg>
                  </button>
                  <!-- Dropdown posicionado a la izquierda para evitar desbordamiento -->
                  <div 
                    v-if="showMobileActions" 
                    class="fixed inset-0 z-50 sm:hidden"
                    @click="showMobileActions = false"
                  >
                    <div class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                      <div class="p-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Acciones</h3>
                        <p class="text-sm text-gray-600">{{ selectedInventory.name }}</p>
                      </div>
                      <div class="p-2">
                        <button
                          @click="uploadProducts(selectedInventory); showMobileActions = false"
                          class="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <span>Cargar Excel</span>
                        </button>
                        <button
                          @click="viewReports(selectedInventory); showMobileActions = false"
                          class="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <span>Ver Reportes</span>
                        </button>
                        <button
                          @click="deleteInventory(selectedInventory); showMobileActions = false"
                          class="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          <span>Eliminar</span>
                        </button>
                      </div>
                      <div class="p-4 border-t border-gray-200">
                        <button
                          @click="showMobileActions = false"
                          class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Acciones secundarias visibles en desktop -->
                <div class="hidden sm:flex sm:space-x-2">
                  <button
                    @click="uploadProducts(selectedInventory)"
                    class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Cargar Excel"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </button>
                  <button
                    @click="viewReports(selectedInventory)"
                    class="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    title="Ver Reportes"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteInventory(selectedInventory)"
                    class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                
                <button
                  @click="clearSelection"
                  class="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Cancelar selección"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- AppTable Component -->
        <AppTable
          :data="filteredTableData"
          :headers="tableHeaders"
          :pageSize="pageSize"
          :pageCurrent="currentPage"
          :totalItems="filteredTableData.length"
          :loading="loading"
          :showPaginator="false"
          :multipleSelection="false"
          :tableSize="'small'"
          :stripedRows="true"
          :selectedRow="selectedInventory"
          @row-double-click="handleRowDoubleClick"
        >
          <!-- Slot para progreso basado en unidades -->
          <template #custom-progress="{ data }">
            <div class="flex flex-col items-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${calculateUnitProgress(data)}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-600">{{ Math.round(calculateUnitProgress(data)) }}%</span>
              <span class="text-xs text-gray-400">
                {{ data.counted_units || 0 }}/{{ data.total_units || 0 }} unidades
              </span>
            </div>
          </template>

          <!-- Slot para cuando no hay datos -->
          <template #empty>
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay inventarios</h3>
              <p class="text-gray-500 mb-4">Crea tu primer inventario para comenzar</p>
              <button
                @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
              >
                Crear Primer Inventario
              </button>
            </div>
          </template>
        </AppTable>
      </div>
    </main>

    <!-- Modal de Crear Inventario -->
    <transition name="modal">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <transition name="modal-content">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Crear Nuevo Inventario
            </h3>
            
            <form @submit.prevent="createInventory">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Inventario *</label>
                  <input
                    v-model="newInventory.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Ej: Inventario General"
                    ref="nameInput"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    v-model="newInventory.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Descripción opcional del inventario"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Archivo Excel de Productos</label>
                  <input
                    type="file"
                    ref="fileInput"
                    accept=".xlsx, .xls"
                    @change="handleFileSelect"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  >
                  <p class="text-xs text-gray-500 mt-1">Archivo Excel con columnas: código de barras, nombre del producto, stock esperado</p>
                </div>

                <div v-if="selectedFile" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-sm font-medium text-blue-700">{{ selectedFile.name }}</span>
                      <span class="text-xs text-blue-600">({{ formatFileSize(selectedFile.size) }})</span>
                    </div>
                    <button
                      type="button"
                      @click="clearSelectedFile"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex space-x-3 mt-6">
                <button
                  type="button"
                  @click="showCreateModal = false"
                  class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="creatingInventory"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <svg v-if="creatingInventory" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ creatingInventory ? 'Creando...' : 'Crear Inventario' }}</span>
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Modal de Edición -->
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

    <!-- Modal de Confirmación de Eliminación -->
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
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
import AppTable from '@/components/atoms/AppTable.vue'

const router = useRouter()
const { success, error, info } = useNotifications()

const inventories = ref([])
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const selectedInventory = ref(null)
const searchQuery = ref('')

// Estados para modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showMobileActions = ref(false)
const editingInventory = ref({ id: null, name: '', description: '' })
const deletingInventory = ref(null)
const nameInput = ref(null)
const editNameInput = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const creatingInventory = ref(false)

// Estados para archivos
const selectedFile = ref(null)

// Configuración de paginación
const pageSize = ref(10)
const currentPage = ref(1)

const newInventory = ref({
  name: '',
  description: ''
})

// Configuración de la tabla
const tableHeaders = ref([
  { field: 'name', header: 'Nombre', width: '200px' },
  { field: 'description', header: 'Descripción', width: '200px' },
  { field: 'total_products', header: 'Productos', width: '100px' },
  { field: 'total_units', header: 'Unidades', width: '100px' },
  { field: 'counted_products', header: 'Productos Contados', width: '160px' },
  { field: 'counted_units', header: 'Unid. Contadas', width: '160px' },
  { field: 'progress', header: 'Progreso', width: '120px' },
  { field: 'created_at', header: 'Creado', width: '120px' },
  { field: 'created_by_name', header: 'Creado por', width: '150px' },
  { field: 'updated_at', header: 'Última Actualización', width: '150px' }
])

// Datos formateados para la tabla
const tableData = computed(() => {
  return inventories.value.map(inventory => ({
    ...inventory,
    progress: calculateUnitProgress(inventory),
    created_at: formatDateForTable(inventory.created_at)
  }))
})

// Datos filtrados por búsqueda
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value
  
  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(inventory => 
    inventory.name?.toLowerCase().includes(query) ||
    inventory.description?.toLowerCase().includes(query) ||
    inventory.created_by_name?.toLowerCase().includes(query)
  )
})

// Función para calcular progreso basado en unidades
function calculateUnitProgress(inventory) {
  const totalUnits = inventory.total_units || 0
  const countedUnits = inventory.counted_units || 0
  
  if (totalUnits === 0) return 0
  
  const progress = (countedUnits / totalUnits) * 100
  return Math.min(100, Math.max(0, progress))
}

// Funciones de formato
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatDateForTable(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Manejar doble click
function handleRowDoubleClick(inventory) {
  selectedInventory.value = inventory
}

// Limpiar selección
function clearSelection() {
  selectedInventory.value = null
  showMobileActions.value = false
}

// Toggle acciones móviles
function toggleMobileActions() {
  showMobileActions.value = !showMobileActions.value
}

// Refrescar inventarios
function refreshInventories() {
  fetchInventories()
  success('Actualizado', 'Lista de inventarios actualizada')
}

// Funciones CRUD usando el servicio de API
async function fetchInventories() {
  loading.value = true
  try {
    const data = await apiService.getInventories()
    // Asegurarse de que los valores numéricos sean correctos
    inventories.value = data.map(inv => ({
      ...inv,
      total_units: Number(inv.total_units) || 0,
      counted_units: Number(inv.counted_units) || 0,
      total_products: Number(inv.total_products) || 0,
      counted_products: Number(inv.counted_products) || 0
    }))
    console.log('Inventarios cargados:', inventories.value)
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error de conexión', 'No se pudo conectar con el servidor')
    }
  } finally {
    loading.value = false
  }
}

// Manejar selección de archivo
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    // Validar tipo de archivo
    const validTypes = ['.xlsx', '.xls']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      error('Error', 'Solo se permiten archivos Excel (.xlsx, .xls)')
      event.target.value = ''
      return
    }
    
    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      error('Error', 'El archivo no debe superar los 10MB')
      event.target.value = ''
      return
    }
    
    selectedFile.value = file
  }
}

function clearSelectedFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function createInventory() {
  if (!newInventory.value.name.trim()) {
    error('Error', 'El nombre del inventario es requerido')
    return
  }
  
  creatingInventory.value = true
  
  try {
    const data = await apiService.createInventory(newInventory.value)
    const inventoryId = data.id
    
    // Si hay un archivo seleccionado, cargarlo inmediatamente
    if (selectedFile.value) {
      await apiService.uploadProducts(inventoryId, selectedFile.value, false)
    }
    
    // Limpiar formulario y cerrar modal
    newInventory.value = { name: '', description: '' }
    clearSelectedFile()
    showCreateModal.value = false
    
    // Actualizar lista
    fetchInventories()
    success('Éxito', 'Inventario creado exitosamente' + (selectedFile.value ? ' con productos cargados' : ''))
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al crear el inventario')
    }
  } finally {
    creatingInventory.value = false
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
    await apiService.updateInventory(editingInventory.value.id, {
      name: editingInventory.value.name,
      description: editingInventory.value.description
    })
    
    showEditModal.value = false
    fetchInventories()
    success('Éxito', 'Inventario actualizado exitosamente')
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al actualizar el inventario')
    }
  }
}

function deleteInventory(inventory) {
  deletingInventory.value = inventory
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await apiService.deleteInventory(deletingInventory.value.id)
    showDeleteModal.value = false
    fetchInventories()
    success('Éxito', 'Inventario eliminado exitosamente')
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al eliminar el inventario')
    }
  }
}

function uploadProducts(inventory) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx, .xls'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadFile(inventory.id, file, false)
    }
  }
  input.click()
}

async function uploadFile(inventoryId, file, overwrite = false) {
  try {
    const data = await apiService.uploadProducts(inventoryId, file, overwrite)
    
    success('Éxito', data.message)
    if (data.errorDetails && data.errorDetails.length > 0) {
      info('Advertencias', `Algunas filas tuvieron errores: ${data.errorDetails.join(', ')}`)
    }
    fetchInventories()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al cargar el archivo')
    }
  }
}

function startCounting(inventory) {
  router.push(`/conteo/${inventory.id}`)
}

function viewReports(inventory) {
  router.push(`/reportes/${inventory.id}`)
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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animación para el modal de acciones móviles */
.mobile-actions-enter-active,
.mobile-actions-leave-active {
  transition: all 0.3s ease;
}

.mobile-actions-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.mobile-actions-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>