<script setup>
import { ref, onMounted } from "vue";
import { useNotifications } from "@/composables/useNotifications";
import { useConfirmModal } from "@/composables/useConfirmModal";
import { useCantidadModal } from "@/composables/useCantidadModal";
import { useProductInventory } from "@/composables/useProductInventory";
import { usePagination } from "@/composables/usePagination";
import { useTheme } from "@/composables/useTheme";
import BaseButton from "@/components/BaseButton.vue";
import PaginationMenu from "@/components/PaginationMenu.vue";
import TableInfo from "@/components/TableInfo.vue";

// Composables
const { notifications, showNotification, removeNotification } = useNotifications();
const { 
  showConfirmModal, 
  confirmConfig, 
  // modalAnimation, 
  askConfirmation, 
  handleConfirm, 
  handleCancel 
} = useConfirmModal();

const { 
  showCantidadModal, 
  modalAnimation: cantidadModalAnimation, 
  productoSeleccionado, 
  cantidadInput, 
  accion,
  abrirModal, 
  cerrarModal, 
  confirmarCantidad 
} = useCantidadModal();

const { 
  productos, 
  archivoCargado, 
  busquedaActiva, 
  exportar, 
  borrar, 
  manejarArchivo, 
  buscar, 
  limpiarBusqueda, 
  cargarProducto 
} = useProductInventory(showNotification, askConfirmation, abrirModal);

const { currentPage, totalPages, productosPaginados, cambiarPagina } = usePagination(productos, 10);

// Tema
const { isDark, toggleTheme } = useTheme();

// Refs para el template
const inputArchivo = ref(null);
const productIdInput = ref("");
const searchInput = ref(null);

// Función de toggle del tema
function handleToggleTheme() {
  toggleTheme();
}

// Función corregida para abrir archivo
function abrirArchivo() {
  console.log('Abriendo archivo...');
  if (inputArchivo.value) {
    inputArchivo.value.click();
  } else {
    console.error('inputArchivo no está definido');
  }
}

// Función corregida para buscar
function onBuscar() {
  console.log('Buscando:', productIdInput.value);
  buscar(productIdInput.value);
}

// Función corregida para cargar producto
function onCargarProducto() {
  console.log('Cargando producto:', productIdInput.value);
  cargarProducto(productIdInput.value);
}

// Función corregida para borrar
function onBorrar() {
  console.log('Borrando productos...');
  borrar();
}

// Función corregida para exportar
function onExportar() {
  console.log('Exportando...');
  exportar();
}

// Función corregida para limpiar búsqueda
function onLimpiarBusqueda() {
  console.log('Limpiando búsqueda...');
  limpiarBusqueda();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    onBuscar();
  }
}

// Auto-focus en el input de cantidad cuando se abre el modal
function onModalShown() {
  setTimeout(() => {
    const cantidadInputElement = document.querySelector('#cantidad-input');
    if (cantidadInputElement) {
      cantidadInputElement.focus();
      cantidadInputElement.select();
    }
  }, 100);
}

