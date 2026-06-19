  import { useState, useEffect } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';

  export default function useHomeUser() {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    // STATE AUTENTIKASI SIMULASI
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
      return sessionStorage.getItem('isLoggedInUser') === 'true';
    }); 
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthWarningModal, setShowAuthWarningModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false); 
    
    const [nomorTiketBaru, setNomorTiketBaru] = useState(() => {
      return sessionStorage.getItem('nomorTiketAktif') || '';
    });

    // DATA PROFIL MAHASISWA
    const [userProfile] = useState(() => {
      const savedProfile = sessionStorage.getItem('userProfileData');
      return savedProfile ? JSON.parse(savedProfile) : { nama: "Guest Civitas", nim: "—" };
    });

    // DATA MASTER MASTER LOKET TERPUSAT
    const [masterLoket, setMasterLoket] = useState(() => {
      const savedMaster = sessionStorage.getItem('globalMasterLoket');
      if (savedMaster) return JSON.parse(savedMaster);

      const defaultMaster = [
        { id: 1, kode: "1A", nama: "Loket 1A - Pembayaran Yayasan", kategori: "Keuangan", aktif: "Y-18", sisa: 5, estimasi: 15, status: "Buka", selanjutnya: ["Y-19", "Y-20", "Y-21", "Y-22", "Y-23", "Y-24"] },
        { id: 2, kode: "1B", nama: "Loket 1B - Pembayaran Yayasan", kategori: "Keuangan", aktif: "Y-12", sisa: 2, estimasi: 6, status: "Buka", selanjutnya: ["Y-13", "Y-14"] },
        { id: 3, kode: "2", nama: "Loket 2 - BAAK (Akademik)", kategori: "Akademik", aktif: "A-45", sisa: 8, estimasi: 24, status: "Buka", selanjutnya: ["A-46", "A-47", "A-48", "A-49"] },
        { id: 4, kode: "3", nama: "Loket 3 - BAU (Keuangan)", kategori: "Umum", aktif: "B-02", sisa: 1, estimasi: 3, status: "Buka", selanjutnya: ["B-03"] },
        { id: 5, kode: "4", nama: "Loket 4 - Beasiswa & Kemahasiswaan", kategori: "Kemahasiswaan", aktif: "C-09", sisa: 0, estimasi: 0, status: "Tutup", selanjutnya: [] },
      ];
      sessionStorage.setItem('globalMasterLoket', JSON.stringify(defaultMaster));
      return defaultMaster;
    });

    // SELEKSI BERDASARKAN KATEGORI LAYANAN TRADING
    const [selectedKategori, setSelectedKategori] = useState("Keuangan");

    // Menangkap navigasi lemparan dari halaman Status Loket
    useEffect(() => {
      if (location.state && location.state.autoSelectLoketId) {
        const id = location.state.autoSelectLoketId;
        const target = masterLoket.find(l => l.id === id);
        if (target) setSelectedKategori(target.kategori);
        navigate('/', { replace: true, state: {} });
      }
    }, [location.state, navigate, masterLoket]); // <--- FIX AMAN: Bebas dari typo masterMasterLoket

    // SINKRONISASI UPDATE DATA REAL-TIME
    useEffect(() => {
      const checkStorage = () => {
        const savedMaster = sessionStorage.getItem('globalMasterLoket');
        if (savedMaster) setMasterLoket(JSON.parse(savedMaster));
      };
      const interval = setInterval(checkStorage, 500); 
      return () => clearInterval(interval);
    }, []);

    // RESTRUKTURISASI DATA LAYANAN KONSISTEN FORMULA DAFFA
    const layananList = [
      {
        kategori: "Keuangan",
        judulTampilan: "KEUANGAN",
        kodeDisplay: "LOKET 1A / 1B",
        subTeks: "Yayasan",
        status: (masterLoket.find(l => l.kode === "1A")?.status === "Buka" || masterLoket.find(l => l.kode === "1B")?.status === "Buka") ? "Buka" : "Tutup",
        sisa: (masterLoket.find(l => l.kode === "1A")?.sisa || 0) + (masterLoket.find(l => l.kode === "1B")?.sisa || 0),
        aktifDisplay: masterLoket.find(l => l.kode === "1A")?.aktif || "—",
        selanjutnyaList: [...(masterLoket.find(l => l.kode === "1A")?.selanjutnya || []), ...(masterLoket.find(l => l.kode === "1B")?.selanjutnya || [])].sort()
      },
      {
        kategori: "Akademik",
        judulTampilan: "AKADEMIK",
        kodeDisplay: "LOKET 2",
        subTeks: "BAAK",
        status: masterLoket.find(l => l.kode === "2")?.status || "Tutup",
        sisa: masterLoket.find(l => l.kode === "2")?.sisa || 0,
        aktifDisplay: masterLoket.find(l => l.kode === "2")?.aktif || "—",
        selanjutnyaList: masterLoket.find(l => l.kode === "2")?.selanjutnya || []
      },
      {
        kategori: "Umum",
        judulTampilan: "UMUM",
        kodeDisplay: "LOKET 3",
        subTeks: "BAU",
        status: masterLoket.find(l => l.kode === "3")?.status || "Tutup",
        sisa: masterLoket.find(l => l.kode === "3")?.sisa || 0,
        aktifDisplay: masterLoket.find(l => l.kode === "3")?.aktif || "—",
        selanjutnyaList: masterLoket.find(l => l.kode === "3")?.selanjutnya || []
      },
      {
        kategori: "Kemahasiswaan",
        judulTampilan: "KEMAHASISWAAN",
        kodeDisplay: "LOKET 4",
        subTeks: "Beasiswa & Kemahasiswaan",
        status: masterLoket.find(l => l.kode === "4")?.status || "Tutup",
        sisa: masterLoket.find(l => l.kode === "4")?.sisa || 0,
        aktifDisplay: masterLoket.find(l => l.kode === "4")?.aktif || "—",
        selanjutnyaList: masterLoket.find(l => l.kode === "4")?.selanjutnya || []
      }
    ];

    const layananAktif = layananList.find(l => l.kategori === selectedKategori) || layananList[0];
    const loketPemanggil = masterLoket.find(l => l.aktif === nomorTiketBaru && l.status === 'Buka');

    // LOGIKA AMBIL TIKET ANTRIAN ADIL
    const handleAmbilAntrean = () => {
      if (layananAktif.status === 'Tutup' || nomorTiketBaru) return; 
      if (!isLoggedIn) {
        setShowAuthWarningModal(true);
        return;
      } 

      let tiketSelanjutnya = "";
      let targetId = 1; 
      if (selectedKategori === "Akademik") targetId = 3;
      if (selectedKategori === "Umum") targetId = 4;
      if (selectedKategori === "Kemahasiswaan") targetId = 5;

      if (layananAktif.selanjutnyaList.length > 0) {
        const tiketTerakhir = layananAktif.selanjutnyaList[layananAktif.selanjutnyaList.length - 1];
        const [kodePrefiks, angkaStr] = tiketTerakhir.split('-');
        const angkaSelanjutnya = parseInt(angkaStr, 10) + 1;
        tiketSelanjutnya = `${kodePrefiks}-${angkaSelanjutnya}`;
      } else {
        const prefiksMap = { "Keuangan": "Y", "Akademik": "A", "Umum": "B", "Kemahasiswaan": "C" };
        tiketSelanjutnya = `${prefiksMap[selectedKategori] || 'X'}-01`;
      }

      const updatedMaster = masterLoket.map(l => {
        if (l.id === targetId) {
          return {
            ...l,
            sisa: l.sisa + 1,
            estimasi: (l.sisa + 1) * 3,
            selanjutnya: [...l.selanjutnya, tiketSelanjutnya]
          };
        }
        return l;
      });

      setMasterLoket(updatedMaster);
      sessionStorage.setItem('globalMasterLoket', JSON.stringify(updatedMaster));
      setNomorTiketBaru(tiketSelanjutnya);
      sessionStorage.setItem('nomorTiketAktif', tiketSelanjutnya); 
      setShowSuccessModal(true);
    };

    const handleBatalkanAntrean = () => setShowCancelConfirmModal(true);

    const handleConfirmPembatalan = () => {
      const updatedMaster = masterLoket.map(l => {
        return {
          ...l,
          sisa: l.selanjutnya.includes(nomorTiketBaru) ? Math.max(0, l.sisa - 1) : l.sisa,
          estimasi: l.selanjutnya.includes(nomorTiketBaru) ? Math.max(0, (l.sisa - 1) * 3) : l.estimasi,
          selanjutnya: l.selanjutnya.filter(t => t !== nomorTiketBaru)
        };
      });

      setMasterLoket(updatedMaster);
      sessionStorage.setItem('globalMasterLoket', JSON.stringify(updatedMaster));
      setNomorTiketBaru('');
      sessionStorage.removeItem('nomorTiketAktif'); 
      setShowCancelConfirmModal(false);
    };

    // LOGIKA LOGOUT
    const handleLogout = () => {
      sessionStorage.removeItem('isLoggedInUser');
      sessionStorage.removeItem('userProfileData');
      sessionStorage.removeItem('nomorTiketAktif');
      setIsLoggedIn(false);
      setIsMenuOpen(false); 
      setNomorTiketBaru(''); 
      navigate('/');
    };

    return {
      navigate,
      isLoggedIn,
      isMenuOpen,
      setIsMenuOpen,
      userProfile,
      layananList,
      selectedKategori,
      setSelectedKategori,
      layananAktif,
      handleAmbilAntrean,
      handleLogout,
      showAuthWarningModal,
      setShowAuthWarningModal,
      showSuccessModal,
      setShowSuccessModal,
      nomorTiketBaru,
      handleBatalkanAntrean,
      showCancelConfirmModal,     
      setShowCancelConfirmModal,  
      handleConfirmPembatalan,
      loketPemanggil
    };
  }