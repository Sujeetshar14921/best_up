import React from 'react'
import { Mail, Phone, MapPin, Heart, Shield, Zap } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-yellow-400">Best</span>
              <span className="text-2xl font-bold text-blue-600">Up</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your intelligent smartphone guide. We help you find the perfect phone based on your budget and priorities.
            </p>
            <div className="flex gap-4">
              <Heart size={18} className="text-red-500" />
              <Shield size={18} className="text-green-500" />
              <Zap size={18} className="text-yellow-500" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span className="text-yellow-400">→</span> Home</a></li>
              <li><a href="/recommend" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span className="text-yellow-400">→</span> Find Phone</a></li>
              <li><a href="/phones" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span className="text-yellow-400">→</span> All Phones</a></li>
              <li><a href="/compare" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span className="text-yellow-400">→</span> Compare</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Features</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-400">★</span> AI Recommendations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-400">★</span> Phone Comparison</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-400">★</span> Detailed Specs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-400">★</span> Price Tracking</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-yellow-400 mt-1 flex-shrink-0" />
                <a href="mailto:support@bestup.com" className="text-gray-400 hover:text-yellow-400 transition-colors">support@bestup.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-yellow-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">+91 8957744642</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-yellow-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 py-8 border-y border-gray-800 mb-8">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">500+</div>
            <p className="text-gray-400 text-xs md:text-sm">Phones Listed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">50K+</div>
            <p className="text-gray-400 text-xs md:text-sm">Users Helped</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-400">100%</div>
            <p className="text-gray-400 text-xs md:text-sm">Accurate Data</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} <span className="text-yellow-400">Best</span><span className="text-blue-400">Up</span>. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 flex-wrap justify-center">
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
