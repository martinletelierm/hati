import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const auth = req.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD ?? 'hati2026'

  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic') {
      const decoded = Buffer.from(encoded, 'base64').toString()
      const [, pass] = decoded.split(':')
      if (pass === password) return NextResponse.next()
    }
  }

  return new NextResponse('Acceso no autorizado', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="HATI Admin"' },
  })
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
