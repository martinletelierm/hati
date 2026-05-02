# HATI Landing Page

Landing page de pre-venta para el juego de mesa HATI.

## Características

- ✨ Showcase del producto con imágenes
- 📋 Formulario de pre-venta con validación completa
- 🗺️ Integración de Google Maps para confirmar ubicación
- 💰 Sistema de precios dinámico (primeras 20 unidades/día a precio especial)
- 📱 Responsive design
- 🎨 Diseño moderno con Tailwind CSS

## Requisitos Previos

- Node.js 16+ 
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone <repo-url>
cd hati
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Necesitarás una API key de Google Maps. Obtén una en:
https://console.cloud.google.com/

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
hati/
├── app/
│   ├── api/
│   │   └── presale/          # API para procesar pre-órdenes
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página de inicio
│   └── globals.css            # Estilos globales
├── components/
│   ├── PreSaleForm.tsx        # Formulario de pre-venta
│   └── MapComponent.tsx       # Componente de mapa
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Configuración de Precios

Los precios se configuran en `components/PreSaleForm.tsx`:

```typescript
const PRICE_PER_UNIT_EARLY = 27990      // Primeras 20 unidades/día
const PRICE_PER_UNIT_REGULAR = 29990    // Resto de unidades
const DAILY_LIMIT = 20                  // Límite diario
```

## Variables de Entorno

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: API key de Google Maps (requerida)

## Deployment

Para desplegar en producción:

```bash
npm run build
npm start
```

## Próximos Pasos

1. **Agregar imágenes del producto**: Reemplaza los placeholders en `page.tsx`
2. **Configurar base de datos**: Integra una base de datos para almacenar las pre-órdenes
3. **Configurar email**: Implementa envío de confirmación por email
4. **Integrar pasarela de pago**: Si deseas recibir pagos en línea
5. **Analytics**: Agrega Google Analytics u otra herramienta de tracking

## Licencia

© 2024 HATI. Todos los derechos reservados.
