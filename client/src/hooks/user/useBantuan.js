import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatNamaMahasiswa = (namaLengkap) => {
  if (!namaLengkap) return "Guest Civitas";
  const kata = namaLengkap.trim().split(/\s+/);
  if (kata.length <= 2) return namaLengkap;
  const duaKataPertama = kata.slice(0, 2).join(" ");
  const sisaInisial = kata.slice(2).map((k) => `${k.charAt(0).toUpperCase()}.`).join(" ");
  return `${duaKataPertama} ${sisaInisial}`;
};

const getIsLoggedIn = () => sessionStorage.getItem('isLoggedInUser') === 'true';
const getProfile = () => {
  const saved = sessionStorage.getItem('userProfileData');
  if (saved) {
    const parsed = JSON.parse(saved);
    return { nama: formatNamaMahasiswa(parsed.nama), nim: parsed.npm || "—" };
  }
  return { nama: "Guest Civitas", nim: "—" };
};

export default function useBantuan() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);
  const [userProfile, setUserProfile] = useState(getProfile);

  useEffect(() => {
    const sync = () => { setIsLoggedIn(getIsLoggedIn()); setUserProfile(getProfile()); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // LOGIKA KELUAR AKUN SINKRON
  const handleLogout = () => {
    ['tokenMahasiswa', 'isLoggedInUser', 'userProfileData', 'nomorTiketAktif', 'idAntreanAktif'].forEach((k) => sessionStorage.removeItem(k));
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