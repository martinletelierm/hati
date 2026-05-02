import PreSaleWizard from '@/components/PreSaleWizard'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">

      {/* HEADER MINIMAL */}
      <header className="bg-forest text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/images/components.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/80 via-forest/60 to-forest" />

        <div className="relative max-w-3xl mx-auto px-6 py-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            hati
          </h1>
          <p className="text-cream-dark text-lg md:text-xl">
            ¡Gracias por sumarte a la pre-venta!
          </p>
          <p className="text-white/60 text-sm mt-2">
            Completa tu compra en 3 simples pasos · 2 minutos
          </p>
        </div>

        {/* Wave separator */}
        <svg className="block w-full -mb-1" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,60 L0,30 Q300,0 600,30 T1200,30 L1200,60 Z" fill="#F8F4EE" />
        </svg>
      </header>

      {/* WIZARD */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <PreSaleWizard />
        </div>
      </section>

      {/* GAME PREVIEW */}
      <section className="px-4 py-12 bg-forest text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Lo que viene a tu casa
          </h2>
          <p className="text-center text-white/70 mb-10">
            Un juego de equilibrio para 2-6 jugadores · +5 años · 45 minutos
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="col-span-2 row-span-2 aspect-square">
              <img src="/images/full.jpg" alt="HATI completo" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="aspect-square">
              <img src="/images/box.jpg" alt="Caja" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="aspect-square">
              <img src="/images/tower.jpg" alt="Torre" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="aspect-square">
              <img src="/images/action.jpg" alt="En acción" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="aspect-square">
              <img src="/images/components.jpg" alt="Componentes" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Stat icon="🌿" value="2–6" label="jugadores" color="bg-forest-light" />
            <Stat icon="🎯" value="+5" label="años" color="bg-orange" />
            <Stat icon="⏱️" value="45" label="minutos" color="bg-magenta" />
            <Stat icon="🐘" value="6" label="animales" color="bg-purple" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-forest text-white/70 py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-sm space-y-2">
          <p className="text-white text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>hati</p>
          <p>Diseñado por Claudia Valenzuela Lowey &amp; Matías Castillo Bustos</p>
          <p className="text-white/40 text-xs">© 2026 HATI · SJS Editorial</p>
        </div>
      </footer>

    </main>
  )
}

function Stat({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{value}</div>
      <div className="text-xs uppercase tracking-wider opacity-90">{label}</div>
    </div>
  )
}
