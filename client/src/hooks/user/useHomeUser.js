import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useHomeUser() {
  const navigate = useNavigate();
  const location = useLocation();

  // STATE AUTENTIKASI UTAMA
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedInUser") === "true";
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthWarningModal, setShowAuthWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Menyimpan string nomor tiket
  const [nomorTiketBaru, setNomorTiketBaru] = useState(() => {
    return sessionStorage.getItem("nomorTiketAktif") || "";
  });

  const formatNamaMahasiswa = (namaLengkap) => {
    if (!namaLengkap) return "Guest Civitas";
    const kata = namaLengkap.trim().split(/\s+/);
    if (kata.length <= 2) return namaLengkap;

    const duaKataPertama = kata.slice(0, 2).join(" ");
    const sisaInisial = kata
      .slice(2)
      .map((k) => `${k.charAt(0).toUpperCase()}.`)
      .join(" ");

    return `${duaKataPertama} ${sisaInisial}`;
  };

  // DATA PROFIL MAHASISWA
  const [userProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem("userProfileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      return {
        nama: formatNamaMahasiswa(parsed.nama),
        nim: parsed.npm || "—",
      };
    }
    return { nama: "Guest Civitas", nim: "—" };
  });

  // DATA MASTER MEJA LOKET UTAMA (Template Dasar)
  const [masterLoket, setMasterLoket] = useState([
    { id: 1, id_layanan: 1, kode: "1A", nama: "Loket 1A - Pembayaran Yayasan", kategori: "Keuangan", aktif: "—", sisa: 0, estimasi: 0, status: "Buka", selanjutnya: [] },
    { id: 2, id_layanan: 1, kode: "1B", nama: "Loket 1B - Pembayaran Yayasan", kategori: "Keuangan", aktif: "—", sisa: 0, estimasi: 0, status: "Buka", selanjutnya: [] },
    { id: 3, id_layanan: 2, kode: "2", nama: "Loket 2 - BAAK (Akademik)", kategori: "Akademik", aktif: "—", sisa: 0, estimasi: 0, status: "Buka", selanjutnya: [] },
    { id: 4, id_layanan: 3, kode: "3", nama: "Loket 3 - BAU (Keuangan)", kategori: "Umum", aktif: "—", sisa: 0, estimasi: 0, status: "Buka", selanjutnya: [] },
    { id: 5, id_layanan: 4, kode: "4", nama: "Loket 4 - Beasiswa & Kemahasiswaan", kategori: "Kemahasiswaan", aktif: "—", sisa: 0, estimasi: 0, status: "Tutup", selanjutnya: [] },
  ]);

  const [selectedKategori, setSelectedKategori] = useState("Keuangan");

  // =========================================================================
  // INTEGRASI 1: GET MONITOR REAL-TIME DARI SUPABASE
  // =========================================================================
  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/antrean/monitor");
        const resData = await response.json();

        if (resData.success) {
          const { sedangDipanggil, sedangMenunggu } = resData.data;

          setMasterLoket((prevMaster) => 
            prevMaster.map((loket) => {
              // Cari antrean yang sedang dilayani di loket spesifik (cth: "1A")
              const dipanggil = sedangDipanggil.find((a) => a.nomor_loket === loket.kode);
              
              let menunggu = [];
              // Hindari duplikasi daftar tunggu di Loket 1B (Taruh semua daftar tunggu Keuangan di 1A)
              if (loket.kode === "1A" || loket.kode === "2" || loket.kode === "3" || loket.kode === "4") {
                menunggu = sedangMenunggu
                  .filter((a) => a.id_layanan === loket.id_layanan)
                  .map((a) => a.nomor_display);
              }

              return {
                ...loket,
                aktif: dipanggil ? dipanggil.nomor_display : "—",
                selanjutnya: menunggu,
                sisa: menunggu.length,
                estimasi: menunggu.length * 3,
              };
            })
          );
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data monitor:", err.message);
      }
    };

    // Jalankan pertama kali, lalu set interval setiap 2 detik
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state && location.state.autoSelectLoketId) {
      const id = location.state.autoSelectLoketId;
      const target = masterLoket.find((l) => l.id === id);
      if (target) setSelectedKategori(target.kategori);
      navigate("/", { replace: true, state: {} });
    }
  }, [location.state, navigate, masterLoket]);

  const layananList = [
    {
      kategori: "Keuangan",
      judulTampilan: "KEUANGAN",
      kodeDisplay: "LOKET 1A / 1B",
      subTeks: "Yayasan",
      status:
        masterLoket.find((l) => l.kode === "1A")?.status === "Buka" ||
        masterLoket.find((l) => l.kode === "1B")?.status === "Buka"
          ? "Buka"
          : "Tutup",
      sisa: (masterLoket.find((l) => l.kode === "1A")?.sisa || 0) + (masterLoket.find((l) => l.kode === "1B")?.sisa || 0),
      aktifDisplay: masterLoket.find((l) => l.kode === "1A")?.aktif || "—",
      selanjutnyaList: [
        ...(masterLoket.find((l) => l.kode === "1A")?.selanjutnya || []),
        ...(masterLoket.find((l) => l.kode === "1B")?.selanjutnya || []),
      ].sort(),
    },
    {
      kategori: "Akademik",
      judulTampilan: "AKADEMIK",
      kodeDisplay: "LOKET 2",
      subTeks: "BAAK",
      status: masterLoket.find((l) => l.kode === "2")?.status || "Tutup",
      sisa: masterLoket.find((l) => l.kode === "2")?.sisa || 0,
      aktifDisplay: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "2")?.selanjutnya || [],
    },
    {
      kategori: "Umum",
      judulTampilan: "UMUM",
      kodeDisplay: "LOKET 3",
      subTeks: "BAU",
      status: masterLoket.find((l) => l.kode === "3")?.status || "Tutup",
      sisa: masterLoket.find((l) => l.kode === "3")?.sisa || 0,
      aktifDisplay: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "3")?.selanjutnya || [],
    },
    {
      kategori: "Kemahasiswaan",
      judulTampilan: "KEMAHASISWAAN",
      kodeDisplay: "LOKET 4",
      subTeks: "Beasiswa & Kemahasiswaan",
      status: masterLoket.find((l) => l.kode === "4")?.status || "Tutup",
      sisa: masterLoket.find((l) => l.kode === "4")?.sisa || 0,
      aktifDisplay: masterLoket.find((l) => l.kode === "4")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "4")?.selanjutnya || [],
    },
  ];

  const layananAktif = layananList.find((l) => l.kategori === selectedKategori) || layananList[0];
  const loketPemanggil = masterLoket.find((l) => l.aktif === nomorTiketBaru && l.status === "Buka");

  // =========================================================================
  // INTEGRASI 2: POST AMBIL ANTREAN BARU
  // =========================================================================
  const handleAmbilAntrean = async () => {
    if (layananAktif.status === "Tutup" || nomorTiketBaru) return;
    if (!isLoggedIn) {
      setShowAuthWarningModal(true);
      return;
    }

    const savedProfile = sessionStorage.getItem("userProfileData");
    if (!savedProfile) {
      setShowAuthWarningModal(true);
      return;
    }
    const npmMahasiswa = JSON.parse(savedProfile).npm;

    let targetIdLayanan = 1;
    if (selectedKategori === "Keuangan") targetIdLayanan = 1;
    if (selectedKategori === "Akademik") targetIdLayanan = 2;
    if (selectedKategori === "Umum") targetIdLayanan = 3;
    if (selectedKategori === "Kemahasiswaan") targetIdLayanan = 4;

    try {
      const response = await fetch("http://localhost:3000/api/antrean/ambil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_layanan: targetIdLayanan,
          npm_mahasiswa: npmMahasiswa,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Gagal mencetak nomor antrean.");
      }

      const tiketBaru = resData.data.nomor_display;
      const idAntreanDB = resData.data.id;

      setNomorTiketBaru(tiketBaru);
      sessionStorage.setItem("nomorTiketAktif", tiketBaru);
      sessionStorage.setItem("idAntreanAktif", idAntreanDB); 
      
      setShowSuccessModal(true);
    } catch (err) {
      alert("Kesalahan Jaringan: " + err.message);
    }
  };

  const handleBatalkanAntrean = () => setShowCancelConfirmModal(true);

  // =========================================================================
  // INTEGRASI 3: PATCH BATALKAN TIKET
  // =========================================================================
  const handleConfirmPembatalan = async () => {
    const idAntrean = sessionStorage.getItem("idAntreanAktif");
    if (!idAntrean) {
      alert("Referensi ID tiket tidak ditemukan di sistem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/antrean/batal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_antrean: idAntrean }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Gagal membatalkan tiket di server.");
      }

      setNomorTiketBaru("");
      sessionStorage.removeItem("nomorTiketAktif");
      sessionStorage.removeItem("idAntreanAktif");
      setShowCancelConfirmModal(false);
    } catch (err) {
      alert("Kesalahan Jaringan: " + err.message);
    }
  };

  const triggerLogoutConfirm = () => setShowLogoutModal(true);

  const handleConfirmLogout = () => {
    sessionStorage.removeItem("isLoggedInUser");
    sessionStorage.removeItem("userProfileData");
    sessionStorage.removeItem("nomorTiketAktif");
    sessionStorage.removeItem("idAntreanAktif");

    setIsLoggedIn(false);
    setIsMenuOpen(false);
    setNomorTiketBaru("");
    setShowLogoutModal(false);

    navigate("/");
    window.location.reload();
  };

  return {
    navigate,
    isLoggedIn,
    isMenuOpen,
    setIsMenuOpen,
    userProfile,
    layananList,
    selectedKategori,
    setSelectedKategori,
    layananAktif,
    handleAmbilAntrean,
    handleLogout: triggerLogoutConfirm,
    handleConfirmLogout,
    showAuthWarningModal,
    setShowAuthWarningModal,
    showSuccessModal,
    setShowSuccessModal,
    nomorTiketBaru,
    handleBatalkanAntrean,
    showCancelConfirmModal,
    setShowCancelConfirmModal,
    handleConfirmPembatalan,
    loketPemanggil,
    masterLoket,
    showLogoutModal,
    setShowLogoutModal,
  };
}