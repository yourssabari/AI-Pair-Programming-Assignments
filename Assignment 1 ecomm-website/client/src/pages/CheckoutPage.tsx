import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react'
import { useCart } from '@/stores/cartStore'
import { useCreateOrder } from '@/hooks/useApi'
import { formatCurrency, isValidEmail } from '@/utils'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const createOrderMutation = useCreateOrder()

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-4">Add some products to continue with checkout.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-clay-600 text-white rounded-lg hover:bg-clay-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const validateShipping = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required'
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required'
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required'
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'CVV is required'
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV'
    }
    if (!paymentInfo.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 'shipping' && validateShipping()) {
      setStep('payment')
    } else if (step === 'payment' && validatePayment()) {
      setStep('review')
    }
  }

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price ?? 0,
        })),
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
        contactInfo: {
          email: shippingInfo.email,
          phone: shippingInfo.phone
        },
        paymentMethod: 'card', // In a real app, this would be handled securely
        totalAmount: total
      }

      await createOrderMutation.mutateAsync(orderData)
      clearCart()
      navigate('/order-confirmation', { replace: true })
    } catch (error) {
      console.error('Order submission failed:', error)
      setErrors({ submit: 'Failed to submit order. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/cart"
            className="flex items-center text-clay-600 hover:text-clay-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div></div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {(['shipping', 'payment', 'review'] as const).map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepName 
                    ? 'bg-clay-600 text-white' 
                    : index < (['shipping', 'payment', 'review'] as const).indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === stepName ? 'text-clay-600' : 'text-gray-500'
                }`}>
                  {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                </span>
                {index < 2 && <div className="w-8 h-px bg-gray-300 ml-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Shipping Information */}
              {step === 'shipping' && (
                <div>
                  <div className="flex items-center mb-6">
                    <MapPin className="w-5 h-5 text-clay-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {step === 'payment' && (
                <div>
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-5 h-5 text-clay-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                        placeholder="John Doe"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-500 ${
                          errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Review */}
              {step === 'review' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    {/* Shipping Details */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p>Email: {shippingInfo.email}</p>
                        <p>Phone: {shippingInfo.phone}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        <p>{paymentInfo.cardholderName}</p>
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (step === 'payment') setStep('shipping')
                    else if (step === 'review') setStep('payment')
                  }}
                  className={`px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                    step === 'shipping' ? 'invisible' : ''
                  }`}
                >
                  Back
                </button>

                <button
                  onClick={step === 'review' ? handleSubmitOrder : handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-clay-600 text-white rounded-lg hover:bg-clay-700 disabled:bg-gray-400 transition-colors"
                >
                  {isSubmitting 
                    ? 'Processing...' 
                    : step === 'review' 
                    ? 'Place Order' 
                    : 'Continue'
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => {
                  const img = item.product?.primaryImage || item.product?.images?.[0]?.url
                  const alt = item.product?.name || 'Product image'
                  const name = item.product?.name || 'Product'
                  const lineTotal = (item.product?.price ?? 0) * item.quantity
                  return (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {img ? (
                          <img src={img} alt={alt} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-clay-100 flex items-center justify-center">
                            <span className="text-clay-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(lineTotal)}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-clay-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {shipping === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">🎉 You qualify for free shipping!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
