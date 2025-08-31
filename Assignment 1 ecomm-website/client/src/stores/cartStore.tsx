import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getTotalPriceInPaise: () => number
  getItemQuantity: (productId: number) => number
  isItemInCart: (productId: number) => boolean
}

type CartStore = CartState & CartActions

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,

      // Actions
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id)
          
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity
            if (newQuantity > 10) {
              toast.error('Maximum 10 items allowed per product')
              return state
            }
            if (newQuantity > product.stock) {
              toast.error(`Only ${product.stock} items available`)
              return state
            }
            
            toast.success(`Updated ${product.name} quantity`)
            return {
              ...state,
              items: state.items.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            }
          } else {
            if (quantity > product.stock) {
              toast.error(`Only ${product.stock} items available`)
              return state
            }
            
            toast.success(`${product.name} added to cart`)
            return {
              ...state,
              items: [...state.items, { productId: product.id, quantity, product }],
            }
          }
        })
      },

      removeItem: (productId: number) => {
        set((state) => {
          const item = state.items.find(item => item.productId === productId)
          if (item?.product) {
            toast.success(`${item.product.name} removed from cart`)
          }
          
          return {
            ...state,
            items: state.items.filter(item => item.productId !== productId),
          }
        })
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => {
          const item = state.items.find(item => item.productId === productId)
          if (!item?.product) return state

          if (quantity > 10) {
            toast.error('Maximum 10 items allowed per product')
            return state
          }
          
          if (quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} items available`)
            return state
          }

          return {
            ...state,
            items: state.items.map(cartItem =>
              cartItem.productId === productId
                ? { ...cartItem, quantity }
                : cartItem
            ),
          }
        })
      },

      clearCart: () => {
        set({ items: [] })
        toast.success('Cart cleared')
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().getTotalPriceInPaise() / 100
      },

      getTotalPriceInPaise: () => {
        return get().items.reduce((total, item) => {
          if (!item.product) return total
          return total + (item.product.priceInPaise * item.quantity)
        }, 0)
      },

      getItemQuantity: (productId: number) => {
        const item = get().items.find(item => item.productId === productId)
        return item?.quantity || 0
      },

      isItemInCart: (productId: number) => {
        return get().items.some(item => item.productId === productId)
      },
    }),
    {
      name: 'claycraft-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
)

// Provider component for React context (optional, but useful for dev tools)
import React, { createContext, ReactNode } from 'react'

const CartContext = createContext<CartStore | null>(null)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <CartContext.Provider value={null}>{children}</CartContext.Provider>
}

// Custom hook with better error handling
export const useCart = () => {
  const store = useCartStore()
  return store
}
