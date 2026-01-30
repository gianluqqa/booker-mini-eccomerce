"use client";

import React, { useState } from 'react';
import { Quote, Star, User, BookOpen } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  book: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  avatar?: string;
}

const Testimonials = () => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'lectores' | 'criticos'>('todos');

  // Datos de ejemplo con reseñas profundas y humanas
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "María Elena Fernández",
      role: "Lectora habitual",
      book: "La memoria del agua",
      author: "Sofía Ríos",
      content: "Hay libros que lees, y libros que te leen. Este último me transformó. Pasé las noches en vela no por la trama, sino porque cada página me obligaba a mirar mi propia vida de otra manera. Ríos escribe con la precisión de un cirujano y el alma de un poeta.",
      rating: 5,
      date: "Hace 3 días"
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      role: "Crítico literario",
      book: "Los ecos del silencio",
      author: "Javier Torres",
      content: "Torres logra lo que pocos autores contemporáneos: hacer del silencio un personaje protagonista. Su prosa no describe, evoca. No te cuenta una historia, te sumerge en una atmósfera que permanece días después de cerrar el libro. Una obra maestra de la narrativa sutil.",
      rating: 5,
      date: "Hace 1 semana"
    },
    {
      id: 3,
      name: "Ana Patricia Morales",
      role: "Psicóloga clínica",
      book: "Fragmentos de luz",
      author: "Carmen Valdés",
      content: "Como profesional de la salud mental, encuentro fascinante cómo Valdés explora la resiliencia sin caer en el cliché. Sus personajes no superan sus traumas, aprenden a convivir con ellos. Es una lección de vida disfrazada de novela. Lo recomiendo a mis pacientes.",
      rating: 5,
      date: "Hace 2 semanas"
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Profesor de literatura",
      book: "El último verano",
      author: "Diego Herrera",
      content: "Herrera recupera la tradición del Bildungsroman pero la actualiza con una sensibilidad contemporánea. Su exploración de la memoria y la identidad me recuerda a Proust, pero con la urgencia del siglo XXI. Es el tipo de libro que enseña a leer de otra manera.",
      rating: 5,
      date: "Hace 1 mes"
    },
    {
      id: 5,
      name: "Lucía Gutiérrez",
      role: "Editora independiente",
      book: "Cartas a nadie",
      author: "Marisol Paredes",
      content: "Paredes escribe con una honestidad que duele. Sus cartas son como conversaciones íntimas que no deberías escuchar pero no puedes dejar de leer. Hay una belleza terrible en su vulnerabilidad. Este libro cambiará tu forma de entender la correspondencia humana.",
      rating: 5,
      date: "Hace 1 mes"
    },
    {
      id: 6,
      name: "Felipe Navarro",
      role: "Arquitecto",
      book: "Espacios vacíos",
      author: "Gabriel Ortiz",
      content: "Como arquitecto, admiro cómo Ortiz construye espacios emocionales con palabras. Cada descripción de un lugar es también una descripción de un estado del alma. Los vacíos de sus personajes son tan reveladores como sus presencias. Una lección sobre cómo el silencio arquitectónico puede ser elocuente.",
      rating: 5,
      date: "Hace 2 meses"
    }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'criticos') return testimonial.role.includes('Crítico') || testimonial.role.includes('Profesor') || testimonial.role.includes('Editora');
    if (activeFilter === 'lectores') return !testimonial.role.includes('Crítico') && !testimonial.role.includes('Profesor') && !testimonial.role.includes('Editora');
    return true;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-[#2e4b30] fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 px-4 bg-[#f5efe1]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-[#2e4b30]/20 rounded-full mb-6">
            <Quote className="w-4 h-4 text-[#2e4b30]" />
            <span className="text-[#2e4b30] text-sm font-medium tracking-wide">
              Voces de nuestros lectores
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#2e4b30] mb-4">
            Lo que dicen nuestros libros
          </h2>
          
          <p className="text-[#2e4b30]/70 max-w-2xl mx-auto text-sm leading-relaxed">
            Cada reseña es un diálogo entre un lector y una obra. 
            Aquí compartimos algunas de esas conversaciones que enriquecen 
            nuestra comunidad literaria.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-sm border border-[#2e4b30]/10 p-1">
            <button
              onClick={() => setActiveFilter('todos')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'todos'
                  ? 'bg-[#2e4b30] text-[#f5efe1]'
                  : 'text-[#2e4b30] hover:text-[#2e4b30]/80'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('lectores')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'lectores'
                  ? 'bg-[#2e4b30] text-[#f5efe1]'
                  : 'text-[#2e4b30] hover:text-[#2e4b30]/80'
              }`}
            >
              Lectores
            </button>
            <button
              onClick={() => setActiveFilter('criticos')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'criticos'
                  ? 'bg-[#2e4b30] text-[#f5efe1]'
                  : 'text-[#2e4b30] hover:text-[#2e4b30]/80'
              }`}
            >
              Críticos
            </button>
          </div>
        </div>

        {/* Grid de Testimonios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Header del testimonio */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2e4b30]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#2e4b30]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2e4b30] text-sm">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-[#2e4b30]/60">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#2e4b30]/40">
                  {testimonial.date}
                </span>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Contenido */}
              <blockquote className="text-[#2e4b30]/80 text-sm leading-relaxed mb-4 italic">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Info del libro */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#2e4b30]/10">
                <BookOpen className="w-4 h-4 text-[#2e4b30]/50" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#2e4b30]">
                    {testimonial.book}
                  </p>
                  <p className="text-xs text-[#2e4b30]/60">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de invitación */}
        <div className="text-center bg-white rounded-2xl p-8 border border-[#2e4b30]/10 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-[#2e4b30] mb-3">
              Tu voz también importa
            </h3>
            <p className="text-[#2e4b30]/70 text-sm mb-6 leading-relaxed">
              Cada lectura es única y cada perspectiva enriquece la experiencia colectiva. 
              Comparte tu encuentro con nuestros libros y únete a esta conversación 
              que trasciende las páginas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-[#2e4b30] text-[#f5efe1] rounded-lg hover:bg-[#2e4b30]/90 transition-colors text-sm font-medium">
                Escribir una reseña
              </button>
              <button className="px-6 py-3 bg-[#f5efe1] text-[#2e4b30] border border-[#2e4b30] rounded-lg hover:bg-white transition-colors text-sm font-medium">
                Leer más voces
              </button>
            </div>
          </div>
        </div>

        {/* Nota editorial */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#2e4b30]/50 italic max-w-3xl mx-auto">
            Las reseñas reflejan experiencias personales de lectura. 
            Creemos en el diálogo honesto entre lectores, autores y libros, 
            porque cada interpretación legítima enriquece la obra y la comunidad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;