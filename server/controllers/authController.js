import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth.js';

/**
 * ========================================================
 * 1. FUNGSI LOGIN STAF (100% Bcrypt Secured)
 * ========================================================
 */
export const loginStaf = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan kata sandi wajib diisi!' });
    }

    const { data: staf, error } = await supabase
      .from('staf')
      .select('*, layanan(nama_layanan)')
      .eq('username', username)
      .single();

    if (error || !staf) {
      return res.status(401).json({ success: false, message: 'Username tidak terdaftar!' });
    }

    // Validasi ketat menggunakan Bcrypt (Menolak plaintext)
    const isPasswordValid = await bcrypt.compare(password, staf.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Kata sandi salah!' });
    }

    const token = generateToken({
      id: staf.id,
      username: staf.username,
      nama: staf.nama_staf,
      role: 'staf'
    });

    return res.status(200).json({
      success: true,
      message: `Selamat datang kembali, ${staf.nama_staf}! 👋`,
      token,
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
 * 2. FUNGSI LOGIN MAHASISWA (100% Bcrypt Secured)
 * ========================================================
 */
export const loginMahasiswa = async (req, res) => {
  try {
    const { npm, password } = req.body;

    if (!npm || !password) {
      return res.status(400).json({ success: false, message: 'NPM dan password wajib diisi!' });
    }

    const { data: mhs, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('npm', npm)
      .single();

    if (error || !mhs) {
      return res.status(401).json({ success: false, message: 'NPM tidak terdaftar sebagai mahasiswa UNSAP!' });
    }

    // Validasi ketat menggunakan Bcrypt (Menolak plaintext)
    const isPasswordValid = await bcrypt.compare(password, mhs.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Password salah!' });
    }

    const token = generateToken({
      id: mhs.id,
      npm: mhs.npm,
      nama: mhs.nama_mahasiswa,
      role: 'mahasiswa'
    });

    const hariIni = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());

    const { data: tiketAktif } = await supabase
      .from('antrean')
      .select('id, nomor_display, status')
      .eq('npm_mahasiswa', mhs.npm)
      .eq('tanggal_antrean', hariIni)
      .in('status', ['menunggu', 'dipanggil'])
      .maybeSingle();

    return res.status(200).json({
      success: true,
      message: `Login berhasil. Selamat datang, ${mhs.nama_mahasiswa}! ✨`,
      token,
      data: {
        id: mhs.id,
        npm: mhs.npm,
        nama_mahasiswa: mhs.nama_mahasiswa,
        prodi: mhs.prodi,
        angkatan: mhs.angkatan
      },
      tiket_aktif: tiketAktif || null
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};