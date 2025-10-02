"use client"
import React, { useState } from 'react'
import { BookOpen, Search, Heart, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount] = useState(3);
  
    return (
      <nav className="bg-[#F5EFE1] border-b-2 border-[#2E4B30]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-[#2E4B30] p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#F5EFE1]" strokeWidth={2} />
              </div>
              <span className="text-3xl font-bold text-[#2E4B30] tracking-tight">Booker</span>
            </div>
  
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#books" className="text-[#2E4B30] hover:text-[#2E4B30]/70 transition-colors duration-200 font-medium text-lg">
                Books
              </a>
              <a href="#bestsellers" className="text-[#2E4B30] hover:text-[#2E4B30]/70 transition-colors duration-200 font-medium text-lg">
                Bestsellers
              </a>
              <a href="#collections" className="text-[#2E4B30] hover:text-[#2E4B30]/70 transition-colors duration-200 font-medium text-lg">
                Collections
              </a>
              <a href="#about" className="text-[#2E4B30] hover:text-[#2E4B30]/70 transition-colors duration-200 font-medium text-lg">
                About
              </a>
            </div>
  
            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search books, authors, genres..."
                  className="w-full bg-white text-[#2E4B30] placeholder-[#2E4B30]/50 rounded-xl py-3 px-6 pr-12 border-2 border-[#2E4B30]/20 focus:outline-none focus:border-[#2E4B30] focus:ring-2 focus:ring-[#2E4B30]/20 transition-all duration-200"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E4B30]/60" />
              </div>
            </div>
  
            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button className="relative text-[#2E4B30] hover:bg-[#2E4B30]/10 p-2 rounded-lg transition-all duration-200">
                <ShoppingCart className="w-6 h-6" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2E4B30] text-[#F5EFE1] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
  
              {/* User Profile */}
              <button className="text-[#2E4B30] hover:bg-[#2E4B30]/10 p-2 rounded-lg transition-all duration-200">
                <User className="w-6 h-6" strokeWidth={2} />
              </button>
  
              {/* Logout */}
              <button className="hidden md:flex items-center space-x-2 bg-[#2E4B30] text-[#F5EFE1] px-5 py-2.5 rounded-xl hover:bg-[#2E4B30]/90 transition-all duration-200 font-medium shadow-md">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
  
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-[#2E4B30] hover:bg-[#2E4B30]/10 p-2 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
  
          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full bg-white text-[#2E4B30] placeholder-[#2E4B30]/50 rounded-xl py-3 px-6 pr-12 border-2 border-[#2E4B30]/20 focus:outline-none focus:border-[#2E4B30] focus:ring-2 focus:ring-[#2E4B30]/20 transition-all duration-200"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E4B30]/60" />
            </div>
          </div>
  
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-[#2E4B30]/10 pt-4">
              <div className="flex flex-col space-y-3">
                <a href="#books" className="text-[#2E4B30] hover:bg-[#2E4B30]/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg">
                  Books
                </a>
                <a href="#bestsellers" className="text-[#2E4B30] hover:bg-[#2E4B30]/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg">
                  Bestsellers
                </a>
                <a href="#collections" className="text-[#2E4B30] hover:bg-[#2E4B30]/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg">
                  Collections
                </a>
                <a href="#about" className="text-[#2E4B30] hover:bg-[#2E4B30]/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg">
                  About
                </a>
                <button className="flex items-center space-x-2 bg-[#2E4B30] text-[#F5EFE1] px-5 py-3 rounded-xl hover:bg-[#2E4B30]/90 transition-all duration-200 font-medium w-fit shadow-md">
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