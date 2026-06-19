import React, { useState } from "react";
import {
  Volume2,
  ChevronRight,
  ArrowRightCircle,
  PauseCircle,
  Power,
  Clock,
  Users,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import useDashboardAdmin from "../../hooks/admin/useDashboardAdmin";

export default function DashboardAdmin() {
  const {
    adminProfile,
    loketInfo,
    nomorAktif,
    sisaAntrean,
    daftarSelanjutnya,
    daftarDilewati,
    isCalling,
    handleNext,
    handleRecall,
    handleSkip,
    handlePanggilDilewati,
    triggerLogoutConfirm,
    handleAdminLogout,
    showSwitchModal,
    setShowSwitchModal,
    listLoketTugas,
    handleSwitchLoket,
    showConfirmModal,
    setShowConfirmModal,
    triggerStatusToggle,
    handleConfirmStatusToggle,
    showLogoutModal,
    setShowLogoutModal,
  } = useDashboardAdmin();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdminTutup = loketInfo.status === "Tutup";

  let namaTampilanKonter = loketInfo.nama;
  if (loketInfo.id === 4 || loketInfo.kode === "3") namaTampilanKonter = "UMUM (LOKET 3) (BAU)";

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col">
      <Navbar
        navigate={() => {}}
        isLoggedIn={true}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        userProfile={{
          nama: adminProfile.username,
          nim: adminProfile.role,
        }}
        handleLogout={triggerLogoutConfirm} // Pemicu diarahkan ke modal konfirmasi
        title="Staff System"
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* BARIS ATAS: MONITOR UTAMA INFORMASI MEJA LOKET */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/50 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black tracking-tight text-text-main">
                {namaTampilanKonter}
              </h2>

              <button
                type="button"
                onClick={() => setShowSwitchModal(true)}
                className="h-7 px-3 text-[10px] font-black flex items-center justify-center gap-1.5 rounded-lg border border-brand-primary/20 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 active:scale-[0.97] transition-all cursor-pointer select-none"
              >
                <RefreshCw size={10} className="shrink-0" />
                <span>Ganti Meja</span>
              </button>
            </div>
            <p className="text-xs text-text-muted font-medium uppercase tracking-widest">
              Pusat Kendali Layanan Antrean Terpadu
            </p>
          </div>

          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0 h-9 justify-end sm:ml-auto">
            <div className="h-full flex items-stretch">
              <Badge
                variant={!isAdminTutup ? "success" : "danger"}
                className="h-full rounded-xl px-4 flex items-center justify-center"
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className={`w-1.5 h-1.5 rounded-full ${!isAdminTutup ? "bg-success animate-pulse" : "bg-danger"}`} />
                  <span>Loket {loketInfo.status}</span>
                </div>
              </Badge>
            </div>

            <div className="h-full flex items-stretch">
              <Button
                onClick={triggerStatusToggle}
                className={`h-full py-0 px-4 text-[11px] font-black shadow-sm flex items-center justify-center gap-1.5 border-0 rounded-xl text-white select-none transition-colors ${
                  !isAdminTutup ? "bg-danger hover:bg-danger-hover" : "bg-success hover:bg-success-hover"
                }`}
              >
                <Power size={12} className="shrink-0" />
                <span>{!isAdminTutup ? "Tutup Loket" : "Buka Loket"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* LAYOUT GRID DUA KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <Card className={`p-8 flex flex-col items-center text-center relative overflow-hidden transition-all duration-200 ${isAdminTutup ? "opacity-65" : ""}`}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary" />
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Nomor Sedang Dilayani</p>
              <div className="w-full max-w-sm bg-bg-muted-box border border-border-default rounded-3xl py-10 shadow-inner">
                <span className={`text-7xl md:text-8xl font-black tracking-tighter ${isAdminTutup ? "text-text-muted/40" : "text-brand-primary"}`}>{nomorAktif}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
                <Button variant="secondary" onClick={handleRecall} disabled={isAdminTutup || isCalling} className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 py-0 font-bold">
                  <Volume2 size={24} className={isCalling ? "animate-ping" : ""} />
                  <span className="text-[11px] uppercase tracking-wider">Panggil Ulang</span>
                </Button>
                <Button variant="primary" onClick={handleNext} disabled={isAdminTutup || daftarSelanjutnya.length === 0 || isCalling} className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl shadow-lg shadow-brand-primary/20 scale-105 py-0 font-black">
                  <ArrowRightCircle size={28} />
                  <span className="text-[11px] uppercase tracking-wider">Panggil Selanjutnya</span>
                </Button>
                <Button variant="secondary" onClick={handleSkip} disabled={isAdminTutup || nomorAktif === "—" || isCalling} className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 py-0 font-bold">
                  <PauseCircle size={24} />
                  <span className="text-[11px] uppercase tracking-wider">Lewati (Hold)</span>
                </Button>
              </div>
            </Card>

            <div className={`grid grid-cols-2 gap-6 transition-all duration-200 ${isAdminTutup ? "opacity-65" : ""}`}>
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><Users size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Sisa Antrean</p>
                  <p className="text-xl font-black text-text-main leading-none mt-1">{!isAdminTutup ? sisaAntrean : 0} Orang</p>
                </div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Estimasi Selesai</p>
                  <p className="text-xl font-black text-text-main leading-none mt-1">± {!isAdminTutup ? sisaAntrean * 3 : 0} Menit</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <Card className={`flex flex-col h-[320px] overflow-hidden transition-all duration-200 ${isAdminTutup ? "opacity-65" : ""}`}>
              <div className="p-4 border-b border-border-default bg-bg-muted-box"><h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Antrean Berikutnya</h3></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                {!isAdminTutup && nomorAktif !== "—" ? (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-brand-primary/30 bg-brand-primary/5 w-full">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-primary text-white">1</span>
                        <span className="text-xs font-bold text-brand-primary">Aktif Dilayani</span>
                      </div>
                      <span className="text-sm font-black text-brand-primary tracking-tight">{nomorAktif}</span>
                    </div>
                    {daftarSelanjutnya.filter(nomor => {
                      const angkaNomor = parseInt(nomor.split('-')[1], 10);
                      const angkaAktif = parseInt(nomorAktif.split('-')[1], 10);
                      return angkaNomor > angkaAktif;
                    }).map((nomor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border-default bg-bg-main/50 opacity-75 w-full">
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-border-default text-text-muted">{index + 2}</span>
                          <span className="text-xs font-semibold text-text-muted">Nomor Tiket</span>
                        </div>
                        <span className="text-sm font-black text-text-muted tracking-tight">{nomor}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-border-default flex items-center justify-center text-text-muted"><ChevronRight size={20} /></div>
                    <p className="text-[11px] font-medium text-text-muted">{isAdminTutup ? "Operasional Berhenti" : "Daftar Tunggu Kosong"}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className={`flex flex-col h-[280px] overflow-hidden transition-all duration-200 ${isAdminTutup ? "opacity-65" : ""}`}>
              <div className="p-4 border-b border-border-default bg-amber-500/5"><h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Daftar Lewati (Hold)</h3></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                {!isAdminTutup && daftarDilewati.length > 0 ? (
                  daftarDilewati.map((nomor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                      <span className="text-sm font-black text-amber-700 tracking-tight">{nomor}</span>
                      <button onClick={() => handlePanggilDilewati(nomor)} className="text-[10px] font-bold underline bg-transparent border-0 text-amber-600 hover:text-amber-800 cursor-pointer">Panggil Sekarang</button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6"><p className="text-[10px] font-medium text-text-muted">{isAdminTutup ? "Operasional Berhenti" : "Tidak ada nomor dilewati"}</p></div>
                )}
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* MODALS WINDOW SYSTEM */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Konfirmasi Status Operasional" showCloseButton={true}>
        <div className="space-y-4 py-1 text-center">
          <p className="text-xs text-text-muted leading-relaxed">Apakah Anda yakin ingin <span className="font-black text-text-main">{!isAdminTutup ? "MENUTUP" : "MEMBUKA"}</span> operasional layanan <span className="font-black text-brand-primary">{namaTampilanKonter}</span> saat ini?</p>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="py-2 text-xs font-bold rounded-xl border border-border-default bg-transparent text-text-main hover:bg-bg-muted-box">Batalkan</Button>
            <Button onClick={handleConfirmStatusToggle} className={`py-2 text-xs font-black text-white rounded-xl border-0 ${!isAdminTutup ? "bg-danger hover:bg-danger-hover" : "bg-success hover:bg-success-hover"}`}>Ya, Ubah Status</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSwitchModal} onClose={() => setShowSwitchModal(false)} title="Pindah Meja Tugas Loket">
        <div className="space-y-3 py-1">
          <p className="text-[11px] text-text-muted text-center leading-normal">Pilih meja loket baru Anda. Sistem akan otomatis memindahkan kontrol antrean aktif tanpa mengeluarkan sesi akun Anda.</p>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {listLoketTugas.filter((l) => l.id !== loketInfo.id).map((meja) => {
              const savedMaster = sessionStorage.getItem("globalMasterLoket");
              const globalMasterList = savedMaster ? JSON.parse(savedMaster) : [];
              const globalMeja = globalMasterList.find((m) => m.id === meja.id) || { status: "Buka" };
              const isMejaTujuanTutup = globalMeja.status === "Tutup";

              return (
                <button key={meja.id} type="button" onClick={() => handleSwitchLoket(meja)} className={`w-full flex items-center justify-between p-3.5 text-left rounded-xl border border-border-default bg-bg-main/50 hover:bg-brand-primary/5 hover:border-brand-primary/20 active:scale-[0.99] transition-all cursor-pointer text-text-main group select-none ${isMejaTujuanTutup ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-black">{meja.kode}</div>
                    <span className="text-xs font-bold">{meja.nama} ({meja.subLayanan})</span>
                    {isMejaTujuanTutup && <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider scale-90">Tutup</span>}
                  </div>
                  <span className="text-[10px] font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-all">Pilih →</span>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* FIX REDAKSI LOGOUT KENDALI PENUH: Akun admin tidak terikat permanen pada satu meja tugas */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Konfirmasi Keluar Sistem" showCloseButton={true}>
        <div className="space-y-4 py-1 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
            <Power size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-main">Apakah Anda Yakin Ingin Keluar?</p>
            <p className="text-[11px] text-text-muted px-4 leading-normal">
              Tindakan ini akan memutuskan <span className="font-black text-danger">KENDALI PENUH</span> sesi akun Anda secara aman dari sistem aplikasi pelayanan.
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button onClick={() => setShowLogoutModal(false)} className="flex-1 cursor-pointer rounded-xl border border-border-default bg-transparent py-2 text-xs font-bold text-text-muted transition-all hover:bg-bg-main">Batal</button>
            <button onClick={handleAdminLogout} className="flex-1 border-0 bg-danger py-2 text-xs font-black text-white transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"><span>Ya, Keluar Akun</span></button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}