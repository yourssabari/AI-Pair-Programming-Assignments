import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginFormData } from '@/types'
import { apiClient } from '@/api/client'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  login: (credentials: LoginFormData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginFormData) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.login(credentials)
          
          if (response.success) {
            const { token, user } = response.data
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
            
            toast.success(`Welcome back, ${user.firstName}!`)
            return true
          } else {
            toast.error('Login failed')
            set({ isLoading: false })
            return false
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          toast.error(errorMessage)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')
        
        // Clear state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        
        // Call logout API (optional, for server-side token cleanup)
        apiClient.logout().catch(() => {
          // Ignore errors on logout API call
        })
        
        toast.success('Logged out successfully')
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth-token')
        const userStr = localStorage.getItem('auth-user')
        
        if (!token || !userStr) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
          return
        }

        try {
      const user = JSON.parse(userStr)
          
          // Verify token with server
          const response = await apiClient.verifyToken()
          
      if (response.success) {
            set({
        user: response.data.user ?? user,
              token,
              isAuthenticated: true,
            })
          } else {
            // Token invalid, clear auth
            get().logout()
          }
        } catch (error) {
          // Token invalid or network error, clear auth
          get().logout()
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'claycraft-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Provider component
import React, { createContext, ReactNode, useEffect } from 'react'

const AuthContext = createContext<AuthStore | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  
  useEffect(() => {
    // Check authentication on app load
    checkAuth()
  }, [checkAuth])
  
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>
}

// Custom hook
export const useAuth = () => {
  const store = useAuthStore()
  return store
}
