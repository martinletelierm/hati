import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('daily_sales')
    .select('total')
    .single()

  if (error) {
    return NextResponse.json({ total: 0 })
  }

  return NextResponse.json({ total: Number(data?.total ?? 0) })
}
