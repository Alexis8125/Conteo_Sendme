import { computed, ref } from 'vue'

export function usePagination(productos, itemsPerPage = 10) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil(productos.value.length / itemsPerPage)
  })

  const productosPaginados = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return productos.value.slice(start, start + itemsPerPage)
  })

  function cambiarPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPages.value) {
      currentPage.value = pagina
    }
  }

  return {
    currentPage,
    totalPages,
    productosPaginados,
    cambiarPagina
  }
}