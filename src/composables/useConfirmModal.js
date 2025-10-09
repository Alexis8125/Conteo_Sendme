import { ref } from 'vue'

export function useConfirmModal() {
  const showConfirmModal = ref(false)
  const confirmConfig = ref({ title: "", message: "", onConfirm: null })
  const modalAnimation = ref(false)

  function askConfirmation(title, message, onConfirm) {
    confirmConfig.value = { title, message, onConfirm }
    showConfirmModal.value = true
    setTimeout(() => {
      modalAnimation.value = true
    }, 10)
  }

  function handleConfirm() {
    if (confirmConfig.value.onConfirm) {
      confirmConfig.value.onConfirm()
    }
    closeModal()
  }

  function handleCancel() {
    closeModal()
  }

  function closeModal() {
    modalAnimation.value = false
    setTimeout(() => {
      showConfirmModal.value = false
    }, 300)
  }

  return {
    showConfirmModal,
    confirmConfig,
    modalAnimation,
    askConfirmation,
    handleConfirm,
    handleCancel,
    closeModal
  }
}