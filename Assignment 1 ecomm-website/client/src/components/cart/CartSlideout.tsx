import React from 'react'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/stores/cartStore'
import { formatCurrency } from '@/utils'
import { Link } from 'react-router-dom'

export const CartSlideout: React.FC = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCart()

  const total = getTotalPrice()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Slideout */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some beautiful clay products to get started!
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="bg-clay-600 text-white px-6 py-2 rounded-lg hover:bg-clay-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {(() => {
                      const img = item.product?.primaryImage || item.product?.images?.[0]?.url
                      const alt = item.product?.name || 'Product image'
                      return img ? (
                        <img src={img} alt={alt} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-clay-100 flex items-center justify-center">
                          <span className="text-clay-400 text-xs">No Image</span>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.product?.name ?? 'Product'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.product ? formatCurrency(item.product.price) : '-'} each
                    </p>
                    <p className="text-sm font-medium text-clay-600">
                      {item.product ? formatCurrency(item.product.price * item.quantity) : '-'}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-clay-600">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full bg-clay-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-clay-700 transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full text-clay-600 py-2 px-4 rounded-lg font-medium hover:bg-clay-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
