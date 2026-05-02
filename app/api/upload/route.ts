import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await getSupabase()
    .storage
    .from('comprobantes')
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error('Storage upload error:', error)
    return NextResponse.json({ error: 'Error subiendo archivo' }, { status: 500 })
  }

  const { data } = getSupabase().storage.from('comprobantes').getPublicUrl(filename)

  return NextResponse.json({ url: data.publicUrl })
}
