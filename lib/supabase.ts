import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _browserClient: SupabaseClient | null = null
let _serverClient: SupabaseClient | null = null

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL no está configurada')
  return url
}

export function getSupabaseBrowser() {
  if (!_browserClient) {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!key) throw new Error('Falta NEXT_PUBLIC_SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    _browserClient = createClient(getSupabaseUrl(), key)
  }
  return _browserClient
}

export function getSupabaseServer() {
  if (!_serverClient) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!key) {
      throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY (o una key pública como fallback)')
    }
    _serverClient = createClient(getSupabaseUrl(), key)
  }
  return _serverClient
}

// Backward compatibility for existing imports in server routes
export const getSupabase = getSupabaseServer
