import PreSaleWizard from '@/components/PreSaleWizard'
import GameImage from '@/components/GameImage'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#F7F6F2' }}>

      {/* HEADER */}
      <header className="bg-forest text-white">
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>hati</h1>
          <span className="text-white/50 text-sm">Pre-venta</span>
        </div>
      </header>

      {/* HERO IMAGE */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-52 md:h-72 rounded-b-3xl overflow-hidden -mt-1">
          <GameImage
            src="/images/DSCF9477.png"
            alt="HATI juego de mesa"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WIZARD */}
      <section className="max-w-2xl mx-auto px-6 py-10">
        <PreSaleWizard />
      </section>

      {/* GAME GALLERY */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5 text-center">
          Lo que viene a tu casa
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2 aspect-[4/3] row-span-2">
            <GameImage src="/images/DSCF9550.png" alt="HATI completo" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <GameImage src="/images/DSCF9379.png" alt="Caja" className="w-full aspect-square object-cover rounded-2xl" />
          <GameImage src="/images/DSCF9497.png" alt="Torre" className="w-full aspect-square object-cover rounded-2xl" />
          <GameImage src="/images/DSCF9538.png" alt="Acción" className="w-full aspect-square object-cover rounded-2xl" />
          <div className="bg-forest rounded-2xl aspect-square flex flex-col items-center justify-center text-white p-4 text-center">
            <span className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>2–6</span>
            <span className="text-xs text-white/60 mt-1">jugadores</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[['45', 'minutos'], ['+5', 'años'], ['6', 'animales']].map(([val, label]) => (
            <div key={label} className="bg-white rounded-xl py-4 border border-gray-100">
              <div className="text-xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>{val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-8 px-6 text-center">
        <p className="text-sm font-bold text-forest mb-1" style={{ fontFamily: 'Georgia, serif' }}>hati</p>
        <p className="text-xs text-gray-400">Claudia Valenzuela Lowey &amp; Matías Castillo Bustos · SJS Editorial</p>
      </footer>

    </main>
  )
}
