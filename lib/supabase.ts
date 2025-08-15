import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Listing {
  id: string
  title: string
  description: string
  category: 'product' | 'service' | 'skill'
  price: number
  image_url?: string
  contact_method: string
  user_id: string
  created_at: string
  user?: User
}
