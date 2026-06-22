import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// 1. Membaca konfigurasi environment (.env)
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Urungkan migrasi: URL atau Service Role Key tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * ========================================================
 * DATA MIGRATION V2: HASHING PASSWORD MAHASISWA & STAF
 * ========================================================
 */
const migrateDatabase = async () => {
  try {
    console.log('⏳ Menghubungkan ke Supabase dan mengambil data...\n');

    // ====================================================
    // BLOK 1: MIGRASI TABEL MAHASISWA
    // ====================================================
    console.log('--- 🎓 [1/2] Memulai Migrasi Tabel Mahasiswa ---');
    const { data: daftarMahasiswa, error: fetchMhsError } = await supabase
      .from('mahasiswa')
      .select('id, npm, nama_mahasiswa, password_hash');

    if (fetchMhsError) throw fetchMhsError;

    let mhsCounter = 0;
    if (!daftarMahasiswa || daftarMahasiswa.length === 0) {
      console.log('✅ Tidak ada data mahasiswa yang ditemukan.');
    } else {
      for (const mhs of daftarMahasiswa) {
        if (mhs.password_hash && mhs.password_hash.startsWith('$2')) continue; // Skip jika aman

        const hashedPassword = await bcrypt.hash(mhs.password_hash, 10);
        const { error: updateError } = await supabase
          .from('mahasiswa')
          .update({ password_hash: hashedPassword })
          .eq('id', mhs.id);

        if (updateError) {
          console.error(`❌ Gagal update mahasiswa ${mhs.nama_mahasiswa}:`, updateError.message);
        } else {
          mhsCounter++;
          console.log(`🔒 Sukses mengamankan mhs: ${mhs.nama_mahasiswa} (${mhs.npm})`);
        }
      }
    }
    console.log(`Selesai blok mahasiswa: ${mhsCounter} akun baru diamankan.\n`);

    // ====================================================
    // BLOK 2: MIGRASI TABEL STAF
    // ====================================================
    console.log('--- 👨‍💼 [2/2] Memulai Migrasi Tabel Staf ---');
    const { data: daftarStaf, error: fetchStafError } = await supabase
      .from('staf')
      .select('id, username, nama_staf, password_hash');

    if (fetchStafError) throw fetchStafError;

    let stafCounter = 0;
    if (!daftarStaf || daftarStaf.length === 0) {
      console.log('✅ Tidak ada data staf yang ditemukan.');
    } else {
      for (const staf of daftarStaf) {
        if (staf.password_hash && staf.password_hash.startsWith('$2')) continue; // Skip jika aman

        const hashedPassword = await bcrypt.hash(staf.password_hash, 10);
        const { error: updateError } = await supabase
          .from('staf')
          .update({ password_hash: hashedPassword })
          .eq('id', staf.id);

        if (updateError) {
          console.error(`❌ Gagal update staf ${staf.nama_staf}:`, updateError.message);
        } else {
          stafCounter++;
          console.log(`🔒 Sukses mengamankan staf: ${staf.nama_staf} (${staf.username})`);
        }
      }
    }
    console.log(`Selesai blok staf: ${stafCounter} akun baru diamankan.\n`);

    console.log('🎉 PROSES SELESAI KESELURUHAN! Seluruh Database sudah 100% Aman.');
    
  } catch (error) {
    console.error('❌ Kegagalan fatal saat proses migrasi:', error.message);
  }
};

// Eksekusi skrip migrasi
migrateDatabase();