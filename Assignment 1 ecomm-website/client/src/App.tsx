import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Pages
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-clay-600 text-white rounded-lg hover:bg-clay-700 transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
