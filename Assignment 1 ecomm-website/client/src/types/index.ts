// Product related types
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDesc?: string
  price: number
  priceInPaise: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  weight?: number
  dimensions?: string
  material?: string
  careInstructions?: string
  category: {
    id: number
    name: string
    slug: string
  }
  images: ProductImage[]
  primaryImage?: string
  relatedProducts?: RelatedProduct[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: number
  url: string
  altText?: string
  isPrimary: boolean
  sortOrder?: number
}

export interface RelatedProduct {
  id: number
  name: string
  slug: string
  shortDesc?: string
  price: number
  primaryImage?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  productCount?: number
}

// Cart related types
export interface CartItem {
  productId: number
  quantity: number
  product?: Product
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  totalPriceInPaise: number
}

// Order related types
export interface Order {
  id: number
  orderNumber: string
  status: OrderStatus
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    address: string
    city: string
    state?: string
    pincode: string
  }
  items: OrderItem[]
  pricing: {
    subtotal: number
    subtotalInPaise: number
    shipping: number
    shippingInPaise: number
    total: number
    totalInPaise: number
  }
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderDate: string
  estimatedDeliveryDate?: string
}

export interface OrderItem {
  id: number
  quantity: number
  price: number
  priceInPaise: number
  total: number
  totalInPaise: number
  product: {
    id: number
    name: string
    slug: string
    image?: string
  }
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentMethod = 'COD' | 'MOCK_UPI' | 'MOCK_CARD'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

// API response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    filters?: Record<string, any>
  }
}

export interface ProductListResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    filters: {
      category?: string
      search?: string
      minPrice?: number
      maxPrice?: number
      inStock?: boolean
      featured?: boolean
      sortBy: string
      sortOrder: string
    }
  }
}

// Form types
export interface CheckoutFormData {
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    address: string
    city: string
    state?: string
    pincode: string
  }
  paymentMethod: PaymentMethod
}

export interface ProductFormData {
  name: string
  description: string
  shortDesc?: string
  priceInPaise: number
  stock: number
  categoryId: number
  weight?: number
  dimensions?: string
  material?: string
  careInstructions?: string
  isFeatured: boolean
  images?: {
    url: string
    altText?: string
    isPrimary: boolean
    sortOrder: number
  }[]
}

// User and Auth types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}

export interface LoginFormData {
  email: string
  password: string
}

// Filter and search types
export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Admin dashboard types
export interface AdminStats {
  products: {
    total: number
    active: number
    inactive: number
  }
  orders: {
    total: number
    pending: number
    completed: number
  }
  revenue: {
    total: number
    monthly: number
  }
}

// Upload types
export interface UploadResponse {
  success: boolean
  data: {
    url: string
    filename: string
    originalName: string
    size: number
  }
}

// Error types
export interface ApiError {
  success: false
  message: string
  error?: string
  errors?: Array<{
    field: string
    message: string
  }>
}
