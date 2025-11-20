<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header  -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="goBackToInventories"
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

          <!-- Información del último escaneo -->
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

          <!-- Información del producto manual -->
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

      <!-- SOLO ÚLTIMO ESCANEO Y PRODUCTO ANTERIOR -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Último Escaneo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Último Escaneo
          </h3>
          <div v-if="lastScanInfo" class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Producto</span>
              <span class="text-lg font-bold text-green-600">{{ lastScanInfo.product_name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Código</span>
              <span class="text-lg font-mono text-gray-900">{{ lastScanInfo.barcode }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stock Esperado</span>
              <span class="text-lg font-bold text-purple-600">{{ lastScanInfo.expected_stock || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Contado</span>
              <span class="text-lg font-bold text-green-600">{{ lastScanInfo.total_counted }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Escaneado Ahora</span>
              <span class="text-lg font-bold text-blue-600">{{ lastScanInfo.quantity }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Por Contar</span>
              <span class="text-lg font-bold text-orange-600">{{ lastScanInfo.remaining }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Progreso</span>
              <span class="text-lg font-bold text-indigo-600">{{ lastScanInfo.progress_percentage }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Fecha/Hora</span>
              <span class="text-xs font-mono text-gray-500">{{ lastScanInfo.timestamp }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500 text-sm">Aún no se han realizado escaneos</p>
          </div>
        </div>

        <!-- Producto Anterior -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
            Producto Anterior
          </h3>
          <div v-if="previousProduct" class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Producto</span>
              <span class="text-lg font-bold text-purple-600">{{ previousProduct.product_name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Código</span>
              <span class="text-lg font-mono text-gray-900">{{ previousProduct.barcode }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stock Esperado</span>
              <span class="text-lg font-bold text-purple-600">{{ previousProduct.expected_stock || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Contado</span>
              <span class="text-lg font-bold text-green-600">{{ previousProduct.counted_stock || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Por Contar</span>
              <span class="text-lg font-bold text-orange-600">{{ Math.max(0, (previousProduct.expected_stock || 0) - (previousProduct.counted_stock || 0)) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Progreso</span>
              <span class="text-lg font-bold text-indigo-600">{{ previousProductStats?.progress_percentage || 0 }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Último Escaneo</span>
              <span class="text-xs font-mono text-gray-500">{{ previousProduct.last_scan_time }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <p class="text-gray-500 text-sm">Aún no hay productos anteriores escaneados</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Botón flotante para escáner de cámara -->
    <button
      v-if="isMobileDevice && !showQRScanner"
      @click="openQRScanner"
      class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40"
      title="Abrir Escáner de Cámara"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    </button>

    <!-- Modal del escáner QR SIMPLIFICADO -->
    <div v-if="showQRScanner" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Escáner de Códigos</h3>
            <button @click="closeQRScanner" class="text-white hover:text-blue-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <!-- Estado de carga -->
          <div v-if="qrLoading" class="text-center py-8">
            <div class="loading-spinner-large mx-auto mb-4"></div>
            <p class="text-gray-600 font-medium">Inicializando cámara...</p>
            <p class="text-sm text-gray-500 mt-2">Por favor espera</p>
          </div>

          <!-- Escáner QR -->
          <div v-else-if="!qrError" class="scanner-container">
            <qrcode-stream 
              @decode="onQRCodeDecoded"
              @init="onQRScannerInit"
              :camera="camera"
              class="rounded-lg overflow-hidden border-2 border-blue-500"
            >
              <div class="scanner-overlay">
                <div class="scanner-frame"></div>
                <div class="scanner-line"></div>
              </div>
            </qrcode-stream>
            
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600 mb-2 font-medium">
                📷 Apunta la cámara hacia un código de barras
              </p>
              <p class="text-xs text-gray-500">
                El escaneo es automático
              </p>
            </div>
          </div>

          <!-- Mensaje de error SIMPLIFICADO -->
          <div v-else class="text-center py-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">No se puede acceder a la cámara</h4>
              <p class="text-gray-600 mb-4 text-sm">{{ qrError }}</p>
              
              <div class="space-y-3">
                <button 
                  @click="retryQRScanner"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                >
                  🔄 Reintentar
                </button>
                
                <button 
                  @click="useManualInputInstead"
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300"
                >
                  ⌨️ Usar entrada manual
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
// Importar el escáner QR
import { QrcodeStream } from 'vue-qrcode-reader'

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

// Refs para información por producto
const currentProduct = ref(null)
const currentProductStats = ref(null)
const previousProduct = ref(null)
const previousProductStats = ref(null)

// Refs para audio
const successSound = ref(null)
const errorSound = ref(null)

// Refs para QR Scanner - SIMPLIFICADOS
const showQRScanner = ref(false)
const qrLoading = ref(false)
const qrError = ref('')
const camera = ref('auto')
const isMobileDevice = ref(false)

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

// Función para volver a inventarios
async function goBackToInventories() {
  try {
    await router.push('/inventarios')
  } catch (err) {
    console.error('Error en navegación:', err)
    window.location.href = '/'
  }
}

// Funciones de sonido
function playSuccessSound() {
  if (soundEnabled.value && successSound.value) {
    try {
      successSound.value.currentTime = 0
      successSound.value.play().catch(e => console.log('Error playing sound:', e))
    } catch (e) {
      console.log('Error with sound:', e)
    }
  }
}

function playErrorSound() {
  if (soundEnabled.value && errorSound.value) {
    try {
      errorSound.value.currentTime = 0
      errorSound.value.play().catch(e => console.log('Error playing sound:', e))
    } catch (e) {
      console.log('Error with sound:', e)
    }
  }
}

function initializeSounds() {
  // Sonidos simples base64
  if (!successSound.value) {
    successSound.value = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==')
  }
  if (!errorSound.value) {
    errorSound.value = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==')
  }
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
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

// Detección de dispositivo móvil
function checkMobileDevice() {
  isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  console.log('Móvil detectado:', isMobileDevice.value)
}

// Funciones QR Scanner SIMPLIFICADAS
async function openQRScanner() {
  console.log('Abriendo escáner QR...')
  showQRScanner.value = true
  qrError.value = ''
  qrLoading.value = true
  
  await nextTick()
}

function closeQRScanner() {
  showQRScanner.value = false
  qrError.value = ''
  qrLoading.value = false
}

async function onQRScannerInit(promise) {
  console.log('Inicializando cámara...')
  try {
    qrLoading.value = true
    await promise
    console.log('✅ Cámara inicializada correctamente')
    qrLoading.value = false
  } catch (err) {
    console.error('❌ Error en cámara:', err)
    qrError.value = getCameraErrorMessage(err)
    qrLoading.value = false
  }
}

function getCameraErrorMessage(error) {
  console.log('Tipo de error:', error.name)
  
  if (error.name === 'NotAllowedError') {
    return 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara en tu navegador.'
  } else if (error.name === 'NotFoundError') {
    return 'No se encontró ninguna cámara en el dispositivo.'
  } else if (error.name === 'NotSupportedError') {
    return 'Tu navegador no soporta acceso a la cámara.'
  } else if (error.name === 'NotReadableError') {
    return 'La cámara no se puede leer. Puede que esté siendo usada por otra aplicación.'
  } else if (error.name === 'OverconstrainedError') {
    return 'No se puede usar la cámara con la configuración requerida.'
  } else if (error.name === 'SecurityError') {
    return 'La cámara requiere HTTPS. Estás en: ' + window.location.protocol + '//' + window.location.host
  }
  
  return `Error: ${error.message || 'Error desconocido'}`
}

function onQRCodeDecoded(decodedText) {
  console.log('Código escaneado:', decodedText)
  
  if (decodedText && decodedText.trim()) {
    if (mode.value === 'auto') {
      autoBarcode.value = decodedText
      processAutoScan()
    } else {
      manualBarcode.value = decodedText
      searchManualProduct()
    }
    
    closeQRScanner()
    playSuccessSound()
    success('✅ Escaneo exitoso', 'Código escaneado correctamente')
  }
}

function retryQRScanner() {
  console.log('Reintentando cámara...')
  qrError.value = ''
  qrLoading.value = false
  showQRScanner.value = false
  
  setTimeout(() => {
    openQRScanner()
  }, 500)
}

function useManualInputInstead() {
  closeQRScanner()
  nextTick(() => {
    if (mode.value === 'auto') {
      autoInput.value?.focus()
    } else {
      manualBarcodeInput.value?.focus()
    }
  })
}

// Funciones del sistema de conteo (se mantienen igual)
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
    const products = await apiService.searchProducts(inventoryId, barcode)
    
    if (products.length > 0) {
      const product = products[0]
      const countResult = await registerCount(product.barcode, 1)
      
      if (countResult.success) {
        if (currentProduct.value) {
          previousProduct.value = { ...currentProduct.value }
          previousProductStats.value = { ...currentProductStats.value }
          previousProduct.value.last_scan_time = new Date().toLocaleString('es-ES')
        }
        
        currentProduct.value = countResult.product
        currentProductStats.value = countResult.productStats
        
        lastScanInfo.value = {
          barcode: product.barcode,
          product_name: product.product_name,
          quantity: 1,
          total_counted: countResult.product.counted_stock,
          expected_stock: countResult.product.expected_stock,
          remaining: countResult.productStats.remaining,
          progress_percentage: countResult.productStats.progress_percentage,
          timestamp: new Date().toLocaleString('es-ES')
        }
        
        scanError.value = false
        playSuccessSound()
        success('✅ Producto registrado', `${product.product_name} contado correctamente`)
      }
    } else {
      scanError.value = true
      scanErrorBarcode.value = barcode
      playErrorSound()
      error('❌ Producto no encontrado', `El código ${barcode} no existe en el sistema`)
      lastScanInfo.value = null
      currentProduct.value = null
      currentProductStats.value = null
    }
  } catch (err) {
    console.error('Error en escaneo automático:', err)
    playErrorSound()
    error('❌ Error', 'Error en el escaneo automático')
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

async function searchManualProduct() {
  if (!manualBarcode.value.trim()) {
    playErrorSound()
    error('❌ Error', 'Ingresa un código de barras')
    return
  }

  try {
    const products = await apiService.searchProducts(inventoryId, manualBarcode.value)
    
    if (products.length > 0) {
      manualProduct.value = products[0]
      manualProductError.value = false
      playSuccessSound()
    } else {
      manualProduct.value = null
      manualProductError.value = true
      playErrorSound()
      error('❌ Producto no encontrado', `El código ${manualBarcode.value} no existe en el sistema`)
    }
  } catch (err) {
    console.error('Error buscando producto:', err)
    playErrorSound()
    error('❌ Error', 'Error al buscar el producto')
    manualProductError.value = false
  }
}

async function registerManualCount() {
  if (!manualProduct.value || !manualQuantity.value) {
    playErrorSound()
    error('❌ Error', 'Completa todos los campos')
    return
  }
  
  const result = await registerCount(manualProduct.value.barcode, manualQuantity.value)
  
  if (result.success) {
    if (currentProduct.value) {
      previousProduct.value = { ...currentProduct.value }
      previousProductStats.value = { ...currentProductStats.value }
      previousProduct.value.last_scan_time = new Date().toLocaleString('es-ES')
    }
    
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

async function registerCount(barcode, quantity) {
  try {
    const response = await apiService.registerCount(inventoryId, barcode, quantity)
    await fetchInventory()
    return {
      success: true,
      product: response.product,
      productStats: response.productStats
    }
  } catch (err) {
    console.error('Error registrando conteo:', err)
    playErrorSound()
    error('❌ Error', err.message || 'Error al registrar el conteo')
    return { success: false }
  }
}

async function fetchInventory() {
  try {
    inventory.value = await apiService.getInventory(inventoryId)
  } catch (err) {
    console.error('Error cargando inventario:', err)
    error('❌ Error', 'Error al cargar el inventario')
  }
}

onMounted(() => {
  initializeSounds()
  checkMobileDevice()
  fetchInventory()
  nextTick(() => {
    autoInput.value?.focus()
  })
})

onUnmounted(() => {
  closeQRScanner()
})
</script>

<style scoped>
/* Estilos para móviles */
@media (max-width: 768px) {
  .grid-cols-1, .grid-cols-2, .lg\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  button {
    min-height: 44px;
  }
  
  input {
    font-size: 16px;
  }
}

/* Estilos del escáner */
.scanner-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-frame {
  width: 250px;
  height: 150px;
  border: 2px solid #00ff00;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  position: relative;
}

.scanner-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #00ff00;
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}

.loading-spinner-large {
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>