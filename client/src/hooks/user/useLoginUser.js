import { useState, useEffect } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';

  export default function useHomeUser() {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
      return sessionStorage.getItem('isLoggedInUser') === 'true';
    }); 
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthWarningModal, setShowAuthWarningModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false); 
    
    // NEW STATE: Pengendali Pop-up Premium Modal Logout User
    const [showLogoutModal, setShowLogoutModal] = useState(false); 

    const [nomorTiketBaru, setNomorTiketBaru] = useState(() => {
      return sessionStorage.getItem('nomorTiketAktif') || '';
    });

    // ... (Data masterLoket, selectedKategori, dan useEffect bawaan kamu biarkan tetap utuh di sini) ...

    // AMBIL TIKET & PEMBATALAN (Biarkan kode bawaan kamu tetap utuh)
    const handleAmbilAntrean = () => { /* ... kode asli kamu ... */ };
    const handleBatalkanAntrean = () => setShowCancelConfirmModal(true);
    const handleConfirmPembatalan = () => { /* ... kode asli kamu ... */ };

    // PEMICU MODAL LOGOUT PREMIUM
    const triggerLogoutConfirm = () => setShowLogoutModal(true);

    // EKSEKUSI MUTASI LOGOUT NYATA
    const handleConfirmLogout = () => {
      sessionStorage.removeItem('isLoggedInUser');
      sessionStorage.removeItem('userProfileData');
      sessionStorage.removeItem('nomorTiketAktif');
      
      setIsLoggedIn(false);
      setIsMenuOpen(false); 
      setNomorTiketBaru(''); 
      setShowLogoutModal(false);
      
      navigate('/');
      window.location.reload(); 
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
      triggerLogoutConfirm, // <-- Kita lempar fungsi pemicu ini ke UI Navbar
      handleConfirmLogout,  // <-- Kita lempar fungsi eksekusi ini ke tombol "Ya, Keluar" di dalam Modal
      showAuthWarningModal,
      setShowAuthWarningModal,
      showSuccessModal,
      setShowSuccessModal,
      nomorTiketBaru,
      handleBatalkanAntrean,
      showCancelConfirmModal,     
      setShowCancelConfirmModal,  
      handleConfirmPembatalan,
      loketPemanggil,
      showLogoutModal,      // <-- Lempar state ini agar UI bisa membaca kondisi open/close
      setShowLogoutModal    // <-- Lempar setter ini ke properti onClose Modal
    };
  }