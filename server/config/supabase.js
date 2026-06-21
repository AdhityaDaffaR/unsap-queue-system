import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Aktifkan pembacaan env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Eksekusi koneksi ke cloud database Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);