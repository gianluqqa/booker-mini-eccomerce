import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return ((
        <footer className="bg-[#2E4B30] text-[#F5EFE1] text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Contenido Principal del Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Sección de la Marca */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#F5EFE1] p-1.5 rounded-sm">
                    <Image src="/booker-new-logo.png" alt="Booker Logo" width={20} height={20} className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-[#F5EFE1]">Booker</span>
                </div>
                <p className="text-[#F5EFE1]/80 text-sm leading-relaxed">
                  Tu destino definitivo para descubrir y coleccionar libros. Desde clásicos atemporales hasta bestsellers modernos.
                </p>
                <div className="flex space-x-3 pt-2">
                  <button className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-sm transition-all duration-200 cursor-pointer">
                    <Facebook className="w-5 h-5 text-[#F5EFE1]" />
                  </button>
                  <button className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-sm transition-all duration-200 cursor-pointer">
                    <Instagram className="w-5 h-5 text-[#F5EFE1]" />
                  </button>
                  <button className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-sm transition-all duration-200 cursor-pointer">
                    <Twitter className="w-5 h-5 text-[#F5EFE1]" />
                  </button>
                  <button className="bg-[#F5EFE1]/10 hover:bg-[#F5EFE1]/20 p-2 rounded-sm transition-all duration-200 cursor-pointer">
                    <Youtube className="w-5 h-5 text-[#F5EFE1]" />
                  </button>
                </div>
              </div>
    
              {/* Enlaces Rápidos */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-3">
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Todos los Libros
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Más Vendidos
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Nuevos Lanzamientos
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Ofertas Especiales
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Tarjetas de Regalo
                    </button>
                  </li>
                </ul>
              </div>
    
              {/* Servicio al Cliente */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Servicio al Cliente</h3>
                <ul className="space-y-3">
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Centro de Ayuda
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Información de Envío
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Devoluciones y Cambios
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Rastrear Pedido
                    </button>
                  </li>
                  <li>
                    <button className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer text-left">
                      Preguntas Frecuentes
                    </button>
                  </li>
                </ul>
              </div>
    
              {/* Información de Contacto */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Contáctanos</h3>
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
    
            {/* Sección de Newsletter */}
            <div className="border-t border-[#F5EFE1]/20 pt-6 pb-6">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-1.5">Suscríbete a Nuestro Boletín</h3>
                <p className="text-[#F5EFE1]/80 text-sm mb-4">Recibe las últimas recomendaciones de libros y ofertas exclusivas</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ingresa tu email"
                    className="flex-1 bg-[#F5EFE1]/10 text-[#F5EFE1] placeholder-[#F5EFE1]/50 rounded-sm py-3 px-4 border border-[#F5EFE1]/20 focus:outline-none focus:border-[#F5EFE1] focus:ring-2 focus:ring-[#F5EFE1]/20 transition-all duration-200"
                  />
                  <button className="bg-[#F5EFE1] text-[#2E4B30] px-6 py-3 rounded-sm hover:bg-white transition-all duration-200 font-medium">
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
    
            {/* Barra Inferior */}
            <div className="border-t border-[#F5EFE1]/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-[#F5EFE1]/60 text-sm">
                  2025 Booker. Todos los derechos reservados.
                </p>
                <div className="flex space-x-6">
                  <button className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer">
                    Política de Privacidad
                  </button>
                  <button className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer">
                    Términos de Servicio
                  </button>
                  <button className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm cursor-pointer">
                    Política de Cookies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
  ));
}

export default Footer