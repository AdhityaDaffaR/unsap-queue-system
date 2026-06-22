import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// PENTING: Gunakan Service Role Key agar bisa bypass tabel yang tanpa RLS Policy
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL atau Service Role Key belum disetel di .env');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);