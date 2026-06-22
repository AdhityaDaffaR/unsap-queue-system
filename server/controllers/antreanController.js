import { supabase } from "../config/supabase.js";

// --- FUNGSI MAHASISWA ---

export const ambilAntreanBaru = async (req, res) => {
  try {
    const { id_layanan, npm_mahasiswa } = req.body;
    if (!id_layanan || !npm_mahasiswa)
      return res
        .status(400)
        .json({ success: false, message: "Data tidak lengkap!" });

    const { data: dataLayanan } = await supabase
      .from("layanan")
      .select("kode_layanan")
      .eq("id", id_layanan)
      .single();
    if (!dataLayanan)
      return res
        .status(404)
        .json({ success: false, message: "Layanan tidak ditemukan!" });

    const hariIni = new Date().toISOString().split("T")[0];
    const { count } = await supabase
      .from("antrean")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${hariIni}T00:00:00.000Z`)
      .eq("id_layanan", id_layanan);

    const nomorUrutBerikutnya = (count || 0) + 1;
    const nomorDisplayBerikutnya = `${dataLayanan.kode_layanan}-${nomorUrutBerikutnya.toString().padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("antrean")
      .insert([
        {
          nomor_urut: nomorUrutBerikutnya,
          nomor_display: nomorDisplayBerikutnya,
          id_layanan,
          status: "menunggu",
          npm_mahasiswa,
        },
      ])
      .select()
      .single();
    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const batalAntrean = async (req, res) => {
  try {
    const { id_antrean } = req.body;
    const { data, error } = await supabase
      .from("antrean")
      .update({ status: "batal" })
      .eq("id", id_antrean)
      .select();
    if (error) throw error;
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- FUNGSI ADMIN / STAF ---

export const panggilAntrean = async (req, res) => {
  try {
    const { id_layanan, nomor_loket } = req.body;

    // Selesaikan antrean yang sedang dipanggil di loket tersebut
    await supabase
      .from("antrean")
      .update({ status: "selesai" })
      .eq("nomor_loket", nomor_loket)
      .eq("status", "dipanggil");

    // Ambil antrean 'menunggu' berikutnya
    const { data: next, error } = await supabase
      .from("antrean")
      .select("*")
      .eq("id_layanan", id_layanan)
      .eq("status", "menunggu")
      .order("nomor_urut", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!next)
      return res.status(200).json({ success: true, message: "Antrean kosong" });

    const { data: updated, error: errUpdate } = await supabase
      .from("antrean")
      .update({ status: "dipanggil", nomor_loket })
      .eq("id", next.id)
      .select();
    if (errUpdate) throw errUpdate;

    return res.status(200).json({ success: true, data: updated[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const lewatiAntrean = async (req, res) => {
  try {
    const { nomor_loket } = req.body;
    const { data, error } = await supabase
      .from("antrean")
      .update({ status: "dilewati" })
      .eq("nomor_loket", nomor_loket)
      .eq("status", "dipanggil")
      .select();
    if (error) throw error;
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const panggilAntreanLewati = async (req, res) => {
  try {
    const { id_antrean, nomor_loket } = req.body;
    await supabase
      .from("antrean")
      .update({ status: "selesai" })
      .eq("nomor_loket", nomor_loket)
      .eq("status", "dipanggil");
    const { data, error } = await supabase
      .from("antrean")
      .update({ status: "dipanggil", nomor_loket })
      .eq("id", id_antrean)
      .select();
    if (error) throw error;
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAntreanMonitor = async (req, res) => {
  try {
    const hariIni = new Date().toISOString().split("T")[0];
    const [dipanggil, menunggu, dilewati] = await Promise.all([
      supabase
        .from("antrean")
        .select("*, layanan(nama_layanan)")
        .eq("status", "dipanggil")
        .gte("created_at", `${hariIni}T00:00:00.000Z`),
      supabase
        .from("antrean")
        .select("*, layanan(nama_layanan)")
        .eq("status", "menunggu")
        .gte("created_at", `${hariIni}T00:00:00.000Z`)
        .order("nomor_urut", { ascending: true }),
      supabase
        .from("antrean")
        .select("*, layanan(nama_layanan)")
        .eq("status", "dilewati")
        .gte("created_at", `${hariIni}T00:00:00.000Z`)
        .order("nomor_urut", { ascending: true }),
    ]);
    return res
      .status(200)
      .json({
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
