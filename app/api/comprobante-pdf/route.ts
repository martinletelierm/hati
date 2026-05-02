import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const dynamic = 'force-dynamic'

const PRICE_PER_UNIT = 27990

const TIPO_LABEL: Record<string, string> = {
  transferencia: 'Transferencia bancaria',
  maquina: 'Pago con máquina',
}

function clampStr(s: unknown, max: number): string {
  if (s == null || typeof s !== 'string') return ''
  const t = s.trim()
  return t.length > max ? `${t.slice(0, max)}…` : t
}

/** Aproximación para Helvetica 11 pt (~495 pt de ancho útil). */
function wrapLine(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length <= maxChars) cur = next
    else {
      if (cur) lines.push(cur)
      cur = w.length > maxChars ? `${w.slice(0, maxChars - 1)}…` : w
    }
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : ['']
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const cantidad = Math.min(999, Math.max(1, Number(body.cantidad) || 1))
  const tipoPago = clampStr(body.tipoPago, 32)
  const numeroPedido = clampStr(body.numeroPedido, 120)
  const numeroBoleta = clampStr(body.numeroBoleta, 120)
  const nombre = clampStr(body.nombre, 200)
  const email = clampStr(body.email, 200)
  const telefono = clampStr(body.telefono, 40)
  const rut = clampStr(body.rut, 20)
  const direccion = clampStr(body.direccion, 300)
  const departamento = clampStr(body.departamento, 120)
  const comuna = clampStr(body.comuna, 120)
  const ciudad = clampStr(body.ciudad, 120)
  const region = clampStr(body.region, 120)
  const comprobanteUrlRaw = body.comprobanteUrl

  const precioTotal = cantidad * PRICE_PER_UNIT
  const refComprobante = numeroPedido || numeroBoleta || '—'
  const tipoLabel = (tipoPago && TIPO_LABEL[tipoPago]) || tipoPago || '—'

  const direccionCompleta = [direccion, departamento, comuna, ciudad, region]
    .filter(Boolean)
    .join(', ')

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 50
  const maxChars = 82

  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const draw = (text: string, size: number, bold = false, color = rgb(0.15, 0.18, 0.16)) => {
    const f = bold ? fontBold : font
    for (const line of wrapLine(text, maxChars)) {
      if (y < margin + 60) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
      }
      page.drawText(line, {
        x: margin,
        y,
        size,
        font: f,
        color,
      })
      y -= size + (size >= 14 ? 6 : 4)
    }
  }

  draw('HATI · Comprobante de compra', 18, true)
  y -= 6
  draw(`Emitido: ${new Date().toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' })}`, 10, false, rgb(0.45, 0.45, 0.45))
  y -= 10

  draw('Datos del pedido', 13, true)
  draw(`Referencia / N° comprobante: ${refComprobante}`, 11)
  draw(`Cantidad: ${cantidad} juego${cantidad > 1 ? 's' : ''}`, 11)
  draw(`Tipo de pago: ${tipoLabel}`, 11)
  if (numeroBoleta && tipoPago === 'maquina') {
    draw(`N° boleta o voucher: ${numeroBoleta}`, 11)
  }
  draw(`Total: $${precioTotal.toLocaleString('es-CL')}`, 11, true)

  y -= 8
  draw('Datos de contacto y envío', 13, true)
  draw(`Nombre: ${nombre || '—'}`, 11)
  draw(`Email: ${email || '—'}`, 11)
  draw(`Teléfono: ${telefono || '—'}`, 11)
  draw(`RUT: ${rut || '—'}`, 11)
  draw(`Envío: ${direccionCompleta || '—'}`, 11)

  y -= 14
  draw(
    'Guarda este archivo como respaldo. Te avisaremos por WhatsApp cuando tu pedido salga en camino.',
    10,
    false,
    rgb(0.35, 0.38, 0.36),
  )

  const comprobanteUrl =
    typeof comprobanteUrlRaw === 'string' && comprobanteUrlRaw.startsWith('http')
      ? comprobanteUrlRaw
      : null

  if (comprobanteUrl) {
    try {
      const res = await fetch(comprobanteUrl, {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: 'application/pdf,image/*,*/*' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const buf = new Uint8Array(await res.arrayBuffer())
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      const lowerUrl = comprobanteUrl.toLowerCase()

      const isPdf = ct.includes('pdf') || lowerUrl.includes('.pdf')
      const isPng = ct.includes('png') || lowerUrl.endsWith('.png')
      const isJpg =
        ct.includes('jpeg') ||
        ct.includes('jpg') ||
        lowerUrl.endsWith('.jpg') ||
        lowerUrl.endsWith('.jpeg')

      if (isPdf && buf.byteLength > 0) {
        const src = await PDFDocument.load(buf)
        const copied = await pdfDoc.copyPages(src, src.getPageIndices())
        copied.forEach((p) => pdfDoc.addPage(p))
      } else if (isPng && buf.byteLength > 0) {
        const img = await pdfDoc.embedPng(buf)
        const imgPage = pdfDoc.addPage([pageWidth, pageHeight])
        const titleY = pageHeight - margin
        imgPage.drawText('Comprobante adjunto (imagen)', {
          x: margin,
          y: titleY,
          size: 13,
          font: fontBold,
          color: rgb(0.15, 0.18, 0.16),
        })
        const usableW = pageWidth - 2 * margin
        const usableH = titleY - margin - 40
        let w = img.width
        let h = img.height
        const scale = Math.min(usableW / w, usableH / h, 1)
        w *= scale
        h *= scale
        imgPage.drawImage(img, {
          x: margin + (usableW - w) / 2,
          y: titleY - 24 - h,
          width: w,
          height: h,
        })
      } else if (isJpg && buf.byteLength > 0) {
        const img = await pdfDoc.embedJpg(buf)
        const imgPage = pdfDoc.addPage([pageWidth, pageHeight])
        const titleY = pageHeight - margin
        imgPage.drawText('Comprobante adjunto (imagen)', {
          x: margin,
          y: titleY,
          size: 13,
          font: fontBold,
          color: rgb(0.15, 0.18, 0.16),
        })
        const usableW = pageWidth - 2 * margin
        const usableH = titleY - margin - 40
        let w = img.width
        let h = img.height
        const scale = Math.min(usableW / w, usableH / h, 1)
        w *= scale
        h *= scale
        imgPage.drawImage(img, {
          x: margin + (usableW - w) / 2,
          y: titleY - 24 - h,
          width: w,
          height: h,
        })
      }
    } catch (e) {
      console.error('[comprobante-pdf] Adjunto omitido:', e)
      const note = pdfDoc.addPage([pageWidth, pageHeight])
      note.drawText(
        'No se pudo incluir el archivo del comprobante en este PDF. Conserva el correo o la captura que subiste.',
        {
          x: margin,
          y: pageHeight - margin,
          size: 11,
          font,
          color: rgb(0.5, 0.35, 0.2),
          maxWidth: pageWidth - 2 * margin,
        },
      )
    }
  }

  const pdfBytes = await pdfDoc.save()
  const safeRef = refComprobante.replace(/[^\w.-]+/g, '_').slice(0, 60)
  const filename = `hati-comprobante-${safeRef}.pdf`

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'no-store',
    },
  })
}