// Enfocar el input al cargar la página
onMounted(() => {
  console.log('Componente montado');
  if (searchInput.value) {
    searchInput.value.focus();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Sistema de Inventario</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Botón de tema -->
            <button
              @click="handleToggleTheme"
              class="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
              :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            >
              <div class="flex items-center justify-center w-5 h-5">
                <svg
                  v-if="!isDark"
                  class="w-5 h-5 text-orange-500 transition-all duration-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-blue-300 transition-all duration-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                  />
                </svg>
              </div>
            </button>

            <BaseButton
              label="Borrar productos"
              color="red"
              :disabled="!archivoCargado"
              @click="onBorrar"
            />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Panel de búsqueda -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex flex-1 w-full sm:max-w-md">
            <input
              ref="searchInput"
              type="text"
              v-model="productIdInput"
              class="flex-1 px-4 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              placeholder="Escanea código de barras o ingresa código"
              @keypress="handleKeyPress"
            />

            <div
              class="flex items-center justify-center px-4 py-3 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              @click="abrirArchivo"
              title="Cargar archivo Excel"
            >
              <span class="text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors duration-300">Cargar Excel</span>
            </div>

            <BaseButton label="Buscar" color="blue" class="rounded-l-none" @click="onBuscar" />
          </div>

          <div class="flex gap-2">
            <BaseButton
              v-if="busquedaActiva"
              label="Limpiar"
              color="gray"
              @click="onLimpiarBusqueda"
            />
            <BaseButton
              label="Cargar Producto"
              color="green"
              @click="onCargarProducto"
            />
            <BaseButton
              label="Exportar"
              color="green"
              :disabled="!archivoCargado"
              @click="onExportar"
            />
          </div>

          <input
            ref="inputArchivo"
            type="file"
            accept=".xlsx, .xls"
            class="hidden"
            @change="manejarArchivo"
          />
        </div>

        <div v-if="busquedaActiva" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-300">Mostrando resultados de búsqueda</span>
            </div>
            <span class="text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300"
              >{{ productos.length }} producto(s)</span
            >
          </div>
        </div>
      </div>

      <!-- Estado cuando no hay archivo cargado -->
      <div v-if="!archivoCargado" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors duration-300">
        <div class="max-w-md mx-auto">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
            <svg class="w-12 h-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Requisitos del Archivo Excel</h3>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              El archivo debe contener una columna de identificación:<br>
              <strong>ID, Código, SKU o Referencia</strong>
            </p>
          </div>

          <svg
            class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Sin inventario cargado</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Carga un archivo Excel con la estructura correcta o comienza a escanear productos.
          </p>
          <BaseButton
            label="Cargar archivo Excel"
            color="blue"
            class="mt-4"
            @click="abrirArchivo"
          />
        </div>
      </div>

      <!-- Tabla de productos cuando hay archivo cargado -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Productos en Inventario</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                {{ busquedaActiva ? "Resultados de búsqueda" : "Todos los productos" }} - 
                {{ productosPaginados.length }} de {{ productos.length }} productos
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Página {{ currentPage }} de {{ totalPages }}
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="overflow-hidden">
            <TableInfo :productos="productosPaginados" />
          </div>

          <PaginationMenu
            v-if="totalPages > 1"
            class="mt-6"
            :totalPages="totalPages"
            :currentPage="currentPage"
            @page-change="cambiarPagina"
          />
        </div>
      </div>
    </main>

    <!-- Modal de Cantidad -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showCantidadModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        >
          <transition
            enter-active-class="transition-opacity duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="cantidadModalAnimation"
              class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              @click="cerrarModal"
            ></div>
          </transition>

          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="cantidadModalAnimation"
              class="relative inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl sm:my-8 sm:align-middle sm:p-6"
              @vue:mounted="onModalShown"
            >
              <div
                class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 transition-transform duration-300 hover:scale-110"
              >
                <svg
                  class="w-6 h-6 text-blue-600 dark:text-blue-400 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div class="text-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                  {{ accion === 'buscar' ? 'Actualizar Cantidad' : 'Ingresar Cantidad' }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                  Producto: <strong class="text-gray-900 dark:text-white">{{ productoSeleccionado?.id }}</strong>
                </p>
                
                <div class="mb-6">
                  <label for="cantidad-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cantidad en inventario:
                  </label>
                  <input
                    id="cantidad-input"
                    v-model.number="cantidadInput"
                    type="number"
                    min="0"
                    step="1"
                    class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl font-semibold transition-colors duration-300"
                    placeholder="0"
                    @keypress.enter="confirmarCantidad"
                  />
                </div>
              </div>

              <div class="flex gap-3 justify-center">
                <BaseButton
                  label="Cancelar"
                  color="gray"
                  @click="cerrarModal"
                  class="transition-transform duration-200 hover:scale-105 active:scale-95"
                />
                <BaseButton
                  label="Confirmar"
                  color="blue"
                  @click="confirmarCantidad"
                  class="transition-transform duration-200 hover:scale-105 active:scale-95"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>

    <!-- Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-3 w-80">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="relative p-4 rounded-xl shadow-lg border transform transition-all duration-300 ease-out cursor-pointer"
        :class="[
          {
            'bg-white border-blue-200': notification.type === 'info',
            'bg-green-50 border-green-200': notification.type === 'success',
            'bg-red-50 border-red-200': notification.type === 'error',
            'bg-yellow-50 border-yellow-200': notification.type === 'warning',
            'bg-gray-50 border-gray-200': notification.type === 'loading',
          },
        ]"
        @click="removeNotification(notification.id)"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-0.5">
            <svg
              v-if="notification.type === 'success'"
              class="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="w-5 h-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div class="ml-3 flex-1">
            <h4 class="text-sm font-medium text-gray-900">
              {{ notification.title }}
            </h4>
            <p class="mt-1 text-sm text-gray-600">
              {{ notification.message }}
            </p>
          </div>

          <button
            @click.stop="removeNotification(notification.id)"
            class="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ confirmConfig.title }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ confirmConfig.message }}</p>
        
        <div class="flex gap-3 justify-end">
          <BaseButton
            label="Cancelar"
            color="gray"
            @click="handleCancel"
          />
          <BaseButton
            label="Confirmar"
            color="blue"
            @click="handleConfirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>