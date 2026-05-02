import type { SupabaseClient } from '@supabase/supabase-js'
import { PREVENTA_1_CLP, PREVENTA_2_CLP } from '@/lib/pricing'
import { getSantiagoDayBounds } from '@/lib/chile-date'

/**
 * Suma unidades vendidas hoy a precio Pre Venta 1 (cupo diario).
 * Usa `unidades_preventa_1` si existe en la fila; si no, heurística legacy.
 */
export async function getPv1UnitsSoldToday(
  supabase: SupabaseClient,
): Promise<number> {
  const { start, end } = getSantiagoDayBounds()

  const { data, error } = await supabase
    .from('preorders')
    .select('cantidad, precio_total, unidades_preventa_1')
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  if (error) {
    console.error('[pv1-sold-today]', error)
    return 0
  }

  let sum = 0
  for (const row of data ?? []) {
    const raw = row as {
      cantidad: number
      precio_total: number
      unidades_preventa_1?: number | null
    }
    const u1col = raw.unidades_preventa_1
    if (typeof u1col === 'number' && !Number.isNaN(u1col)) {
      sum += u1col
      continue
    }
    const c = Number(raw.cantidad) || 0
    const pt = Number(raw.precio_total) || 0
    if (c <= 0) continue
    if (pt === c * PREVENTA_2_CLP) continue
    if (pt === c * PREVENTA_1_CLP) sum += c
  }

  return sum
}
