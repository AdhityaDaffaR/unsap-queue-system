import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Clock, HelpCircle } from "lucide-react";

import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import useStatusLoket from "../../hooks/user/useStatusLoket";

export default function StatusLoket() {
  const navigate = useNavigate();

  const {
    isLoggedIn,
    userProfile,
    handleLogout,
    searchQuery,
    setSearchQuery,
    daftarLoket,
  } = useStatusLoket();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col">
      <Navbar
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        userProfile={userProfile}
        handleLogout={handleLogout}
        title="Queue System"
      />

      {/* KONTEN UTAMA MONITOR LOKET */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8">
        {/* HERO BANNER SECTION */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-4">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text-main">
            Status Operasional Loket Terpadu
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed">
            Pantau pergerakan antrean aktif dan status operasional meja layanan
            Universitas Sebelas April secara langsung tanpa harus mengantre di
            lokasi.
          </p>
        </section>

        {/* SEARCH BAR SECTION */}
        <section className="max-w-md mx-auto w-full">
          <Input
            icon={Search}
            type="text"
            placeholder="Cari layanan, contoh: 'BAAK', 'Yayasan'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        {/* GRID LIVE MONITORING LOKET TRADING 4 KOLOM */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {daftarLoket.length > 0 ? (
            daftarLoket.map((loket) => {
              const isTutup = loket.status === "Tutup";

              // KALKULASI INDIKATOR STATUS KEPADATAN DINAMIS KATEGORI
              const getKepadatanProps = () => {
                if (isTutup) {
                  return {
                    text: "—",
                    color: "text-text-muted bg-bg-muted-box border-border-default",
                  };
                }
                if (loket.sisaAntrean > 5) {
                  return {
                    text: "Sangat Padat",
                    color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
                  };
                }
                if (loket.sisaAntrean >= 3) {
                  return {
                    text: "Cukup Padat",
                    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
                  };
                }
                return {
                  text: "Lancar Senggang",
                  color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                };
              };

              const kepadatan = getKepadatanProps();

              return (
                <div
                  key={loket.kategori}
                  onClick={() => {
                    if (!isTutup) {
                      navigate("/", { state: { autoSelectLoketId: loket.id } });
                    }
                  }}
                  className={!isTutup ? "cursor-pointer" : "select-none"}
                >
                  <Card
                    className={`p-6 relative overflow-hidden flex flex-col justify-between transition-all rounded-2xl border border-border-default bg-bg-surface shadow-md h-full ${
                      !isTutup
                        ? "hover:border-brand-primary/30 hover:shadow-lg active:scale-[0.99]"
                        : "opacity-65"
                    }`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${!isTutup ? "bg-success" : "bg-danger"}`} />

                    {/* AREA ATAS KARTU: KATEGORI & BADGE LOKET MINI */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 truncate min-w-0">
                          <div className="truncate">
                            <h3 className={`text-sm font-black leading-tight tracking-tight uppercase truncate ${!isTutup ? "text-brand-primary" : "text-text-main"}`}>
                              {loket.judulTampilan}
                            </h3>
                            {/* FIX FONT SIZE INCREASE: Ukuran sub-teks dinaikkan ke text-xs font-semibold */}
                            {/* FIX MARQUEE INTEGRATION: Proteksi tulisan Kemahasiswaan yang meluap */}
                            <div className="w-full overflow-hidden whitespace-nowrap relative h-[18px] flex items-center bg-transparent mt-1">
                              <p className={`text-xs font-semibold tracking-tight text-text-muted absolute ${
                                loket.subTeks.length > 15 ? "animate-[statusMarquee_12s_linear_infinite] hover:[animation-play-state:paused]" : ""
                              }`}>
                                {loket.subTeks}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Badge Info Nomor Meja Terikat Rapi */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[8px] font-black tracking-widest bg-bg-main border border-border-default/80 px-1.5 py-0.5 rounded text-text-muted uppercase scale-95">
                            {loket.kodeDisplay}
                          </span>
                          <Badge variant={!isTutup ? "success" : "danger"}>
                            <div className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${!isTutup ? "bg-success animate-pulse" : "bg-danger"}`} />
                              <span>{!isTutup ? "Buka" : "Tutup"}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      {/* MONITOR UTAMA NOMOR ANTRIAN YANG SEDANG DILAYANI */}
                      <div className="bg-bg-muted-box border border-border-default rounded-2xl py-6 text-center shadow-inner flex flex-col justify-center items-center min-h-[110px]">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-1">
                          Nomor Sedang Dilayani
                        </p>
                        {/* FIX KONSISTENSI UTUT: Teks "TUTUP" pudar dibuang, mendisplay nomor aktif terakhir dengan pudar gray */}
                        <span className={`text-4xl font-black tracking-tighter leading-none ${!isTutup ? "text-brand-primary" : "text-text-muted/40"}`}>
                          {loket.nomorAktif}
                        </span>

                        {/* Petunjuk dinamis loket konter fisik tujuan terintegrasi adil */}
                        {!isTutup && loket.nomorAktif !== "—" && (
                          <p className="text-[10px] font-bold text-success bg-success/5 border border-success/10 px-3 py-0.5 rounded-full uppercase tracking-wider animate-pulse mt-2">
                            👉 {loket.konterFisikAktif ? `Menuju Konter Loket ${loket.konterFisikAktif}` : `Menuju Loket ${loket.kodeDisplay}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* BARIS STATISTIK KAKI KARTU */}
                    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border-default/50 text-xs w-full">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1.5 text-text-muted/70">
                          <Users size={13} className="shrink-0" />
                          <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Antrean</span>
                        </div>
                        <p className="text-xs font-black text-text-main leading-tight">
                          {!isTutup ? `${loket.sisaAntrean} Orang` : "—"}
                        </p>
                      </div>

                      <div className="border-l border-border-default/60 h-7 self-end mb-0.5" />

                      <div className="flex flex-col space-y-1 flex-1 pl-4">
                        <div className="flex items-center gap-1.5 text-text-muted/70">
                          <Clock size={13} className="shrink-0" />
                          <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Estimasi</span>
                        </div>
                        <p className="text-xs font-black text-text-main leading-tight">
                          {!isTutup ? `± ${loket.estimasi} Min` : "—"}
                        </p>
                      </div>

                      <div className={`px-2.5 flex items-center justify-center text-[10px] font-black rounded-lg border select-none h-7 tracking-tight shrink-0 self-end ${kepadatan.color}`}>
                        {kepadatan.text}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-border-default flex items-center justify-center text-text-muted">
                <HelpCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-main">Layanan Tidak Ditemukan</p>
                <p className="text-[11px] text-text-muted">Kata kunci "{searchQuery}" tidak cocok dengan klaster transaksi manapun.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* STYLE MARQUEE LOKAL KHUSUS LOKET */}
      <style>{`
        @keyframes statusMarquee {
          0% { transform: translate3d(0, 0, 0); }
          15% { transform: translate3d(0, 0, 0); }
          85% { transform: translate3d(-45%, 0, 0); }
          100% { transform: translate3d(-45%, 0, 0); }
        }
      `}</style>
    </div>
  );
}