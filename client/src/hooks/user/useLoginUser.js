import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api';

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
      const resData = await api.post('/api/auth/login-mahasiswa', { 
        npm: nim, 
        password: tanggalLahir 
      });

      if (!resData.success) {
        throw new Error(resData.message || 'Gagal login, periksa kembali data Anda.');
      }
      
      sessionStorage.setItem('tokenMahasiswa', resData.token);
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