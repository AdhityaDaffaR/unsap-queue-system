import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import useDisplayMonitor from '../../hooks/user/useDisplayMonitor';
import UnsapLogo from '../../assets/logo-unsap.png';

export default function DisplayMonitor() {
  const { layananList, audioReady, activateAudio } = useDisplayMonitor();
  const [time, setTime] = useState(new Date());
  const [audioDismissed, setAudioDismissed] = useState(false);

  // Jam Digital Live Real-Time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d16] text-[#e2e8f0] flex flex-col select-none overflow-hidden font-sans relative">
      {!audioReady && !audioDismissed && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151c2c] border border-slate-700/80 rounded-2xl p-4 shadow-2xl w-64">
          <div className="flex items-start gap-3 mb-3">
            <Volume2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white">Aktifkan Suara</p>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                Monitor membutuhkan izin suara untuk memanggil nomor antrian melalui pengeras suara.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={activateAudio}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              Izinkan
            </button>
            <button
              onClick={() => setAudioDismissed(true)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              Tolak
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER MONITOR UTAMA PREMIUM (Skema Slate Soft) */}
      <header className="bg-[#151c2c] border-b border-slate-800/80 px-8 py-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <img 
            src={UnsapLogo} 
            alt="Logo Universitas Sebelas April" 
            className="w-10 h-10 object-contain shrink-0 select-none drop-shadow-md" 
          />
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">MONITOR ANTREAN DIGITAL TERPADU</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Universitas Sebelas April Sumedang</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-black tracking-widest text-brand-primary leading-none">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">
            {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* BODY UTAMA LAYAR MONITOR TINGKAT PREMIUM */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden bg-[#0a0d16]">
        
        {/* SISI KIRI (KOLOM 7): 4 GRID LAYANAN UTAMA RAKSASA */}
        <section className="col-span-7 grid grid-cols-2 gap-4">
          {layananList.map((layanan) => {
            const isTutup = layanan.status === 'Tutup';
            return (
              <div 
                key={layanan.kategori}
                className={`bg-[#151c2c] border rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 relative overflow-hidden ${
                  isTutup ? 'opacity-25 bg-[#0f1422] border-slate-900' : 'border-slate-800/80 ring-1 ring-slate-900/40'
                }`}
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isTutup ? 'bg-rose-500/40' : 'bg-emerald-500'}`} />

                {/* Bagian Atas: Kategori & Info Badge Loket Terbungkus Rapi */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-black tracking-tight text-white uppercase truncate">
                      {layanan.judul}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{layanan.subLayanan}</p>
                  </div>
                  <span className="text-[9px] font-black tracking-widest bg-[#0a0d16] border border-slate-800 px-2 py-1 rounded text-slate-400 uppercase shrink-0">
                    {layanan.kodeDisplay}
                  </span>
                </div>

                {/* Bagian Tengah: Display Angka Raksasa (High-Contrast Readability) */}
                <div className="my-4 text-center py-4 bg-[#0a0d16]/60 border border-slate-900 rounded-2xl shadow-inner">
                  <span className={`text-6xl font-black tracking-tighter leading-none block ${
                    isTutup ? 'text-slate-700' : 'text-emerald-400'
                  }`}>
                    {layanan.aktifDisplay}
                  </span>
                </div>

                {/* Bagian Bawah: Instruksi Konter Tujuan Dinamis Melompat Sesuai Klik Petugas */}
                <div className="w-full flex items-center justify-center min-h-[28px]">
                  {!isTutup && layanan.aktifDisplay !== "—" ? (
                    <p className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <span>Menuju Loket {layanan.konterFisikAktif}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Operasional Berhenti</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* SISI KANAN (KOLOM 5): POOL DAFTAR TUNGGU GLOBAL BERKELOMPOK PER LAYANAN */}
        <section className="col-span-5 bg-[#151c2c] border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div>
              <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">DAFTAR ANTRIAN LAYANAN SELANJUTNYA</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Urutan antrian berkelompok berdasarkan klaster urusan</p>
            </div>

            {/* List Row untuk masing-masing 4 Rumpun Layanan */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin flex flex-col justify-between py-2">
              {layananList.map((layanan) => (
                <div key={layanan.kategori} className="border-b border-slate-800/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{layanan.subLayanan} Pool</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Sisa: {layanan.selanjutnyaList.length} Orang</span>
                  </div>

                  {/* Baris nomor horizontal berjalan kekanan */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none min-h-[36px]">
                    {layanan.status === "Buka" && layanan.selanjutnyaList.length > 0 ? (
                      layanan.selanjutnyaList.map((nomor, idx) => (
                        <div key={idx} className="px-3 py-1.5 bg-[#0a0d16]/80 border border-slate-800/80 rounded-xl flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-bold text-slate-500">{idx + 1}</span>
                          <span className="text-xs font-black tracking-tight text-slate-300">{nomor}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-600 font-medium italic pl-1">
                        {layanan.status === "Tutup" ? "Layanan konter ditutup" : "Belum ada nomor mengantre"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-right border-t border-slate-800/60 pt-3 select-none">
            Smart Queue System • UNSAP Project
          </div>
        </section>

      </main>

      {/* FOOTER: RUNNING TEXT BERJALAN ALAMI */}
      <footer className="w-full bg-brand-primary text-white h-10 flex items-center font-bold text-xs shadow-inner relative overflow-hidden">
        <div className="bg-brand-primary-hover px-6 h-full flex items-center shrink-0 z-10 shadow-md uppercase tracking-wider text-[11px] font-black border-r border-white/10 select-none">
          Maklumat Kampus
        </div>
        <div className="w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-block animate-[marquee_25s_linear_infinite] pl-[100%] hover:[animation-play-state:paused] cursor-pointer">
            ✦ Selamat Datang di Ruang Pelayanan Terpadu Universitas Sebelas April Sumedang ✦ Jagalah ketertiban dan kenyamanan bersama selama mengantre ✦ Pastikan seluruh berkas administrasi sudah disiapkan sebelum nomor Anda dipanggil oleh konter meja petugas ✦ Terima kasih atas kerjasamanya.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
}