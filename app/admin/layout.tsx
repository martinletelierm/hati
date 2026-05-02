import type { Metadata, Viewport } from 'next'

/** Vista de escritorio / navegador: permite zoom y evita sensación de webapp a pantalla completa. */
export const metadata: Metadata = {
  title: 'HATI · Admin — Pedidos',
  description: 'Panel interno de pedidos de preventa HATI.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'auto',
  themeColor: '#f9fafb',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
