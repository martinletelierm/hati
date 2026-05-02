import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    nombre, email, telefono, rut,
    direccion, ciudad, comuna, cantidad,
    ubicacion, precioTotal, numeroPedido,
  } = body

  if (!nombre || !email || !rut || !direccion) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const { error } = await getSupabase().from('preorders').insert({
    numero_pedido: numeroPedido,
    nombre,
    email,
    telefono,
    rut,
    direccion,
    ciudad,
    comuna,
    cantidad,
    precio_total: precioTotal,
    ubicacion_lat: ubicacion?.lat ?? null,
    ubicacion_lng: ubicacion?.lng ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Error guardando la pre-orden' }, { status: 500 })
  }

  return NextResponse.json({ success: true, numeroPedido }, { status: 201 })
}
