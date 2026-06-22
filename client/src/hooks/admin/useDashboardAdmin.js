import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useDashboardAdmin() {
  const navigate = useNavigate();

  // KUNCI OTENTIKASI: Membaca status login asli dari browser
  const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";

  // SINKRONISASI AKUN: Membaca profil otentikasi admin dari storage hulu secara dinamis
  const [adminProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem("adminProfileData");
    return savedProfile && isAdminLoggedIn
      ? JSON.parse(savedProfile)
      : { username: "", nama: "", role: "", id_layanan: null };
  });

  // Membaca delegasi meja kerja admin
  const [loketInfo, setLoketInfo] = useState(() => {
    const savedLoket = sessionStorage.getItem("loket_tugas_aktif");
    // Jika tidak ada loket yang dipilih, defaultkan ke loket 1A (ID: 1)
    return savedLoket && isAdminLoggedIn
      ? JSON.parse(savedLoket)
      : { id: 1, kode: "—", nama: "Meja Non-Aktif", status: "Tutup" };
  });

  // DATA STATE RIIL (Akan di-overwrite oleh Supabase via fetch)
  const [nomorAktif, setNomorAktif] = useState("—");
  const [sisaAntrean, setSisaAntrean] = useState(0);
  const [daftarSelanjutnya, setDaftarSelanjutnya] = useState([]);

  const [daftarDilewati, setDaftarDilewati] = useState([]);

  const [isCalling, setIsCalling] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Pilihan Loket Statis (hanya untuk menu modal ganti loket)
  const listLoketTugas = [
    {
      id: 1,
      kode: "1A",
      nama: "KEUANGAN (LOKET 1A)",
      subLayanan: "Yayasan",
      targetIdLayanan: 1,
    },
    {
      id: 2,
      kode: "1B",
      nama: "KEUANGAN (LOKET 1B)",
      subLayanan: "Yayasan",
      targetIdLayanan: 1,
    },
    {
      id: 3,
      kode: "2",
      nama: "AKADEMIK (LOKET 2)",
      subLayanan: "BAAK",
      targetIdLayanan: 2,
    },
    {
      id: 4,
      kode: "3",
      nama: "UMUM (LOKET 3)",
      subLayanan: "BAU",
      targetIdLayanan: 3,
    },
    {
      id: 5,
      kode: "4",
      nama: "KEMAHASISWAAN (LOKET 4)",
      subLayanan: "Beasiswa",
      targetIdLayanan: 4,
    },
  ];

  // =========================================================================
  // 1. FUNGSI MENARIK DATA REAL-TIME DARI SUPABASE (MONITORING LOKET)
  // =========================================================================
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const fetchMonitorData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/antrean/monitor",
        );
        const resData = await response.json();

        if (resData.success) {
          const { sedangDipanggil, sedangMenunggu } = resData.data;

          // 1A. Cari tiket yang sedang dipanggil KHUSUS untuk loket admin ini (misal: "1A")
          const tiketPanggilLoketku = sedangDipanggil.find(
            (t) => t.nomor_loket === loketInfo.kode,
          );

          if (tiketPanggilLoketku) {
            setNomorAktif(tiketPanggilLoketku.nomor_display);
          } else {
            setNomorAktif("—");
          }

          // 1B. Cari sisa tiket yang masih menunggu sesuai dengan Kategori Layanan Admin ini
          // (Misal: Admin loket 1A hanya menarik antrean untuk ID_layanan = 1 / Keuangan)
          let targetIdLayanan = 1; // Default
          const loketAktifData = listLoketTugas.find(
            (l) => l.id === loketInfo.id,
          );
          if (loketAktifData) targetIdLayanan = loketAktifData.targetIdLayanan;

          const tiketMenungguLoketku = sedangMenunggu
            .filter((t) => t.id_layanan === targetIdLayanan)
            .map((t) => t.nomor_display);

          setDaftarSelanjutnya(tiketMenungguLoketku);
          setSisaAntrean(tiketMenungguLoketku.length);

          const tiketDilewatiLoketku = resData.data.sedangDilewati
            .filter((t) => t.id_layanan === targetIdLayanan)
            .map((t) => ({
              id: t.id,
              nomor_display: t.nomor_display,
              id_layanan: t.id_layanan,
            }));

          setDaftarDilewati(tiketDilewatiLoketku);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data loket admin:", err);
      }
    };

    // Jalankan setiap 2 detik untuk membaca perubahan dari Mahasiswa
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 2000);
    return () => clearInterval(interval);
  }, [isAdminLoggedIn, loketInfo]);

  // =========================================================================
  // 2. FUNGSI PANGGIL TIKET SELANJUTNYA KE SUPABASE
  // =========================================================================
  // Note: Audio akan dimainkan oleh DisplayMonitor.jsx, bukan di sini
  const handleNext = async () => {
    if (
      !isAdminLoggedIn ||
      loketInfo.status === "Tutup" ||
      daftarSelanjutnya.length === 0
    )
      return;

    setIsCalling(true);

    try {
      // Tentukan target layanan
      let targetIdLayanan = 1;
      const loketAktifData = listLoketTugas.find((l) => l.id === loketInfo.id);
      if (loketAktifData) targetIdLayanan = loketAktifData.targetIdLayanan;

      const response = await fetch(
        "http://localhost:3000/api/antrean/panggil",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_layanan: targetIdLayanan,
            nomor_loket: loketInfo.kode, // Mengirimkan kode loket admin (contoh: "1A" atau "2")
          }),
        },
      );

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Gagal memanggil antrean.");
      }

      // Animasi panggil UI sebentar (600ms)
      setTimeout(() => {
        setIsCalling(false);
        // Supabase sudah terupdate. UseEffect interval akan menarik data nomorAktif terbaru dalam 2 detik.
        // Audio akan dimainkan otomatis oleh DisplayMonitor.jsx saat mendeteksi perubahan
      }, 600);
    } catch (err) {
      alert("Kesalahan Eksekusi: " + err.message);
      setIsCalling(false);
    }
  };

  const handleRecall = () => {
    if (!isAdminLoggedIn || loketInfo.status === "Tutup" || nomorAktif === "—")
      return;
    setIsCalling(true);
    // Ini hanya animasi UI (berkedip). Fitur panggil ulang suara bisa dihubungkan nanti
    setTimeout(() => setIsCalling(false), 600);
  };

  // Skip & Hold (Disimpan sementara di array lokal Admin, belum dikirim ke Supabase)
  const handleSkip = async () => {
    if (!isAdminLoggedIn || loketInfo.status === "Tutup" || nomorAktif === "—")
      return;

    setIsCalling(true);

    try {
      const response = await fetch("http://localhost:3000/api/antrean/lewati", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor_loket: loketInfo.kode }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Gagal menahan nomor antrean.");
      }

      // Panggil antrean berikutnya setelah memindahkan antrean aktif ke status "dilewati"
      await handleNext();
    } catch (err) {
      alert("Kesalahan saat hold nomor: " + err.message);
      setIsCalling(false);
    }
  };

  const handlePanggilDilewati = async (ticket) => {
    if (!isAdminLoggedIn || loketInfo.status === "Tutup" || !ticket?.id) return;

    setIsCalling(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/antrean/panggil-dilewati",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_antrean: ticket.id,
            nomor_loket: loketInfo.kode,
          }),
        },
      );

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(
          resData.message || "Gagal memanggil nomor yang di-hold.",
        );
      }

      setNomorAktif(ticket.nomor_display);
      setDaftarDilewati((prev) => prev.filter((item) => item.id !== ticket.id));
      // Audio akan dimainkan otomatis oleh DisplayMonitor.jsx saat mendeteksi perubahan
    } catch (err) {
      alert("Kesalahan saat memanggil nomor hold: " + err.message);
    } finally {
      setTimeout(() => setIsCalling(false), 600);
    }
  };

  // =========================================================================
  // KONTROL OPERASIONAL LOKET LOKAL
  // =========================================================================
  const triggerStatusToggle = () => {
    if (!isAdminLoggedIn) return;
    setShowConfirmModal(true);
  };

  const handleConfirmStatusToggle = () => {
    const nextStatus = loketInfo.status === "Buka" ? "Tutup" : "Buka";
    const updatedLoket = { ...loketInfo, status: nextStatus };
    setLoketInfo(updatedLoket);
    sessionStorage.setItem("loket_tugas_aktif", JSON.stringify(updatedLoket));
    setShowConfirmModal(false);
  };

  const handleSwitchLoket = (loketBaru) => {
    if (!isAdminLoggedIn) return;
    // Tutup loket lama sebelum ganti
    const objekBaru = {
      id: loketBaru.id,
      kode: loketBaru.kode,
      nama: `${loketBaru.nama} (${loketBaru.subLayanan})`,
      status: "Buka", // Otomatis buka saat admin pindah meja
    };

    setLoketInfo(objekBaru);
    sessionStorage.setItem("loket_tugas_aktif", JSON.stringify(objekBaru));
    setShowSwitchModal(false);
  };

  const triggerLogoutConfirm = () => setShowLogoutModal(true);

  const handleAdminLogout = () => {
    sessionStorage.removeItem("loket_tugas_aktif");
    sessionStorage.removeItem("adminProfileData");
    sessionStorage.removeItem("isAdminLoggedIn");
    setShowLogoutModal(false);
    navigate("/admin/login", { replace: true });
  };

  return {
    adminProfile,
    loketInfo,
    nomorAktif,
    sisaAntrean,
    daftarSelanjutnya,
    daftarDilewati,
    isCalling,
    handleNext,
    handleRecall,
    handleSkip,
    handlePanggilDilewati,
    triggerLogoutConfirm,
    handleAdminLogout,
    showSwitchModal,
    setShowSwitchModal,
    listLoketTugas,
    handleSwitchLoket,
    showConfirmModal,
    setShowConfirmModal,
    triggerStatusToggle,
    handleConfirmStatusToggle,
    showLogoutModal,
    setShowLogoutModal,
    isAdminLoggedIn,
    navigate,
  };
}
