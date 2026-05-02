import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import {
  PREVENTA_1_CLP,
  PREVENTA_2_CLP,
  PREVENTA_1_CUPO_DIARIO,
  computePreventaSplit,
} from '@/lib/pricing'
import { getPv1UnitsSoldToday } from '@/lib/pv1-sold-today'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cantidadParam = request.nextUrl.searchParams.get('cantidad')
  const cantidad = Math.min(999, Math.max(1, Number(cantidadParam) || 1))

  const supabase = getSupabase()
  const vendidasHoyPv1 = await getPv1UnitsSoldToday(supabase)
  const split = computePreventaSplit(cantidad, vendidasHoyPv1)

  return NextResponse.json({
    preventa1: {
      precio: PREVENTA_1_CLP,
      cupoDiario: PREVENTA_1_CUPO_DIARIO,
      vendidasHoy: vendidasHoyPv1,
      restantesHoy: split.cuposPv1Disponibles,
    },
    preventa2: {
      precio: PREVENTA_2_CLP,
    },
    pedido: {
      cantidad,
      unidadesPreventa1: split.unidadesPv1,
      unidadesPreventa2: split.unidadesPv2,
      precioTotal: split.precioTotal,
    },
  })
}
