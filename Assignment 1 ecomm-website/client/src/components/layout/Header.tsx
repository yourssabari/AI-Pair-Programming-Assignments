import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User,
  LogOut,
  Package
} from 'lucide-react'
import { useCart } from '@/stores/cartStore'
import { useAuth } from '@/stores/authStore'
import { CartSlideout } from '@/components/cart/CartSlideout'
import { cn } from '@/utils'

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  
  const { getTotalItems, openCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  
  const totalItems = getTotalItems()

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/products?category=mugs-cups', label: 'Mugs' },
    { href: '/products?category=planters', label: 'Planters' },
    { href: '/products?category=decorative-items', label: 'Decor' },
    { href: '/products?category=tableware', label: 'Tableware' },
  ]

  const isActivePage = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href) || location.search.includes(href.split('?')[1] || '')
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-clay-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-clay-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-clay-900">ClayCraft</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isActivePage(link.href)
                      ? "text-clay-700 border-b-2 border-clay-700"
                      : "text-clay-600 hover:text-clay-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-clay-600 hover:text-clay-700 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-clay-600 hover:text-clay-700 transition-colors"
                aria-label={`Cart with ${totalItems} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-clay-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="relative hidden md:flex items-center space-x-2">
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-clay-600 hover:text-clay-700 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-clay-600 hover:text-clay-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="hidden md:flex items-center space-x-1 px-3 py-2 text-sm text-clay-600 hover:text-clay-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-clay-600 hover:text-clay-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t border-clay-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-clay-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for clay products..."
                  className="w-full pl-10 pr-4 py-2 border border-clay-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-clay-200">
              <nav className="flex flex-col space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActivePage(link.href)
                        ? "bg-clay-100 text-clay-700"
                        : "text-clay-600 hover:bg-clay-50 hover:text-clay-700"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-clay-200 mt-4">
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-clay-600 hover:bg-clay-50 hover:text-clay-700 rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-clay-600 hover:bg-clay-50 hover:text-clay-700 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/admin/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-clay-600 hover:bg-clay-50 hover:text-clay-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Admin Login</span>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Slideout */}
      <CartSlideout />
    </>
  )
}
