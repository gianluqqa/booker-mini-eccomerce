"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, ShoppingCart, User, LogOut, Menu, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para hacer scroll suave a una sección
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
  };

  const isHomePage = pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || isMenuOpen
        ? 'bg-[#f5efe1] bg-opacity-95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Botón de Regreso y Logo */}
          <div className="flex items-center">
            {!isHomePage && (
              <button onClick={() => router.back()} className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80 mr-3">
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/booker-new-logo.png" alt="Booker Logo" width={32} height={32} className="h-8 w-auto" /> 
              <span className="text-xl font-bold text-[#2e4b30] tracking-tight transition-colors duration-300">Booker</span>
            </Link>
          </div>


          {/* Navegación de Desktop */}
          {isHomePage && (
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('books')} 
                className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80 cursor-pointer"
              >
                Libros
              </button>
              <button 
                onClick={() => scrollToSection('bestsellers')} 
                className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80 cursor-pointer"
              >
                Más Vendidos
              </button>
              <button 
                onClick={() => scrollToSection('collections')} 
                className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80 cursor-pointer"
              >
                Colecciones
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-[#2e4b30] transition-colors duration-300 font-medium text-base hover:opacity-80 cursor-pointer"
              >
                Sobre Nosotros
              </button>
            </div>
          )}

          {/* Barra de Búsqueda */}
          {isHomePage && (
            <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className={`w-full rounded-lg py-1.5 px-4 pr-8 border focus:outline-none focus:ring-1 transition-all duration-200 text-sm ${
                    isScrolled 
                      ? 'bg-white text-[#2e4b30] placeholder-[#2e4b30]/50 border-[#2e4b30]/20 focus:border-[#2e4b30] focus:ring-[#2e4b30]/20' 
                      : 'bg-white text-[#2e4b30] placeholder-[#2e4b30]/50 border-[#2e4b30]/20 focus:border-[#2e4b30] focus:ring-[#2e4b30]/20'
                  }`}
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2e4b30]/60 transition-colors duration-200" />
              </div>
            </div>
          )}

          {/* Iconos del Lado Derecho */}
          <div className="flex items-center space-x-3">
            {/* Carrito */}
            <Link href="/cart" className="relative text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80">
              <ShoppingCart className="w-5 h-5" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2e4b30] text-[#f5efe1] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg transition-colors duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Perfil de Usuario o Login */}
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80">
                  <User className="w-5 h-5" strokeWidth={2} />
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="hidden md:flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#2e4b30]/90 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="hidden md:flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#2e4b30]/90 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm">
                <span>Iniciar Sesión</span>
              </Link>
            )}

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#2e4b30] hover:bg-[#2e4b30]/10 p-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Móvil */}
        {isHomePage && (
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
        )}

        {/* Menú Móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 border-t border-[#2e4b30]/20 pt-3 transition-colors duration-200">
            <div className="flex flex-col space-y-2">
              {isHomePage && (
                <>
                  <button 
                    onClick={() => scrollToSection('books')} 
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80 text-left"
                  >
                    Libros
                  </button>
                  <button 
                    onClick={() => scrollToSection('bestsellers')} 
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80 text-left"
                  >
                    Más Vendidos
                  </button>
                  <button 
                    onClick={() => scrollToSection('collections')} 
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80 text-left"
                  >
                    Colecciones
                  </button>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-lg text-base hover:opacity-80 text-left"
                  >
                    Sobre Nosotros
                  </button>
                </>
              )}
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    logout();
                    router.push('/');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#2e4b30]/90 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium w-fit shadow-md text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <Link 
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center bg-[#2e4b30] text-[#f5efe1] hover:bg-[#2e4b30]/90 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium w-fit shadow-md text-sm"
                >
                  <span>Iniciar Sesión</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar
