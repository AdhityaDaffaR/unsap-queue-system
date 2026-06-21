import { supabase } from '../config/supabase.js';

// =========================================================================
// FITUR PENGGUNA: MAHASISWA / KIOS ANTREAN
// =========================================================================

/**
 * 1. Fungsi mengambil nomor antrean baru
 * POST /api/antrean/ambil
 */
export const ambilAntreanBaru = async (req, res) => {
  try {
    const { id_layanan } = req.body;

    if (!id_layanan) {
      return res.status(400).json({ success: false, message: 'ID layanan wajib diisi!' });
    }

    // Ambil data layanan untuk mendapatkan kode_layanan (cth: 'A', 'Y')
    const { data: dataLayanan, error: errorLayanan } = await supabase
      .from('layanan')
      .select('kode_layanan')
      .eq('id', id_layanan)
      .single();

    if (errorLayanan || !dataLayanan) {
      return res.status(404).json({ success: false, message: 'Kategori layanan tidak ditemukan!' });
    }

    const kode = dataLayanan.kode_layanan;

    // Hitung jumlah antrean yang ada hari ini untuk menentukan nomor_urut berikutnya
    const hariIni = new Date().toISOString().split('T')[0];
    const { count, error: errorCount } = await supabase
      .from('antrean')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${hariIni}T00:00:00.000Z`);

    if (errorCount) {
      return res.status(400).json({ success: false, message: errorCount.message });
    }

    const nomorUrutBerikutnya = (count || 0) + 1;
    const nomorDisplayBerikutnya = `${kode}-${nomorUrutBerikutnya}`;

    // Masukkan data antrean baru ke database dengan status 'menunggu'
    const { data: antreanBaru, error: errorInsert } = await supabase
      .from('antrean')
      .insert([
        {
          nomor_urut: nomorUrutBerikutnya,
          nomor_display: nomorDisplayBerikutnya,
          id_layanan: id_layanan,
          status: 'menunggu'
        }
      ])
      .select()
      .single();

    if (errorInsert) {
      return res.status(400).json({ success: false, message: errorInsert.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Tiket antrean berhasil diambil!',
      data: antreanBaru
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 2. Fitur Baru: Membatalkan tiket antrean
 * PATCH /api/antrean/batal
 */
export const batalAntrean = async (req, res) => {
  try {
    const { id_antrean } = req.body;

    if (!id_antrean) {
      return res.status(400).json({ success: false, message: 'ID antrean wajib diisi!' });
    }

    // Perbarui status antrean dari 'menunggu' menjadi 'batal'
    const { data: hasilBatal, error: errorBatal } = await supabase
      .from('antrean')
      .update({ status: 'batal' })
      .eq('id', id_antrean)
      .select();

    if (errorBatal) {
      return res.status(400).json({ success: false, message: errorBatal.message });
    }

    if (!hasilBatal || hasilBatal.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Data antrean tidak ditemukan atau gagal dibatalkan! Periksa kembali RLS UPDATE Anda.' 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Antrean ${hasilBatal[0].nomor_display} berhasil dibatalkan!`,
      data: hasilBatal[0]
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// =========================================================================
// FITUR PENGGUNA: ADMIN / STAF LOKET PELAYANAN
// =========================================================================

/**
 * 3. Fungsi memanggil antrean berikutnya berdasarkan urutan terkecil
 * PATCH /api/antrean/panggil
 */
export const panggilAntrean = async (req, res) => {
  try {
    const { id_layanan, nomor_loket } = req.body;

    if (!id_layanan || !nomor_loket) {
      return res.status(400).json({ success: false, message: 'ID layanan dan nomor loket wajib diisi!' });
    }

    // Cari antrean paling pertama yang statusnya masih 'menunggu' pada layanan tersebut
    const { data: antreanBerikutnya, error: errorCari } = await supabase
      .from('antrean')
      .select('*')
      .eq('id_layanan', id_layanan)
      .eq('status', 'menunggu')
      .order('nomor_urut', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (errorCari) {
      return res.status(400).json({ success: false, message: errorCari.message });
    }

    if (!antreanBerikutnya) {
      return res.status(200).json({ success: true, message: 'Antrean sudah habis atau kosong!' });
    }

    // Update status antrean menjadi 'dipanggil' dan sematkan nomor loket eksekutor
    const { data: hasilUpdate, error: errorUpdate } = await supabase
      .from('antrean')
      .update({ status: 'dipanggil', nomor_loket: nomor_loket })
      .eq('id', antreanBerikutnya.id)
      .select();

    if (errorUpdate) {
      return res.status(400).json({ success: false, message: errorUpdate.message });
    }

    if (!hasilUpdate || hasilUpdate.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Gagal memperbarui status antrean. Pastikan RLS Policy UPDATE aktif di Supabase!' 
      });
    }

    const dataTiket = hasilUpdate[0];

    return res.status(200).json({
      success: true,
      message: `Nomor ${dataTiket.nomor_display} silahkan menuju loket ${nomor_loket}`,
      data: dataTiket
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 4. Fungsi Mengambil Data Antrean Aktif untuk Layar Monitor & Beranda
 * GET /api/antrean/monitor
 */
export const getAntreanMonitor = async (req, res) => {
  try {
    const hariIni = new Date().toISOString().split('T')[0];

    // 1. Ambil semua antrean yang SEDANG DIPANGGIL hari ini di tiap loket
    const { data: sedangDipanggil, error: errorDipanggil } = await supabase
      .from('antrean')
      .select('*, layanan(nama_layanan, kode_layanan)')
      .eq('status', 'dipanggil')
      .gte('created_at', `${hariIni}T00:00:00.000Z`);

    if (errorDipanggil) {
      return res.status(400).json({ success: false, message: errorDipanggil.message });
    }

    // 2. Ambil semua antrean yang MASIH MENUNGGU hari ini (diurutkan dari yang paling pertama antre)
    const { data: sedangMenunggu, error: errorMenunggu } = await supabase
      .from('antrean')
      .select('*, layanan(nama_layanan, kode_layanan)')
      .eq('status', 'menunggu')
      .gte('created_at', `${hariIni}T00:00:00.000Z`)
      .order('nomor_urut', { ascending: true });

    if (errorMenunggu) {
      return res.status(400).json({ success: false, message: errorMenunggu.message });
    }

    // Kembalikan dua kubu data ini ke Frontend
    return res.status(200).json({
      success: true,
      data: {
        sedangDipanggil: sedangDipanggil || [],
        sedangMenunggu: sedangMenunggu || []
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};