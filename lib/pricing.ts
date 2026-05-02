/** Precios preventa (CLP). */
export const PREVENTA_1_CLP = 27_990
export const PREVENTA_2_CLP = 29_990

/** Cupo diario de unidades a precio Pre Venta 1 (por día, hora Chile). */
export const PREVENTA_1_CUPO_DIARIO = 20

export type PreventaSplit = {
  unidadesPv1: number
  unidadesPv2: number
  precioTotal: number
  /** Cupos PV1 disponibles antes de este pedido (mismo día). */
  cuposPv1Disponibles: number
  /** Unidades ya vendidas hoy a PV1 (antes de este pedido). */
  vendidasHoyPv1: number
}

/**
 * Reparte unidades entre Pre Venta 1 y Pre Venta 2 según cupo diario ya consumido.
 */
export function computePreventaSplit(
  cantidad: number,
  vendidasHoyPv1: number,
): PreventaSplit {
  const c = Math.min(999, Math.max(1, Math.floor(cantidad)))
  const vendidas = Math.max(0, Math.floor(vendidasHoyPv1))
  const cuposPv1Disponibles = Math.max(0, PREVENTA_1_CUPO_DIARIO - vendidas)
  const unidadesPv1 = Math.min(c, cuposPv1Disponibles)
  const unidadesPv2 = c - unidadesPv1
  const precioTotal =
    unidadesPv1 * PREVENTA_1_CLP + unidadesPv2 * PREVENTA_2_CLP

  return {
    unidadesPv1,
    unidadesPv2,
    precioTotal,
    cuposPv1Disponibles,
    vendidasHoyPv1: vendidas,
  }
}
