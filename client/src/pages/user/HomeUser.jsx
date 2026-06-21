import React from "react";
import {
  LayoutGrid,
  Ticket,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Trash2,
  BellRing,
  Power,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import Modal from "../../components/ui/Modal";
import useHomeUser from "../../hooks/user/useHomeUser";

export default function HomeUser() {
  const {
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
    handleLogout,
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
    masterLoket,
    showLogoutModal,
    setShowLogoutModal,
    handleConfirmLogout,
  } = useHomeUser();

  const punyaTiketAktif = isLoggedIn && nomorTiketBaru;
  const isMonitorUtamaTutup = layananAktif.status === "Tutup";

  const konterFisikPemanggil = masterLoket?.find(
    (l) => l.aktif === layananAktif.aktifDisplay && l.status === "Buka"
  );

  const isGilirankuDipanggil = punyaTiketAktif && (layananAktif.aktifDisplay === nomorTiketBaru);

  const getButtonProps = () => {
    if (isMonitorUtamaTutup) {
      return {
        text: "Layanan Sedang Tutup",
        disabled: true,
        className: "opacity-40 bg-gray-400 dark:bg-zinc-700 cursor-not-allowed pointer-events-none",
      };
    }
    if (punyaTiketAktif) {
      return {
        text: "Antrean Anda Sudah Aktif",
        disabled: true,
        className: "opacity-50 bg-emerald-600 text-white cursor-not-allowed pointer-events-none border-0",
      };
    }
    return { text: "Ambil Tiket", disabled: false, className: "" };
  };

  const btnProps = getButtonProps();

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

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6 mt-4">
        
        {/* UI TIKET ANTREAN AKTIF MAHASISWA */}
        {punyaTiketAktif && (
          <section className="w-full transition-all duration-300">
            <Card className={`p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
              loketPemanggil 
                ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md shadow-emerald-500/5 animate-[pulse_2.5s_infinite]' 
                : 'border-brand-primary/30 bg-brand-primary/5'
            }`}>
              <div className={`absolute top-0 left-0 h-full w-1 ${loketPemanggil ? 'bg-success' : 'bg-brand-primary'}`} />

              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border text-white ${
                  loketPemanggil ? 'bg-success border-emerald-500/10' : 'bg-brand-primary border-brand-primary/10'
                }`}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider ${loketPemanggil ? 'text-success' : 'text-brand-primary'}`}>
                    {loketPemanggil ? '✦ GILIRAN ANDA TIBA! ✦' : 'Tiket Antrean Berjalan Anda'}
                  </h3>
                  <p className="text-sm font-bold text-text-main mt-0.5">
                    {loketPemanggil ? `SILAKAN MERAPAT KE ${loketPemanggil.nama.toUpperCase()}` : 'Menunggu Panggilan Antrean'}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    {loketPemanggil 
                      ? 'Nomor tiket Anda sedang dipanggil. Silakan bawa seluruh berkas kelengkapan administrasi Anda menuju meja konter sekarang.'
                      : 'Tiket Anda aman tersimpan. Silakan santai di ruang tunggu dan perhatikan perubahan monitor di bawah.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
                <div className={`border px-6 flex flex-col justify-center rounded-xl text-center min-w-[130px] h-[52px] shadow-sm select-none w-full sm:w-auto transition-colors ${
                  loketPemanggil ? 'bg-bg-surface border-success' : 'bg-bg-surface border-border-default'
                }`}>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none">Nomor Anda</p>
                  <p className={`text-2xl font-black mt-1 leading-none tracking-tight ${loketPemanggil ? 'text-success' : 'text-brand-primary'}`}>
                    {nomorTiketBaru}
                  </p>
                </div>

                <button
                  onClick={handleBatalkanAntrean}
                  className="w-12 sm:w-13 h-[52px] bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl border border-rose-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
                  title="Batalkan Antrean"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          </section>
        )}

        {/* LAYOUT DUA KOLOM ATAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* MONITOR UTAMA BERDASARKAN KATEGORI LAYANAN */}
          <section className="md:col-span-2">
            <Card className={`h-[380px] flex flex-col p-6 relative overflow-hidden transition-all duration-200 ${isMonitorUtamaTutup ? "opacity-65" : ""}`}>
              
              <div className="absolute top-0 left-0 w-full h-[26px] bg-brand-primary flex items-center justify-center border-b border-brand-primary/10 select-none">
                <span className="text-[9px] font-black tracking-[0.25em] text-white uppercase flex items-center justify-center gap-2">
                  <Ticket size={14} className="shrink-0" /> 
                  <span className="leading-none pt-[1px]">LAYAR PANTAU TERPILIH</span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4 w-full h-9">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-text-main flex items-center gap-1.5 truncate">
                  <span>{layananAktif.judulTampilan}</span>
                  <span className="text-text-muted/80 font-bold">({layananAktif.subTeks})</span>
                </h1>

                <Badge variant={!isMonitorUtamaTutup ? "success" : "danger"} className="shrink-0">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${!isMonitorUtamaTutup ? "bg-success animate-pulse" : "bg-danger"}`} />
                    <span>Layanan {layananAktif.status}</span>
                  </div>
                </Badge>
              </div>

              <div className="flex-1 w-full flex flex-col justify-between bg-bg-muted-box border border-border-default rounded-2xl text-center max-w-md mx-auto my-3 min-h-[170px] relative overflow-hidden pt-5 shadow-inner">
                {loketPemanggil && loketPemanggil.kategori === selectedKategori ? (
                  <div className="flex flex-col items-center justify-center space-y-2 animate-pulse text-success px-4 pb-4 flex-1">
                    <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center"><BellRing size={16} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">GILIRAN ANDA TIBA</p>
                    <p className="text-4xl font-black tracking-tight">{nomorTiketBaru}</p>
                    <p className="text-[10px] text-text-muted font-bold max-w-[240px] leading-normal">
                      Silakan merapat ke <span className="text-success font-black">{loketPemanggil.kode}</span> sekarang!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full flex-1">
                    <div className="flex flex-col items-center justify-center flex-1 py-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">
                        Sedang Dipanggil
                      </p>
                      <div className={`text-5xl sm:text-6xl font-black tracking-tighter leading-none mt-2 ${
                        isMonitorUtamaTutup ? "text-text-muted/40" : "text-brand-primary"
                      }`}>
                        {layananAktif.aktifDisplay}
                      </div>
                    </div>

                    <div className="w-full">
                      {!isMonitorUtamaTutup && layananAktif.aktifDisplay !== "—" ? (
                        isGilirankuDipanggil ? (
                          <div className="w-full bg-emerald-600 dark:bg-emerald-500 text-white py-2 px-4 flex items-center justify-center gap-1.5 text-sm font-black uppercase tracking-wide shadow-inner select-none animate-[pulse_2s_infinite]">
                            <span>✨ MENUJU LOKET {konterFisikPemanggil ? konterFisikPemanggil.kode : layananAktif.kodeDisplay.replace("LOKET ", "").split(' / ')[0]}</span>
                          </div>
                        ) : (
                          <div className="w-full bg-bg-main/80 border-t border-border-default/80 text-text-muted py-2 px-4 flex items-center justify-center text-sm font-black uppercase tracking-wide select-none">
                            <span>LOKET {konterFisikPemanggil ? konterFisikPemanggil.kode : layananAktif.kodeDisplay.replace("LOKET ", "").split(' / ')[0]}</span>
                          </div>
                        )
                      ) : (
                        <div className="w-full bg-border-default/40 text-text-muted/60 py-2.5 px-4 text-[10px] font-black uppercase tracking-widest select-none">
                          {isMonitorUtamaTutup ? "OPERASIONAL BERHENTI" : "MENUNGGU PANGGILAN ANTRIAN"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="max-w-md mx-auto w-full pt-1">
                <Button
                  variant="primary"
                  onClick={handleAmbilAntrean}
                  className={btnProps.className}
                  disabled={btnProps.disabled}
                >
                  {btnProps.text}
                </Button>
              </div>
            </Card>
          </section>

          {/* LIST ANTREAN URUTAN TUNGGU KANAN */}
          <section className="md:col-span-1">
            <Card className={`h-[380px] flex flex-col p-6 overflow-hidden relative transition-all duration-200 ${isMonitorUtamaTutup ? "opacity-65" : ""}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-border-default" />

              <div className="mb-3">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Urutan Tunggu</h2>
                <p className="text-[11px] text-text-muted mt-0.5">Daftar urutan loket aktif saat ini</p>
              </div>

              <div className="h-[275px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin w-full">
                <div className="flex items-center p-3 h-[52px] rounded-xl border border-brand-primary/30 bg-brand-primary/5 w-full">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-primary text-white">1</span>
                    <span className="text-xs font-semibold text-brand-primary">Nomor Tiket</span>
                  </div>
                  <div className="flex-1 text-right text-base font-black tracking-tight text-brand-primary">
                    {layananAktif.aktifDisplay}
                  </div>
                </div>

                {!isMonitorUtamaTutup && layananAktif.selanjutnyaList.length > 0 ? (
                  layananAktif.selanjutnyaList.map((nomor, index) => (
                    <div key={index} className="flex items-center p-3 h-[52px] rounded-xl border border-border-default bg-bg-main/30 opacity-70 w-full">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-border-default text-text-muted">{index + 2}</span>
                        <span className="text-xs font-semibold text-text-muted">Nomor Tiket</span>
                      </div>
                      <div className="flex-1 text-right text-base font-black tracking-tight text-text-muted/90">{nomor}</div>
                    </div>
                  ))
                ) : (
                  layananAktif.selanjutnyaList.length === 0 && (
                    <div className="text-center py-4 flex flex-col items-center justify-center h-[200px] text-text-muted/40">
                      <p className="text-[10px] font-bold uppercase tracking-wider">Tidak Ada Daftar Tunggu</p>
                    </div>
                  )
                )}
              </div>
            </Card>
          </section>
        </div>

        {/* 4 BARIS KATEGORI TRANSAKSIONAL TERPADU */}
        <section className="w-full space-y-4">
          <div className="flex items-center gap-2 px-1">
            <LayoutGrid size={16} className="text-brand-primary" />
            <h2 className="text-xs font-bold tracking-tight uppercase text-text-muted">Pilih Kategori Transaksi Layanan Kampus</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {layananList.map((layanan) => {
              const isSelected = selectedKategori === layanan.kategori;
              const isTutup = layanan.status === "Tutup";

              return (
                <div
                  key={layanan.kategori}
                  onClick={() => setSelectedKategori(layanan.kategori)}
                  className={`group rounded-2xl cursor-pointer transition-all duration-200 border p-5 flex flex-col justify-between min-h-[140px] h-full select-none relative overflow-hidden ${
                    isSelected ? "border-brand-primary ring-2 ring-brand-primary/10 shadow-md bg-bg-surface" : "border-border-default hover:border-text-muted shadow-sm bg-bg-surface"
                  } ${isTutup ? "opacity-65" : ""}`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${isTutup ? "bg-danger" : "bg-success"}`} />

                  <div className="space-y-3 flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-xs font-black tracking-tight uppercase truncate ${isSelected ? "text-brand-primary" : "text-text-main"}`}>
                        {layanan.judulTampilan}
                      </h3>
                      <span className="text-[8px] font-black tracking-widest bg-bg-main border border-border-default/80 px-1.5 py-0.5 rounded text-text-muted shrink-0 uppercase scale-95">
                        {layanan.kodeDisplay}
                      </span>
                    </div>
                    
                    <div className="w-full overflow-hidden whitespace-nowrap relative h-[18px] flex items-center bg-transparent">
                      <p className={`text-xs font-semibold tracking-tight text-text-muted absolute ${
                        layanan.subTeks.length > 15 ? "animate-[cardMarquee_12s_linear_infinite] pl-[10%] hover:[animation-play-state:paused]" : ""
                      }`}>
                        {layanan.subTeks}
                      </p>
                    </div>

                    <div className="text-3xl font-black pt-1 leading-none">
                      <span className={isTutup ? "text-text-muted/40 font-black" : "text-brand-primary"}>
                        {layanan.aktifDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-border-default flex items-center justify-between text-[10px] w-full">
                    <span className="text-text-muted font-medium">{isTutup ? "Tutup" : `Sisa antrean: ${layanan.sisa} orang`}</span>
                    <span className={`transition-all flex items-center font-bold gap-0.5 ${isSelected ? "text-brand-primary opacity-100" : "text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-brand-primary"}`}>
                      Pantau <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/* ========================================================================= */}
      {/* WINDOWS SYSTEM MODALS */}
      {/* ========================================================================= */}
      
      {/* REVISI PREMIUM: MODAL LOGOUT USER BERBASIS FRAMER MOTION KAMU */}
      <Modal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        title="Konfirmasi Keluar Sistem" 
        showCloseButton={true}
      >
        <div className="space-y-4 py-1 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
            <Power size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-main">Apakah Anda Yakin Ingin Keluar?</p>
            <p className="text-[11px] text-text-muted px-4 leading-normal">
              Sesi aktif Anda akan dibersihkan dengan aman demi melindungi privasi data antrean mahasiswa.
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setShowLogoutModal(false)} 
              className="flex-1 cursor-pointer rounded-xl border border-border-default bg-transparent py-2 text-xs font-bold text-text-muted transition-all hover:bg-bg-main"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleConfirmLogout} 
              className="flex-1 border-0 bg-danger py-2 text-xs font-black text-white transition-all rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-600"
            >
              Ya, Keluar Akun
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAuthWarningModal} onClose={() => setShowAuthWarningModal(false)} title="Akses Pengambilan Tiket Ditolak">
        <div className="text-center flex flex-col items-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500"><AlertCircle size={24} /></div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-main">Kamu Belum Terautentikasi</p>
            <p className="text-[11px] text-text-muted px-4 leading-normal">Demi validasi data antrean civitas, silakan masuk menggunakan NIM atau Email Kampus terlebih dahulu.</p>
          </div>
          <div className="w-full pt-2 flex gap-3">
            <button onClick={() => setShowAuthWarningModal(false)} className="flex-1 py-2 text-xs font-bold border border-border-default bg-transparent hover:bg-bg-main rounded-xl text-text-muted transition-all cursor-pointer">Batal</button>
            <button onClick={() => { setShowAuthWarningModal(false); navigate("/login"); }} className="flex-1 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover rounded-xl text-white transition-all border-0">Login Sekarang</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Nomor Antrean Berhasil Diambil">
        <div className="text-center flex flex-col items-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><CheckCircle size={24} /></div>
          <div className="w-full bg-bg-muted-box border border-border-default rounded-xl p-4 text-center max-w-[200px] mx-auto">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Nomor Tiket Anda</p>
            <p className="text-4xl font-black text-brand-primary mt-2.5 tracking-tight leading-none">{nomorTiketBaru}</p>
          </div>
          <div className="space-y-1 px-2">
            <p className="text-xs font-bold text-text-main">{layananAktif.judulTampilan}</p>
            <p className="text-[10px] text-text-muted leading-normal">Silakan simpan nomor ini and pantau pergerakan antrean. Jangan sampai terlewat!</p>
          </div>
          <div className="w-full pt-2"><Button variant="primary" onClick={() => setShowSuccessModal(false)} className="w-full py-2 text-xs font-bold">Selesai & Mengerti</Button></div>
        </div>
      </Modal>

      <Modal isOpen={showCancelConfirmModal} onClose={() => setShowCancelConfirmModal(false)} title="Konfirmasi Pembatalan Tiket">
        <div className="text-center flex flex-col items-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500"><AlertCircle size={24} /></div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-main">Apakah Anda Yakin?</p>
            <p className="text-[11px] text-text-muted px-4 leading-normal">Tindakan ini akan menghapus nomor antrean <span className="font-black text-brand-primary">{nomorTiketBaru}</span> secara permanen dari sistem.</p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button onClick={() => setShowCancelConfirmModal(false)} className="flex-1 cursor-pointer rounded-xl border border-border-default bg-transparent py-2 text-xs font-bold text-text-muted transition-all hover:bg-bg-main">Kembali</button>
            <button onClick={handleConfirmPembatalan} className="flex-1 border-0 bg-danger py-2 text-xs font-black text-white transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"><Trash2 size={13} /><span>Ya, Batalkan</span></button>
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes cardMarquee {
          0% { transform: translate3d(0, 0, 0); }
          15% { transform: translate3d(0, 0, 0); }
          85% { transform: translate3d(-45%, 0, 0); }
          100% { transform: translate3d(-45%, 0, 0); }
        }
      `}</style>
    </div>
  );
}