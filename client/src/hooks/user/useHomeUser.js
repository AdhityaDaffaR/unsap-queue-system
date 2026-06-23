import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../config/api";
import { useLoket } from "../../context/LoketContext";

const getToken = () => sessionStorage.getItem("tokenMahasiswa");
const getIsLoggedIn = () => sessionStorage.getItem("isLoggedInUser") === "true" && !!getToken();

const formatNamaMahasiswa = (namaLengkap) => {
  if (!namaLengkap) return "Guest Civitas";
  const kata = namaLengkap.trim().split(/\s+/);
  if (kata.length <= 2) return namaLengkap;
  const duaKataPertama = kata.slice(0, 2).join(" ");
  const sisaInisial = kata.slice(2).map((k) => `${k.charAt(0).toUpperCase()}.`).join(" ");
  return `${duaKataPertama} ${sisaInisial}`;
};

const getProfile = () => {
  const saved = sessionStorage.getItem("userProfileData");
  if (saved) {
    const parsed = JSON.parse(saved);
    return { nama: formatNamaMahasiswa(parsed.nama), nim: parsed.npm || "—" };
  }
  return { nama: "Guest Civitas", nim: "—" };
};

export default function useHomeUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);
  const [userProfile, setUserProfile] = useState(getProfile);

  useEffect(() => {
    const sync = () => {
      setIsLoggedIn(getIsLoggedIn());
      setUserProfile(getProfile());
    };
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("storage", sync); };
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthWarningModal, setShowAuthWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [nomorTiketBaru, setNomorTiketBaru] = useState(() => {
    return sessionStorage.getItem("nomorTiketAktif") || "";
  });

  const { masterLoket, layananList, refreshMonitorData } = useLoket();

  const [selectedKategori, setSelectedKategori] = useState("Keuangan");

  useEffect(() => {
    if (location.state && location.state.autoSelectLoketId) {
      const target = masterLoket.find((l) => l.id_layanan === location.state.autoSelectLoketId);
      if (target) setSelectedKategori(target.kategori); // eslint-disable-line react-hooks/set-state-in-effect
      navigate("/", { replace: true, state: {} });
    }
  }, [location.state, navigate, masterLoket]);

  const layananAktif = layananList.find((l) => l.kategori === selectedKategori) || layananList[0] || { status: "Tutup", aktifDisplay: "—", kodeDisplay: "", sisa: 0, judulTampilan: "Memuat Data...", subTeks: "", selanjutnyaList: [] };
  const loketPemanggil = masterLoket.find((l) => l.aktif === nomorTiketBaru && l.status === "buka");

  const handleAmbilAntrean = async () => {
    if (layananAktif.status === "Tutup" || nomorTiketBaru) return;
    if (!isLoggedIn) { setShowAuthWarningModal(true); return; }
    const savedProfile = sessionStorage.getItem("userProfileData");
    if (!savedProfile) { setShowAuthWarningModal(true); return; }
    const npmMahasiswa = JSON.parse(savedProfile).npm;
    const token = getToken();
    const targetLayanan = layananList.find(l => l.kategori === selectedKategori);
    if (!targetLayanan) { alert("Kategori layanan tidak tersedia. Silakan pilih ulang."); return; }
    const targetIdLayanan = targetLayanan.id;
    try {
      const resData = await api.post("/api/antrean/ambil", { id_layanan: targetIdLayanan, npm_mahasiswa: npmMahasiswa }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal mencetak nomor antrean.");
      const tiketBaru = resData.data.nomor_display;
      const idAntreanDB = resData.data.id;
      setNomorTiketBaru(tiketBaru);
      sessionStorage.setItem("nomorTiketAktif", tiketBaru);
      sessionStorage.setItem("idAntreanAktif", idAntreanDB);
      setShowSuccessModal(true);
      refreshMonitorData();
    } catch (err) {
      alert("Kesalahan: " + err.message);
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
      refreshMonitorData();
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
