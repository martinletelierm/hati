import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HATI - Juego de Mesa',
  description: 'Descubre HATI, un juego de mesa único y colorido para toda la familia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
