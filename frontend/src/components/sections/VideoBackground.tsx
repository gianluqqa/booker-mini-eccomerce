import React, { useEffect, useRef } from 'react'

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(error => {
        console.log('Error al reproducir video automáticamente:', error)
      })
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden pt-20">
      {/* Video de fondo */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/videos/video-introduccion-booker.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-booker-green-dark/70" />
      </div>

      {/* Contenido del Hero */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Badge de bienvenida */}
            <div className="inline-flex items-center rounded-full border border-booker-beige/30 bg-booker-green/20 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-medium text-booker-beige">
                Bienvenidos a Booker
              </span>
            </div>

            {/* Título principal */}
            <h1 className="font-specialgothic text-4xl font-bold text-booker-beige sm:text-5xl md:text-6xl lg:text-7xl">
              Transforma tu mente,
              <br />
              <span className="text-booker-green-light">un libro a la vez</span>
            </h1>

            {/* Subtítulo */}
            <p className="mx-auto max-w-2xl text-lg text-booker-beige/90 sm:text-xl">
              Sumérgete en historias que desafían límites y conocimientos que expanden horizontes. 
              Tu próxima gran revelación está entre estas páginas.
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button className="bg-[#2e4b30] text-[#f5efe1] px-8 py-3 rounded-lg hover:bg-[#1a3a1c] transition-all duration-200 font-medium">
                Explorar Catálogo
              </button>
              
              <button className="bg-[#f5efe1] text-[#2e4b30] px-8 py-3 rounded-lg hover:bg-[#2e4b30]/10 transition-all duration-200 font-medium">
                Ver Novedades
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gradiente inferior para suavizar transición */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-booker-green to-transparent" />
    </section>
  )
}

export default VideoBackground