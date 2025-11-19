// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
  }

  getFullUrl(endpoint) {
    // En desarrollo con proxy, usa URL relativa
    return `${this.baseURL}${endpoint}`
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const url = this.getFullUrl(endpoint)
      const response = await fetch(url, config)
      
      if (response.status === 401) {
        this.handleUnauthorized()
        throw new Error('Unauthorized')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error('API request failed:', err)
      throw err
    }
  }

  handleUnauthorized() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  // Métodos específicos para inventarios
  async getInventories() {
    return this.request('/inventories')
  }

  async getInventory(inventoryId) {
    return this.request(`/inventories/${inventoryId}`)
  }

  async createInventory(data) {
    return this.request('/inventories', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateInventory(id, data) {
    return this.request(`/inventories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteInventory(id) {
    return this.request(`/inventories/${id}`, {
      method: 'DELETE'
    })
  }

  async searchProducts(inventoryId, barcode) {
    return this.request(`/inventories/${inventoryId}/products/search?barcode=${encodeURIComponent(barcode)}`)
  }

  async registerCount(inventoryId, barcode, quantity) {
    return this.request(`/inventories/${inventoryId}/count`, {
      method: 'POST',
      body: JSON.stringify({
        barcode: barcode,
        quantity: quantity
      })
    })
  }

  async uploadProducts(inventoryId, file, overwrite = false) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    if (overwrite) {
      formData.append('overwrite', 'true')
    }

    const url = this.getFullUrl(`/inventories/${inventoryId}/upload`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (response.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async exportInventory(inventoryId, format = 'excel') {
    const url = this.getFullUrl(`/inventories/${inventoryId}/export?format=${format}`)
    const token = localStorage.getItem('token')
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.blob()
  }

  // Agrega este método al archivo src/services/api.js en la clase ApiService

  async getProducts(inventoryId) {
    return this.request(`/inventories/${inventoryId}/products`)
  }
}

export const apiService = new ApiService()