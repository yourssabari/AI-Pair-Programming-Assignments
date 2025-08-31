import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useApi'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/utils'

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  
  // Get filters from URL
  const categoryFilter = searchParams.get('category')
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const search = searchParams.get('q')

  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.category?.slug === categoryFilter
      )
    }

    // Price filter
    if (priceMin) {
      filtered = filtered.filter(product => product.price >= Number(priceMin))
    }
    if (priceMax) {
      filtered = filtered.filter(product => product.price <= Number(priceMax))
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, categoryFilter, priceMin, priceMax, search, sortBy])

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const activeFiltersCount = [categoryFilter, priceMin, priceMax, search].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of handcrafted clay products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={cn(
            "lg:w-64 lg:flex-shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-clay-600 hover:text-clay-700"
                  >
                    Clear ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!categoryFilter}
                      onChange={() => updateFilter('category', null)}
                      className="text-clay-600 focus:ring-clay-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={categoryFilter === category.slug}
                        onChange={() => updateFilter('category', category.slug)}
                        className="text-clay-600 focus:ring-clay-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin || ''}
                      onChange={(e) => updateFilter('priceMin', e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-clay-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax || ''}
                      onChange={(e) => updateFilter('priceMax', e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-clay-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Results and Filters Toggle */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} products
                  </span>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-1 text-sm text-clay-600 hover:text-clay-700"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-clay-600 text-white text-xs px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* View Mode and Sort */}
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 text-sm",
                        viewMode === 'grid'
                          ? "bg-clay-600 text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2 text-sm",
                        viewMode === 'list'
                          ? "bg-clay-600 text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-clay-500"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className={cn(
                      "bg-gray-200",
                      viewMode === 'grid' ? "aspect-square" : "h-48"
                    )}></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-clay-600 hover:text-clay-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? "flex-row" : ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
