import PreSaleForm from '@/components/PreSaleForm'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20 px-4">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">HATI</h1>
              <p className="text-xl text-white/90 mb-8">
                Un juego de mesa único y colorido que conecta naturaleza, estrategia y diversión.
                Diseñado para familias que buscan compartir momentos especiales.
              </p>
              <div className="flex gap-4">
                <a
                  href="#presale"
                  className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-accent/80 transition"
                >
                  Reservar Ahora
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {/* Placeholder for image - users will add actual images */}
                <div className="bg-white/20 rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-white/50">Imagen del juego aquí</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">Qué Incluye HATI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-primary mb-3">Piezas Vibrantes</h3>
              <p className="text-gray-600">
                Fichas coloridas y detalladas que hacen el juego visualmente atractivo para jugadores de todas las edades.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-primary mb-3">Diseño Natural</h3>
              <p className="text-gray-600">
                Inspirado en la flora y fauna, HATI combina un diseño hermoso con mecánicas de juego fascinantes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-primary mb-3">Para Todos</h3>
              <p className="text-gray-600">
                Perfecto para noches de juego en familia. Reglas accesibles pero con profundidad estratégica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">Galería del Producto</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Imagen del juego 1</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Imagen del juego 2</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Imagen del juego 3</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Imagen del juego 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-sale Section */}
      <section id="presale" className="py-20 px-4 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-primary mb-4">Reserva tu HATI</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Sé parte de los primeros en tener HATI. Completa el formulario y asegura tu copia a un precio especial.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <PreSaleForm />
          </div>
        </div>
      </section>

      {/* Pricing Info Banner */}
      <section className="py-12 px-4 bg-primary text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Precio Especial de Pre-Venta</h3>
              <p className="text-white/90">
                Las primeras 20 unidades vendidas cada día tienen un precio especial. No esperes, ¡reserva ahora!
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block bg-white/20 rounded-lg p-6">
                <div className="text-green-300 font-bold mb-2">Primeras 20 unidades/día</div>
                <div className="text-4xl font-bold">$27.990</div>
                <div className="text-white/70 mt-2">Precio especial</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">Preguntas Frecuentes</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">¿Cuándo se envía?</h3>
              <p className="text-gray-600">
                Los envíos se realizarán una vez completado el período de pre-venta. Te notificaremos con los detalles exactos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">¿Incluye envío?</h3>
              <p className="text-gray-600">
                El precio es sin envío. El costo de envío se coordina directamente con cada comprador según su ubicación.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">¿Cuál es el mínimo a comprar?</h3>
              <p className="text-gray-600">
                Puedes reservar desde 1 unidad. No hay mínimo de compra.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">¿Puedo cambiar mi pedido?</h3>
              <p className="text-gray-600">
                Sí, puedes modificar tu pedido mientras el período de pre-venta esté activo. Contáctanos para cambios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-4">
        <div className="container-custom text-center text-white/80">
          <p>&copy; 2024 HATI - Juego de Mesa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
