<!-- src/components/atoms/AppTable.vue -->
<script setup lang="ts">
import { computed, ref, useAttrs, watch, watchEffect } from 'vue'

import Card from 'primevue/card'
import Column from 'primevue/column'
import ContextMenu from 'primevue/contextmenu'
import DataTable from 'primevue/datatable'
import Paginator from 'primevue/paginator'

import type { TableHeader } from './types/table-header.type'

export interface DateFormatConfig {
  field: string
  format?: 'date' | 'time' | 'datetime'
  customFormat?: string
  showTimezone?: boolean
}

type DataTableSize = 'small' | 'large'
type DataTableSelectionMode = 'single' | 'multiple'
type PaginatorPosition = 'left' | 'center' | 'right'

interface Props {
  data: Record<string, unknown>[]
  headers: TableHeader[]
  pageSize: number
  pageCurrent: number
  totalItems: number
  showPaginator?: boolean
  multipleSelection?: boolean
  textTotalItems?: string
  loading?: boolean
  emptyMessage?: string
  selectedRow?: Record<string, unknown> | null

  dateFields?: DateFormatConfig[]
  autoDetectDateFields?: boolean

  tableSize?: DataTableSize
  selectionMode?: DataTableSelectionMode
  removableSort?: boolean
  resizableColumns?: boolean
  reorderableColumns?: boolean
  scrollable?: boolean
  scrollHeight?: string
  virtualScrollerOptions?: object
  showGridlines?: boolean
  stripedRows?: boolean
  paginatorTemplate?: string
  paginatorPosition?: PaginatorPosition

  contextMenu?: boolean
  contextMenuSelection?: Record<string, unknown> | null

  containerClass?: string
  tableClass?: string
  cardClass?: string
  paginatorClass?: string

  // PassThrough API
  pt?: object
  ptOptions?: object
}

const props = withDefaults(defineProps<Props>(), {
  showPaginator: true,
  multipleSelection: false,
  textTotalItems: 'Total de registros',
  loading: false,
  emptyMessage: 'No se encontraron resultados',
  selectedRow: null,
  dateFields: () => [],
  autoDetectDateFields: true,
  tableSize: 'small',
  removableSort: true,
  resizableColumns: false,
  reorderableColumns: false,
  scrollable: false,
  scrollHeight: '400px',
  showGridlines: false,
  stripedRows: false,
  paginatorTemplate:
    'RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
  paginatorPosition: 'right',
  contextMenu: true,
  contextMenuSelection: null,
  containerClass: 'w-full',
  tableClass: '',
  cardClass: 'w-full',
  paginatorClass: 'text-sm',
})

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<{
  'selection-change': [selection: Record<string, unknown> | Record<string, unknown>[] | null]
  'page-change': [event: { pageSize: number; limitSize: number }]
  'row-double-click': [row: Record<string, unknown>]
  'row-select': [event: { originalEvent: Event; data: Record<string, unknown>; index: number }]
  'row-unselect': [event: { originalEvent: Event; data: Record<string, unknown>; index: number }]
  'row-select-all': [event: { originalEvent: Event; data: Record<string, unknown>[] }]
  'row-unselect-all': [event: { originalEvent: Event }]
  'column-resize-end': [event: { element: HTMLElement; delta: number }]
  'column-reorder': [event: { originalEvent: Event; dragIndex: number; dropIndex: number }]
}>()

const attrs = useAttrs()

// Filtrar atributos conflictivos
const blockKeys = ['class']

const forwardedAttrs = computed(() => {
  const src = attrs ?? {}
  return Object.fromEntries(Object.entries(src).filter(([k]) => !blockKeys.includes(k)))
})

// Manejar clases del contenedor
const containerClasses = computed(() => {
  const classAttr = attrs.class as string | undefined
  return classAttr ? `${props.containerClass} ${classAttr}` : props.containerClass
})

