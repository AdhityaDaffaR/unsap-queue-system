import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { api } from "../../config/api";

const REALTIME_CHANNEL = "realtime_sync";

export default function useHomeUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => sessionStorage.getItem("tokenMahasiswa");

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedInUser") === "true" && !!getToken();
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthWarningModal, setShowAuthWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [nomorTiketBaru, setNomorTiketBaru] = useState(() => {
    return sessionStorage.getItem("nomorTiketAktif") || "";
  });

  const formatNamaMahasiswa = (namaLengkap) => {
    if (!namaLengkap) return "Guest Civitas";
    const kata = namaLengkap.trim().split(/\s+/);
    if (kata.length <= 2) return namaLengkap;
    const duaKataPertama = kata.slice(0, 2).join(" ");
    const sisaInisial = kata.slice(2).map((k) => `${k.charAt(0).toUpperCase()}.`).join(" ");
    return `${duaKataPertama} ${sisaInisial}`;
  };

  const [userProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem("userProfileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      return { nama: formatNamaMahasiswa(parsed.nama), nim: parsed.npm || "—" };
    }
    return { nama: "Guest Civitas", nim: "—" };
  });

  const [masterLoket, setMasterLoket] = useState([
    { id_layanan: 1, kode: "1A", nama: "Loket 1A - Pembayaran Yayasan", kategori: "Keuangan", aktif: "—", sisa: 0, status: "buka", selanjutnya: [] },
    { id_layanan: 1, kode: "1B", nama: "Loket 1B - Pembayaran Yayasan", kategori: "Keuangan", aktif: "—", sisa: 0, status: "buka", selanjutnya: [] },
    { id_layanan: 2, kode: "2", nama: "Loket 2 - BAAK (Akademik)", kategori: "Akademik", aktif: "—", sisa: 0, status: "buka", selanjutnya: [] },
    { id_layanan: 3, kode: "3", nama: "Loket 3 - BAU (Keuangan)", kategori: "Umum", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
    { id_layanan: 4, kode: "4", nama: "Loket 4 - Beasiswa & Kemahasiswaan", kategori: "Kemahasiswaan", aktif: "—", sisa: 0, status: "tutup", selanjutnya: [] },
  ]);

  const [selectedKategori, setSelectedKategori] = useState("Keuangan");

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
            return { ...loket, aktif: dipanggil ? dipanggil.nomor_display : "—", selanjutnya: menunggu, sisa: menunggu.length };
          })
        );
      }
    } catch (err) {
      console.error("Gagal sinkronisasi:", err.message);
    }
  }, []);

  const fetchMasterLoket = useCallback(async () => {
    try {
      const resData = await api.get("/api/loket");
      if (resData.success) {
        const loketDB = resData.data;
        setMasterLoket((prev) =>
          prev.map((lokal) => {
            const fromDB = loketDB.find((db) => db.kode_loket === lokal.kode);
            return fromDB ? { ...lokal, status: fromDB.status } : lokal;
          })
        );
      }
    } catch (err) {
      console.error("Gagal memuat master loket:", err);
    }
  }, []);

  useEffect(() => {
    fetchMasterLoket();
  }, [fetchMasterLoket]);

  useEffect(() => {
    fetchMonitorData();
    const channels = [
      supabase.channel(`${REALTIME_CHANNEL}_home_${Date.now()}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "antrean" }, fetchMonitorData)
        .subscribe(),
      supabase.channel(REALTIME_CHANNEL)
        .on("broadcast", { event: "antrean_berubah" }, fetchMonitorData)
        .on("broadcast", { event: "loket_berubah" }, () => { fetchMasterLoket(); fetchMonitorData(); })
        .subscribe(),
    ];
    const interval = setInterval(fetchMonitorData, 3000);
    return () => {
      channels.forEach((c) => supabase.removeChannel(c));
      clearInterval(interval);
    };
  }, [fetchMonitorData, fetchMasterLoket]);

  useEffect(() => {
    if (location.state && location.state.autoSelectLoketId) {
      const target = masterLoket.find((l) => l.id === location.state.autoSelectLoketId);
      if (target) setSelectedKategori(target.kategori);
      navigate("/", { replace: true, state: {} });
    }
  }, [location.state, navigate, masterLoket]);

  const layananList = [
    {
      kategori: "Keuangan", judulTampilan: "KEUANGAN", kodeDisplay: "LOKET 1A / 1B", subTeks: "Yayasan",
      status: masterLoket.find((l) => l.kode === "1A")?.status === "buka" || masterLoket.find((l) => l.kode === "1B")?.status === "buka" ? "Buka" : "Tutup",
      sisa: (masterLoket.find((l) => l.kode === "1A")?.sisa || 0) + (masterLoket.find((l) => l.kode === "1B")?.sisa || 0),
      aktifDisplay: masterLoket.find((l) => l.kode === "1A")?.aktif || "—",
      selanjutnyaList: [...(masterLoket.find((l) => l.kode === "1A")?.selanjutnya || []), ...(masterLoket.find((l) => l.kode === "1B")?.selanjutnya || [])].sort(),
    },
    {
      kategori: "Akademik", judulTampilan: "AKADEMIK", kodeDisplay: "LOKET 2", subTeks: "BAAK",
      status: masterLoket.find((l) => l.kode === "2")?.status === "buka" ? "Buka" : "Tutup",
      sisa: masterLoket.find((l) => l.kode === "2")?.sisa || 0,
      aktifDisplay: masterLoket.find((l) => l.kode === "2")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "2")?.selanjutnya || [],
    },
    {
      kategori: "Umum", judulTampilan: "UMUM", kodeDisplay: "LOKET 3", subTeks: "BAU",
      status: masterLoket.find((l) => l.kode === "3")?.status === "buka" ? "Buka" : "Tutup",
      sisa: masterLoket.find((l) => l.kode === "3")?.sisa || 0,
      aktifDisplay: masterLoket.find((l) => l.kode === "3")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "3")?.selanjutnya || [],
    },
    {
      kategori: "Kemahasiswaan", judulTampilan: "KEMAHASISWAAN", kodeDisplay: "LOKET 4", subTeks: "Beasiswa & Kemahasiswaan",
      status: masterLoket.find((l) => l.kode === "4")?.status === "buka" ? "Buka" : "Tutup",
      sisa: masterLoket.find((l) => l.kode === "4")?.sisa || 0,
      aktifDisplay: masterLoket.find((l) => l.kode === "4")?.aktif || "—",
      selanjutnyaList: masterLoket.find((l) => l.kode === "4")?.selanjutnya || [],
    },
  ];

  const layananAktif = layananList.find((l) => l.kategori === selectedKategori) || layananList[0];
  const loketPemanggil = masterLoket.find((l) => l.aktif === nomorTiketBaru && l.status === "buka");

  const handleAmbilAntrean = async () => {
    if (layananAktif.status === "Tutup" || nomorTiketBaru) return;
    if (!isLoggedIn) { setShowAuthWarningModal(true); return; }
    const savedProfile = sessionStorage.getItem("userProfileData");
    if (!savedProfile) { setShowAuthWarningModal(true); return; }
    const npmMahasiswa = JSON.parse(savedProfile).npm;
    const token = getToken();
    let targetIdLayanan = 1;
    if (selectedKategori === "Keuangan") targetIdLayanan = 1;
    if (selectedKategori === "Akademik") targetIdLayanan = 2;
    if (selectedKategori === "Umum") targetIdLayanan = 3;
    if (selectedKategori === "Kemahasiswaan") targetIdLayanan = 4;
    try {
      const resData = await api.post("/api/antrean/ambil", { id_layanan: targetIdLayanan, npm_mahasiswa: npmMahasiswa }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal mencetak nomor antrean.");
      const tiketBaru = resData.data.nomor_display;
      const idAntreanDB = resData.data.id;
      setNomorTiketBaru(tiketBaru);
      sessionStorage.setItem("nomorTiketAktif", tiketBaru);
      sessionStorage.setItem("idAntreanAktif", idAntreanDB);
      setShowSuccessModal(true);
      fetchMonitorData();
    } catch (err) {
      if (err.message.includes("403") || err.message.includes("Akses")) setShowAuthWarningModal(true);
      else alert("Kesalahan: " + err.message);
    }
  };

  const handleBatalkanAntrean = () => setShowCancelConfirmModal(true);

  const handleConfirmPembatalan = async () => {
    const idAntrean = sessionStorage.getItem("idAntreanAktif");
    const token = getToken();
    if (!idAntrean) { alert("Referensi ID tiket tidak ditemukan."); return; }
    try {
      const resData = await api.patch("/api/antrean/batal", { id_antrean: idAntrean }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal membatalkan tiket.");
      setNomorTiketBaru("");
      sessionStorage.removeItem("nomorTiketAktif");
      sessionStorage.removeItem("idAntreanAktif");
      setShowCancelConfirmModal(false);
      fetchMonitorData();
    } catch (err) { alert("Kesalahan: " + err.message); }
  };

  const triggerLogoutConfirm = () => setShowLogoutModal(true);

  const handleConfirmLogout = () => {
    ["tokenMahasiswa", "isLoggedInUser", "userProfileData", "nomorTiketAktif", "idAntreanAktif"].forEach((k) => sessionStorage.removeItem(k));
    setIsLoggedIn(false); setIsMenuOpen(false); setNomorTiketBaru(""); setShowLogoutModal(false);
    navigate("/");
  };

  return {
    navigate, isLoggedIn, isMenuOpen, setIsMenuOpen, userProfile, layananList,
    selectedKategori, setSelectedKategori, layananAktif, handleAmbilAntrean,
    handleLogout: triggerLogoutConfirm, handleConfirmLogout,
    showAuthWarningModal, setShowAuthWarningModal,
    showSuccessModal, setShowSuccessModal, nomorTiketBaru,
    handleBatalkanAntrean, showCancelConfirmModal, setShowCancelConfirmModal,
    handleConfirmPembatalan, loketPemanggil, masterLoket,
    showLogoutModal, setShowLogoutModal,
  };
}
