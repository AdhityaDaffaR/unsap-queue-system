import { supabase } from '../config/supabase.js';

// Fungsi untuk mengambil semua kategori layanan
export const getAllLayanan = async (req, res) => {
  try {
    // Mengambil data dari tabel 'layanan' dan mengurutkannya berdasarkan id
    const { data, error } = await supabase
      .from('layanan')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ getAllLayanan error:", err.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan internal server." });
  }
};