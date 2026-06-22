import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLoginUser() {
  const navigate = useNavigate();
  
  const [nim, setNim] = useState(''); 
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleLogin = async (e) => {
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

    try {
      const response = await fetch('http://localhost:3000/api/auth/login-mahasiswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          npm: nim, 
          password: tanggalLahir 
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Gagal login, periksa kembali data Anda.');
      }
      
      sessionStorage.setItem('isLoggedInUser', 'true');
      sessionStorage.setItem('userProfileData', JSON.stringify({
        id: resData.data.id,
        nama: resData.data.nama_mahasiswa,
        npm: resData.data.npm,
        prodi: resData.data.prodi,
        angkatan: resData.data.angkatan
      }));

      navigate('/'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectGoogleAccount = (emailNama) => {
    setShowGoogleModal(false);
    setIsLoading(true);
    
    // Google Modal murni bertindak sebagai simulasi penutup tanpa membawa data hardcoded luar
    setTimeout(() => {
      setIsLoading(false);
      setError('Metode Google Sign-In eksternal dinonaktifkan sementara di lingkungan localhost.');
    }, 800);
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