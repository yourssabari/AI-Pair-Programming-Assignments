import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  
} from 'lucide-react'
import { useProduct } from '@/hooks/useApi'
import { useCart } from '@/stores/cartStore'
import { formatCurrency } from '@/utils'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const { data: product, isLoading, error } = useProduct(slug!)
  const { addItem } = useCart()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-clay-600 text-white rounded-lg hover:bg-clay-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }

  // No discount logic in current model

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-clay-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-clay-600">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link 
                to={`/products?category=${product.category.slug}`}
                className="hover:text-clay-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.url || product.images[0].url}
                  alt={product.images[selectedImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-clay-100 flex items-center justify-center">
                  <span className="text-clay-400 text-lg">No Image Available</span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index 
                        ? 'border-clay-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Link
                to={`/products?category=${product.category.slug}`}
                className="inline-block text-sm text-clay-600 hover:text-clay-700 font-medium"
              >
                {product.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-clay-600">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    {product.stock > 10 
                      ? 'In Stock' 
                      : `Only ${product.stock} left`
                    }
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-clay-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-clay-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-clay-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over $75</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-clay-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quality Guarantee</p>
                    <p className="text-xs text-gray-600">Handcrafted excellence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-clay-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                    <p className="text-xs text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with actual related products */}
            <div className="text-center text-gray-500 col-span-full py-8">
              Related products would be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
