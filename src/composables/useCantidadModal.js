import { ref } from 'vue'

export function useCantidadModal() {
  const showCantidadModal = ref(false)
  const modalAnimation = ref(false)
  const productoSeleccionado = ref(null)
  const cantidadInput = ref(1)
  const accion = ref('') 
  const callbackConfirmar = ref(null)

  function abrirModal(producto, accionType, onConfirm) {
    productoSeleccionado.value = producto
    accion.value = accionType
    cantidadInput.value = producto?.conteo || 0
    callbackConfirmar.value = onConfirm
    showCantidadModal.value = true
    setTimeout(() => {
      modalAnimation.value = true
    }, 10)
  }

  function cerrarModal() {
    modalAnimation.value = false
    setTimeout(() => {
      showCantidadModal.value = false
      productoSeleccionado.value = null
      cantidadInput.value = 1
      callbackConfirmar.value = null
    }, 300)
  }

  function confirmarCantidad() {
    const cantidad = Number(cantidadInput.value)
    if (isNaN(cantidad) || cantidad < 0) {
      console.error('Cantidad inválida')
      return
    }

    if (callbackConfirmar.value) {
      callbackConfirmar.value(cantidad)
    }

    cerrarModal()
  }

  return {
    showCantidadModal,
    modalAnimation,
    productoSeleccionado,
    cantidadInput,
    accion,
    abrirModal,
    cerrarModal,
    confirmarCantidad
  }
}