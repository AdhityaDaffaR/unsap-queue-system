import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { api } from "../../config/api";

const REALTIME_CHANNEL = "realtime_sync";

export default function useDashboardAdmin() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("tokenAdmin");
  const isAdminLoggedIn = !!token;

  const [adminProfile] = useState(() => {
    const saved = sessionStorage.getItem("adminProfileData");
    return saved && isAdminLoggedIn ? JSON.parse(saved) : { username: "", nama: "", id_layanan: null };
  });

  const [loketInfo, setLoketInfo] = useState(() => {
    const saved = sessionStorage.getItem("loket_tugas_aktif");
    return saved && isAdminLoggedIn ? JSON.parse(saved) : { id: null, kode: "—", nama: "Meja Non-Aktif", status: "tutup", id_layanan: null };
  });

  const [nomorAktif, setNomorAktif] = useState("—");
  const [sisaAntrean, setSisaAntrean] = useState(0);
  const [daftarSelanjutnya, setDaftarSelanjutnya] = useState([]);
  const [daftarDilewati, setDaftarDilewati] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [listLoketTugas, setListLoketTugas] = useState([]);

  const monitorParams = {
    kode: loketInfo.kode,
    idLayanan: loketInfo.id_layanan,
    isActive: isAdminLoggedIn && loketInfo.kode && loketInfo.kode !== "—",
  };

  const fetchMonitorData = useCallback(async () => {
    if (!monitorParams.isActive) return;
    try {
      const resData = await api.get("/api/antrean/monitor");
      if (resData.success) {
        const { sedangDipanggil, sedangMenunggu, sedangDilewati } = resData.data;
        const tiketPanggil = sedangDipanggil.find((t) => t.nomor_loket === monitorParams.kode);
        setNomorAktif(tiketPanggil ? tiketPanggil.nomor_display : "—");
        setDaftarSelanjutnya(sedangMenunggu.filter((t) => t.id_layanan === monitorParams.idLayanan).map((t) => t.nomor_display));
        setSisaAntrean(sedangMenunggu.filter((t) => t.id_layanan === monitorParams.idLayanan).length);
        setDaftarDilewati(sedangDilewati.filter((t) => t.id_layanan === monitorParams.idLayanan));
      }
    } catch (err) { console.error("Gagal sinkronisasi:", err); }
  }, [monitorParams.isActive, monitorParams.kode, monitorParams.idLayanan]);

  useEffect(() => {
    if (!monitorParams.isActive) return;
    fetchMonitorData();
    const channels = [
      supabase.channel(`admin_dashboard_${Date.now()}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "antrean" }, fetchMonitorData)
        .subscribe(),
      supabase.channel(REALTIME_CHANNEL)
        .on("broadcast", { event: "antrean_berubah" }, fetchMonitorData)
        .on("broadcast", { event: "loket_berubah" }, fetchMonitorData)
        .subscribe(),
    ];
    const interval = setInterval(fetchMonitorData, 3000);
    return () => {
      channels.forEach((c) => supabase.removeChannel(c));
      clearInterval(interval);
    };
  }, [monitorParams.isActive, monitorParams.kode, monitorParams.idLayanan, fetchMonitorData]);

  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const fetchLoketMaster = async () => {
      try {
        const resData = await api.get("/api/loket", token);
        if (resData.success) setListLoketTugas(resData.data);
      } catch (err) { console.error("Gagal memuat data loket:", err); }
    };
    fetchLoketMaster();
  }, [isAdminLoggedIn]);

  const handleNext = async () => {
    if (!isAdminLoggedIn || loketInfo.status === "tutup" || daftarSelanjutnya.length === 0) return;
    setIsCalling(true);
    try {
      const resData = await api.patch("/api/antrean/panggil", { id_layanan: loketInfo.id_layanan, nomor_loket: loketInfo.kode }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal memanggil antrean.");
      await supabase.channel(REALTIME_CHANNEL).send({ type: "broadcast", event: "antrean_berubah", payload: {} });
      setTimeout(() => setIsCalling(false), 600);
    } catch (err) { alert("Kesalahan: " + err.message); setIsCalling(false); }
  };

  const handleRecall = async () => {
    if (!isAdminLoggedIn || loketInfo.status === "tutup" || nomorAktif === "—") return;
    setIsCalling(true);
    try {
      await supabase.channel(REALTIME_CHANNEL).send({
        type: "broadcast", event: "panggil_ulang",
        payload: { nomor_display: nomorAktif, loket: loketInfo.kode },
      });
    } catch (err) { alert("Gagal mengirim sinyal: " + err.message); }
    finally { setTimeout(() => setIsCalling(false), 600); }
  };

  const handleSkip = async () => {
    if (!isAdminLoggedIn || loketInfo.status === "tutup" || nomorAktif === "—") return;
    setIsCalling(true);
    try {
      const resData = await api.patch("/api/antrean/lewati", { nomor_loket: loketInfo.kode }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal menahan nomor.");
      await handleNext();
    } catch (err) { alert("Kesalahan: " + err.message); setIsCalling(false); }
  };

  const handlePanggilDilewati = async (ticket) => {
    if (!isAdminLoggedIn || loketInfo.status === "tutup" || !ticket?.id) return;
    setIsCalling(true);
    try {
      const resData = await api.patch("/api/antrean/panggil-dilewati", { id_antrean: ticket.id, nomor_loket: loketInfo.kode }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal memanggil nomor hold.");
      setNomorAktif(ticket.nomor_display);
      setDaftarDilewati((prev) => prev.filter((item) => item.id !== ticket.id));
      await supabase.channel(REALTIME_CHANNEL).send({ type: "broadcast", event: "antrean_berubah", payload: {} });
    } catch (err) { alert("Kesalahan: " + err.message); }
    finally { setTimeout(() => setIsCalling(false), 600); }
  };

  const triggerStatusToggle = () => { if (isAdminLoggedIn) setShowConfirmModal(true); };

  const handleConfirmStatusToggle = async () => {
    if (!isAdminLoggedIn || !loketInfo.id) return;
    const nextStatus = loketInfo.status === "buka" ? "tutup" : "buka";
    try {
      const resData = await api.patch("/api/loket/status", { id_loket: loketInfo.id, status: nextStatus }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal mengubah status loket.");
      const updated = { id: resData.data.id, kode: resData.data.kode_loket, nama: resData.data.nama_loket, id_layanan: resData.data.id_layanan, status: resData.data.status };
      setLoketInfo(updated);
      sessionStorage.setItem("loket_tugas_aktif", JSON.stringify(updated));
      setShowConfirmModal(false);
    } catch (err) { alert("Kesalahan: " + err.message); }
  };

  const handleSwitchLoket = async (loketBaru) => {
    if (!isAdminLoggedIn) return;
    try {
      const resData = await api.patch("/api/loket/pilih", { id_loket: loketBaru.id }, token);
      if (!resData.success) throw new Error(resData.message || "Gagal pindah loket.");
      const updated = { id: resData.data.id, kode: resData.data.kode_loket, nama: resData.data.nama_loket, id_layanan: resData.data.id_layanan, status: resData.data.status };
      setLoketInfo(updated);
      sessionStorage.setItem("loket_tugas_aktif", JSON.stringify(updated));
      setShowSwitchModal(false);
    } catch (err) { alert("Kesalahan: " + err.message); }
  };

  const triggerLogoutConfirm = () => setShowLogoutModal(true);

  const handleAdminLogout = () => {
    ["loket_tugas_aktif", "adminProfileData", "tokenAdmin"].forEach((k) => sessionStorage.removeItem(k));
    setShowLogoutModal(false);
    navigate("/admin/login", { replace: true });
  };

  return {
    adminProfile, loketInfo, nomorAktif, sisaAntrean, daftarSelanjutnya, daftarDilewati,
    isCalling, handleNext, handleRecall, handleSkip, handlePanggilDilewati,
    triggerLogoutConfirm, handleAdminLogout, showSwitchModal, setShowSwitchModal,
    listLoketTugas, handleSwitchLoket, showConfirmModal, setShowConfirmModal,
    triggerStatusToggle, handleConfirmStatusToggle, showLogoutModal, setShowLogoutModal,
    isAdminLoggedIn, navigate,
  };
}
