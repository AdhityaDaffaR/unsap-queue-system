import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { api } from "../../config/api";
import { useLoket } from "../../context/LoketContext";

const formatNamaMahasiswa = (namaLengkap) => {
  if (!namaLengkap) return "Guest Civitas";
  const kata = namaLengkap.trim().split(/\s+/);
  if (kata.length <= 2) return namaLengkap;
  const duaKataPertama = kata.slice(0, 2).join(" ");
  const sisaInisial = kata.slice(2).map((k) => `${k.charAt(0).toUpperCase()}.`).join(" ");
  return `${duaKataPertama} ${sisaInisial}`;
};

const getIsLoggedIn = () => sessionStorage.getItem("isLoggedInUser") === "true";
const getProfile = () => {
  const saved = sessionStorage.getItem("userProfileData");
  if (saved) {
    const parsed = JSON.parse(saved);
    return { nama: formatNamaMahasiswa(parsed.nama), nim: parsed.npm || "—" };
  }
  return { nama: "Guest Civitas", nim: "—" };
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

  const { masterLoket, setMasterLoket } = useLoket();

  const fetchMonitorData = useCallback(async () => {
    try {
      const resData = await api.get("/api/antrean/monitor");
      if (resData.success) {
        const { sedangDipanggil, sedangMenunggu } = resData.data;
        setMasterLoket((prev) =>
          prev.map((loket) => {
            const dipanggil = sedangDipanggil.find((a) => a.nomor_loket === loket.kode);
            let menunggu = [];
            if (["1A", "1B", "2", "3", "4"].includes(loket.kode)) {
              menunggu = sedangMenunggu.filter((a) => a.id_layanan === loket.id_layanan).map((a) => a.nomor_display);
            }
            return { ...loket, aktif: dipanggil ? dipanggil.nomor_display : "—", selanjutnya: menunggu, sisa: menunggu.length, estimasi: Math.ceil(menunggu.length * (loket.estimasi_waktu || 3)) };
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
      supabase.channel("realtime_sync")
        .on("broadcast", { event: "antrean_berubah" }, fetchMonitorData)
        .subscribe(),
    ];
    return () => channels.forEach((c) => supabase.removeChannel(c));
  }, [fetchMonitorData]);

  const handleLogout = () => {
    ["tokenMahasiswa", "isLoggedInUser", "userProfileData", "nomorTiketAktif", "idAntreanAktif"].forEach((k) => sessionStorage.removeItem(k));
    setIsLoggedIn(false);
    navigate("/");
  };

  const layananList = [
    {
      id: 1, kategori: "Keuangan", judulTampilan: "KEUANGAN", subTeks: "Yayasan", kodeDisplay: "LOKET 1A / 1B",
      status: masterLoket.find((l) => l.kode === "1A")?.status === "buka" || masterLoket.find((l) => l.kode === "1B")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "1A")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "1A")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "1A")?.aktif !== "—"
        ? masterLoket.find((l) => l.kode === "1A")?.aktif
        : masterLoket.find((l) => l.kode === "1B")?.aktif || "—",
      konterFisikAktif: masterLoket.find((l) => l.kategori === "Keuangan" && l.aktif !== "—" && l.status === "buka")?.kode || null,
    },
    {
      id: 2, kategori: "Akademik", judulTampilan: "AKADEMIK", subTeks: "BAAK", kodeDisplay: "LOKET 2",
      status: masterLoket.find((l) => l.kode === "2")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "2")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "2")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      konterFisikAktif: "2",
    },
    {
      id: 3, kategori: "Umum", judulTampilan: "UMUM", subTeks: "BAU", kodeDisplay: "LOKET 3",
      status: masterLoket.find((l) => l.kode === "3")?.status === "buka" ? "Buka" : "Tutup",
      sisaAntrean: masterLoket.find((l) => l.kode === "3")?.sisa || 0,
      estimasi: masterLoket.find((l) => l.kode === "3")?.estimasi || 0,
      nomorAktif: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      konterFisikAktif: "3",
    },
    {
      id: 4, kategori: "Kemahasiswaan", judulTampilan: "KEMAHASISWAAN", subTeks: "Beasiswa & Kemahasiswaan", kodeDisplay: "LOKET 4",
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
