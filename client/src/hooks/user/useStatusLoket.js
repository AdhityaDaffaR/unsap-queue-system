import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { api } from "../../config/api";

const getIsLoggedIn = () => sessionStorage.getItem("isLoggedInUser") === "true";
const getProfile = () => {
  const saved = sessionStorage.getItem("userProfileData");
  return saved ? JSON.parse(saved) : { nama: "Guest Civitas", nim: "—" };
};

export default function useStatusLoket() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);
  const [userProfile, setUserProfile] = useState(getProfile);

  useEffect(() => {
    const sync = () => { setIsLoggedIn(getIsLoggedIn()); setUserProfile(getProfile()); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const [masterLoket, setMasterLoket] = useState([
    { id_layanan: 1, kode: "1A", kategori: "Keuangan", aktif: "—", sisa: 0, estimasi: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 1, kode: "1B", kategori: "Keuangan", aktif: "—", sisa: 0, estimasi: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 2, kode: "2", kategori: "Akademik", aktif: "—", sisa: 0, estimasi: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 3, kode: "3", kategori: "Umum", aktif: "—", sisa: 0, estimasi: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 4, kode: "4", kategori: "Kemahasiswaan", aktif: "—", sisa: 0, estimasi: 0, status: "tutup", selanjutnya: [] },
  ]);

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
            return { ...loket, aktif: dipanggil ? dipanggil.nomor_display : "—", selanjutnya: menunggu, sisa: menunggu.length, estimasi: menunggu.length * 3 };
          })
        );
      }
    } catch (err) { console.error("Gagal sinkronisasi data monitor:", err.message); }
  }, []);

  useEffect(() => {
    fetchMonitorData(); // eslint-disable-line react-hooks/set-state-in-effect
    const channels = [
      supabase.channel("status_loket_antrean")
        .on("postgres_changes", { event: "*", schema: "public", table: "antrean" }, fetchMonitorData)
        .subscribe(),
      supabase.channel("status_loket_loket")
        .on("postgres_changes", { event: "*", schema: "public", table: "loket" }, () => { fetchMasterLoket(); fetchMonitorData(); })
        .subscribe(),
      supabase.channel("realtime_sync")
        .on("broadcast", { event: "antrean_berubah" }, fetchMonitorData)
        .on("broadcast", { event: "loket_berubah" }, () => { fetchMasterLoket(); fetchMonitorData(); })
        .subscribe(),
    ];
    return () => channels.forEach((c) => supabase.removeChannel(c));
  }, [fetchMonitorData, fetchMasterLoket]);

  const handleLogout = () => {
    ["tokenMahasiswa", "isLoggedInUser", "userProfileData", "nomorTiketAktif", "idAntreanAktif"].forEach((k) => sessionStorage.removeItem(k));
    setIsLoggedIn(false);
    navigate("/");
  };

  const layananList = [
    {
      id: 1, kategori: "Keuangan", judulTampilan: "KEUANGAN", subTeks: "Yayasan", kodeDisplay: "LOKET 1A / 1B",
      status: masterLoket.find((l) => l.kode === "1A")?.status === "buka" || masterLoket.find((l) => l.kode === "1B")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: (masterLoket.find((l) => l.kode === "1A")?.sisa || 0) + (masterLoket.find((l) => l.kode === "1B")?.sisa || 0),
      estimasi: (masterLoket.find((l) => l.kode === "1A")?.estimasi || 0) + (masterLoket.find((l) => l.kode === "1B")?.estimasi || 0),
      nomorAktif: masterLoket.find((l) => l.kode === "1A")?.aktif || "—",
      konterFisikAktif: masterLoket.find((l) => l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "buka")?.kode || null,
    },
    {
      id: 3, kategori: "Akademik", judulTampilan: "AKADEMIK", subTeks: "BAAK", kodeDisplay: "LOKET 2",
      status: masterLoket.find((l) => l.kode === "2")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "2")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "2")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      konterFisikAktif: "2",
    },
    {
      id: 4, kategori: "Umum", judulTampilan: "UMUM", subTeks: "BAU", kodeDisplay: "LOKET 3",
      status: masterLoket.find((l) => l.kode === "3")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "3")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "3")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      konterFisikAktif: "3",
    },
    {
      id: 5, kategori: "Kemahasiswaan", judulTampilan: "KEMAHASISWAAN", subTeks: "Beasiswa & Kemahasiswaan", kodeDisplay: "LOKET 4",
      status: masterLoket.find((l) => l.kode === "4")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "4")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "4")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "4")?.aktif || "—",
      konterFisikAktif: "4",
    },
  ];

  const layananTersaring = layananList.filter(
    (layanan) =>
      layanan.subTeks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.kodeDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.kategori.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return { isLoggedIn, userProfile, handleLogout, searchQuery, setSearchQuery, daftarLoket: layananTersaring };
}