const selectedRow = ref<Record<string, unknown> | Record<string, unknown>[] | null>([])

// Watcher para detectar cambios en la selección
watch(
  selectedRow,
  (newSelection) => {
    emit('selection-change', newSelection)
  },
  { deep: true },
)

const isMdScreen = ref(window.innerWidth < 1024)
const contextMenuRef = ref()

const menuModel = ref([
  {
    label: 'Ver',
    icon: 'pi pi-fw pi-eye',
    command: () => {
      if (selectedRow.value && !Array.isArray(selectedRow.value)) {
        // No hacemos nada aquí, las acciones están en el header
      }
    },
    class: 'text-xs',
  },
])

//Detectar campos de fecha automáticamente
const detectedDateFields = computed(() => {
  if (!props.autoDetectDateFields || props.data.length === 0) {
    return props.dateFields
  }

  const dateFieldConfigs: DateFormatConfig[] = [...props.dateFields]
  const existingFields = dateFieldConfigs.map((config) => config.field)

  //Comprueba datos para inferir campos de fecha
  const item = props.data[0]

  props.headers.forEach((header) => {
    const field = header.field
    const value = item[field]

    //Si ya está configurado, omitir
    if (existingFields.includes(field)) {
      return
    }

    const isDateField =
      typeof value === 'string' &&
      (field.toLowerCase().includes('date') ||
        field.toLowerCase().includes('at') ||
        (value && isIsoDateString(value as string)))

    if (isDateField) {
      dateFieldConfigs.push({
        field,
        format: field.toLowerCase().includes('time') ? 'time' : 'datetime',
      })
    }
  })

  return dateFieldConfigs
})

// Función auxiliar para detectar strings de fecha ISO
const isIsoDateString = (str: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}/.test(str) && !isNaN(Date.parse(str))
}

//Detectar si un campo es de fecha
const isDateField = (field: string): boolean => {
  return detectedDateFields.value.some((config) => config.field === field)
}

//Obtener la configuración de formato para un campo
const getDateConfig = (field: string): DateFormatConfig | undefined => {
  return detectedDateFields.value.find((config) => config.field === field)
}

// Formatear fecha usando JavaScript nativo
const formatDate = (date: string, field: string): string => {
  if (!date) return '-'

  const config = getDateConfig(field)
  const format = config?.format || 'date'

  try {
    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
      return date
    }

    switch (format) {
      case 'time':
        return dateObj.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      case 'datetime':
        return dateObj.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      case 'date':
      default:
        return dateObj.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
    }
  } catch {
    return date
  }
}

// Función para aplicar clases a las filas - RESALTADO EN GRIS
const rowClass = (data: Record<string, unknown>) => {
  if (props.selectedRow && data.id === props.selectedRow.id) {
    return 'bg-gray-100 border-l-4 border-l-blue-500'
  }
  return ''
}

