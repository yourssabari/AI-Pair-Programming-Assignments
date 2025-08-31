import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react'
import { useProducts } from '@/hooks/useApi'
import { ProductCard } from '@/components/product/ProductCard'

export const HomePage: React.FC = () => {
  const { data: products, isLoading } = useProducts({ 
    limit: 8, 
    featured: true 
  })

  const features = [
    {
      icon: Heart,
      title: 'Handcrafted with Love',
      description: 'Each piece is carefully crafted by skilled artisans using traditional techniques passed down through generations.'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'We stand behind our products with a satisfaction guarantee. If you\'re not happy, we\'ll make it right.'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Enjoy free shipping on all orders over $75. Your beautiful clay products will arrive safely packaged.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Portland, OR',
      rating: 5,
      text: 'Absolutely love my ClayCraft mug! The quality is exceptional and it\'s become my favorite for morning coffee.'
    },
    {
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      rating: 5,
      text: 'The planters I ordered have transformed my apartment. Beautiful craftsmanship and perfect size for my herbs.'
    },
    {
      name: 'Emily Rodriguez',
      location: 'Austin, TX',
      rating: 5,
      text: 'Fast shipping and gorgeous products. The attention to detail in every piece is remarkable. Highly recommend!'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clay-50 to-clay-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-clay-900 leading-tight">
                Handcrafted Clay
                <span className="block text-clay-700">
                  Products for Your Home
                </span>
              </h1>
              <p className="text-lg text-clay-700 leading-relaxed">
                Discover our collection of beautiful, sustainable clay products. 
                Each piece is lovingly handcrafted by skilled artisans who pour 
                their passion into every detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-clay-600 text-white font-medium rounded-lg hover:bg-clay-700 transition-colors"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-clay-600 text-clay-600 font-medium rounded-lg hover:bg-clay-600 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-square bg-clay-200 rounded-2xl overflow-hidden">
                <img
                  src="/images/hero-pottery.jpg"
                  alt="Beautiful handcrafted clay pottery"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full bg-clay-200 flex items-center justify-center">
                  <span className="text-clay-400 text-lg">Hero Image</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-clay-300 rounded-full opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-clay-400 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-clay-900 mb-4">
              Why Choose ClayCraft?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing you the finest handcrafted clay products 
              with exceptional service and sustainable practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-clay-100 text-clay-600 rounded-full mb-6">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-clay-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-clay-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-clay-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular handcrafted clay products, 
              each piece unique and made with care.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-3 bg-clay-600 text-white font-medium rounded-lg hover:bg-clay-700 transition-colors"
                >
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-clay-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of happy customers who love our clay products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-clay-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-clay-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-clay-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay Connected with ClayCraft
          </h2>
          <p className="text-lg text-clay-200 mb-8">
            Get the latest updates on new products, artisan stories, 
            and exclusive offers delivered to your inbox.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-clay-500"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-clay-600 hover:bg-clay-500 text-white font-medium rounded-r-lg transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          
          <p className="text-sm text-clay-300 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  )
}
