import { ref } from 'vue'

export function useNotifications() {
  const notifications = ref([])

  function showNotification(type, title, message, duration = 4000) {
    const id = Date.now() + Math.random()
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      show: false,
    }

    notifications.value.push(notification)

    setTimeout(() => {
      const index = notifications.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        notifications.value[index].show = true
      }
    }, 10)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value[index].show = false
      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300)
    }
  }

  return {
    notifications,
    showNotification,
    removeNotification
  }
}