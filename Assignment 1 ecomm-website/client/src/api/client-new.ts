import axios from 'axios'
import type { Product, Category, ProductFilters, CheckoutFormData, CartItem, Order } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  })

  constructor() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/admin/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Products
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams()
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.featured) params.append('featured', 'true')

    const response = await this.api.get(`/products?${params}`)
    return response.data
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.api.get(`/products/${id}`)
    return response.data
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get('/categories')
    return response.data
  }

  // Cart validation
  async validateCart(items: CartItem[]): Promise<{ valid: boolean; issues?: string[] }> {
    const response = await this.api.post('/cart/validate', { items })
    return response.data
  }

  // Checkout
  async checkout(data: CheckoutFormData & { items: CartItem[] }): Promise<Order> {
    const response = await this.api.post('/checkout', data)
    return response.data
  }

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    const response = await this.api.post('/orders', orderData)
    return response.data
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.api.get('/orders')
    return response.data
  }

  async getOrder(orderNumber: string): Promise<Order> {
    const response = await this.api.get(`/orders/${orderNumber}`)
    return response.data
  }

  // Admin - Products
  async getAdminProducts(): Promise<Product[]> {
    const response = await this.api.get('/admin/products')
    return response.data
  }

  async createProduct(productData: FormData): Promise<Product> {
    const response = await this.api.post('/admin/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async updateProduct(id: string, productData: FormData): Promise<Product> {
    const response = await this.api.put(`/admin/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/admin/products/${id}`)
  }

  // Admin - Orders
  async getAdminOrders(): Promise<Order[]> {
    const response = await this.api.get('/admin/orders')
    return response.data
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await this.api.patch(`/admin/orders/${id}/status`, { status })
    return response.data
  }

  // Auth
  async login(credentials: { username: string; password: string }): Promise<{ token: string; user: any }> {
    const response = await this.api.post('/admin/login', credentials)
    const { token } = response.data
    localStorage.setItem('authToken', token)
    return response.data
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken')
  }
}

export const apiClient = new ApiClient()
