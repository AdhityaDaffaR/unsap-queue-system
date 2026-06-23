import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, MapPin, Info } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import useBantuan from '../../hooks/user/useBantuan';

export default function Bantuan() {
  const { 
    navigate, 
    isLoggedIn, 
    userProfile, 
    handleLogout, 
    activeIndex, 
    toggleFAQ, 
    dataFAQ 
  } = useBantuan();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col">
      
      {/* FIX INTEGRASI SINKRON: Mengalirkan data login dinamis dari useBantuan */}
      <Navbar 
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        userProfile={userProfile}
        handleLogout={handleLogout}
        title="Queue System"
      />

      {/* KONTEN UTAMA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8 mt-4">
        
        {/* HERO BANNER SECTION */}
        <section className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto shadow-sm">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text-main">
            Pusat Bantuan & Layanan Informasi
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed">
            Punya kendala terkait sistem antrean atau operasional loket terpadu Universitas Sebelas April? Temukan panduan dan jawaban instan di bawah ini.
          </p>
        </section>

        {/* LAYOUT DUA KOLOM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* KOLOM KIRI: ACCORDION FAQ */}
          <section className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 px-1 mb-2">
              <Info size={16} className="text-brand-primary" />
              <h3 className="text-xs font-bold tracking-tight uppercase text-text-muted">Pertanyaan Yang Sering Diajukan</h3>
            </div>

            {dataFAQ.map((item, index) => {
              const isOpen = activeIndex === index;
              return (
                <Card key={index} className="overflow-hidden transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left bg-transparent border-0 text-text-main font-bold text-sm cursor-pointer select-none gap-4"
                  >
                    <span>{item.tanya}</span>
                    <span className="text-text-muted group-hover:text-text-main shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[200px] border-t border-border-default/50 bg-bg-muted-box/30' : 'max-h-0'
                  }`}>
                    <p className="p-5 text-xs text-text-muted leading-relaxed">
                      {item.jawab}
                    </p>
                  </div>
                </Card>
              );
            })}
          </section>

          {/* KOLOM KANAN: KARTU KONTAK & INFORMASI LOKASI */}
          <section className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 px-1 mb-2">
              <MessageSquare size={16} className="text-brand-primary" />
              <h3 className="text-xs font-bold tracking-tight uppercase text-text-muted">Hubungi Layanan</h3>
            </div>

            {/* KARTU LOKASI FISIK */}
            <Card className="p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/40" />
              <div className="flex items-center gap-2.5 text-text-main">
                <MapPin size={16} className="text-brand-primary shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-wider">Lokasi Fisik Loket</h4>
              </div>
              <p className="text-[11px] text-text-muted leading-normal">
                Gedung Rektorat Kampus Pusat UNSAP, Lantai 1, Jl. Angkrek Situ No.19, Sumedang Utara, West Java.
              </p>
            </Card>

            {/* KARTU JAM OPERASIONAL KAMPUS */}
            <Card className="p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/40" />
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-main">Jam Pelayanan</h4>
                <Badge variant="success" className="normal-case">Senin - Jumat</Badge>
              </div>
              <div className="space-y-1.5 pt-1 text-[11px] text-text-muted">
                <div className="flex justify-between border-b border-border-default/50 pb-1">
                  <span>Sesi Pagi</span>
                  <span className="font-bold text-text-main">08:00 — 12:00 WIB</span>
                </div>
                <div className="flex justify-between border-b border-border-default/50 pb-1">
                  <span>Istirahat</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">12:00 — 13:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Sesi Sore</span>
                  <span className="font-bold text-text-main">13:00 — 16:00 WIB</span>
                </div>
              </div>
            </Card>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}