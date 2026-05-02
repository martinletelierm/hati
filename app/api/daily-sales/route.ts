import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('daily_sales')
    .select('total')
    .single()

  if (error) {
    return NextResponse.json({ total: 0 })
  }

  return NextResponse.json({ total: Number(data?.total ?? 0) })
}
