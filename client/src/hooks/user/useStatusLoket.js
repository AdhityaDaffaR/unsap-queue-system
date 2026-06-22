import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useStatusLoket() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedInUser") === "true";
  });

  const [userProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem("userProfileData");
    return savedProfile
      ? JSON.parse(savedProfile)
      : { nama: "Guest Civitas", nim: "—" };
  });

  const [searchQuery, setSearchQuery] = useState("");

  // DATA MASTER MEJA LOKET UTAMA (Template Dasar)
  const [masterLoket, setMasterLoket] = useState([
    {
      id: 1,
      id_layanan: 1,
      kode: "1A",
      nama: "Loket 1A - Pembayaran Yayasan",
      kategori: "Keuangan",
      aktif: "—",
      sisa: 0,
      estimasi: 0,
      status: "Buka",
      selanjutnya: [],
    },
    {
      id: 2,
      id_layanan: 1,
      kode: "1B",
      nama: "Loket 1B - Pembayaran Yayasan",
      kategori: "Keuangan",
      aktif: "—",
      sisa: 0,
      estimasi: 0,
      status: "Buka",
      selanjutnya: [],
    },
    {
      id: 3,
      id_layanan: 2,
      kode: "2",
      nama: "Loket 2 - BAAK (Akademik)",
      kategori: "Akademik",
      aktif: "—",
      sisa: 0,
      estimasi: 0,
      status: "Buka",
      selanjutnya: [],
    },
    {
      id: 4,
      id_layanan: 3,
      kode: "3",
      nama: "Loket 3 - BAU (Keuangan)",
      kategori: "Umum",
      aktif: "—",
      sisa: 0,
      estimasi: 0,
      status: "Tutup",
      selanjutnya: [],
    },
    {
      id: 5,
      id_layanan: 4,
      kode: "4",
      nama: "Loket 4 - Beasiswa & Kemahasiswaan",
      kategori: "Kemahasiswaan",
      aktif: "—",
      sisa: 0,
      estimasi: 0,
      status: "Tutup",
      selanjutnya: [],
    },
  ]);

  // =========================================================================
  // INTEGRASI: GET MONITOR REAL-TIME DARI SUPABASE
  // =========================================================================
  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/antrean/monitor",
        );
        const resData = await response.json();

        if (resData.success) {
          const { sedangDipanggil, sedangMenunggu } = resData.data;

          setMasterLoket((prevMaster) =>
            prevMaster.map((loket) => {
              // Cari antrean yang sedang dilayani di loket spesifik (cth: "1A")
              const dipanggil = sedangDipanggil.find(
                (a) => a.nomor_loket === loket.kode,
              );

              let menunggu = [];
              // Hindari duplikasi daftar tunggu di Loket 1B (Taruh semua daftar tunggu Keuangan di 1A)
              if (
                loket.kode === "1A" ||
                loket.kode === "2" ||
                loket.kode === "3" ||
                loket.kode === "4"
              ) {
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
            }),
          );
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data monitor:", err.message);
      }
    };

    // Jalankan setiap 2 detik untuk membaca perubahan real-time
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedInUser");
    sessionStorage.removeItem("userProfileData");
    sessionStorage.removeItem("nomorTiketAktif");
    setIsLoggedIn(false);
    navigate("/");
  };

  // RESTRUKTURISASI DATA MENJADI 4 KATEGORI LAYANAN TERPADU SINKRON DENGAN BERANDA
  const layananList = [
    {
      id: 1, // Melempar seleksi default ke Keuangan saat diklik
      kategori: "Keuangan",
      judulTampilan: "KEUANGAN",
      subTeks: "Yayasan",
      kodeDisplay: "LOKET 1A / 1B",
      status:
        masterLoket.find((l) => l.kode === "1A")?.status === "Buka" ||
        masterLoket.find((l) => l.kode === "1B")?.status === "Buka"
          ? "Buka"
          : "Tutup",
      sisaAntrean:
        (masterLoket.find((l) => l.kode === "1A")?.sisa || 0) +
        (masterLoket.find((l) => l.kode === "1B")?.sisa || 0),
      estimasi:
        (masterLoket.find((l) => l.kode === "1A")?.estimasi || 0) +
        (masterLoket.find((l) => l.kode === "1B")?.estimasi || 0),
      nomorAktif: masterLoket.find((l) => l.kode === "1A")?.aktif || "—",
      konterFisikAktif:
        masterLoket.find(
          (l) =>
            l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "Buka",
        )?.kode || null,
    },
    {
      id: 3,
      kategori: "Akademik",
      judulTampilan: "AKADEMIK",
      subTeks: "BAAK",
      kodeDisplay: "LOKET 2",
      status: masterLoket.find((l) => l.kode === "2")?.status || "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "2")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "2")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      konterFisikAktif: "2",
    },
    {
      id: 4,
      kategori: "Umum",
      judulTampilan: "UMUM",
      subTeks: "BAU",
      kodeDisplay: "LOKET 3",
      status: masterLoket.find((l) => l.kode === "3")?.status || "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "3")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "3")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      konterFisikAktif: "3",
    },
    {
      id: 5,
      kategori: "Kemahasiswaan",
      judulTampilan: "KEMAHASISWAAN",
      subTeks: "Beasiswa & Kemahasiswaan",
      kodeDisplay: "LOKET 4",
      status: masterLoket.find((l) => l.kode === "4")?.status || "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "4")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "4")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "4")?.aktif || "—",
      konterFisikAktif: "4",
    },
  ];

  // Jalankan filter pencarian adaptif pada data klaster transaksional baru
  const layananTersaring = layananList.filter(
    (layanan) =>
      layanan.subTeks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.kodeDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.kategori.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    navigate,
    isLoggedIn,
    userProfile,
    handleLogout,
    searchQuery,
    setSearchQuery,
    daftarLoket: layananTersaring,
  };
}
