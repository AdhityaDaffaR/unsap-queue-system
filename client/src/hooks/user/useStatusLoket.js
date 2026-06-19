import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useStatusLoket() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedInUser') === 'true';
  });

  const [userProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem('userProfileData');
    return savedProfile ? JSON.parse(savedProfile) : { nama: "Guest Civitas", nim: "—" };
  });

  const [searchQuery, setSearchQuery] = useState("");

  // MEMBACA DATABASE MASTER GLOBAL TERPUSAT
  const [masterLoket, setMasterLoket] = useState(() => {
    const savedMaster = sessionStorage.getItem('globalMasterLoket');
    if (savedMaster) return JSON.parse(savedMaster);
    
    return [
      { id: 1, kode: "1A", nama: "Loket 1A - Pembayaran Yayasan", kategori: "Keuangan", aktif: "Y-18", sisa: 5, estimasi: 15, status: "Buka", selanjutnya: ["Y-19", "Y-20", "Y-21", "Y-22", "Y-23", "Y-24"] },
      { id: 2, kode: "1B", nama: "Loket 1B - Pembayaran Yayasan", kategori: "Keuangan", aktif: "Y-12", sisa: 2, estimasi: 6, status: "Buka", selanjutnya: ["Y-13", "Y-14"] },
      { id: 3, kode: "2", nama: "Loket 2 - BAAK (Akademik)", kategori: "Akademik", aktif: "A-45", sisa: 8, estimasi: 24, status: "Buka", selanjutnya: ["A-46", "A-47", "A-48", "A-49"] },
      { id: 4, kode: "3", nama: "Loket 3 - BAU (Keuangan)", kategori: "Umum", aktif: "B-02", sisa: 1, estimasi: 3, status: "Buka", selanjutnya: ["B-03"] },
      { id: 5, kode: "4", nama: "Loket 4 - Beasiswa & Kemahasiswaan", kategori: "Kemahasiswaan", aktif: "C-09", sisa: 0, estimasi: 0, status: "Tutup", selanjutnya: [] }
    ];
  });

  // Sinkronisasi data real-time dengan storage browser
  useEffect(() => {
    const syncData = () => {
      const savedMaster = sessionStorage.getItem('globalMasterLoket');
      if (savedMaster) setMasterLoket(JSON.parse(savedMaster));
    };
    const interval = setInterval(syncData, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedInUser');
    sessionStorage.removeItem('userProfileData');
    sessionStorage.removeItem('nomorTiketAktif');
    setIsLoggedIn(false);
    navigate('/');
  };

  // RESTRUKTURISASI DATA MENJADI 4 KATEGORI LAYANAN TERPADU SINKRON DENGAN BERANDA
  const layananList = [
    {
      id: 1, // Melempar seleksi default ke Keuangan saat diklik
      kategori: "Keuangan",
      judulTampilan: "KEUANGAN",
      subTeks: "Yayasan",
      kodeDisplay: "LOKET 1A / 1B",
      status: (masterLoket.find(l => l.kode === "1A")?.status === "Buka" || masterLoket.find(l => l.kode === "1B")?.status === "Buka") ? "Buka" : "Tutup",
      sisaAntrean: (masterLoket.find(l => l.kode === "1A")?.sisa || 0) + (masterLoket.find(l => l.kode === "1B")?.sisa || 0),
      estimasi: (masterLoket.find(l => l.kode === "1A")?.estimasi || 0) + (masterLoket.find(l => l.kode === "1B")?.estimasi || 0),
      nomorAktif: masterLoket.find(l => l.kode === "1A")?.aktif || "—",
      konterFisikAktif: masterLoket.find(l => l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "Buka")?.kode || null
    },
    {
      id: 3,
      kategori: "Akademik",
      judulTampilan: "AKADEMIK",
      subTeks: "BAAK",
      kodeDisplay: "LOKET 2",
      status: masterLoket.find(l => l.kode === "2")?.status || "Tutup",
      sisaAntrean: masterLoket.find(l => l.kode === "2")?.sisa || 0,
      estimasi: masterLoket.find(l => l.kode === "2")?.estimasi || 0,
      nomorAktif: masterLoket.find(l => l.kode === "2")?.aktif || "—",
      konterFisikAktif: "2"
    },
    {
      id: 4,
      kategori: "Umum",
      judulTampilan: "UMUM",
      subTeks: "BAU",
      kodeDisplay: "LOKET 3",
      status: masterLoket.find(l => l.kode === "3")?.status || "Tutup",
      sisaAntrean: masterLoket.find(l => l.kode === "3")?.sisa || 0,
      estimasi: masterLoket.find(l => l.kode === "3")?.estimasi || 0,
      nomorAktif: masterLoket.find(l => l.kode === "3")?.aktif || "—",
      konterFisikAktif: "3"
    },
    {
      id: 5,
      kategori: "Kemahasiswaan",
      judulTampilan: "KEMAHASISWAAN",
      subTeks: "Beasiswa & Kemahasiswaan",
      kodeDisplay: "LOKET 4",
      status: masterLoket.find(l => l.kode === "4")?.status || "Tutup",
      sisaAntrean: masterLoket.find(l => l.kode === "4")?.sisa || 0,
      estimasi: masterLoket.find(l => l.kode === "4")?.estimasi || 0,
      nomorAktif: masterLoket.find(l => l.kode === "4")?.aktif || "—",
      konterFisikAktif: "4"
    }
  ];

  // Jalankan filter pencarian adaptif pada data klaster transaksional baru
  const layananTersaring = layananList.filter(layanan => 
    layanan.subTeks.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layanan.kodeDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layanan.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    navigate,
    isLoggedIn,
    userProfile,
    handleLogout,
    searchQuery,
    setSearchQuery,
    daftarLoket: layananTersaring
  };
}