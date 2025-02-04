
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://lgybzwgwlhhkxggbryyr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxneWJ6d2d3bGhoa3hnZ2JyeXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyOTM2ODAsImV4cCI6MjA1Mzg2OTY4MH0.zQ9CZDnmGmXU2zKlfo3bFJVRAm3a6GQZwqfmdHxzP8s"

console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Anon Key:", supabaseAnonKey ? "Definida" : "No definida")

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variables de entorno de Supabase no definidas")
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

