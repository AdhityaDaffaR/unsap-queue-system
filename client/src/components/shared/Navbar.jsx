import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- FIX ABSOLUT: Wajib impor ini agar komponen motion aktif!
import { LogIn, LogOut, Home, Layers, HelpCircle, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LogoUnsap from '../../assets/logo-unsap.png'; // <--- FIX ABSOLUT: Gunakan impor gambar agar bundler bekerja dengan baik

export default function Navbar({ 
  navigate, 
  isLoggedIn, 
  isMenuOpen, 
  setIsMenuOpen, 
  userProfile, 
  handleLogout,
  title = "Queue System" 
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="w-full bg-bg-surface border-b border-border-default px-6 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* SISI KIRI: BRANDING LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={LogoUnsap}
            alt="Logo Universitas Sebelas April"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex flex-col justify-center select-none">
            <span className="text-xs font-black text-text-main leading-tight">UNIVERSITAS SEBELAS APRIL SUMEDANG</span>
            <span className="text-xs font-medium text-text-muted leading-tight mt-0.5">{title}</span>
          </div>
        </div>

        {/* SISI TENGAH: NAVIGASI DESKTOP — LIVE SLIDING SEJATI BERBASIS LAYOUT ID */}
        {title === "Queue System" && (
          <nav className="hidden md:flex items-center justify-center gap-6 text-sm flex-1 mx-4 h-10 relative">
            
            {/* LINK 1: BERANDA */}
            <button 
              onClick={() => navigate('/')}
              className={`flex flex-col items-center justify-center h-full px-1 cursor-pointer bg-transparent border-0 p-0 transition-colors select-none group relative ${
                currentPath === '/' ? 'text-brand-primary font-bold' : 'text-text-muted hover:text-text-main font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 py-1">
                <Home size={15} strokeWidth={currentPath === '/' ? 3 : 2} className="shrink-0 mb-1" />
                <span 
                  className="inline-flex flex-col items-center justify-center after:content-[attr(data-text)] after:font-bold after:invisible after:h-0"
                  data-text="Beranda"
                >
                  Beranda
                </span>
              </div>
              
              {/* FIX SEJATI: Menggunakan motion.div dengan layoutId agar beneran meluncur fleksibel */}
              {currentPath === '/' && (
                <motion.div 
                  layoutId="slidingUnderline"
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} // Efek animasi pegas liquid premium
                />
              )}
            </button>

            {/* LINK 2: STATUS LOKET */}
            <button 
              onClick={() => navigate('/status-loket')}
              className={`flex flex-col items-center justify-center h-full px-1 cursor-pointer bg-transparent border-0 p-0 transition-colors select-none group relative ${
                currentPath === '/status-loket' ? 'text-brand-primary font-bold' : 'text-text-muted hover:text-text-main font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 py-1">
                <Layers size={15} strokeWidth={currentPath === '/status-loket' ? 3 : 2} className="shrink-0 mb-1" />
                <span 
                  className="inline-flex flex-col items-center justify-center after:content-[attr(data-text)] after:font-bold after:invisible after:h-0"
                  data-text="Status Loket"
                >
                  Status Loket
                </span>
              </div>
              
              {/* FIX SEJATI: Berbagi kuota layoutId yang sama agar garisnya beneran meluncur melompat antar-halaman */}
              {currentPath === '/status-loket' && (
                <motion.div 
                  layoutId="slidingUnderline"
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* LINK 3: BANTUAN */}
            <button 
              onClick={() => navigate('/bantuan')}
              className={`flex flex-col items-center justify-center h-full px-1 cursor-pointer bg-transparent border-0 p-0 transition-colors select-none group relative ${
                currentPath === '/bantuan' ? 'text-brand-primary font-bold' : 'text-text-muted hover:text-text-main font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 py-1">
                <HelpCircle size={15} strokeWidth={currentPath === '/bantuan' ? 3 : 2} className="shrink-0 mb-1" />
                <span 
                  className="inline-flex flex-col items-center justify-center after:content-[attr(data-text)] after:font-bold after:invisible after:h-0"
                  data-text="Bantuan"
                >
                  Bantuan
                </span>
              </div>

              {/* FIX SEJATI: Garis meluncur */}
              {currentPath === '/bantuan' && (
                <motion.div 
                  layoutId="slidingUnderline"
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

          </nav>
        )}

        {/* SISI KANAN: SESSION CONTROLS */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-[1px] bg-border-default mx-0.5" />
            
            {!isLoggedIn ? (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors cursor-pointer border-0 shadow-sm"
              >
                <LogIn size={16} />
                <span>Masuk</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Blok Profil */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-100 border border-border-default flex items-center justify-center font-black text-xs text-black shrink-0 select-none shadow-sm">
                    {userProfile.nama ? userProfile.nama.substring(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-black leading-none text-text-main">{userProfile.nama}</p>
                    <p className="text-[10px] text-text-muted mt-1 leading-none">{userProfile.nim}</p>
                  </div>
                </div>
                
                {/* FIX DESKTOP: Tombol Keluar dengan Bungkusan Fisik Kotak Premium */}
                <button 
                  onClick={handleLogout} 
                  className="h-8 px-3 text-[11px] font-black flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white active:scale-[0.97] transition-all cursor-pointer select-none"
                  title="Keluar Sesi"
                >
                  <LogOut size={13} className="shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border-default text-text-main bg-bg-surface cursor-pointer hover:bg-bg-main transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MENU PANEL MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border-default mt-3 pt-3 pb-2 space-y-3 px-2 flex flex-col">
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/'); }}
            className={`flex items-center gap-2 text-sm text-left px-2 py-1.5 rounded-lg border-0 w-full cursor-pointer border-l-4 border-transparent ${
              currentPath === '/' ? 'text-brand-primary font-bold bg-brand-primary/5 !border-brand-primary' : 'text-text-muted'
            }`}
          >
            <Home size={16} strokeWidth={currentPath === '/' ? 2.5 : 2} /> Beranda
          </button>
          
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/status-loket'); }}
            className={`flex items-center gap-2 text-sm text-left px-2 py-1.5 rounded-lg border-0 w-full cursor-pointer border-l-4 border-transparent ${
              currentPath === '/status-loket' ? 'text-brand-primary font-bold bg-brand-primary/5 !border-brand-primary' : 'text-text-muted'
            }`}
          >
            <Layers size={16} strokeWidth={currentPath === '/status-loket' ? 2.5 : 2} /> Status Loket
          </button>
          
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/bantuan'); }}
            className={`flex items-center gap-2 text-sm text-left px-2 py-1.5 rounded-lg border-0 w-full cursor-pointer border-l-4 border-transparent ${
              currentPath === '/bantuan' ? 'text-brand-primary font-bold bg-brand-primary/5 !border-brand-primary' : 'text-text-muted'
            }`}
          >
            <HelpCircle size={16} strokeWidth={currentPath === '/bantuan' ? 2.5 : 2} /> Bantuan
          </button>

          <div className="border-t border-border-default my-2 pt-3 flex items-center justify-between px-2">
            <span className="text-xs font-medium text-text-muted">Ubah Tema</span>
            <ThemeToggle />
          </div>
          
          <div className="pt-2 px-2">
            {!isLoggedIn ? (
              <button 
                onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 bg-brand-primary text-white rounded-lg border-0 shadow-sm"
              >
                <LogIn size={16} /> <span>Masuk</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-2 bg-bg-muted-box rounded-xl border border-border-default">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-sm border border-border-default">
                    {userProfile.nama ? userProfile.nama.substring(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-main">{userProfile.nama}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{userProfile.nim}</p>
                  </div>
                </div>
                
                {/* FIX MOBILE: Tombol Keluar dengan Bungkusan Solid Khusus di HP Dropdown */}
                <button 
                  onClick={handleLogout} 
                  className="h-8 px-3 text-[11px] font-black flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white active:scale-[0.97] transition-all cursor-pointer select-none"
                >
                  <LogOut size={13} className="shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}