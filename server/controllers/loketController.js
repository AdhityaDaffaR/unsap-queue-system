import { supabase } from '../config/supabase.js';
import { broadcastUpdate } from '../config/broadcast.js';

export const getAllLoket = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loket')
      .select(`
        *,
        layanan(id, nama_layanan, kode_layanan, estimasi_waktu),
        staf:id_staf_aktif(id, username, nama_staf)
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error("❌ getAllLoket query error:", error.message);
      return res.status(400).json({ success: false, message: "Gagal memuat data loket." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ getAllLoket error:", err.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan internal server." });
  }
};

export const getLoketByStaf = async (req, res) => {
  try {
    const { id_staf } = req.params;

    const { data, error } = await supabase
      .from('loket')
      .select(`
        *,
        layanan(id, nama_layanan, kode_layanan, estimasi_waktu)
      `)
      .eq('id_staf_aktif', id_staf)
      .single();

    if (error) {
      return res.status(404).json({ success: false, message: 'Loket tidak ditemukan untuk staf ini.' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ getLoketByStaf error:", err.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan internal server." });
  }
};

export const pilihLoket = async (req, res) => {
  try {
    const { id_loket } = req.body;
    const id_staf = req.user.id;

    if (!id_loket) {
      return res.status(400).json({ success: false, message: 'ID loket wajib diisi.' });
    }

    const { data: existing } = await supabase
      .from('loket')
      .select('id, id_staf_aktif, status, kode_loket')
      .eq('id', id_loket)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Loket tidak ditemukan.' });
    }

    if (existing.id_staf_aktif && existing.id_staf_aktif !== id_staf) {
      return res.status(409).json({ success: false, message: `Loket ${existing.kode_loket} sedang digunakan petugas lain.` });
    }

    const { data, error } = await supabase
      .from('loket')
      .update({
        id_staf_aktif: id_staf,
        status: 'buka',
        updated_at: new Date().toISOString()
      })
      .eq('id', id_loket)
      .select(`
        *,
        layanan(id, nama_layanan, kode_layanan, estimasi_waktu)
      `)
      .single();

    if (error) throw error;

    await broadcastUpdate('loket_berubah');

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ pilihLoket error:", err.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan internal server." });
  }
};

export const updateStatusLoket = async (req, res) => {
  try {
    const { id_loket, status } = req.body;
    const id_staf = req.user.id;

    if (!id_loket || !status) {
      return res.status(400).json({ success: false, message: 'ID loket dan status wajib diisi.' });
    }

    if (!['buka', 'tutup'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status hanya boleh "buka" atau "tutup".' });
    }

    const { data: existing } = await supabase
      .from('loket')
      .select('id, id_staf_aktif')
      .eq('id', id_loket)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Loket tidak ditemukan.' });
    }

    if (existing.id_staf_aktif !== id_staf) {
      return res.status(403).json({ success: false, message: 'Anda tidak bertugas di loket ini.' });
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('loket')
      .update(updateData)
      .eq('id', id_loket)
      .select(`
        *,
        layanan(id, nama_layanan, kode_layanan, estimasi_waktu)
      `)
      .single();

    if (error) throw error;

    await broadcastUpdate('loket_berubah');

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ updateStatusLoket error:", err.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan internal server." });
  }
};
