import { ref } from 'vue'
import * as XLSX from 'xlsx'

export function useProductInventory(showNotification, askConfirmation, abrirModalCantidad) {
  const productos = ref([])
  const productosOriginal = ref([])
  const archivoCargado = ref(false)
  const busquedaActiva = ref(false)

  function exportar() {
    if (productos.value.length === 0) {
      showNotification("error", "Error", "No hay productos para exportar")
      return
    }

    try {
      const wb = XLSX.utils.book_new()

      const datosExportar = productos.value.map((producto) => {
        const datos = { ...producto }
        if (producto.conteo !== undefined) datos["Conteo"] = producto.conteo
        if (producto.suma !== undefined) datos["Suma"] = producto.suma
        return datos
      })

      const ws = XLSX.utils.json_to_sheet(datosExportar)
      XLSX.utils.book_append_sheet(wb, ws, "Productos")

      const fecha = new Date().toISOString().split("T")[0]
      XLSX.writeFile(wb, `inventario_${fecha}.xlsx`)

      showNotification(
        "success",
        "Exportación exitosa",
        `Se exportaron ${productos.value.length} productos`
      )
    } catch (error) {
      showNotification("error", "Error en exportación", "No se pudo exportar el archivo")
      console.error("Error al exportar:", error)
    }
  }

  function borrar() {
    if (productos.value.length === 0) {
      showNotification("warning", "Sin datos", "No hay productos para borrar")
      return
    }

    askConfirmation(
      "Borrar Productos",
      `¿Estás seguro de que deseas borrar todos los productos (${productos.value.length} elementos)? Esta acción no se puede deshacer.`,
      () => {
        const count = productos.value.length
        productos.value = []
        productosOriginal.value = []
        archivoCargado.value = false
        busquedaActiva.value = false
        showNotification(
          "success",
          "Productos borrados",
          `Se eliminaron ${count} productos exitosamente`
        )
      }
    )
  }

  function manejarArchivo(event) {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      showNotification(
        "error",
        "Archivo inválido",
        "Por favor, selecciona un archivo Excel válido (.xlsx o .xls)"
      )
      return
    }

    const loadingId = showNotification(
      "loading",
      "Cargando archivo",
      "Procesando el archivo Excel...",
      0
    )

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        const hoja = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(hoja)

        if (json.length === 0) {
          showNotification("warning", "Archivo vacío", "El archivo seleccionado no contiene datos")
          return
        }

        const productosConContadores = json.map((producto) => ({
          ...producto,
          conteo: 0,
          suma: 0,
          busquedas: 0,
        }))

        productos.value = productosConContadores
        productosOriginal.value = [...productosConContadores]
        archivoCargado.value = true
        busquedaActiva.value = false

        showNotification(
          "success",
          "Archivo cargado",
          `Se cargaron ${json.length} productos exitosamente`
        )
      } catch (error) {
        showNotification(
          "error",
          "Error al leer",
          `No se pudo procesar el archivo: ${error.message}`
        )
      }
    }

    reader.onerror = () => {
      showNotification("error", "Error", "Error al leer el archivo")
    }

    reader.readAsArrayBuffer(file)
    event.target.value = ""
  }

  function buscar(productId) {
    const productIdTrimmed = productId.trim()
    if (!productIdTrimmed) {
      showNotification("warning", "Código requerido", "Por favor ingresa un código de producto")
      return
    }

    const productoEncontrado = productosOriginal.value.find((producto) =>
      Object.values(producto).some((valor) =>
        String(valor).toLowerCase().includes(productIdTrimmed.toLowerCase())
      )
    )

    if (productoEncontrado) {
      abrirModalCantidad(
        productoEncontrado, 
        'buscar', 
        (cantidad) => {
          productoEncontrado.conteo = cantidad
          productoEncontrado.suma = cantidad
          productoEncontrado.busquedas = (productoEncontrado.busquedas || 0) + 1

          productos.value = [productoEncontrado]
          busquedaActiva.value = true

          showNotification(
            "success",
            "Producto actualizado",
            `Producto "${productIdTrimmed}" actualizado. Cantidad: ${cantidad}`
          )
        }
      )
    } else {
      showNotification(
        "error",
        "Producto no encontrado",
        `No se encontró ningún producto con el código: ${productIdTrimmed}`
      )
    }
  }

  function limpiarBusqueda() {
    if (busquedaActiva.value) {
      productos.value = [...productosOriginal.value]
      busquedaActiva.value = false
      showNotification("info", "Búsqueda limpiada", "Mostrando todos los productos")
    }
  }

  function cargarProducto(productId) {
    const productIdTrimmed = productId.trim()
    if (!productIdTrimmed) {
      showNotification("warning", "Código requerido", "Por favor ingresa un código de producto")
      return
    }

    const productoExistente = productosOriginal.value.find((producto) =>
      Object.values(producto).some((valor) =>
        String(valor).toLowerCase().includes(productIdTrimmed.toLowerCase())
      )
    )

    if (productoExistente) {
      abrirModalCantidad(
        productoExistente,
        'cargar',
        (cantidad) => {
          productoExistente.conteo = cantidad
          productoExistente.suma = cantidad
          productoExistente.busquedas = (productoExistente.busquedas || 0) + 1

          showNotification(
            "success",
            "Producto actualizado",
            `Producto "${productIdTrimmed}" actualizado. Cantidad: ${cantidad}`
          )
        }
      )
    } else {
      askConfirmation(
        "Nuevo Producto", 
        `¿Crear nuevo producto con código: ${productIdTrimmed}?`,
        () => {
          const nuevoProducto = {
            id: productIdTrimmed,
            codigo: productIdTrimmed,
            conteo: 0,
            suma: 0,
            busquedas: 0,
            fechaCarga: new Date().toLocaleDateString(),
          }

          abrirModalCantidad(
            nuevoProducto,
            'cargar',
            (cantidad) => {
              nuevoProducto.conteo = cantidad
              nuevoProducto.suma = cantidad
              nuevoProducto.busquedas = 1

              productos.value.unshift(nuevoProducto)
              productosOriginal.value.unshift(nuevoProducto)
              
              if (!archivoCargado.value) {
                archivoCargado.value = true
              }

              showNotification(
                "success",
                "Producto creado",
                `Nuevo producto "${productIdTrimmed}" agregado. Cantidad: ${cantidad}`
              )
            }
          )
        }
      )
    }
  }

  return {
    productos,
    productosOriginal,
    archivoCargado,
    busquedaActiva,
    exportar,
    borrar,
    manejarArchivo,
    buscar,
    limpiarBusqueda,
    cargarProducto
  }
}