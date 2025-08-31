import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils'
import { useCart } from '@/stores/cartStore'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '' 
}) => {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // Cart store expects a Product object; pass full product
    addItem(product, 1)
  }

  return (
    <div className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${className}`}>
  <Link to={`/products/${product.slug}`}>
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
      {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
        alt={product.images[0].altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-clay-100 flex items-center justify-center">
              <span className="text-clay-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Sale Badge placeholder: no salePrice in model */}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Add to favorites"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-clay-600 uppercase tracking-wide mb-1">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-clay-700 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-clay-600">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Stock Indicator */}
      {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-600 mb-3">
        Only {product.stock} left in stock
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center space-x-2 bg-clay-600 text-white py-2 px-4 rounded-lg hover:bg-clay-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </div>
  )
}
