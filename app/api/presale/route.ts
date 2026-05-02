import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const PRICE_EARLY = 27990
const PRICE_REGULAR = 29990
const DAILY_LIMIT = 20

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    numeroPedido, nombre, email, telefono, rut,
    direccion, ciudad, comuna, ubicacion,
  } = body

  if (!numeroPedido || !nombre || !email || !rut || !direccion) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Calcular precio según ventas del día
  const { data: salesData } = await supabase.from('daily_sales').select('total').single()
  const sold = Number(salesData?.total ?? 0)
  const precio = sold < DAILY_LIMIT ? PRICE_EARLY : PRICE_REGULAR

  const { error } = await supabase.from('preorders').insert({
    numero_pedido: numeroPedido,
    nombre,
    email,
    telefono,
    rut,
    direccion,
    ciudad,
    comuna,
    cantidad: 1,
    precio_total: precio,
    ubicacion_lat: ubicacion?.lat ?? null,
    ubicacion_lng: ubicacion?.lng ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Error guardando la pre-orden' }, { status: 500 })
  }

  return NextResponse.json({ success: true, numeroPedido, precio }, { status: 201 })
}
