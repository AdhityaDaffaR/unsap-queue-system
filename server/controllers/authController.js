import { supabase } from '../config/supabase.js';

/**
 * ========================================================
 * 1. FUNGSI LOGIN STAF (Sudah Sukses & Aman)
 * ========================================================
 */
export const loginStaf = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validasi input kosong
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan kata sandi wajib diisi!' });
    }

    // 2. Cari data staf berdasarkan username di tabel 'staf' Supabase
    const { data: staf, error } = await supabase
      .from('staf')
      .select('*, layanan(nama_layanan)')
      .eq('username', username)
      .single();

    if (error || !staf) {
      return res.status(401).json({ success: false, message: 'Username tidak terdaftar!' });
    }

    // 3. Validasi kata sandi (Plaintext)
    if (staf.password !== password) {
      return res.status(401).json({ success: false, message: 'Kata sandi salah!' });
    }

    // 4. Jika sukses, kembalikan data otorisasi profil staf
    return res.status(200).json({
      success: true,
      message: `Selamat datang kembali, ${staf.nama_staf}! 👋`,
      data: {
        id: staf.id,
        username: staf.username,
        nama_staf: staf.nama_staf,
        nomor_loket: staf.nomor_loket,
        id_layanan: staf.id_layanan,
        nama_layanan: staf.layanan?.nama_layanan || 'Multi-layanan'
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================================================
 * 2. FUNGSI LOGIN MAHASISWA (Tokoh Utama 🚀)
 * POST /api/auth/login-mahasiswa
 * ========================================================
 */
export const loginMahasiswa = async (req, res) => {
  try {
    const { npm, password } = req.body;

    // 1. Validasi input kosong
    if (!npm || !password) {
      return res.status(400).json({ success: false, message: 'NPM dan password wajib diisi!' });
    }

    // 2. Cari data mahasiswa berdasarkan npm di tabel 'mahasiswa' Supabase
    const { data: mhs, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('npm', npm)
      .single();

    if (error || !mhs) {
      return res.status(401).json({ success: false, message: 'NPM tidak terdaftar sebagai mahasiswa UNSAP!' });
    }

    // 3. Validasi kata sandi (Plaintext)
    if (mhs.password !== password) {
      return res.status(401).json({ success: false, message: 'Password salah!' });
    }

    // 4. Jika sukses login, kembalikan objek lengkap untuk informasi & inisial navbar Frontend
    return res.status(200).json({
      success: true,
      message: `Login berhasil. Selamat datang, ${mhs.nama_mahasiswa}! ✨`,
      data: {
        id: mhs.id,
        npm: mhs.npm,
        nama_mahasiswa: mhs.nama_mahasiswa,
        prodi: mhs.prodi,
        angkatan: mhs.angkatan
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};