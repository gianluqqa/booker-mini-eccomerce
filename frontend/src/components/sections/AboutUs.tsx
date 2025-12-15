import React from "react";
import { BookOpen, Zap, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-[#2e4b30] min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 relative text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1.5 bg-[#f5efe1] bg-opacity-10 rounded-full mb-4">
              <span className="text-[#2e4b30] text-[11px] font-medium tracking-wide">
                SOBRE NOSOTROS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5efe1] mb-4 leading-tight">
              Bienvenido a Booker
            </h2>

            <p className="text-[#f5efe1] text-sm sm:text-base mb-4 leading-relaxed opacity-90">
              Tu destino premium para descubrir libros extraordinarios desde
              2020.
            </p>

            <p className="text-[#f5efe1] text-xs sm:text-sm mb-6 leading-relaxed opacity-80">
              Conectamos lectores con colecciones cuidadosamente seleccionadas que abarcan
              todos los géneros. Desde clásicos atemporales hasta bestsellers modernos, nuestra
              misión es hacer que la literatura de calidad sea accesible para todos.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-[#f5efe1] bg-opacity-10 backdrop-blur-sm px-6 py-4 rounded-lg flex-1 min-w-[140px]">
                <div className="text-2xl font-bold text-[#2e4b30] mb-1">
                  20+
                </div>
                <div className="text-[#2e4b30] text-xs opacity-80">
                  Libros Disponibles
                </div>
              </div>
              <div className="bg-[#f5efe1] bg-opacity-10 backdrop-blur-sm px-6 py-4 rounded-lg flex-1 min-w-[140px]">
                <div className="text-2xl font-bold text-[#2e4b30] mb-1">
                  24/7
                </div>
                <div className="text-[#2e4b30] text-xs opacity-80">
                  Soporte al Cliente
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 p-6 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5efe1] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#2e4b30]" />
              </div>
              <h3 className="text-base font-semibold text-[#2e4b30] mb-1.5">
                Amplia Selección
              </h3>
              <p className="text-[#2e4b30] opacity-80 text-xs leading-relaxed">
                Descubre miles de títulos en todos los géneros y categorías
              </p>
            </div>

            <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 p-6 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5efe1] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#2e4b30]" />
              </div>
              <h3 className="text-base font-semibold text-[#2e4b30] mb-1.5">
                Entrega Rápida
              </h3>
              <p className="text-[#2e4b30] opacity-80 text-xs leading-relaxed">
                Envío rápido y seguro para llevar los libros directamente a tu puerta
              </p>
            </div>

            <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 p-6 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5efe1] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-[#2e4b30]" />
              </div>
              <h3 className="text-base font-semibold text-[#2e4b30] mb-1.5">
                Calidad Garantizada
              </h3>
              <p className="text-[#2e4b30] opacity-80 text-xs leading-relaxed">
                Cada libro cuidadosamente seleccionado y verificado para tu satisfacción
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
