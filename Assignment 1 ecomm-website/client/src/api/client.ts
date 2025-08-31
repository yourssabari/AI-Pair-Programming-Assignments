import axios from 'axios'
import type { Product, Category, ProductFilters, CheckoutFormData, CartItem, Order } from '@/types'

// Point to the running API (server defaults to 4000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

class ApiClient {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  })

  constructor() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth-token')
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
          localStorage.removeItem('auth-token')
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
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.featured) params.append('featured', 'true')
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const response = await this.api.get(`/products?${params.toString()}`)
    const payload = response.data
    // Server returns { success, data: { products, pagination, ... } }
    if (payload && typeof payload === 'object' && 'data' in payload && payload.data?.products) {
      return payload.data.products as Product[]
    }
    // Fallbacks
    if (Array.isArray(payload)) return payload as Product[]
    if (Array.isArray(payload?.data)) return payload.data as Product[]
    return []
  }

  async getProduct(slug: string): Promise<Product> {
    const response = await this.api.get(`/products/${slug}`)
    // Server returns { success, data: product }
    return response.data?.data ?? response.data
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    // Server exposes categories under /api/products/categories/list
    const response = await this.api.get('/products/categories/list')
    return response.data?.data ?? response.data
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
  async login(credentials: { email: string; password: string }): Promise<import('@/types').AuthResponse> {
    const response = await this.api.post('/auth/login', credentials)
    const payload = response.data
    // Expect { success, data: { token, user } }
    if (payload?.success && payload.data?.token) {
      localStorage.setItem('auth-token', payload.data.token)
      localStorage.setItem('auth-user', JSON.stringify(payload.data.user))
    }
    return payload
  }

  async verifyToken(): Promise<{ success: boolean; data?: any }> {
    const response = await this.api.post('/auth/verify')
    return response.data
  }

  async logout(): Promise<void> {
    try { await this.api.post('/auth/logout') } catch {}
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
  }
}

export const apiClient = new ApiClient()
