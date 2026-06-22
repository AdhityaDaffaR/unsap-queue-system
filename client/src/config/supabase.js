import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL atau Anon Key belum disetel di .env client!");
}

// Client ini hanya digunakan untuk mendengarkan WebSockets (Realtime) & Broadcast
export const supabase = createClient(supabaseUrl, supabaseAnonKey);