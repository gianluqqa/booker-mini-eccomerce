import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return ((
        <footer className="bg-[#2E4B30] text-[#F5EFE1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Contenido Principal del Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Sección de la Marca */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#F5EFE1] p-2 rounded-lg">
                    <Image src="/booker-new-logo.png" alt="Booker Logo" width={24} height={24} className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-[#F5EFE1]">Booker</span>
                </div>
                <p className="text-[#F5EFE1]/80 text-sm leading-relaxed">
                  Tu destino definitivo para descubrir y coleccionar libros. Desde clásicos atemporales hasta bestsellers modernos.
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
    
              {/* Enlaces Rápidos */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Todos los Libros
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Más Vendidos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Nuevos Lanzamientos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Ofertas Especiales
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Tarjetas de Regalo
                    </a>
                  </li>
                </ul>
              </div>
    
              {/* Servicio al Cliente */}
              <div>
                <h3 className="text-[#F5EFE1] font-bold text-lg mb-4">Servicio al Cliente</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Centro de Ayuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Información de Envío
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Devoluciones y Cambios
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Rastrear Pedido
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#F5EFE1]/80 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                      Preguntas Frecuentes
                    </a>
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
            <div className="border-t border-[#F5EFE1]/20 pt-8 pb-8">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-[#F5EFE1] font-bold text-xl mb-2">Suscríbete a Nuestro Boletín</h3>
                <p className="text-[#F5EFE1]/80 text-sm mb-4">Recibe las últimas recomendaciones de libros y ofertas exclusivas</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ingresa tu email"
                    className="flex-1 bg-[#F5EFE1]/10 text-[#F5EFE1] placeholder-[#F5EFE1]/50 rounded-lg py-3 px-4 border border-[#F5EFE1]/20 focus:outline-none focus:border-[#F5EFE1] focus:ring-2 focus:ring-[#F5EFE1]/20 transition-all duration-200"
                  />
                  <button className="bg-[#F5EFE1] text-[#2E4B30] px-6 py-3 rounded-lg hover:bg-white transition-all duration-200 font-medium">
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
    
            {/* Barra Inferior */}
            <div className="border-t border-[#F5EFE1]/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-[#F5EFE1]/60 text-sm">
                  © 2025 Booker. Todos los derechos reservados.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                    Política de Privacidad
                  </a>
                  <a href="#" className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                    Términos de Servicio
                  </a>
                  <a href="#" className="text-[#F5EFE1]/60 hover:text-[#F5EFE1] transition-colors duration-200 text-sm">
                    Política de Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
  ));
}

export default Footer