import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/stores/authStore'

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-clay-900 mb-6">Admin Dashboard</h1>
      <p className="text-clay-700 mb-8">Welcome{user ? `, ${user.firstName}` : ''}! This is a placeholder dashboard.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/products" className="p-5 border border-clay-200 rounded-lg hover:bg-clay-50">
          <h2 className="text-lg font-semibold text-clay-900">Browse Products</h2>
          <p className="text-sm text-clay-700">Go to storefront</p>
        </Link>
        <Link to="/admin/login" className="p-5 border border-clay-200 rounded-lg hover:bg-clay-50">
          <h2 className="text-lg font-semibold text-clay-900">Re-authenticate</h2>
          <p className="text-sm text-clay-700">Sign in again</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboardPage
