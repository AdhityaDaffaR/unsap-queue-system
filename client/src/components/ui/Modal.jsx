import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // <--- JANTUNG ANIMASI PREMIUM
import Card from './Card';

export default function Modal({ isOpen, onClose, title, children, showCloseButton = true }) {
  // LOGIKA: Mengunci scrollbar browser di latar belakang ketika modal sedang terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    /* AnimatePresence wajib membungkus kondisi agar animasi keluar (exit) bisa berjalan */
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          
          {/* BACKDROP: Latar belakang gelap transparan dengan efek blur halus (Framer Motion) */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={showCloseButton ? onClose : undefined} // Kunci klik luar jika close button disembunyikan
          />
          
          {/* KONTEN KARTU MODAL (Dilengkapi animasi scale-up lembut berbasis Spring) */}
          <motion.div 
            className="w-full max-w-sm relative z-10"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}   // Mulai dari agak kecil, transparan, dan sedikit ke bawah
            animate={{ opacity: 1, scale: 1, y: 0 }}       // Meluncur pas ke tengah dengan ukuran penuh
            exit={{ opacity: 0, scale: 0.95, y: 10 }}      // Mengecil lembut saat ditutup agar dramatis
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} // Efek pegas mikro yang responsif dan organik
          >
            <Card className="p-6 border border-border-default bg-bg-surface shadow-2xl rounded-2xl relative flex flex-col space-y-4">
              
              {/* HEADER MODAL */}
              {title && (
                <div className="text-center pr-6 pl-6">
                  <h3 className="text-sm font-bold text-text-main tracking-tight">{title}</h3>
                </div>
              )}

              {/* TOMBOL SILANG (CLOSE) */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-main transition-colors cursor-pointer bg-transparent border-0 flex items-center justify-center"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </button>
              )}

              {/* AREA ISI KONTEN DINAMIS */}
              <div className="w-full text-left">
                {children}
              </div>

            </Card>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}