import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../config/supabase";
import { api } from "../../config/api";

export default function useDisplayMonitor() {
  const [masterLoket, setMasterLoket] = useState([
    { id_layanan: 1, kode: "1A", kategori: "Keuangan", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 1, kode: "1B", kategori: "Keuangan", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 2, kode: "2", kategori: "Akademik", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 3, kode: "3", kategori: "Umum", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 4, kode: "4", kategori: "Kemahasiswaan", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
  ]);

  const previousNomorRef = useRef({ "1A": "—", "1B": "—", 2: "—", 3: "—", 4: "—" });
  const audioReadyRef = useRef(false);
  const preferredVoiceRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);

  const getPreferredVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const indo = voices.find((v) => v.lang.startsWith("id"));
    if (indo) return indo;
    const msMy = voices.find((v) => v.lang.startsWith("ms"));
    if (msMy) return msMy;
    return voices.find((v) => v.lang.startsWith("en")) || null;
  };

  useEffect(() => {
    const loadVoices = () => { preferredVoiceRef.current = getPreferredVoice(); };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const activateAudio = () => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
      audioReadyRef.current = true;
      setAudioReady(true);
    } catch (err) { console.error("❌ Gagal mengaktifkan audio:", err); }
  };

  const playAnnouncementAudio = (nomorDisplay, loketKode) => {
    if (!audioReadyRef.current) return;
    try {
      const message = `Nomor antrian ${nomorDisplay}, silahkan menuju loket ${loketKode}`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      if (preferredVoiceRef.current) utterance.voice = preferredVoiceRef.current;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (err) { console.error("❌ Gagal memainkan audio:", err); }
  };

  const fetchMonitorData = useCallback(async () => {
    try {
      const resData = await api.get("/api/antrean/monitor");
      if (resData.success) {
        const { sedangDipanggil, sedangMenunggu } = resData.data;
        setMasterLoket((prev) =>
          prev.map((loket) => {
            const dipanggil = sedangDipanggil.find((a) => a.nomor_loket === loket.kode);
            let menunggu = [];
            if (["1A", "2", "3", "4"].includes(loket.kode)) {
              menunggu = sedangMenunggu.filter((a) => a.id_layanan === loket.id_layanan).map((a) => a.nomor_display);
            }
            const nomorBaru = dipanggil ? dipanggil.nomor_display : "—";
            const nomorLama = previousNomorRef.current[loket.kode];
            if (nomorBaru !== "—" && nomorBaru !== nomorLama) {
              playAnnouncementAudio(nomorBaru, loket.kode);
            }
            previousNomorRef.current[loket.kode] = nomorBaru;
            return { ...loket, aktif: nomorBaru, selanjutnya: menunggu, sisa: menunggu.length };
          })
        );
      }
    } catch (err) { console.error("Gagal menarik data monitor:", err.message); }
  }, []);

  const fetchMasterLoket = useCallback(async () => {
    try {
      const resData = await api.get("/api/loket");
      if (resData.success) {
        setMasterLoket((prev) =>
          prev.map((lokal) => {
            const fromDB = resData.data.find((db) => db.kode_loket === lokal.kode);
            return fromDB ? { ...lokal, status: fromDB.status } : lokal;
          })
        );
      }
    } catch (err) { console.error("Gagal memuat master loket:", err); }
  }, []);

  useEffect(() => { fetchMasterLoket(); /* eslint-disable-line react-hooks/set-state-in-effect */ }, [fetchMasterLoket]);

  useEffect(() => {
    fetchMonitorData();
    const channels = [
      supabase.channel("display_antrean")
        .on("postgres_changes", { event: "*", schema: "public", table: "antrean" }, fetchMonitorData)
        .subscribe(),
      supabase.channel("display_loket")
        .on("postgres_changes", { event: "*", schema: "public", table: "loket" }, () => { fetchMasterLoket(); fetchMonitorData(); })
        .subscribe(),
      supabase.channel("realtime_sync")
        .on("broadcast", { event: "panggil_ulang" }, (payload) => {
          playAnnouncementAudio(payload.payload.nomor_display, payload.payload.loket);
        })
        .on("broadcast", { event: "antrean_berubah" }, fetchMonitorData)
        .on("broadcast", { event: "loket_berubah" }, () => { fetchMasterLoket(); fetchMonitorData(); })
        .subscribe(),
    ];
    return () => {
      channels.forEach((c) => supabase.removeChannel(c));
    };
  }, [fetchMonitorData, fetchMasterLoket]);

  const layananMonitorList = [
    {
      kategori: "Keuangan", judul: "KEUANGAN", subLayanan: "Yayasan", kodeDisplay: "LOKET 1A / 1B",
      status: masterLoket.find((l) => l.kode === "1A")?.status === "buka" || masterLoket.find((l) => l.kode === "1B")?.status === "buka" ? "Buka" : "Tutup",
      konterFisikAktif: masterLoket.find((l) => l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "buka")?.kode || "1A",
      aktifDisplay: masterLoket.find((l) => l.kode === "1A")?.aktif || "—",
      selanjutnyaList: [...(masterLoket.find((l) => l.kode === "1A")?.selanjutnya || []), ...(masterLoket.find((l) => l.kode === "1B")?.selanjutnya || [])].sort(),
    },
    {
      kategori: "Akademik", judul: "AKADEMIK", subLayanan: "BAAK", kodeDisplay: "LOKET 2",
      status: masterLoket.find((l) => l.kode === "2")?.status === "buka" ? "Buka" : "Tutup",
      konterFisikAktif: "2",
      aktifDisplay: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "2")?.selanjutnya || [],
    },
    {
      kategori: "Umum", judul: "UMUM", subLayanan: "BAU", kodeDisplay: "LOKET 3",
      status: masterLoket.find((l) => l.kode === "3")?.status === "buka" ? "Buka" : "Tutup",
      konterFisikAktif: "3",
      aktifDisplay: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "3")?.selanjutnya || [],
    },
    {
      kategori: "Kemahasiswaan", judul: "KEMAHASISWAAN", subLayanan: "Beasiswa", kodeDisplay: "LOKET 4",
      status: masterLoket.find((l) => l.kode === "4")?.status === "buka" ? "Buka" : "Tutup",
      konterFisikAktif: "4",
      aktifDisplay: masterLoket.find((l) => l.kode === "4")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "4")?.selanjutnya || [],
    },
  ];

  return { masterLoket, layananMonitorList, audioReady, activateAudio };
}
