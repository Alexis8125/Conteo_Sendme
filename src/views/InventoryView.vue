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
  modalAnimation, 
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

// Funciones del template
function abrirArchivo() {
  inputArchivo.value?.click();
}

function onBorrar() {
  borrar();
}

function onBuscar() {
  buscar(productIdInput.value);
}

function onCargarProducto() {
  cargarProducto(productIdInput.value);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    onBuscar();
  }
}

// Auto-focus en el input de cantidad
function onModalShown() {
  setTimeout(() => {
    const cantidadInputElement = document.querySelector('#cantidad-input');
    if (cantidadInputElement) {
      cantidadInputElement.focus();
      cantidadInputElement.select();
    }
  }, 100);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Inventario</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Toggle de tema -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
              :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            >
              <svg
                v-if="isDark"
                class="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-45"
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
                class="w-5 h-5 text-gray-700 transition-transform duration-300 hover:rotate-45"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                />
              </svg>
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
              type="text"
              v-model="productIdInput"
              class="flex-1 px-4 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              placeholder="Ingresa el código del producto o escanea código de barras"
              @keypress="handleKeyPress"
            />

            <div
              v-if="!archivoCargado"
              class="flex items-center justify-center px-4 py-3 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              @click="abrirArchivo"
              title="Cargar archivo Excel"
            >
              <span class="text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors duration-300">Cargar</span>
            </div>

            <BaseButton label="Buscar" color="blue" class="rounded-l-none" @click="onBuscar" />
          </div>

          <div class="flex gap-2">
            <BaseButton
              v-if="busquedaActiva"
              label="Limpiar"
              color="gray"
              @click="limpiarBusqueda"
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
              @click="exportar"
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
              <span class="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-300">Mostrando resultados de búsqueda. </span>
            </div>
            <span class="text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300"
              >{{ productos.length }} producto(s) encontrado(s)</span
            >
          </div>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div
        v-if="archivoCargado"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Productos</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                {{ busquedaActiva ? "Resultados de búsqueda" : "Todos los productos" }} - Mostrando
                {{ productosPaginados.length }} de {{ productos.length }} productos
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Página {{ currentPage }} de {{ totalPages }}</div>
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

      <!-- Estado vacío -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-300">
        <div class="max-w-md mx-auto">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-300"
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
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Sin datos</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Carga un archivo Excel para comenzar a gestionar tu inventario.
          </p>
          <BaseButton
            label="Cargar archivo Excel"
            color="blue"
            class="mt-4"
            @click="abrirArchivo"
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
      <transition-group
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full scale-90"
        move-class="transition-transform duration-300 ease"
        tag="div"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="relative p-4 rounded-xl shadow-lg border transform transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] active:scale-95"
          :class="[
            {
              'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800': notification.type === 'info',
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': notification.type === 'success',
              'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800': notification.type === 'error',
              'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800': notification.type === 'warning',
              'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600': notification.type === 'loading',
            },
          ]"
          @click="removeNotification(notification.id)"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                v-if="notification.type === 'success'"
                class="w-5 h-5 text-green-600 dark:text-green-400 transition-transform duration-200 hover:scale-110"
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
                class="w-5 h-5 text-red-600 dark:text-red-400 transition-transform duration-200 hover:scale-110"
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
                class="w-5 h-5 text-yellow-600 dark:text-yellow-400 transition-transform duration-200 hover:scale-110"
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
                v-else-if="notification.type === 'loading'"
                class="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 2v4m0 12v4m8-10h-4M6 12H2m15.364-7.364l-2.828 2.828M7.464 17.536l-2.828 2.828m12.728 0l-2.828-2.828M7.464 6.464L4.636 3.636"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 hover:scale-110"
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
              <h4
                class="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {{ notification.title }}
              </h4>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {{ notification.message }}
              </p>
            </div>

            <button
              @click.stop="removeNotification(notification.id)"
              class="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 transform hover:scale-110 hover:rotate-90"
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

          <div
            v-if="notification.duration > 0"
            class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 rounded-b-xl overflow-hidden"
          >
            <div
              class="h-full rounded-b-xl transition-all duration-linear"
              :class="{
                'bg-blue-500': notification.type === 'info',
                'bg-green-500': notification.type === 'success',
                'bg-red-500': notification.type === 'error',
                'bg-yellow-500': notification.type === 'warning',
              }"
              :style="{
                width: notification.show ? '100%' : '0%',
                transition: `width ${notification.duration}ms linear`,
              }"
            ></div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Modal de confirmación -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 overflow-y-auto">
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
              v-if="modalAnimation"
              class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              @click="handleCancel"
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
              v-if="modalAnimation"
              class="relative inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl sm:my-8 sm:align-middle sm:p-6"
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div class="text-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                  {{ confirmConfig.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-200">
                  {{ confirmConfig.message }}
                </p>
              </div>

              <div class="flex gap-3 justify-center">
                <BaseButton
                  label="Cancelar"
                  color="gray"
                  @click="handleCancel"
                  class="transition-transform duration-200 hover:scale-105 active:scale-95"
                />
                <BaseButton
                  label="Confirmar"
                  color="blue"
                  @click="handleConfirm"
                  class="transition-transform duration-200 hover:scale-105 active:scale-95"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>