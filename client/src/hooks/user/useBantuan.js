import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useBantuan() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  // FIX SINKRONISASI AUTENTIKASI: Membaca status login riil dari session storage browser
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedInUser') === 'true';
  });

  // Membaca profil data akun yang sedang aktif digunakan
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = sessionStorage.getItem('userProfileData');
    return savedProfile ? JSON.parse(savedProfile) : { nama: "Guest Civitas", nim: "—" };
  });

  // Sinkronisasi dinamis real-time jika ada perubahan status login dari halaman lain
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(sessionStorage.getItem('isLoggedInUser') === 'true');
      const savedProfile = sessionStorage.getItem('userProfileData');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    };
    const interval = setInterval(syncAuth, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // LOGIKA KELUAR AKUN SINKRON
  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedInUser');
    sessionStorage.removeItem('userProfileData');
    sessionStorage.removeItem('nomorTiketAktif');
    setIsLoggedIn(false);
    navigate('/');
  };

  const dataFAQ = [
    {
      tanya: "Bagaimana cara mengambil nomor antrean digital?",
      jawab: "Silakan Masuk (Login) terlebih dahulu di pojok kanan atas menggunakan NIM dan password (format YYYYMMDD). Setelah berhasil masuk, kembali ke Beranda, pilih meja layanan yang kamu tuju pada menu di bagian bawah, lalu klik tombol 'Ambil Nomor Antrean'."
    },
    {
      tanya: "Mengapa tombol 'Ambil Nomor Antrean' tidak bisa diklik?",
      jawab: "Hal ini terjadi karena dua kemungkinan: 1) Kamu belum melakukan Login ke sistem, atau 2) Meja layanan tersebut sedang dalam status 'Tutup' (ditandai dengan garis aksen merah di atas kartu loket) karena jam operasional istirahat atau pelayanan hari itu sudah selesai."
    },
    {
      tanya: "Apa yang harus dilakukan jika nomor antrean saya terlewat?",
      jawab: "Jangan panik. Sistem kami memiliki fitur 'Hold/Lewati'. Jika nomor kamu terlewat, admin akan memasukkan nomor kamu ke daftar tunggu hold. Kamu bisa langsung menemui petugas loket terkait untuk meminta dipanggil ulang tanpa harus mengambil nomor antrean baru dari awal."
    },
    {
      tanya: "Di mana lokasi fisik loket terpadu ini berada?",
      jawab: "Seluruh loket pelayanan terpadu (BAAK, Keuangan, BAU, dan Yayasan) berlokasi di Gedung Rektorat Lantai 1 Kampus Pusat Universitas Sebelas April, Sumedang."
    }
  ];

  return {
    navigate,
    isLoggedIn,
    userProfile,
    handleLogout,
    activeIndex,
    toggleFAQ,
    dataFAQ
  };
}