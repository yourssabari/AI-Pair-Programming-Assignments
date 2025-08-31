import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ProductFilters, CheckoutFormData, CartItem } from '@/types'
import toast from 'react-hot-toast'

// Products hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => apiClient.getProducts(filters),
  // Always refetch on mount to avoid stale empty results if API evolved
  refetchOnMount: 'always',
  refetchOnWindowFocus: 'always',
  staleTime: 0,
  })
}

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiClient.getProduct(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Cart hooks
export const useValidateCart = () => {
  return useMutation({
    mutationFn: (items: CartItem[]) => apiClient.validateCart(items),
  })
}

export const useCheckout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CheckoutFormData & { items: CartItem[] }) => apiClient.checkout(data),
    onSuccess: () => {
      toast.success('Order placed successfully!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Checkout failed'
      toast.error(message)
    },
  })
}

// Orders hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (orderData: any) => apiClient.createOrder(orderData),
    onSuccess: () => {
      toast.success('Order placed successfully!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Order creation failed'
      toast.error(message)
    }
  })
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.getOrders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useOrder = (orderNumber: string) => {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => apiClient.getOrder(orderNumber),
    enabled: !!orderNumber,
  })
}

// Admin hooks
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => apiClient.getAdminProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productData: FormData) => apiClient.createProduct(productData),
    onSuccess: () => {
      toast.success('Product created successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create product'
      toast.error(message)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      apiClient.updateProduct(id, data),
    onSuccess: () => {
      toast.success('Product updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update product'
      toast.error(message)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete product'
      toast.error(message)
    },
  })
}

// Admin Orders
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiClient.getAdminOrders(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      apiClient.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Order status updated!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update order status'
      toast.error(message)
    },
  })
}

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.login(credentials),
    onSuccess: () => {
      toast.success('Login successful!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    },
  })
}
