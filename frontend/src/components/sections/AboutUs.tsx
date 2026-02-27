import React from "react";
import { BookOpen, Zap, CheckCircle, Shield, Globe, Layers } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-[#2e4b30] py-32 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f5efe1]/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 border-t border-r border-[#f5efe1]/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* LADO IZQUIERDO: EL MANIFIESTO (Col 7) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-[#f5efe1]/40 uppercase tracking-[0.5em] text-[10px] font-black">
                <div className="h-[1px] w-12 bg-[#2e4b30]/30 lg:bg-[#f5efe1]/20"></div>
                <span>Nuestra Identidad</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-black text-[#f5efe1] uppercase tracking-tighter leading-[0.8] mb-8">
                ¿Qué es <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5efe1] to-[#f5efe1]/30">Booker?</span>
              </h2>

              <div className="max-w-xl">
                <p className="text-[#f5efe1] text-xl md:text-2xl font-medium leading-tight mb-8 italic border-l-4 border-[#f5efe1] pl-6 py-2">
                  No somos solo una tienda; somos el puente entre las grandes mentes y los buscadores de conocimiento.
                </p>
                <p className="text-[#f5efe1]/70 text-sm md:text-base leading-relaxed font-light">
                  En Booker, entendemos que cada libro es un objeto de culto. Desde 2020, nos hemos dedicado a la curaduría de piezas literarias únicas, transformando la lectura en una experiencia sensorial y estética. Creemos en la permanencia del objeto físico en un mundo efímero.
                </p>
              </div>
            </div>

            {/* Métrica de Impacto */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
              <div className="relative group">
                <span className="absolute -top-8 -left-4 text-6xl font-black text-[#f5efe1]/5 group-hover:text-[#f5efe1]/10 transition-colors">01</span>
                <p className="text-4xl font-black text-[#f5efe1] tracking-tighter mb-1">5k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#f5efe1]/40">Almas Conectadas</p>
              </div>
              <div className="relative group">
                <span className="absolute -top-8 -left-4 text-6xl font-black text-[#f5efe1]/5 group-hover:text-[#f5efe1]/10 transition-colors">02</span>
                <p className="text-4xl font-black text-[#f5efe1] tracking-tighter mb-1">20+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#f5efe1]/40">Joyas Curadas</p>
              </div>
              <div className="relative group hidden md:block">
                <span className="absolute -top-8 -left-4 text-6xl font-black text-[#f5efe1]/5 group-hover:text-[#f5efe1]/10 transition-colors">03</span>
                <p className="text-4xl font-black text-[#f5efe1] tracking-tighter mb-1">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#f5efe1]/40">Compromiso Estético</p>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: PILARES (Col 5) */}
          <div className="lg:col-span-5 grid gap-4">
            <div className="group bg-[#1a3a1c] p-8 border border-[#f5efe1]/10 hover:border-[#f5efe1]/30 transition-all duration-500 hover:-translate-y-1 shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#f5efe1] text-[#2e4b30]">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-[#f5efe1] uppercase tracking-tighter">Alcance Global</h3>
                  <p className="text-sm text-[#f5efe1]/60 leading-snug">
                    Llevamos la cultura sin fronteras, conectando autores de todo el mundo con lectores en cada rincón.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-[#1a3a1c] p-8 border border-[#f5efe1]/10 hover:border-[#f5efe1]/30 transition-all duration-500 hover:-translate-y-1 shadow-2xl lg:translate-x-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#f5efe1] text-[#2e4b30]">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-[#f5efe1] uppercase tracking-tighter">Curaduría de Capas</h3>
                  <p className="text-sm text-[#f5efe1]/60 leading-snug">
                    Cada título pasa por un proceso de selección riguroso que evalúa contenido, diseño y relevancia.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-[#1a3a1c] p-8 border border-[#f5efe1]/10 hover:border-[#f5efe1]/30 transition-all duration-500 hover:-translate-y-1 shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#f5efe1] text-[#2e4b30]">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-[#f5efe1] uppercase tracking-tighter">Legado Protegido</h3>
                  <p className="text-sm text-[#f5efe1]/60 leading-snug">
                    Garantizamos que cada obra llegue a tus manos en perfecto estado, respetando la integridad del libro.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