watchEffect(() => {
  const handleResize = () => {
    isMdScreen.value = window.innerWidth < 1024
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
})

const onRowContextMenu = (event: { originalEvent: unknown }) => {
  contextMenuRef.value.show(event.originalEvent)
}

const handlePageChange = (event: { first: number; rows: number }) => {
  const newPage = Math.floor(event.first / event.rows) + 1
  const newPageSize = event.rows

  emit('page-change', {
    pageSize: newPage,
    limitSize: newPageSize,
  })
}

const handleRowDoubleClick = (event: { data: Record<string, unknown> }) => {
  emit('row-double-click', event.data)
}

// Configuración de tamaños de página
const rowSizes = computed(() => [10, 20, 50, 100])

// Clases mejoradas para multiselect y paginador
const tableClasses = computed(() => {
  const classes = [props.tableClass]
  if (props.multipleSelection) {
    classes.push('borderless-multiselect')
  }
  return classes.filter(Boolean).join(' ')
})

const paginatorClasses = computed(() => {
  const classes = [props.paginatorClass]
  if (props.multipleSelection) {
    classes.push('compact-paginator')
  }
  return classes.filter(Boolean).join(' ')
})

// Computed para determinar si hay datos y ajustar altura
const hasData = computed(() => props.data && props.data.length > 0)

const tableContentClasses = computed(() => {
  const baseClasses = ['table-content-container']
  if (!hasData.value) {
    baseClasses.push('table-empty')
  }
  return baseClasses.join(' ')
})

// Función para verificar si un item está seleccionado (para vista móvil)
const isSelected = (item: Record<string, unknown>): boolean => {
  if (!selectedRow.value) return false
  
  if (Array.isArray(selectedRow.value)) {
    return selectedRow.value.some(selected => selected.id === item.id)
  } else {
    return selectedRow.value?.id === item.id
  }
}

// Alternar selección en vista móvil
const toggleSelection = (item: Record<string, unknown>) => {
  if (!props.multipleSelection) {
    selectedRow.value = item
    return
  }

  let newSelection: Record<string, unknown>[] = []
  const currentSelection = Array.isArray(selectedRow.value) ? selectedRow.value : []

  if (isSelected(item)) {
    newSelection = currentSelection.filter(selected => selected.id !== item.id)
  } else {
    newSelection = [...currentSelection, item]
  }

  selectedRow.value = newSelection
}
</script>

<template>
  <div :class="containerClasses">
    <Card
      v-bind="forwardedAttrs"
      :class="cardClass"
      :pt="{ ...pt, body: { style: 'padding: 0.8rem !important;' } }"
      :pt-options="ptOptions"
    >
      <template #content>
        <div class="relative flex flex-col" :class="tableContentClasses">
          <ContextMenu
            v-if="contextMenu"
            ref="contextMenuRef"
            :model="menuModel"
            @hide="selectedRow = null"
          />

          <div class="flex-1 min-h-0 overflow-hidden">
            <!-- Vista de escritorio -->
            <DataTable
              v-if="!isMdScreen"
              v-model:selection="selectedRow"
              :value="data"
              :size="tableSize"
              v-model:contextMenuSelection="selectedRow"
              @rowContextmenu="onRowContextMenu"
              @rowDblclick="handleRowDoubleClick"
              :selectionMode="multipleSelection ? 'multiple' : 'single'"
              :removableSort="removableSort"
              :resizableColumns="resizableColumns"
              :reorderableColumns="reorderableColumns"
              :scrollable="true"
              :scrollHeight="'flex'"
              :virtualScrollerOptions="virtualScrollerOptions"
              :showGridlines="showGridlines"
              :stripedRows="stripedRows"
              tableStyle="min-width: 50rem"
              :class="tableClasses"
              :contextMenu="contextMenu"
              @column-resize-end="emit('column-resize-end', $event)"
              @column-reorder="emit('column-reorder', $event)"
              :loading="loading"
              :emptyMessage="emptyMessage"
              :rowClass="rowClass"
            >
              <Column
                selectionMode="multiple"
                headerStyle="width: 3rem"
                class="!border-0"
                v-if="multipleSelection"
              ></Column>
              
              <!-- Columnas dinámicas SIN ACCIONES -->
              <Column
                class="!border-0"
                v-for="col in headers"
                :key="col.field"
                :field="col.field"
                :sortable="true"
                :style="
                  col.width ? { width: col.width, minWidth: col.width, maxWidth: col.width } : {}
                "
              >
                <template #header>
                  <div
                    class="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide"
                  >
                    <slot :name="`header-${col.field}`">
                      {{ col.header }}
                    </slot>
                  </div>
                </template>

                <template #body="{ data }">
                  <div
                    class="flex justify-center font-medium items-center text-sm text-neutral-500 dark:text-neutral-400"
                  >
                    <slot
                      v-if="$slots[`custom-${col.field}`]"
                      :name="`custom-${col.field}`"
                      :data="data"
                    >
                      {{ data[col.field] }}
                    </slot>

                    <template v-else-if="isDateField(col.field) && data[col.field]">
                      <span>
                        {{ formatDate(data[col.field] as string, col.field) }}
                      </span>
                    </template>

                    <template v-else>
                      <span class="truncate max-w-[200px]" :title="String(data[col.field] || '')">
                        {{ data[col.field] || '-' }}
                      </span>
                    </template>
                  </div>
                </template>
              </Column>

              <template #empty>
                <slot name="empty">
                  <div class="flex flex-col items-center justify-center p-4 text-center">
                    <i class="pi pi-inbox text-5xl text-neutral-300 dark:text-neutral-600 mb-4"></i>
                    <p class="text-neutral-500 dark:text-neutral-400">
                      {{ emptyMessage }}
                    </p>
                  </div>
                </slot>
              </template>
            </DataTable>

            <!-- Vista móvil -->
            <div v-else class="mobile-inventories">
              <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Cargando...</p>
              </div>

              <div v-else-if="data.length === 0" class="empty-container">
                <slot name="empty">
                  <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No hay inventarios</h3>
                    <p class="text-gray-500 mb-4">Crea tu primer inventario para comenzar</p>
                  </div>
                </slot>
              </div>

              <div v-else class="mobile-list space-y-4 p-4">
                <div
                  v-for="inventory in data"
                  :key="inventory.id"
                  class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                  :class="{ 'bg-gray-100 border-blue-300': isSelected(inventory) }"
                  @click="toggleSelection(inventory)"
                  @dblclick="handleRowDoubleClick({ data: inventory })"
                >
                  <!-- Header con título -->
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">{{ inventory.name }}</h3>
                      </div>
                      
                      <p class="text-sm text-gray-600 mb-2">{{ inventory.description }}</p>
                      <div class="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span class="flex items-center">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Productos: {{ inventory.total_products }}
                        </span>
                        <span class="flex items-center">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Contados: {{ inventory.counted_products }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Barra de progreso -->
                  <div class="mt-3 mb-3">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span class="font-medium">{{ Math.round(inventory.progress_percentage as number) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        :style="{ width: `${inventory.progress_percentage}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="showPaginator"
          class="flex flex-col md:flex-row md:justify-between items-center mt-4 gap-2 md:gap-0"
        >
          <small class="text-sm text-center md:text-left">
            <span class="text-base font-semibold">
              {{ totalItems }}
            </span>
            {{ textTotalItems }}
          </small>

          <Paginator
            v-show="totalItems > 0"
            :rows="pageSize"
            :rowsPerPageOptions="rowSizes"
            :totalRecords="totalItems"
            :template="paginatorTemplate"
            :class="paginatorClasses"
            @page="handlePageChange"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
// Altura adaptativa simple
.table-content-container {
  &.table-empty {
    max-height: 300px;
  }

  &:not(.table-empty) {
    max-height: 70vh;
  }
}

// DataTable básico
:deep(.p-datatable) {
  .p-datatable-wrapper {
    overflow: auto;
    max-height: 60vh;
  }
}

// Estilos básicos de texto
:deep(.p-datatable-tbody > tr > td) {
  font-size: 12.5px;
  text-align: center;
}

:deep(.p-datatable-column-header-content) {
  justify-content: center;
}

:deep(.p-paginator) {
  justify-content: end;
}

// Estilos para vista móvil
.mobile-inventories {
  @apply w-full;
}

.loading-container {
  @apply flex flex-col items-center justify-center py-8;
}

.loading-spinner {
  @apply w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2;
}

.empty-container {
  @apply flex items-center justify-center py-8;
}

.mobile-list {
  @apply space-y-4 p-4;
}

.mobile-item {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4 
         transition-all duration-200 cursor-pointer hover:shadow-md;
}

.mobile-item.selected {
  @apply bg-gray-100 border-blue-300;
}
</style>