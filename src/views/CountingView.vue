<!-- src/views/CountingView.vue COMPLETO -->
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
            <!-- Progreso del producto actual -->
            <div class="text-center">
              <p class="text-sm text-gray-600">Progreso Producto</p>
              <p class="text-lg font-bold text-blue-600">{{ currentProductStats?.progress_percentage || 0 }}%</p>
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

            <!-- Control de sonido -->
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">Sonido:</span>
              <button
                @click="toggleSound"
                :class="[
                  'p-2 rounded-lg transition-colors duration-200',
                  soundEnabled 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                :title="soundEnabled ? 'Desactivar sonido' : 'Activar sonido'"
              >
                <svg v-if="soundEnabled" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3v18l-4.5-4.5H4a1 1 0 01-1-1v-7a1 1 0 011-1h3.5z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                </svg>
              </button>
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

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Panel principal de conteo -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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

          <!-- Campo de escaneo automático con autofocus -->
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
              @input="handleAutoInput"
              @blur="handleAutoInputBlur"
              autofocus
            />
            <p class="text-sm text-gray-500 text-center">
              El campo está listo para recibir códigos del escáner
            </p>
          </div>

          <!-- Información del último escaneo MEJORADA -->
          <div v-if="lastScanInfo" class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Último Escaneo - {{ lastScanInfo.product_name }}
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Código:</span>
                <p class="text-gray-900 font-mono">{{ lastScanInfo.barcode }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Producto:</span>
                <p class="text-gray-900">{{ lastScanInfo.product_name || 'N/A' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Escaneado Ahora:</span>
                <p class="text-gray-900 font-bold">{{ lastScanInfo.quantity }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Total Contado:</span>
                <p class="text-gray-900 font-bold">{{ lastScanInfo.total_counted }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Stock Esperado:</span>
                <p class="text-gray-900">{{ lastScanInfo.expected_stock || 0 }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Por Contar:</span>
                <p class="text-gray-900 font-bold text-orange-600">{{ lastScanInfo.remaining }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Progreso:</span>
                <p class="text-gray-900 font-bold">{{ lastScanInfo.progress_percentage }}%</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Fecha/Hora:</span>
                <p class="text-gray-900">{{ lastScanInfo.timestamp }}</p>
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

          <!-- Mensaje de error para producto no encontrado -->
          <div v-if="scanError" class="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Error en Escaneo
            </h3>
            <div class="text-red-700">
              <p class="font-medium">Producto no registrado</p>
              <p class="text-sm mt-1">El código <span class="font-mono">{{ scanErrorBarcode }}</span> no existe en el sistema.</p>
              <p class="text-sm mt-2">Contacte al administrador para agregar este producto al inventario.</p>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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

          <!-- Información del producto manual MEJORADA -->
          <div v-if="manualProduct && !manualProductError" class="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
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
              <div v-if="manualProduct.counted_stock">
                <span class="font-medium text-gray-700">Ya Contado:</span>
                <p class="text-gray-900 font-bold text-green-600">{{ manualProduct.counted_stock }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Por Contar:</span>
                <p class="text-gray-900 font-bold text-orange-600">
                  {{ Math.max(0, (manualProduct.expected_stock || 0) - (manualProduct.counted_stock || 0)) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Error de producto no encontrado en modo manual -->
          <div v-if="manualProductError" class="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Producto No Encontrado
            </h3>
            <div class="text-red-700">
              <p class="font-medium">El producto no está registrado</p>
              <p class="text-sm mt-1">El código <span class="font-mono">{{ manualBarcode }}</span> no existe en el sistema.</p>
              <p class="text-sm mt-2">Contacte al administrador para agregar este producto al inventario.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas y reportes MEJORADOS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Estadísticas del PRODUCTO ACTUAL -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Producto Actual
          </h3>
          <div v-if="currentProduct" class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Producto</span>
              <span class="text-lg font-bold text-blue-600">{{ currentProduct.product_name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Código</span>
              <span class="text-lg font-mono text-gray-900">{{ currentProduct.barcode }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stock Esperado</span>
              <span class="text-lg font-bold text-purple-600">{{ currentProduct.expected_stock || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Contado Actual</span>
              <span class="text-lg font-bold text-green-600">{{ currentProduct.counted_stock || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Por Contar</span>
              <span class="text-lg font-bold text-orange-600">{{ Math.max(0, (currentProduct.expected_stock || 0) - (currentProduct.counted_stock || 0)) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Progreso</span>
              <span class="text-lg font-bold text-indigo-600">{{ currentProductStats?.progress_percentage || 0 }}%</span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500 text-sm">Escanea un producto para ver sus estadísticas</p>
          </div>
        </div>

        <!-- Resumen del INVENTARIO COMPLETO -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Resumen del Inventario
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Productos</span>
              <span class="text-lg font-bold text-blue-600">{{ inventory?.total_products || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Productos Contados</span>
              <span class="text-lg font-bold text-green-600">{{ inventory?.counted_products || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Por Contar</span>
              <span class="text-lg font-bold text-orange-600">{{ (inventory?.total_products || 0) - (inventory?.counted_products || 0) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Progreso General</span>
              <span class="text-lg font-bold text-indigo-600">{{ Math.round(inventory?.progress_percentage || 0) }}%</span>
            </div>
          </div>
        </div>

        <!-- Reportes rápidos -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reportes</h3>
          <div class="space-y-3">
            <button
              @click="viewProductReports"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Ver Reportes por Producto</span>
            </button>
            <button
              @click="exportInventory"
              class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
              <span>Exportar a Excel</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Elementos de audio -->
    <!-- <audio ref="successSound" preload="auto">
      <source src="/sounds/success.mp3" type="audio/mpeg">
    </audio>
    <audio ref="errorSound" preload="auto">
      <source src="/sounds/error.mp3" type="audio/mpeg">
    </audio> -->
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const inventoryId = route.params.id
const { success, error, info } = useNotifications()

// Refs principales
const inventory = ref(null)
const mode = ref('auto')
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const soundEnabled = ref(true)

// Refs para modo automático
const autoInput = ref(null)
const autoBarcode = ref('')
const lastScanInfo = ref(null)
const scanError = ref(false)
const scanErrorBarcode = ref('')
const isProcessing = ref(false)

// Refs para modo manual
const manualBarcodeInput = ref(null)
const manualBarcode = ref('')
const manualQuantity = ref(1)
const manualProduct = ref(null)
const manualProductError = ref(false)

// NUEVAS REFS para información por producto
const currentProduct = ref(null)
const currentProductStats = ref(null)

// Refs para audio
const successSound = ref(null)
const errorSound = ref(null)

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

// Funciones de sonido
function playSuccessSound() {
  if (soundEnabled.value && successSound.value) {
    successSound.value.currentTime = 0
    successSound.value.play().catch(e => console.log('Error playing sound:', e))
  }
}

function playErrorSound() {
  if (soundEnabled.value && errorSound.value) {
    errorSound.value.currentTime = 0
    errorSound.value.play().catch(e => console.log('Error playing sound:', e))
  }
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  if (soundEnabled.value) {
    success('Sonido activado', 'Las alertas sonoras están ahora activadas')
  } else {
    info('Sonido desactivado', 'Las alertas sonoras están ahora desactivadas')
  }
}

// Funciones de modo
function setMode(newMode) {
  mode.value = newMode
  scanError.value = false
  manualProductError.value = false
  nextTick(() => {
    if (newMode === 'auto') {
      autoInput.value?.focus()
    } else {
      manualBarcodeInput.value?.focus()
    }
  })
}

// Modo Automático - ACTUALIZADO para manejar información por producto
async function handleAutoInput() {
  if (autoBarcode.value.trim() && !isProcessing.value) {
    clearTimeout(window.autoScanTimeout)
    window.autoScanTimeout = setTimeout(() => {
      processAutoScan()
    }, 300)
  }
}

async function handleAutoInputBlur() {
  if (autoBarcode.value.trim() && !isProcessing.value) {
    processAutoScan()
  }
}

async function processAutoScan() {
  if (isProcessing.value) return

  const barcode = autoBarcode.value.trim()
  if (!barcode) return

  isProcessing.value = true

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
        const countResult = await registerCount(product.barcode, 1)
        
        if (countResult.success) {
          // ACTUALIZADO: Usar la información específica del producto
          currentProduct.value = countResult.product
          currentProductStats.value = countResult.productStats
          
          lastScanInfo.value = {
            barcode: product.barcode,
            product_name: product.product_name,
            quantity: 1, // Cantidad escaneada en este momento
            total_counted: countResult.product.counted_stock, // Total contado hasta ahora
            expected_stock: countResult.product.expected_stock,
            remaining: countResult.productStats.remaining,
            progress_percentage: countResult.productStats.progress_percentage,
            timestamp: new Date().toLocaleString('es-ES')
          }
          
          scanError.value = false
          playSuccessSound()
          success('Producto registrado', `${product.product_name} contado correctamente`)
        }
      } else {
        scanError.value = true
        scanErrorBarcode.value = barcode
        playErrorSound()
        error('Producto no encontrado', `El código ${barcode} no existe en el sistema`)
        lastScanInfo.value = null
        currentProduct.value = null
        currentProductStats.value = null
      }
    }
  } catch (err) {
    playErrorSound()
    error('Error', 'Error en el escaneo automático')
    scanError.value = false
    currentProduct.value = null
    currentProductStats.value = null
  } finally {
    autoBarcode.value = ''
    isProcessing.value = false
    nextTick(() => {
      autoInput.value?.focus()
    })
  }
}

// Modo Manual - ACTUALIZADO
async function searchManualProduct() {
  if (!manualBarcode.value.trim()) {
    playErrorSound()
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
        manualProductError.value = false
        playSuccessSound()
      } else {
        manualProduct.value = null
        manualProductError.value = true
        playErrorSound()
        error('Producto no encontrado', `El código ${manualBarcode.value} no existe en el sistema`)
      }
    }
  } catch (err) {
    playErrorSound()
    error('Error', 'Error al buscar el producto')
    manualProductError.value = false
  }
}

async function registerManualCount() {
  if (!manualProduct.value || !manualQuantity.value) {
    playErrorSound()
    error('Error', 'Completa todos los campos')
    return
  }
  
  const result = await registerCount(manualProduct.value.barcode, manualQuantity.value)
  
  if (result.success) {
    // ACTUALIZADO: Usar la información específica del producto
    currentProduct.value = result.product
    currentProductStats.value = result.productStats
    
    lastScanInfo.value = {
      barcode: manualProduct.value.barcode,
      product_name: manualProduct.value.product_name,
      quantity: manualQuantity.value,
      total_counted: result.product.counted_stock,
      expected_stock: result.product.expected_stock,
      remaining: result.productStats.remaining,
      progress_percentage: result.productStats.progress_percentage,
      timestamp: new Date().toLocaleString('es-ES')
    }
    
    manualBarcode.value = ''
    manualQuantity.value = 1
    manualProduct.value = null
    manualProductError.value = false
    
    nextTick(() => {
      manualBarcodeInput.value?.focus()
    })
  }
}

// Función común para registrar conteo - ACTUALIZADA
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
      await fetchInventory()
      return {
        success: true,
        product: data.product,
        productStats: data.productStats
      }
    } else {
      playErrorSound()
      error('Error', data.error || 'Error al registrar el conteo')
      return { success: false }
    }
  } catch (err) {
    playErrorSound()
    error('Error', 'Error al registrar el conteo')
    return { success: false }
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

function viewProductReports() {
  router.push(`/reportes/${inventoryId}`)
}

async function exportInventory() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `http://localhost:3000/api/inventories/${inventoryId}/export?format=excel`,
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
      a.download = `inventario_${inventory.value.name}_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      success('Éxito', 'Inventario exportado exitosamente')
    } else {
      error('Error', 'Error al exportar el inventario')
    }
  } catch (err) {
    error('Error', 'Error al exportar el inventario')
  }
}

onMounted(() => {
  fetchInventory()
  nextTick(() => {
    autoInput.value?.focus()
  })
})
</script>