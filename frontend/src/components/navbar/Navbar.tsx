"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#f5efe1] bg-opacity-95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image src="/booker-new-logo.png" alt="Booker Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-bold text-[#2e4b30] tracking-tight transition-colors duration-300">Booker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#books" className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80">
              Books
            </a>
            <a href="#bestsellers" className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80">
              Bestsellers
            </a>
            <a href="#collections" className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80">
              Collections
            </a>
            <a href="#about" className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80">
              About
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full rounded-lg py-1.5 px-4 pr-8 border focus:outline-none focus:ring-1 transition-all duration-200 text-sm ${
                  isScrolled 
                    ? 'bg-white text-[#2e4b30] placeholder-[#2e4b30]/50 border-[#2e4b30]/20 focus:border-[#2e4b30] focus:ring-[#2e4b30]/20' 
                    : 'bg-white text-[#2e4b30] placeholder-[#2e4b30]/50 border-[#2e4b30]/20 focus:border-[#2e4b30] focus:ring-[#2e4b30]/20'
                }`}
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2e4b30]/60 transition-colors duration-200" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button className="relative text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80">
              <ShoppingCart className="w-5 h-5" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2e4b30] text-[#f5efe1] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg transition-colors duration-200">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <button className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80">
              <User className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Logout */}
            <button className="hidden md:flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#2e4b30]/90 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
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
              className="w-full bg-white text-[#2e4b30] placeholder-[#2e4b30]/50 rounded-lg py-1.5 px-4 pr-8 border border-[#2e4b30]/20 focus:outline-none focus:border-[#2e4b30] focus:ring-1 focus:ring-[#2e4b30]/20 transition-all duration-200 text-sm"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2e4b30]/60 transition-colors duration-200" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 border-t border-[#2e4b30]/20 pt-3 transition-colors duration-200">
            <div className="flex flex-col space-y-2">
              <a href="#books" className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80">
                Books
              </a>
              <a href="#bestsellers" className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80">
                Bestsellers
              </a>
              <a href="#collections" className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80">
                Collections
              </a>
              <a href="#about" className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80">
                About
              </a>
              <button className="flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#2e4b30]/90 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium w-fit shadow-md text-sm">
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
