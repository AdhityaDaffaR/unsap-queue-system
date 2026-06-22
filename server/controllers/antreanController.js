import { supabase } from "../config/supabase.js";
import { broadcastUpdate } from "../config/broadcast.js";

/**
 * UTILITY: Fungsi untuk mendapatkan tanggal WIB (Asia/Jakarta) dengan format YYYY-MM-DD
 */
const getTanggalHariIniWIB = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date()); 
};

// ========================================================
// --- FUNGSI MAHASISWA (PENGUNJUNG) ---
// ========================================================

export const ambilAntreanBaru = async (req, res) => {
  try {
    const { id_layanan, npm_mahasiswa } = req.body;
    if (!id_layanan || !npm_mahasiswa) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap!" });
    }

    const { data: dataLayanan } = await supabase
      .from("layanan")
      .select("kode_layanan")
      .eq("id", id_layanan)
      .single();

    if (!dataLayanan) {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan!" });
    }

    const hariIni = getTanggalHariIniWIB();

    const { data: antreanTerakhir } = await supabase
      .from("antrean")
      .select("nomor_urut")
      .eq("id_layanan", id_layanan)
      .eq("tanggal_antrean", hariIni)
      .order("nomor_urut", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nomorUrutBerikutnya = antreanTerakhir ? antreanTerakhir.nomor_urut + 1 : 1;
    const nomorDisplayBerikutnya = `${dataLayanan.kode_layanan}-${nomorUrutBerikutnya.toString().padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("antrean")
      .insert([{
        nomor_urut: nomorUrutBerikutnya,
        nomor_display: nomorDisplayBerikutnya,
        id_layanan,
        status: "menunggu",
        npm_mahasiswa,
        tanggal_antrean: hariIni 
      }])
      .select()
      .single();

    if (error) throw error;

    broadcastUpdate('antrean_berubah');

    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const batalAntrean = async (req, res) => {
  try {
    const { id_antrean } = req.body;
    const { data: tiket, error: cekError } = await supabase
      .from("antrean")
      .select("*")
      .eq("id", id_antrean)
      .single();

    if (cekError || !tiket) {
      return res.status(404).json({ success: false, message: "Antrean tidak ditemukan!" });
    }

    if (tiket.status !== "menunggu") {
      return res.status(400).json({ success: false, message: "Hanya antrean berstatus menunggu yang dapat dibatalkan." });
    }

    if (req.user.role === "mahasiswa" && tiket.npm_mahasiswa !== req.user.npm) {
      return res.status(403).json({ success: false, message: "Anda hanya dapat membatalkan antrean milik sendiri." });
    }

    const { data, error } = await supabase
      .from("antrean")
      .update({ status: "batal" })
      .eq("id", id_antrean)
      .select();

    if (error) throw error;
    broadcastUpdate('antrean_berubah');
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================================
// --- FUNGSI ADMIN / STAF (PENGENDALI LOKET) ---
// ========================================================

export const panggilAntrean = async (req, res) => {
  try {
    const { id_layanan, nomor_loket } = req.body;
    const hariIni = getTanggalHariIniWIB();

    await supabase
      .from("antrean")
      .update({ status: "selesai" })
      .eq("nomor_loket", nomor_loket)
      .eq("status", "dipanggil")
      .eq("tanggal_antrean", hariIni);

    const { data: next, error } = await supabase
      .from("antrean")
      .select("*")
      .eq("id_layanan", id_layanan)
      .eq("status", "menunggu")
      .eq("tanggal_antrean", hariIni)
      .order("nomor_urut", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!next) {
      broadcastUpdate('antrean_berubah');
      return res.status(200).json({ success: true, message: "Antrean kosong" });
    }

    const { data: updated, error: errUpdate } = await supabase
      .from("antrean")
      .update({ status: "dipanggil", nomor_loket })
      .eq("id", next.id)
      .select();

    if (errUpdate) throw errUpdate;

    broadcastUpdate('antrean_berubah');
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const lewatiAntrean = async (req, res) => {
  try {
    const { nomor_loket } = req.body;
    const hariIni = getTanggalHariIniWIB();

    const { data, error } = await supabase
      .from("antrean")
      .update({ status: "dilewati" })
      .eq("nomor_loket", nomor_loket)
      .eq("status", "dipanggil")
      .eq("tanggal_antrean", hariIni)
      .select();

    if (error) throw error;
    broadcastUpdate('antrean_berubah');
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const panggilAntreanLewati = async (req, res) => {
  try {
    const { id_antrean, nomor_loket } = req.body;
    const hariIni = getTanggalHariIniWIB();

    await supabase
      .from("antrean")
      .update({ status: "selesai" })
      .eq("nomor_loket", nomor_loket)
      .eq("status", "dipanggil")
      .eq("tanggal_antrean", hariIni);

    const { data, error } = await supabase
      .from("antrean")
      .update({ status: "dipanggil", nomor_loket })
      .eq("id", id_antrean)
      .select();

    if (error) throw error;
    broadcastUpdate('antrean_berubah');
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================================
// --- FUNGSI MONITOR (TV / PUBLIC DISPLAY) ---
// ========================================================

export const getAntreanMonitor = async (req, res) => {
  try {
    const hariIni = getTanggalHariIniWIB();

    const [dipanggil, menunggu, dilewati] = await Promise.all([
      supabase
        .from("antrean")
        .select("*, layanan(nama_layanan)")
        .eq("status", "dipanggil")
        .eq("tanggal_antrean", hariIni),
      supabase
        .from("antrean")
        .select("*, layanan(nama_layanan)")
        .eq("status", "menunggu")
        .eq("tanggal_antrean", hariIni)
        .order("nomor_urut", { ascending: true }),
      supabase
        .from("antrean")
        .select("*, layanan(nama_layanan)")
        .eq("status", "dilewati")
        .eq("tanggal_antrean", hariIni)
        .order("nomor_urut", { ascending: true }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        sedangDipanggil: dipanggil.data,
        sedangMenunggu: menunggu.data,
        sedangDilewati: dilewati.data,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};