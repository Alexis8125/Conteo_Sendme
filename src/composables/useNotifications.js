// src/composables/useNotifications.js
import { ref } from 'vue'

// Estado global para las notificaciones
const notifications = ref([])
let notificationId = 0

export function useNotifications() {
  
  const showNotification = (type, title, message, duration = 5000) => {
    const id = ++notificationId
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      show: true
    }

    console.log('📢 Mostrando notificación:', { type, title, message, id })
    
    // Agregar la notificación al inicio del array para que aparezca arriba
    notifications.value.unshift(notification)

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Métodos rápidos para tipos comunes
  const success = (title, message, duration) => {
    return showNotification('success', title, message, duration)
  }

  const error = (title, message, duration) => {
    return showNotification('error', title, message, duration)
  }

  const warning = (title, message, duration) => {
    return showNotification('warning', title, message, duration)
  }

  const info = (title, message, duration) => {
    return showNotification('info', title, message, duration)
  }

  const loading = (title, message, duration = 0) => {
    return showNotification('loading', title, message, duration)
  }

  return {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    loading
  }
}