// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Crear y montar la aplicación
const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('🎯 Vue app montada correctamente')