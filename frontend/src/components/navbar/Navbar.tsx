"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <nav className="bg-amber-50 border-b-2 border-green-900/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image src="/booker-new-logo.png" alt="Booker Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-bold text-green-900 tracking-tight">Booker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#books" className="text-green-900 hover:text-green-900/70 transition-colors duration-200 font-medium text-base">
              Books
            </a>
            <a href="#bestsellers" className="text-green-900 hover:text-green-900/70 transition-colors duration-200 font-medium text-base">
              Bestsellers
            </a>
            <a href="#collections" className="text-green-900 hover:text-green-900/70 transition-colors duration-200 font-medium text-base">
              Collections
            </a>
            <a href="#about" className="text-green-900 hover:text-green-900/70 transition-colors duration-200 font-medium text-base">
              About
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white text-green-900 placeholder-green-900/50 rounded-lg py-1.5 px-4 pr-8 border border-green-900/20 focus:outline-none focus:border-green-900 focus:ring-1 focus:ring-green-900/20 transition-all duration-200 text-sm"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-900/60" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button className="relative text-green-900 hover:bg-green-900/10 p-1.5 rounded-lg transition-all duration-200">
              <ShoppingCart className="w-5 h-5" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-900 text-amber-50 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <button className="text-green-900 hover:bg-green-900/10 p-1.5 rounded-lg transition-all duration-200">
              <User className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Logout */}
            <button className="hidden md:flex items-center space-x-1.5 bg-green-900 text-amber-50 px-3 py-1.5 rounded-lg hover:bg-green-900/90 transition-all duration-200 font-medium shadow-md text-sm">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-green-900 hover:bg-green-900/10 p-1.5 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4 max-w-xs mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white text-green-900 placeholder-green-900/50 rounded-lg py-1.5 px-4 pr-8 border border-green-900/20 focus:outline-none focus:border-green-900 focus:ring-1 focus:ring-green-900/20 transition-all duration-200 text-sm"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-900/60" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 border-t border-green-900/10 pt-3">
            <div className="flex flex-col space-y-2">
              <a href="#books" className="text-green-900 hover:bg-green-900/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base">
                Books
              </a>
              <a href="#bestsellers" className="text-green-900 hover:bg-green-900/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base">
                Bestsellers
              </a>
              <a href="#collections" className="text-green-900 hover:bg-green-900/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base">
                Collections
              </a>
              <a href="#about" className="text-green-900 hover:bg-green-900/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base">
                About
              </a>
              <button className="flex items-center space-x-1.5 bg-green-900 text-amber-50 px-3 py-1.5 rounded-lg hover:bg-green-900/90 transition-all duration-200 font-medium w-fit shadow-md text-sm">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar
