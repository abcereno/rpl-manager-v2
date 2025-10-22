// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Use import.meta.env for Vite projects
/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in environment variables. Make sure they are defined in your .env file and prefixed with VITE_")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)