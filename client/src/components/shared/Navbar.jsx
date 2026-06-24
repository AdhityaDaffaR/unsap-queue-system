import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { LogIn, LogOut, Home, Layers, HelpCircle, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LogoUnsap from '../../assets/UNSAP.png';

export default function Navbar({ 
  navigate, 
  isLoggedIn, 
  isMenuOpen, 
  setIsMenuOpen, 
  userProfile, 
  handleLogout,
  title = "Queue System",
  maxWidth = "max-w-6xl"
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="w-full bg-bg-surface border-b border-border-default sticky top-0 z-40 h-16 flex items-center">
      <div className={`${maxWidth} w-full mx-auto flex items-center justify-between px-6`}>
        
        {/* SISI KIRI: BRANDING LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={LogoUnsap}
            alt="Logo Universitas Sebelas April"
            className="w-8 h-8 object-cover select-none"
          />
          <div className="flex flex-col justify-center select-none">
            <span className="text-[11px] font-black text-text-main leading-none uppercase tracking-wider">UNIVERSITAS SEBELAS APRIL SUMEDANG</span>
            <span className="text-[10px] font-bold text-text-muted leading-none mt-1 uppercase tracking-widest">{title}</span>
          </div>
        </div>

        {/* SISI TENGAH: NAVIGASI DESKTOP */}
        {title === "Queue System" && (
          <nav className="hidden md:flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-wider flex-1 mx-4 h-10 relative">
            
            {/* LINK 1: BERANDA */}
            <button 
              onClick={() => navigate('/')}
              className={`flex flex-col items-center justify-center h-full px-1 cursor-pointer bg-transparent border-0 p-0 select-none group relative ${
                currentPath === '/' ? 'text-brand-primary' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className="flex items-center gap-1.5 py-1">
                <Home size={14} className="shrink-0 mb-[1px]" />
                <span>Beranda</span>
              </div>
              {currentPath === '/' && (
                <motion.div 
                  layoutId="slidingUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2.5px] bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* LINK 2: STATUS LOKET */}
            <button 
              onClick={() => navigate('/status-loket')}
              className={`flex flex-col items-center justify-center h-full px-1 cursor-pointer bg-transparent border-0 p-0 select-none group relative ${
                currentPath === '/status-loket' ? 'text-brand-primary' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className="flex items-center gap-1.5 py-1">
                <Layers size={14} className="shrink-0 mb-[1px]" />
                <span>Status Loket</span>
              </div>
              {currentPath === '/status-loket' && (
                <motion.div 
                  layoutId="slidingUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2.5px] bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* LINK 3: BANTUAN */}
            <button 
              onClick={() => navigate('/bantuan')}
              className={`flex flex-col items-center justify-center h-full px-1 cursor-pointer bg-transparent border-0 p-0 select-none group relative ${
                currentPath === '/bantuan' ? 'text-brand-primary' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <div className="flex items-center gap-1.5 py-1">
                <HelpCircle size={14} className="shrink-0 mb-[1px]" />
                <span>Bantuan</span>
              </div>
              {currentPath === '/bantuan' && (
                <motion.div 
                  layoutId="slidingUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2.5px] bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

          </nav>
        )}

        {/* SISI KANAN: SESSION CONTROLS */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-3 h-10">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border-default mx-0.5" />
            
            {!isLoggedIn ? (
              <button 
                onClick={() => navigate(currentPath.includes('/admin') ? '/admin/login' : '/login')}
                className="flex items-center gap-1.5 px-4 h-9 bg-brand-primary text-white text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-brand-primary-hover cursor-pointer border border-brand-primary/10 shadow-sm shadow-brand-primary/5 active:scale-[0.97] transition-all"
              >
                <LogIn size={14} />
                <span>Masuk</span>
              </button>
            ) : (
              <div className="flex items-center gap-4 h-9">
                <div className="flex items-center gap-2.5 h-full select-none">
                  <div className="w-7 h-7 rounded-lg bg-bg-muted-box border border-border-default flex items-center justify-center font-black text-[10px] text-text-main shrink-0 shadow-inner">
                    {userProfile?.nama ? userProfile.nama.substring(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="text-left hidden lg:flex flex-col justify-center min-w-[90px]">
                    <p className="text-[11px] font-black leading-none text-text-main truncate max-w-[130px]">{userProfile?.nama || "User"}</p>
                    <p className="text-text-muted text-[9px] mt-1 leading-none font-bold tracking-wide">{userProfile?.nim || "—"}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-lg border border-danger/10 bg-danger/5 text-danger hover:bg-danger hover:text-white active:scale-[0.97] cursor-pointer select-none transition-colors"
                  title="Keluar Sesi"
                >
                  <LogOut size={12} className="shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border-default text-text-main bg-bg-surface cursor-pointer hover:bg-bg-main transition-colors"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

      </div>

      {/* MENU PANEL MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-bg-surface border-b border-border-default py-4 space-y-2.5 px-6 flex flex-col z-40 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <button onClick={() => { setIsMenuOpen(false); navigate('/'); }} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-left px-3 py-2 rounded-lg border-0 w-full cursor-pointer ${currentPath === '/' ? 'text-brand-primary bg-brand-primary/5' : 'text-text-muted'}`}><Home size={14} /> Beranda</button>
          <button onClick={() => { setIsMenuOpen(false); navigate('/status-loket'); }} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-left px-3 py-2 rounded-lg border-0 w-full cursor-pointer ${currentPath === '/status-loket' ? 'text-brand-primary bg-brand-primary/5' : 'text-text-muted'}`}><Layers size={14} /> Status Loket</button>
          <button onClick={() => { setIsMenuOpen(false); navigate('/bantuan'); }} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-left px-3 py-2 rounded-lg border-0 w-full cursor-pointer ${currentPath === '/bantuan' ? 'text-brand-primary bg-brand-primary/5' : 'text-text-muted'}`}><HelpCircle size={14} /> Bantuan</button>
          <div className="border-t border-border-default/60 my-1 pt-3 flex items-center justify-between px-3"><span className="text-[11px] font-black uppercase tracking-wider text-text-muted">Ubah Tema</span><ThemeToggle /></div>
          <div className="pt-2 px-1">
            {!isLoggedIn ? (
              <button onClick={() => { setIsMenuOpen(false); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider py-2.5 bg-brand-primary text-white rounded-lg border-0 shadow-sm"><LogIn size={14} /> <span>Masuk Aplikasi</span></button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-bg-muted-box rounded-xl border border-border-default">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-bg-surface text-text-main flex items-center justify-center font-black text-xs border border-border-default">{userProfile?.nama ? userProfile.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                  <div><p className="text-[11px] font-black text-text-main leading-none">{userProfile?.nama}</p><p className="text-text-muted text-[10px] mt-1 leading-none font-bold">{userProfile?.nim}</p></div>
                </div>
                <button onClick={handleLogout} className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-lg border border-danger/20 bg-danger/5 text-danger hover:bg-danger hover:text-white transition-colors"><LogOut size={12} /><span>Keluar</span></button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}