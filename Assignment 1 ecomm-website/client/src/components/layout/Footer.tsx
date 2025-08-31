import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    products: [
      { href: '/products?category=mugs-cups', label: 'Mugs & Cups' },
      { href: '/products?category=planters', label: 'Planters' },
      { href: '/products?category=decorative-items', label: 'Decorative Items' },
      { href: '/products?category=tableware', label: 'Tableware' },
      { href: '/products?category=vases', label: 'Vases' },
    ],
    support: [
      { href: '/shipping', label: 'Shipping Info' },
      { href: '/returns', label: 'Returns & Exchanges' },
      { href: '/care', label: 'Care Instructions' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact Us' },
    ],
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/artisans', label: 'Our Artisans' },
      { href: '/sustainability', label: 'Sustainability' },
      { href: '/wholesale', label: 'Wholesale' },
      { href: '/press', label: 'Press' },
    ]
  }

  const socialLinks = [
    { href: 'https://facebook.com/claycraft', icon: Facebook, label: 'Facebook' },
    { href: 'https://instagram.com/claycraft', icon: Instagram, label: 'Instagram' },
    { href: 'https://twitter.com/claycraft', icon: Twitter, label: 'Twitter' },
  ]

  return (
    <footer className="bg-clay-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-clay-200 rounded-lg flex items-center justify-center">
                  <span className="text-clay-900 font-bold text-sm">CC</span>
                </div>
                <span className="text-xl font-bold">ClayCraft</span>
              </Link>
              <p className="text-clay-300 text-sm mb-6 leading-relaxed">
                Handcrafted clay products made with love by skilled artisans. 
                Each piece tells a story of tradition, craftsmanship, and sustainable living.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-clay-300">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@claycraft.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Artisan Way, Clay City, CC 12345</span>
                </div>
              </div>
            </div>

            {/* Products Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                {footerLinks.products.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-clay-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-clay-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-clay-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-clay-800">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
              <p className="text-clay-300 text-sm mb-4">
                Get updates on new products, artisan stories, and special offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-clay-800 text-white placeholder-clay-400 rounded-l-lg border border-clay-700 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-clay-600 hover:bg-clay-500 text-white rounded-r-lg transition-colors font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-clay-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-clay-400 text-sm">
              <span>© {currentYear} ClayCraft. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by artisans.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-clay-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-clay-400 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
