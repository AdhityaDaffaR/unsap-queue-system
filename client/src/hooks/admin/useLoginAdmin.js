import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLoginAdmin() {
  const navigate = useNavigate();
  
  // STATE INPUT FORM ADMIN
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // STATE: Pengendali pop-up kustom pilihan penugasan meja loket
  const [showSelectLoketModal, setShowSelectLoketModal] = useState(false);

  // Cek status apakah admin sebenarnya sudah masuk/terotentikasi sebelumnya
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';

  // DATA MASTER LOKET: Opsi plotting penugasan kerja staf
  const listLoketTugas = [
    { id: 1, kode: "1A", nama: "Loket 1A - Pembayaran Yayasan", prefix: "Y-" },
    { id: 2, kode: "1B", nama: "Loket 1B - Pembayaran Yayasan", prefix: "Y-" },
    { id: 3, kode: "2", nama: "Loket 2 - BAAK (Akademik)", prefix: "A-" },
    { id: 4, kode: "3", nama: "Loket 3 - Keuangan/BAU", prefix: "B-" },
  ];

  // LOGIKA SUBMIT LOGIN ADMIN
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan Kata Sandi wajib diisi!');
      return;
    }

    setIsLoading(true);

    // Simulasi pengecekan akun staf loket
    setTimeout(() => {
      setIsLoading(false);
      
      if (username === 'admin1' && password === 'admin123') {
        // FIX INTEGRASI: Titipkan kredensial admin secara riil ke session storage hulu
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        sessionStorage.setItem('adminProfileData', JSON.stringify({
          username: "admin1",
          nama: "Staf Operasional 1",
          role: "Petugas Loket"
        }));

        // Akses disetujui, alihkan ke tahap pemilihan loket tugas
        setShowSelectLoketModal(true);
      } else {
        setError('Akses Ditolak! Username atau Kata Sandi Staf salah.');
      }
    }, 1000);
  };

  // FUNGSI AKSI SAAT STAF MEMILIH MEJA TUGAS
  const handlePilihLoket = (loket) => {
    setShowSelectLoketModal(false);
    
    // Titipkan data loket pilihan ke dalam loker sessionStorage browser
    sessionStorage.setItem('loket_tugas_aktif', JSON.stringify({
      id: loket.id,
      kode: loket.kode,
      nama: loket.nama,
      status: "Buka"
    }));
    
    // Alihkan navigasi masuk ke dalam Dashboard Utama Staf
    navigate('/admin/dashboard');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleAdminLogin,
    showSelectLoketModal,
    setShowSelectLoketModal,
    listLoketTugas,
    handlePilihLoket,
    isAdminLoggedIn,
    navigate
  };
}