import PreSaleForm from '@/components/PreSaleForm'

export default function Home() {
  return (
    <main className="bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <span className="text-2xl font-bold tracking-wider text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          hati
        </span>
        <a
          href="#presale"
          className="bg-forest text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-forest-mid transition-colors"
        >
          Reservar ahora
        </a>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-forest">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/images/components.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/40 to-forest/90" />

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <h1
            className="text-8xl md:text-[160px] font-bold text-white leading-none tracking-tight fade-up"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            hati
          </h1>
          <p className="text-white/80 text-xl md:text-2xl mt-6 fade-up-delay">
            Cuida la selva. Construye el balance. No lo dejes caer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 fade-up-delay-2">
            <a
              href="#presale"
              className="bg-orange text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-orange/80 transition-colors"
            >
              Pre-orden — desde $27.990
            </a>
            <a
              href="#juego"
              className="border border-white/60 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors"
            >
              Ver el juego
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">Descubre</span>
          <div className="w-0.5 h-10 bg-white/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/80 animate-bounce" />
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="bg-cream py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>2–6</div>
              <div className="text-sm text-gray-500 mt-1">jugadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>+5</div>
              <div className="text-sm text-gray-500 mt-1">años</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>45</div>
              <div className="text-sm text-gray-500 mt-1">minutos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>1</div>
              <div className="text-sm text-gray-500 mt-1">ganador</div>
            </div>
          </div>
        </div>
      </section>

      {/* GAME SECTION */}
      <section id="juego" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-forest mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                El juego de la selva en equilibrio
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                En HATI, los guardianes de la selva necesitan tu ayuda. Apila los animales
                sobre los discos y cuida que la torre no se derrumbe. El turno cambia con
                la arena del tiempo — ¡actúa rápido!
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-forest font-bold mt-0.5">→</span>
                  Piezas únicas de animales de la selva
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-forest font-bold mt-0.5">→</span>
                  Discos espejados que forman la torre
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-forest font-bold mt-0.5">→</span>
                  Cartas de misión con desafíos especiales
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-forest font-bold mt-0.5">→</span>
                  Temporizador de arena incluido
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/images/tower.jpg"
                alt="Torre de animales HATI"
                className="w-full rounded-2xl shadow-2xl"
                style={{ maxHeight: '600px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="py-12 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2">
              <img
                src="/images/full.jpg"
                alt="HATI juego completo"
                className="w-full h-full object-cover rounded-2xl"
                style={{ minHeight: '300px', maxHeight: '500px' }}
              />
            </div>
            <div>
              <img
                src="/images/box.jpg"
                alt="Caja HATI"
                className="w-full h-full object-cover rounded-2xl"
                style={{ minHeight: '200px', maxHeight: '245px' }}
              />
            </div>
            <div>
              <img
                src="/images/action.jpg"
                alt="Piezas de HATI en acción"
                className="w-full h-full object-cover rounded-2xl"
                style={{ minHeight: '200px', maxHeight: '245px' }}
              />
            </div>
            <div className="col-span-2">
              <img
                src="/images/components.jpg"
                alt="Componentes de HATI"
                className="w-full object-cover rounded-2xl"
                style={{ height: '245px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-6 bg-forest text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Pre-venta con precio especial
          </h2>
          <p className="text-white/70 mb-12 text-lg">
            Las primeras 20 unidades de cada día tienen precio de lanzamiento.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="text-sm uppercase tracking-widest text-orange mb-2">Precio especial</div>
              <div className="text-5xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>$27.990</div>
              <div className="text-white/60 text-sm mb-4">Primeras 20 unidades por día</div>
              <a href="#presale" className="block bg-orange text-white font-bold py-3 rounded-xl hover:bg-orange/80 transition-colors">
                Reservar a este precio
              </a>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-sm uppercase tracking-widest text-white/50 mb-2">Precio regular</div>
              <div className="text-5xl font-bold text-white/60 mb-1" style={{ fontFamily: 'Georgia, serif' }}>$29.990</div>
              <div className="text-white/40 text-sm mb-4">Unidades restantes</div>
              <div className="block border border-white/20 text-white/50 font-bold py-3 rounded-xl text-center">
                Precio estándar
              </div>
            </div>
          </div>
          <p className="text-white/40 text-sm mt-8">* Envío por pagar, coordinado con cada comprador</p>
        </div>
      </section>

      {/* PRE-SALE FORM */}
      <section id="presale" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-bold text-forest mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Reserva tu HATI
            </h2>
            <p className="text-gray-500 text-lg">
              Completa el formulario y asegura tu copia. Te contactaremos para coordinar el pago y envío.
            </p>
          </div>
          <PreSaleForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-forest text-white/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>hati</span>
          <div className="text-sm text-center">
            Diseñado por Claudia Valenzuela Lowey &amp; Matías Castillo Bustos
          </div>
          <div className="text-sm">© 2024 HATI. Todos los derechos reservados.</div>
        </div>
      </footer>

    </main>
  )
}
