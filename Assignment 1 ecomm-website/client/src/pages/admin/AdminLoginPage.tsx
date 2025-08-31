import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/stores/authStore'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { isAuthenticated, login, isLoading } = useAuth()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const ok = await login({ email, password })
      if (!ok) {
        setErrors({ submit: 'Invalid credentials. Please try again.' })
        return
      }
    } catch (error) {
      setErrors({ submit: 'Invalid credentials. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-50 to-clay-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-clay-600 rounded-full mb-4">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <h1 className="text-2xl font-bold text-clay-900">ClayCraft Admin</h1>
          <p className="text-clay-600">Sign in to your admin account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="admin@claycraft.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-clay-600 text-white py-2 px-4 rounded-lg hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-clay-50 rounded-lg border border-clay-200">
            <h3 className="text-sm font-medium text-clay-900 mb-2">Demo Credentials</h3>
            <div className="text-xs text-clay-700 space-y-1">
              <p><strong>Email:</strong> admin@claycraft.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@claycraft.com')
                setPassword('admin123')
              }}
              className="mt-2 text-xs text-clay-600 hover:text-clay-700 underline"
            >
              Use demo credentials
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-clay-600">
            Need help? Contact{' '}
            <a href="mailto:support@claycraft.com" className="text-clay-700 hover:underline">
              support@claycraft.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
