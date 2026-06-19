import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLoginUser() {
  const navigate = useNavigate();
  
  // STATE FORM
  const [nim, setNim] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // STATE: Untuk memunculkan pop-up tiruan pilihan akun Google
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!nim || !tanggalLahir) {
      setError('NIM dan Tanggal Lahir wajib diisi!');
      return;
    }

    if (tanggalLahir.length !== 8 || isNaN(tanggalLahir)) {
      setError('Format Tanggal Lahir salah! Gunakan format YYYYMMDD.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // FIX INTEGRASI: Simpan status login & profil aktif ke sessionStorage browser
      sessionStorage.setItem('isLoggedInUser', 'true');
      sessionStorage.setItem('userProfileData', JSON.stringify({
        nama: "Adhitya Daffa R.",
        nim: nim,
      }));

      navigate('/'); 
    }, 1000);
  };

  // FUNGSI UNTUK MEMILIH AKUN GOOGLE KAMPUS
  const selectGoogleAccount = (emailNama) => {
    setShowGoogleModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // FIX INTEGRASI: Simpan status login & profil via Google ke sessionStorage browser
      sessionStorage.setItem('isLoggedInUser', 'true');
      sessionStorage.setItem('userProfileData', JSON.stringify({
        nama: "Adhitya Daffa R.",
        nim: "23412001",
      }));

      navigate('/');
    }, 1000);
  };

  return {
    nim,
    setNim,
    tanggalLahir,
    setTanggalLahir,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleLogin,
    showGoogleModal,
    setShowGoogleModal,
    selectGoogleAccount,
    navigate
  };
}