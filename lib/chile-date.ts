import { endOfDay, startOfDay } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

const TZ = 'America/Santiago'

/** Inicio y fin del día civil actual en Chile (para filtrar pedidos en BD). */
export function getSantiagoDayBounds(now: Date = new Date()): {
  start: Date
  end: Date
} {
  const zoned = toZonedTime(now, TZ)
  const dayStartLocal = startOfDay(zoned)
  const dayEndLocal = endOfDay(zoned)
  return {
    start: fromZonedTime(dayStartLocal, TZ),
    end: fromZonedTime(dayEndLocal, TZ),
  }
}
