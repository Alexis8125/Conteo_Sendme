import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  // Función para aplicar el tema
  const applyTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
      console.log('✅ Tema oscuro aplicado')
    } else {
      html.classList.remove('dark')
      console.log('✅ Tema claro aplicado')
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Inicializar tema al cargar
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
      console.log('📁 Tema cargado desde localStorage:', savedTheme)
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      console.log('🌐 Tema detectado del sistema:', prefersDark ? 'oscuro' : 'claro')
    }
    applyTheme()
  })

  // Cambiar tema
  const toggleTheme = () => {
    console.log('🔄 Cambiando tema, estado anterior:', isDark.value ? 'oscuro' : 'claro')
    isDark.value = !isDark.value
    applyTheme()
    console.log('🎯 Nuevo estado del tema:', isDark.value ? 'oscuro' : 'claro')
  }

  return {
    isDark,
    toggleTheme
  }
}