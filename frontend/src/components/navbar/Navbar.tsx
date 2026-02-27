"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, ShoppingCart, User, LogOut, Menu, X, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/hooks/useSearch";
import { useSearchResults } from "@/hooks/useSearchResults";
import SearchDropdown from "@/components/navbar/SearchDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount: cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const { searchQuery, updateSearch, clearSearch } = useSearch();

  // Estado para controlar si el buscador está expandido
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Estado para controlar si el dropdown de búsqueda está abierto
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Referencia al contenedor de búsqueda para detectar clicks fuera
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Referencia para guardar el pathname anterior y detectar cambios de ruta
  const prevPathnameRef = useRef<string>(pathname);

  // Hook para obtener resultados de búsqueda en tiempo real
  const { results: searchResults, loading: searchLoading } = useSearchResults(
    searchQuery,
    300, // Debounce de 300ms
    5    // Máximo 5 resultados en el dropdown
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Limpiar el buscador cuando cambia la ruta
  useEffect(() => {
    // Si el pathname cambió (navegamos a otra página)
    if (prevPathnameRef.current !== pathname) {
      // Limpiar el buscador y cerrar el dropdown
      clearSearch();
      setIsSearchDropdownOpen(false);
      // Actualizar la referencia al pathname actual
      prevPathnameRef.current = pathname;
    }
  }, [pathname, clearSearch]);

  // Cerrar el dropdown cuando se hace click fuera del contenedor de búsqueda
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    if (isSearchDropdownOpen) {
      // Usar 'click' en lugar de 'mousedown' para que no interfiera con los Links
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSearchDropdownOpen]);

  // Función para hacer scroll suave a una sección
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false);
  };

  // Función para manejar el cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSearch(value);

    // Abrir el dropdown cuando hay texto en el input
    if (value.trim() !== '') {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  };

  // Función para manejar el submit del formulario de búsqueda
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Solo cerrar el dropdown, no redirigir
    setIsSearchDropdownOpen(false);
  };

  // Función para manejar el focus en el input de búsqueda
  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '') {
      setIsSearchDropdownOpen(true);
    }
  };

  // Función para cerrar el dropdown
  const handleCloseDropdown = () => {
    setIsSearchDropdownOpen(false);
  };

  const isHomePage = pathname === "/";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? "bg-booker-beige/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* SECCIÓN IZQUIERDA: Menú Móvil, Botón Regreso y Navegación Desktop */}
          <div className="flex-1 flex items-center justify-start space-x-3 sm:space-x-5">
            {/* Botón de Menú Móvil (Ahora a la izquierda para un look más moderno) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#2e4b30] hover:bg-[#2e4b30]/10 p-2 rounded-sm transition-all duration-200"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {!isHomePage && (
              <button
                onClick={() => router.back()}
                className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-2 rounded-sm transition-all duration-200 flex items-center"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
            )}

            {isHomePage && (
              <div className="hidden md:flex items-center space-x-6 text-[12px] lg:text-[14px] uppercase tracking-wider font-extrabold">
                <button
                  onClick={() => scrollToSection("books")}
                  className="text-[#2e4b30] hover:text-[#2e4b30]/60 transition-colors duration-300 border-b-2 border-transparent hover:border-[#2e4b30]/20 pb-0.5"
                >
                  Libros
                </button>
                <button
                  onClick={() => scrollToSection("bestsellers")}
                  className="text-[#2e4b30] hover:text-[#2e4b30]/60 transition-colors duration-300 whitespace-nowrap border-b-2 border-transparent hover:border-[#2e4b30]/20 pb-0.5"
                >
                  Más Vendidos
                </button>
                <button
                  onClick={() => scrollToSection("collections")}
                  className="text-[#2e4b30] hover:text-[#2e4b30]/60 transition-colors duration-300 border-b-2 border-transparent hover:border-[#2e4b30]/20 pb-0.5"
                >
                  Colecciones
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-[#2e4b30] hover:text-[#2e4b30]/60 transition-colors duration-300 border-b-2 border-transparent hover:border-[#2e4b30]/20 pb-0.5"
                >
                  Nosotros
                </button>
              </div>
            )}
          </div>

          {/* SECCIÓN CENTRAL: Logo (Centrado absoluto o flex focalizado) */}
          <div className="flex-shrink-0 flex items-center justify-center px-4">
            <Link href="/" className="flex items-center group transition-all duration-500 hover:scale-105">
              <Image
                src="/booker-new-logo.png"
                alt="Booker Logo"
                width={42}
                height={42}
                className="h-10 w-auto drop-shadow-sm group-hover:drop-shadow-md"
              />
            </Link>
          </div>

          {/* SECCIÓN DERECHA: Acciones (Store, Search, Cart, User) */}
          <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
            {/* Botón de Tienda (Ahora en el extremo izquierdo de esta sección) */}
            {!["/store", "/login", "/register"].includes(pathname) && (
              <Link
                href="/store"
                className="hidden lg:flex items-center p-2 rounded-sm text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-300 active:scale-95"
                title="Ir a la Tienda"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 h-6" strokeWidth={2.5} />
              </Link>
            )}

            {/* Buscador Desplegable (Ahora al lado de los iconos) */}
            {isHomePage && (
              <div className="flex items-center">
                <div ref={searchContainerRef} className="relative flex items-center justify-end">
                  <div className={`flex items-center transition-all duration-500 ease-in-out ${isSearchExpanded ? "w-48 sm:w-72 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                      <input
                        type="text"
                        placeholder="BUSCAR..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        autoFocus={isSearchExpanded}
                        className="w-full bg-[#2e4b30]/10 backdrop-blur-md border border-[#2e4b30] rounded-none py-2 px-4 pr-10 focus:outline-none text-[12px] font-bold uppercase tracking-[0.15em] text-[#2e4b30] placeholder-[#2e4b30]/60 shadow-sm"
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2e4b30]"
                      >
                        <Search className="w-4 h-4" strokeWidth={3} />
                      </button>
                    </form>
                  </div>

                  <button
                    onClick={() => {
                      setIsSearchExpanded(!isSearchExpanded);
                      if (!isSearchExpanded) {
                        setTimeout(() => handleSearchFocus(), 100);
                      }
                    }}
                    className={`p-2 text-[#2e4b30] hover:bg-[#2e4b30]/10 rounded-none transition-all duration-300 ${isSearchExpanded ? "bg-[#2e4b30]/10" : ""}`}
                    aria-label="Buscar"
                  >
                    {isSearchExpanded ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Search className="w-5 h-5 sm:w-6 h-6" strokeWidth={2.5} />}
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-72">
                    <SearchDropdown
                      results={searchResults}
                      loading={searchLoading}
                      isOpen={isSearchDropdownOpen && isSearchExpanded}
                      onClose={handleCloseDropdown}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Carrito */}
            {isAuthenticated && pathname !== "/cart" && pathname !== "/checkout" && (
              <Link
                href="/cart"
                className="relative p-2 text-[#2e4b30] hover:opacity-80 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Usuario y Logout */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                <Link
                  href={user?.role === "admin" ? "/admin" : "/profile"}
                  className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-2 rounded-sm transition-all duration-200 flex items-center space-x-1"
                  title="Mi Perfil"
                >
                  <User className="w-5 h-5" strokeWidth={2} />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="hidden md:flex items-center space-x-1.5 text-[#f5efe1] bg-[#2e4b30] hover:bg-red-700 px-3 py-1.5 rounded-sm transition-all duration-300 text-[10px] font-bold uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="hidden lg:inline">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c] px-4 py-2 rounded-sm transition-all duration-300 font-bold text-[11px] uppercase tracking-[0.2em] shadow-md hover:shadow-xl active:scale-95 border-2 border-[#2e4b30]"
              >
                <span>Acceder</span>
              </Link>
            )}
          </div>
        </div>

        {/* Barra de Búsqueda Móvil con Dropdown */}
        {isHomePage && (
          <div className="lg:hidden pb-4 max-w-xs mx-auto">
            <div ref={searchContainerRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Buscar libros..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="w-full bg-booker-beige text-[#2e4b30] placeholder-[#2e4b30]/50 rounded-sm py-1.5 px-4 pr-8 focus:outline-none border border-booker-green/30 focus:border-booker-green focus:ring-2 focus:ring-booker-green/50 transition-all duration-200 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#2e4b30]/60 hover:text-[#2e4b30] transition-colors duration-200"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Dropdown de resultados de búsqueda móvil */}
              <SearchDropdown
                results={searchResults}
                loading={searchLoading}
                isOpen={isSearchDropdownOpen}
                onClose={handleCloseDropdown}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Menú Móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 border-t border-[#2e4b30]/10 pt-3 transition-colors duration-200">
            <div className="flex flex-col space-y-2">
              {!["/store", "/login", "/register"].includes(pathname) && (
                <Link
                  href="/store"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 py-2.5 px-3 rounded-sm text-base font-bold transition-all ${pathname === "/store"
                    ? "bg-[#2e4b30] text-[#f5efe1] shadow-md"
                    : "text-[#2e4b30] hover:bg-[#2e4b30]/10"
                    }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>IR A LA TIENDA</span>
                </Link>
              )}

              {isHomePage && (
                <>
                  <button
                    onClick={() => scrollToSection("books")}
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-sm text-base hover:opacity-80 text-left"
                  >
                    Libros
                  </button>
                  <button
                    onClick={() => scrollToSection("bestsellers")}
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-sm text-base hover:opacity-80 text-left"
                  >
                    Más Vendidos
                  </button>
                  <button
                    onClick={() => scrollToSection("collections")}
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-sm text-base hover:opacity-80 text-left"
                  >
                    Colecciones
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-[#2e4b30] hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium py-2 px-3 rounded-sm text-base hover:opacity-80 text-left"
                  >
                    Sobre Nosotros
                  </button>
                </>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-1.5 bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c] px-3 py-1.5 rounded-sm transition-all duration-200 font-medium w-fit shadow-md text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c] px-3 py-1.5 rounded-sm transition-all duration-200 font-medium w-fit shadow-md text-sm"
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
};

export default Navbar;
