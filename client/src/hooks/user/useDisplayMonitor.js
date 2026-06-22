import { useState, useEffect, useRef } from "react";

export default function useDisplayMonitor() {
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

  // Track nomor sebelumnya dengan useRef untuk detect perubahan tanpa trigger re-render
  // useRef tidak akan cause infinite loop seperti useState
  const previousNomorRef = useRef({
    "1A": "—",
    "1B": "—",
    2: "—",
    3: "—",
    4: "—",
  });

  // =========================================================================
  // FUNGSI AUDIO: MAINKAN PENGUMUMAN DARI SPEAKER TV
  // =========================================================================
  const playAnnouncementAudio = (nomorDisplay, loketKode) => {
    console.log(
      `🔊 AUDIO TRIGGERED: Nomor ${nomorDisplay} untuk Loket ${loketKode}`,
    );
    try {
      const message = `Nomor ${nomorDisplay}, silakan menuju loket ${loketKode}`;
      const utterance = new SpeechSynthesisUtterance(message);

      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.cancel();
      const isSpeaking = window.speechSynthesis.speak(utterance);
      console.log(
        `✅ Audio diputar: ${message} (Speaking: ${window.speechSynthesis.speaking})`,
      );
      return isSpeaking;
    } catch (err) {
      console.error("❌ Gagal memainkan audio:", err);
    }
  };

  // =========================================================================
  // INTEGRASI: GET MONITOR REAL-TIME DARI SUPABASE + AUDIO DETECTION
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

          setMasterLoket((prevMaster) => {
            const updatedMaster = prevMaster.map((loket) => {
              const dipanggil = sedangDipanggil.find(
                (a) => a.nomor_loket === loket.kode,
              );

              let menunggu = [];
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

              const nomorBaru = dipanggil ? dipanggil.nomor_display : "—";
              const nomorLama = previousNomorRef.current[loket.kode];

              // DEBUG: Log setiap loket
              console.log(
                `[${loket.kode}] Lama: ${nomorLama} → Baru: ${nomorBaru}`,
              );

              // DETECT PERUBAHAN NOMOR DAN PLAY AUDIO
              if (nomorBaru !== "—" && nomorBaru !== nomorLama) {
                console.log(
                  `✨ PERUBAHAN TERDETEKSI Loket ${loket.kode}: ${nomorLama} → ${nomorBaru}`,
                );
                playAnnouncementAudio(nomorBaru, loket.kode);
              }

              // Update previousNomorRef untuk loket ini
              previousNomorRef.current[loket.kode] = nomorBaru;

              return {
                ...loket,
                aktif: nomorBaru,
                selanjutnya: menunggu,
                sisa: menunggu.length,
                estimasi: menunggu.length * 3,
              };
            });

            return updatedMaster;
          });
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data monitor TV:", err.message);
      }
    };

    // Jalankan setiap 2 detik untuk membaca perubahan real-time
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 2000);
    return () => clearInterval(interval);
  }, []); // Dependency array kosong - useRef tidak perlu di-include

  // RESTRUKTURISASI DATA 4 KATEGORI UTAMA UNTUK DISPLAY TV UMUM
  const layananMonitorList = [
    {
      kategori: "Keuangan",
      judul: "KEUANGAN",
      subLayanan: "Yayasan",
      kodeDisplay: "LOKET 1A / 1B",
      status:
        masterLoket.find((l) => l.kode === "1A")?.status === "Buka" ||
        masterLoket.find((l) => l.kode === "1B")?.status === "Buka"
          ? "Buka"
          : "Tutup",
      // Mencari meja fisik mana yang sedang memegang nomor aktif saat ini
      konterFisikAktif:
        masterLoket.find(
          (l) =>
            l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "Buka",
        )?.kode || "1A",
      aktifDisplay: masterLoket.find((l) => l.kode === "1A")?.aktif || "—",
      // Pool Daftar Tunggu Gabungan Berurutan Maju
      selanjutnyaList: [
        ...(masterLoket.find((l) => l.kode === "1A")?.selanjutnya || []),
        ...(masterLoket.find((l) => l.kode === "1B")?.selanjutnya || []),
      ].sort(),
    },
    {
      kategori: "Akademik",
      judul: "AKADEMIK",
      subLayanan: "BAAK",
      kodeDisplay: "LOKET 2",
      status: masterLoket.find((l) => l.kode === "2")?.status || "Tutup",
      konterFisikAktif: "2",
      aktifDisplay: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      selanjutnyaList:
        masterLoket.find((l) => l.kode === "2")?.selanjutnya || [],
    },
    {
      kategori: "Umum",
      judul: "UMUM",
      subLayanan: "BAU",
      kodeDisplay: "LOKET 3",
      status: masterLoket.find((l) => l.kode === "3")?.status || "Tutup",
      konterFisikAktif: "3",
      aktifDisplay: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      selanjutnyaList:
        masterLoket.find((l) => l.kode === "3")?.selanjutnya || [],
    },
    {
      kategori: "Kemahasiswaan",
      judul: "KEMAHASISWAAN",
      subLayanan: "Beasiswa",
      kodeDisplay: "LOKET 4",
      status: masterLoket.find((l) => l.kode === "4")?.status || "Tutup",
      konterFisikAktif: "4",
      aktifDisplay: masterLoket.find((l) => l.kode === "4")?.aktif || "—",
      selanjutnyaList:
        masterLoket.find((l) => l.kode === "4")?.selanjutnya || [],
    },
  ];

  return {
    masterLoket, // Tetap di-export untuk kompatibilitas basic
    layananMonitorList,
  };
}
