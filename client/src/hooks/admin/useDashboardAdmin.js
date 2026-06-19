import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useDashboardAdmin() {
  const navigate = useNavigate();

  // FIX SINKRONISASI AKUN: Membaca profil otentikasi admin dari storage hulu secara dinamis
  const [adminProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem('adminProfileData');
    return savedProfile ? JSON.parse(savedProfile) : { username: "admin_guest", nama: "Staf Loket", role: "Staf" };
  });

  // Membaca delegasi meja kerja admin
  const [loketInfo, setLoketInfo] = useState(() => {
    const savedLoket = sessionStorage.getItem('loket_tugas_aktif');
    return savedLoket ? JSON.parse(savedLoket) : { id: 1, kode: "1A", nama: "Loket 1A - Pembayaran Yayasan", status: "Buka" };
  });

  // Ambil status angka riil dari database global master browser
  const [globalMaster, setGlobalMaster] = useState(() => {
    const savedMaster = sessionStorage.getItem('globalMasterLoket');
    return savedMaster ? JSON.parse(savedMaster) : [];
  });

  const poolSourceId = (loketInfo.id === 1 || loketInfo.id === 2) ? 1 : loketInfo.id;
  const currentPoolData = globalMaster.find(l => l.id === poolSourceId) || { selanjutnya: [] };
  const currentLoketData = globalMaster.find(l => l.id === loketInfo.id) || { aktif: "—", sisa: 0, status: "Buka" };

  const nomorAktif = currentLoketData.aktif;
  
  const sisaAntrean = (loketInfo.id === 1 || loketInfo.id === 2)
    ? (globalMaster.find(l => l.id === 1)?.sisa || 0) + (globalMaster.find(l => l.id === 2)?.sisa || 0)
    : currentLoketData.sisa;

  const daftarSelanjutnya = currentPoolData.selanjutnya;
  const [daftarDilewati, setDaftarDilewati] = useState(["Y-15", "Y-17"]);

  const [isCalling, setIsCalling] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // FIX INTERFACE STATE: Pengendali pop-up peringatan kustom konfirmasi logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // DATA MASTER MEJA TUGAS SEJALUR FORMULA DAFFA
  const listLoketTugas = [
    { id: 1, kode: "1A", nama: "KEUANGAN (LOKET 1A)", subLayanan: "Yayasan" },
    { id: 2, kode: "1B", nama: "KEUANGAN (LOKET 1B)", subLayanan: "Yayasan" },
    { id: 3, kode: "2", nama: "AKADEMIK (LOKET 2)", subLayanan: "BAAK" },
    { id: 4, kode: "3", nama: "UMUM (LOKET 3)", subLayanan: "BAU" }, 
    { id: 5, kode: "4", nama: "KEMAHASISWAAN (LOKET 4)", subLayanan: "Beasiswa" }
  ];

  const saveToGlobalStorage = (updatedMaster) => {
    setGlobalMaster(updatedMaster);
    sessionStorage.setItem('globalMasterLoket', JSON.stringify(updatedMaster));
  };

  useEffect(() => {
    const syncAdminData = () => {
      const savedMaster = sessionStorage.getItem('globalMasterLoket');
      if (savedMaster) setGlobalMaster(JSON.parse(savedMaster));
    };
    const interval = setInterval(syncAdminData, 500);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (loketInfo.status === 'Tutup' || daftarSelanjutnya.length === 0) return;

    setIsCalling(true);
    setTimeout(() => {
      const nextNomor = daftarSelanjutnya[0];
      
      const updatedMaster = globalMaster.map(l => {
        if (l.id === loketInfo.id) {
          return {
            ...l,
            aktif: nextNomor,
            sisa: Math.max(0, l.sisa - 1),
            estimasi: Math.max(0, (l.sisa - 1) * 3),
          };
        }
        if (l.id === 1 && (loketInfo.id === 1 || loketInfo.id === 2)) {
          return {
            ...l,
            aktif: loketInfo.id === 1 ? nextNomor : l.aktif,
            sisa: loketInfo.id === 1 ? Math.max(0, l.sisa - 1) : l.sisa,
            selanjutnya: l.selanjutnya.slice(1)
          };
        }
        return l;
      });

      saveToGlobalStorage(updatedMaster);
      setIsCalling(false);
    }, 800);
  };

  const handleRecall = () => {
    if (loketInfo.status === 'Tutup' || nomorAktif === '—') return;
    setIsCalling(true);
    setTimeout(() => setIsCalling(false), 600);
  };

  const handleSkip = () => {
    if (loketInfo.status === 'Tutup' || nomorAktif === '—') return;

    setDaftarDilewati(prev => [...prev, nomorAktif]);
    const nextNomor = daftarSelanjutnya.length > 1 ? daftarSelanjutnya[1] : '—';
    
    const updatedMaster = globalMaster.map(l => {
      if (l.id === loketInfo.id) {
        return {
          ...l,
          aktif: nextNomor,
          sisa: Math.max(0, l.sisa - 1),
        };
      }
      if (l.id === 1 && (loketInfo.id === 1 || loketInfo.id === 2)) {
        return {
          ...l,
          aktif: loketInfo.id === 1 ? nextNomor : l.aktif,
          selanjutnya: l.selanjutnya.slice(1)
        };
      }
      return l;
    });

    saveToGlobalStorage(updatedMaster);
  };

  const handlePanggilDilewati = (nomor) => {
    if (loketInfo.status === 'Tutup') return;
    
    const updatedMaster = globalMaster.map(l => {
      if (l.id === loketInfo.id) return { ...l, aktif: nomor };
      return l;
    });

    saveToGlobalStorage(updatedMaster);
    setDaftarDilewati(prev => prev.filter(n => n !== nomor));
  };

  const triggerStatusToggle = () => setShowConfirmModal(true);

  const handleConfirmStatusToggle = () => {
    const nextStatus = loketInfo.status === 'Buka' ? 'Tutup' : 'Buka';
    
    setLoketInfo(prev => ({ ...prev, status: nextStatus }));
    sessionStorage.setItem('loket_tugas_aktif', JSON.stringify({ ...loketInfo, status: nextStatus }));

    const updatedMaster = globalMaster.map(l => {
      if (l.id === loketInfo.id) return { ...l, status: nextStatus };
      return l;
    });

    saveToGlobalStorage(updatedMaster);
    setShowConfirmModal(false);
  };

  const handleSwitchLoket = (loketBaru) => {
    const targetMaster = globalMaster.find(l => l.id === loketBaru.id) || { status: "Buka" };
    const statusMejaTerbaru = targetMaster.status;

    const objekBaru = {
      id: loketBaru.id,
      kode: loketBaru.kode,
      nama: `${loketBaru.nama} (${loketBaru.subLayanan})`,
      status: statusMejaTerbaru
    };

    setLoketInfo(objekBaru);
    sessionStorage.setItem('loket_tugas_aktif', JSON.stringify(objekBaru));
    setShowSwitchModal(false);
  };

  // Pemicu awal rantai konfirmasi pembongkaran sesi
  const triggerLogoutConfirm = () => setShowLogoutModal(true);

  // FIX SINKRONISASI KELUAR: Membersihkan lemari penyimpanan secara absolut
  const handleAdminLogout = () => {
    sessionStorage.removeItem('loket_tugas_aktif');
    sessionStorage.removeItem('adminProfileData');
    sessionStorage.removeItem('isAdminLoggedIn');
    setShowLogoutModal(false);
    navigate('/admin/login'); // Kembali ke halaman login setelah bersih terlogout
  };

  return {
    adminProfile,
    loketInfo,
    nomorAktif,
    sisaAntrean,
    daftarSelanjutnya,
    daftarDilewati,
    isCalling,
    handleNext,
    handleRecall,
    handleSkip,
    handlePanggilDilewati,
    triggerLogoutConfirm,
    handleAdminLogout,
    showSwitchModal,
    setShowSwitchModal,
    listLoketTugas,
    handleSwitchLoket,
    showConfirmModal,
    setShowConfirmModal,
    triggerStatusToggle,
    handleConfirmStatusToggle,
    showLogoutModal,
    setShowLogoutModal
  };
}