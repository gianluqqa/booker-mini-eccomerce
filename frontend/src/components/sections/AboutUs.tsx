import { BookOpen, Zap, CheckCircle, Shield, Globe, Layers, Users, Sparkles } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-[#2e4b30] py-32 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* LADO IZQUIERDO: EL MANIFIESTO (Col 7) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-10 border-l-4 border-[#f5efe1]/20 pl-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#f5efe1]/20"></div>
                <span className="text-[#f5efe1]/40 text-xs font-black uppercase tracking-[0.5em]">Nuestra Identidad</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-black text-[#f5efe1] uppercase tracking-tighter leading-[0.8] mb-8">
                ¿Qué es <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5efe1] to-[#f5efe1]/30">Booker?</span>
              </h2>

              <div className="max-w-xl">
                <p className="text-[#f5efe1] text-xl md:text-2xl font-medium leading-tight mb-8 border-l-2 border-[#f5efe1]/10 pl-6 py-2">
                  No somos solo una tienda; somos el puente entre las grandes mentes y los buscadores de conocimiento.
                </p>
                <p className="text-[#f5efe1]/70 text-sm md:text-base leading-relaxed font-light">
                  En Booker, entendemos que cada libro es un objeto de culto. Desde 2020, nos hemos dedicado a la curaduría de piezas literarias únicas, transformando la lectura en una experiencia sensorial y estética. Creemos en la permanencia del objeto físico en un mundo efímero.
                </p>
              </div>
            </div>

            {/* Métrica de Impacto - Cuadros Beige con Texto Verde */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#f5efe1]/10 border border-[#f5efe1]/10 mt-20 max-w-3xl">
              <div className="bg-[#f5efe1] p-10 flex flex-col items-center justify-center text-center">
                <p className="text-5xl font-black text-[#2e4b30] tracking-tighter mb-2">5k+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2e4b30]/60 leading-tight">Almas <br/> Conectadas</p>
              </div>
              <div className="bg-[#f5efe1] p-10 flex flex-col items-center justify-center text-center">
                <p className="text-5xl font-black text-[#2e4b30] tracking-tighter mb-2">20+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2e4b30]/60 leading-tight">Joyas <br/> Curadas</p>
              </div>
              <div className="bg-[#f5efe1] p-10 flex flex-col items-center justify-center text-center">
                <p className="text-5xl font-black text-[#2e4b30] tracking-tighter mb-2">100%</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2e4b30]/60 leading-tight">Compromiso <br/> Estético</p>
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
