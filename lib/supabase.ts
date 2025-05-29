import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Project = {
  id: string
  title: string
  description: string | null
  repo_url: string | null
  stars: number
  estimated_value: number
  status: string
  seller_email: string | null
  created_at: string
  last_commit_date?: string
}
