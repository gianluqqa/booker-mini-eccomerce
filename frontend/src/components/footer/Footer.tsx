import { BookOpen, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import React from 'react'

const Footer = () => {
  return ((
        <footer className="bg-[#2E4B30] text-[#F5EFE1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#F5EFE1] p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-[#2E4B30]" strokeWidth={2} />
                  </div>
                  <span className="text-2xl font-bold text-[#F5EFE1]">Booker</span>
                </div>
                <p className="text-[#F5EFE1]/80 text-sm leading-relaxed">
                  Your ultimate destination for discovering and collecting books. From timeless classics to modern bestsellers.
                </p>
                <div className="flex space-x-3 pt-2">
                  <a href="#" className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-lg transition-all duration-200">
                    <Facebook className="w-5 h-5 text-[#F5EFE1]" />
                  </a>
                  <a href="#" className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-lg transition-all duration-200">
                    <Instagram className="w-5 h-5 text-[#F5EFE1]" />
                  </a>
                  <a href="#" className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-lg transition-all duration-200">
                    <Twitter className="w-5 h-5 text-[#F5EFE1]" />
                  </a>
                  <a href="#" className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-lg transition-all duration-200">
                    <Youtube className="w-5 h-5 text-[#F5EFE1]" />
                  </a>
                </div>
              </div>
    
              {/* Quick Links */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      All Books
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Bestsellers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      New Arrivals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Special Offers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Gift Cards
                    </a>
                  </li>
                </ul>
              </div>
    
              {/* Customer Service */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Customer Service</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Returns & Exchanges
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Track Order
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
    
              {/* Contact Info */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Contact Us</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#F5EFE1]/80 flex-shrink-0 mt-0.5" />
                    <span className="text-[#F5EFE1]/80 text-sm">
                      123 Library Street<br />Buenos Aires, Argentina
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#F5EFE1]/80 flex-shrink-0" />
                    <span className="text-[#F5EFE1]/80 text-sm">+54 341 555-0123</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#F5EFE1]/80 flex-shrink-0" />
                    <span className="text-[#F5EFE1]/80 text-sm">hello@booker.com</span>
                  </li>
                </ul>
              </div>
            </div>
    
            {/* Newsletter Section */}
            <div className="border-t border-[#F5EFE1]/20 pt-8 pb-8">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-[#F5EFE1] font-bold text-xl mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-[#F5EFE1]/80 text-sm mb-4">Get the latest book recommendations and exclusive offers</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-[#F5EFE1]/10 text-[#F5EFE1] placeholder-[#F5EFE1]/50 rounded-lg py-3 px-4 border border-[#F5EFE1]/20 focus:outline-none focus:border-[#F5EFE1] focus:ring-2 focus:ring-[#F5EFE1]/20 transition-all duration-200"
                  />
                  <button className="bg-[#F5EFE1] text-[#2E4B30] px-6 py-3 rounded-lg hover:bg-white transition-all duration-200 font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
    
            {/* Bottom Bar */}
            <div className="border-t border-[#F5EFE1]/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-[#F5EFE1]/60 text-sm">
                  © 2025 Booker. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                    Terms of Service
                  </a>
                  <a href="#" className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
  ));
}

export default Footer