import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const PRICE_PER_UNIT = 27990

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    cantidad = 1, numeroPedido, nombre, email, telefono, rut,
    direccion, departamento, comuna, ciudad, region,
  } = body

  if (!numeroPedido || !nombre || !email || !rut || !direccion) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const { error } = await getSupabase().from('preorders').insert({
    numero_pedido: numeroPedido,
    nombre, email, telefono, rut,
    direccion,
    departamento: departamento || null,
    comuna, ciudad, region,
    cantidad: Number(cantidad),
    precio_total: Number(cantidad) * PRICE_PER_UNIT,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Error guardando la pre-orden' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
