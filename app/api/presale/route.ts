import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const PRICE_PER_UNIT = 27990

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    cantidad = 1, numeroPedido, nombre, email, telefono,
    rut, direccion, ciudad, comuna, ubicacion,
  } = body

  if (!numeroPedido || !nombre || !email || !rut || !direccion) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const precioTotal = Number(cantidad) * PRICE_PER_UNIT

  const { error } = await getSupabase().from('preorders').insert({
    numero_pedido: numeroPedido,
    nombre,
    email,
    telefono,
    rut,
    direccion,
    ciudad,
    comuna,
    cantidad: Number(cantidad),
    precio_total: precioTotal,
    ubicacion_lat: ubicacion?.lat ?? null,
    ubicacion_lng: ubicacion?.lng ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Error guardando la pre-orden' }, { status: 500 })
  }

  return NextResponse.json({ success: true, numeroPedido, precioTotal }, { status: 201 })
}
