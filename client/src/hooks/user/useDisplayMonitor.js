import { useState, useEffect } from 'react';

export default function useDisplayMonitor() {
  const [masterLoket, setMasterLoket] = useState([]);

  useEffect(() => {
    const syncData = () => {
      const savedMaster = sessionStorage.getItem('globalMasterLoket');
      if (savedMaster) setMasterLoket(JSON.parse(savedMaster));
    };

    syncData();
    const interval = setInterval(syncData, 500);
    return () => clearInterval(interval);
  }, []);

  // RESTRUKTURISASI DATA 4 KATEGORI UTAMA UNTUK DISPLAY TV UMUM
  const layananMonitorList = [
    {
      kategori: "Keuangan",
      judul: "KEUANGAN",
      subLayanan: "Yayasan",
      kodeDisplay: "LOKET 1A / 1B",
      status: (masterLoket.find(l => l.kode === "1A")?.status === "Buka" || masterLoket.find(l => l.kode === "1B")?.status === "Buka") ? "Buka" : "Tutup",
      // Mencari meja fisik mana yang sedang memegang nomor aktif saat ini
      konterFisikAktif: masterLoket.find(l => l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "Buka")?.kode || "1A",
      aktifDisplay: masterLoket.find(l => l.kode === "1A")?.aktif || "—",
      // Pool Daftar Tunggu Gabungan Berurutan Maju
      selanjutnyaList: [...(masterLoket.find(l => l.kode === "1A")?.selanjutnya || []), ...(masterLoket.find(l => l.kode === "1B")?.selanjutnya || [])].sort()
    },
    {
      kategori: "Akademik",
      judul: "AKADEMIK",
      subLayanan: "BAAK",
      kodeDisplay: "LOKET 2",
      status: masterLoket.find(l => l.kode === "2")?.status || "Tutup",
      konterFisikAktif: "2",
      aktifDisplay: masterLoket.find(l => l.kode === "2")?.aktif || "—",
      selanjutnyaList: masterLoket.find(l => l.kode === "2")?.selanjutnya || []
    },
    {
      kategori: "Umum",
      judul: "UMUM",
      subLayanan: "BAU",
      kodeDisplay: "LOKET 3",
      status: masterLoket.find(l => l.kode === "3")?.status || "Tutup",
      konterFisikAktif: "3",
      aktifDisplay: masterLoket.find(l => l.kode === "3")?.aktif || "—",
      selanjutnyaList: masterLoket.find(l => l.kode === "3")?.selanjutnya || []
    },
    {
      kategori: "Kemahasiswaan",
      judul: "KEMAHASISWAAN",
      subLayanan: "Beasiswa",
      kodeDisplay: "LOKET 4",
      status: masterLoket.find(l => l.kode === "4")?.status || "Tutup",
      konterFisikAktif: "4",
      aktifDisplay: masterLoket.find(l => l.kode === "4")?.aktif || "—",
      selanjutnyaList: masterLoket.find(l => l.kode === "4")?.selanjutnya || []
    }
  ];

  return { 
    masterLoket, // Tetap di-export untuk kompatibilitas basic
    layananMonitorList 
  };
}