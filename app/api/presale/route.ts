import { NextRequest, NextResponse } from 'next/server'

interface PreSaleData {
  nombre: string
  email: string
  telefono: string
  rut: string
  direccion: string
  ciudad: string
  comuna: string
  cantidad: number
  ubicacion: { lat: number; lng: number }
  precioTotal: number
  numeroPedido: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PreSaleData = await request.json()

    // Validate required fields
    if (!body.nombre || !body.email || !body.telefono || !body.rut || !body.direccion) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Log to analytics
    // 4. Handle payment if needed

    console.log('Pre-sale submission:', body)

    // Simulate database save
    const savedOrder = {
      ...body,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    }

    // Here you could send a confirmation email
    // await sendConfirmationEmail(body.email, savedOrder)

    return NextResponse.json(
      {
        success: true,
        message: 'Pre-orden confirmada exitosamente',
        numeroPedido: body.numeroPedido,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing pre-sale:', error)
    return NextResponse.json(
      { error: 'Error procesando la pre-orden' },
      { status: 500 }
    )
  }
}
