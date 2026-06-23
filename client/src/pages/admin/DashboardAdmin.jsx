import { useState } from "react";
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
    showLoketMasihBukaModal,
    setShowLoketMasihBukaModal,
    isAdminLoggedIn,
    navigate,
  } = useDashboardAdmin();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdminTutup = loketInfo.status === "tutup";
  const statusLabel = !isAdminTutup && isAdminLoggedIn ? "Buka" : "Tutup";

  let namaTampilanKonter = loketInfo.nama;
  if (loketInfo.id === 4 || loketInfo.kode === "3")
    namaTampilanKonter = "UMUM (LOKET 3) (BAU)";

  // VARIABEL PENGENDALI: Mengunci kontrol penuh jika status login bernilai FALSE
  const isSistemTerkunci = !isAdminLoggedIn;

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col">
      {/* NAVBAR DINAMIS: Jika belum login, otomatis menyediakan tombol "Masuk" yang mengarah ke portal login */}
      <Navbar
        navigate={() => navigate("/admin/login")}
        isLoggedIn={isAdminLoggedIn}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        userProfile={{
          nama: adminProfile.nama || "",
          nim: adminProfile.username ? `@${adminProfile.username}` : "",
        }}
        handleLogout={triggerLogoutConfirm}
        title="Staff System"
      />

      {isSistemTerkunci && (
        <div className="w-full bg-danger/10 border-b border-danger/20 text-danger text-xs font-black text-center py-2.5 uppercase tracking-wider select-none animate-pulse">
          🔒 Dashboard dikunci! Silakan klik tombol masuk di pojok kanan atas
          untuk mengendalikan antrean.
        </div>
      )}

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
                disabled={isSistemTerkunci}
                onClick={() => setShowSwitchModal(true)}
                className="h-7 px-3 text-[10px] font-black flex items-center justify-center gap-1.5 rounded-lg border border-brand-primary/20 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 active:scale-[0.97] transition-all cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed"
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
                variant={
                  !isAdminTutup && isAdminLoggedIn ? "success" : "danger"
                }
                className="h-full rounded-xl px-4 flex items-center justify-center"
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${!isAdminTutup && isAdminLoggedIn ? "bg-success animate-pulse" : "bg-danger"}`}
                  />
                    <span>
                      Loket {statusLabel}
                    </span>
                </div>
              </Badge>
            </div>

            <div className="h-full flex items-stretch">
              <Button
                onClick={triggerStatusToggle}
                disabled={isSistemTerkunci}
                className={`h-full py-0 px-4 text-[11px] font-black shadow-sm flex items-center justify-center gap-1.5 border-0 rounded-xl text-white select-none transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  !isAdminTutup
                    ? "bg-danger hover:bg-danger-hover"
                    : "bg-success hover:bg-success-hover"
                }`}
              >
                <Power size={12} className="shrink-0" />
                <span>
                  {!isAdminTutup && isAdminLoggedIn
                    ? "Tutup Loket"
                    : "Buka Loket"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* LAYOUT GRID DUA KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <Card
              className={`p-8 flex flex-col items-center text-center relative overflow-hidden transition-all duration-200 ${isAdminTutup || isSistemTerkunci ? "opacity-60" : ""}`}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary" />
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
                Nomor Sedang Dilayani
              </p>
              <div className="w-full max-w-sm bg-bg-muted-box border border-border-default h-28 flex items-center justify-center rounded-3xl shadow-inner">
                <span
                  className={`text-6xl md:text-7xl font-black tracking-tighter ${isAdminTutup || isSistemTerkunci ? "text-text-muted/30" : "text-brand-primary"}`}
                >
                  {nomorAktif}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
                <Button
                  variant="secondary"
                  onClick={handleRecall}
                  disabled={isAdminTutup || isCalling || isSistemTerkunci}
                  className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 py-0 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Volume2
                    size={24}
                    className={isCalling ? "animate-ping" : ""}
                  />
                  <span className="text-[11px] uppercase tracking-wider">
                    Panggil Ulang
                  </span>
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={
                    isAdminTutup ||
                    daftarSelanjutnya.length === 0 ||
                    isCalling ||
                    isSistemTerkunci
                  }
                  className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl shadow-lg shadow-brand-primary/20 scale-105 py-0 font-black disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRightCircle size={28} />
                  <span className="text-[11px] uppercase tracking-wider">
                    Panggil Selanjutnya
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSkip}
                  disabled={
                    isAdminTutup ||
                    nomorAktif === "—" ||
                    isCalling ||
                    isSistemTerkunci
                  }
                  className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 py-0 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <PauseCircle size={24} />
                  <span className="text-[11px] uppercase tracking-wider">
                    Lewati (Hold)
                  </span>
                </Button>
              </div>
            </Card>

            <div
              className={`grid grid-cols-2 gap-6 transition-all duration-200 ${isAdminTutup || isSistemTerkunci ? "opacity-60" : ""}`}
            >
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Sisa Antrean
                  </p>
                  <p className="text-xl font-black text-text-main leading-none mt-1">
                    {!isAdminTutup && isAdminLoggedIn ? sisaAntrean : 0} Orang
                  </p>
                </div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                    Estimasi Selesai
                  </p>
                  <p className="text-xl font-black text-text-main leading-none mt-1">
                    ± {!isAdminTutup && isAdminLoggedIn ? sisaAntrean * 3 : 0}{" "}
                    Menit
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <Card
              className={`flex flex-col h-[320px] overflow-hidden transition-all duration-200 ${isAdminTutup || isSistemTerkunci ? "opacity-60" : ""}`}
            >
              <div className="p-4 border-b border-border-default bg-bg-muted-box">
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  Antrean Berikutnya
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                {!isAdminTutup && isAdminLoggedIn ? (
                  <>
                    {nomorAktif !== "—" && (
                      <div className="flex items-center justify-between p-3 rounded-xl border border-brand-primary/30 bg-brand-primary/5 w-full">
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-primary text-white">
                            1
                          </span>
                          <span className="text-xs font-bold text-brand-primary">
                            Aktif Dilayani
                          </span>
                        </div>
                        <span className="text-sm font-black text-brand-primary tracking-tight">
                          {nomorAktif}
                        </span>
                      </div>
                    )}
                    {(() => {
                      const angkaAktif = nomorAktif !== "—"
                        ? parseInt(nomorAktif.split("-")[1], 10)
                        : 0;
                      const filtered = daftarSelanjutnya.filter((nomor) => {
                        const angkaNomor = parseInt(nomor.split("-")[1], 10);
                        return angkaNomor > angkaAktif;
                      });
                      const displayList = nomorAktif !== "—" ? filtered : daftarSelanjutnya;
                      return displayList.length > 0 ? (
                        displayList.map((nomor, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-xl border border-border-default bg-bg-main/50 opacity-75 w-full"
                          >
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-border-default text-text-muted">
                                {nomorAktif !== "—" ? index + 2 : index + 1}
                              </span>
                              <span className="text-xs font-semibold text-text-muted">
                                Nomor Tiket
                              </span>
                            </div>
                            <span className="text-sm font-black text-text-muted tracking-tight">
                              {nomor}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                          <div className="w-10 h-10 rounded-full bg-border-default flex items-center justify-center text-text-muted">
                            <ChevronRight size={20} />
                          </div>
                          <p className="text-[11px] font-medium text-text-muted">
                            Daftar Tunggu Kosong
                          </p>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-border-default flex items-center justify-center text-text-muted">
                      <ChevronRight size={20} />
                    </div>
                    <p className="text-[11px] font-medium text-text-muted">
                      {isSistemTerkunci
                        ? "Sesi Terkunci"
                        : "Daftar Tunggu Kosong"}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card
              className={`flex flex-col h-[280px] overflow-hidden transition-all duration-200 ${isAdminTutup || isSistemTerkunci ? "opacity-60" : ""}`}
            >
              <div className="p-4 border-b border-border-default bg-amber-500/5">
                <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                  Daftar Lewati (Hold)
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                {!isAdminTutup &&
                daftarDilewati.length > 0 &&
                isAdminLoggedIn ? (
                  daftarDilewati.map((ticket, index) => (
                    <div
                      key={ticket.id || index}
                      className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5"
                    >
                      <span className="text-sm font-black text-amber-700 tracking-tight">
                        {ticket.nomor_display}
                      </span>
                      <button
                        onClick={() => handlePanggilDilewati(ticket)}
                        disabled={isSistemTerkunci}
                        className="text-[10px] font-bold underline bg-transparent border-0 text-amber-600 hover:text-amber-800 cursor-pointer disabled:opacity-40"
                      >
                        Panggil Sekarang
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <p className="text-[10px] font-medium text-text-muted">
                      {isSistemTerkunci
                        ? "Sesi Terkunci"
                        : "Tidak ada nomor dilewati"}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* MODALS WINDOW SYSTEM */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Konfirmasi Status Operasional"
        showCloseButton={true}
      >
        <div className="space-y-4 py-1 text-center">
          <p className="text-xs text-text-muted leading-relaxed">
            Apakah Anda yakin ingin{" "}
            <span className="font-black text-text-main">
              {!isAdminTutup ? "MENUTUP" : "MEMBUKA"}
            </span>{" "}
            operasional layanan{" "}
            <span className="font-black text-brand-primary">
              {namaTampilanKonter}
            </span>{" "}
            saat ini?
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              className="py-2 text-xs font-bold rounded-xl border border-border-default bg-transparent text-text-main hover:bg-bg-muted-box"
            >
              Batalkan
            </Button>
            <Button
              onClick={handleConfirmStatusToggle}
              className={`py-2 text-xs font-black text-white rounded-xl border-0 ${!isAdminTutup ? "bg-danger hover:bg-danger-hover" : "bg-success hover:bg-success-hover"}`}
            >
              Ya, Ubah Status
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLoketMasihBukaModal}
        onClose={() => setShowLoketMasihBukaModal(false)}
        title="Loket Masih Aktif"
        showCloseButton={true}
      >
        <div className="space-y-4 py-1 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto">
            <Power size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-main">
              Tutup Loket Terlebih Dahulu
            </p>
            <p className="text-[11px] text-text-muted px-4 leading-normal">
              Status loket <span className="font-black text-brand-primary">{loketInfo.nama}</span> masih <span className="font-black text-success">BUKA</span>. Silakan tutup loket terlebih dahulu sebelum keluar dari sistem.
            </p>
          </div>
          <div className="w-full pt-2">
            <Button
              variant="primary"
              onClick={() => setShowLoketMasihBukaModal(false)}
              className="py-2 text-xs font-bold"
            >
              Mengerti
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        title="Pindah Meja Tugas Loket"
      >
        <div className="space-y-3 py-1">
          <p className="text-[11px] text-text-muted text-center leading-normal">
            Pilih meja loket baru Anda. Sistem akan otomatis memindahkan kontrol
            antrean aktif tanpa mengeluarkan sesi akun Anda.
          </p>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {listLoketTugas
              .filter((l) => l.id !== loketInfo.id)
              .map((meja) => {
                const adminProfileData = JSON.parse(sessionStorage.getItem("adminProfileData") || "{}");
                const isDipakai = meja.id_staf_aktif !== null && meja.id_staf_aktif !== adminProfileData.id;
                const isMejaTujuanTutup = meja.status === "tutup" || meja.status === "Tutup";

                return (
                  <button
                    key={meja.id}
                    type="button"
                    onClick={() => !isDipakai && handleSwitchLoket(meja)}
                    disabled={isDipakai}
                    className={`w-full flex items-center justify-between p-3.5 text-left rounded-xl border ${
                      isDipakai
                        ? "border-amber-500/20 opacity-60 cursor-not-allowed"
                        : "border-border-default hover:bg-brand-primary/5 hover:border-brand-primary/20 active:scale-[0.99]"
                    } transition-all cursor-pointer text-text-main group select-none ${isMejaTujuanTutup || isDipakai ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-black">
                        {meja.kode_loket}
                      </div>
                      <span className="text-xs font-bold">
                        {meja.nama_loket} ({meja.layanan?.nama_layanan || "\u2014"})
                      </span>
                      {isDipakai && (
                        <Badge variant="warning" className="shrink-0 scale-90">Dipakai</Badge>
                      )}
                      {isMejaTujuanTutup && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider scale-90">
                          Tutup
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-all">
                      Pilih →
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </Modal>

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
            <p className="text-xs font-bold text-text-main">
              Apakah Anda Yakin Ingin Keluar?
            </p>
            <p className="text-[11px] text-text-muted px-4 leading-normal">
              Tindakan ini akan memutuskan{" "}
              <span className="font-black text-danger">KENDALI PENUH</span> sesi
              akun Anda secara aman dari sistem aplikasi pelayanan.
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 cursor-pointer rounded-xl border border-border-default bg-transparent py-2 text-xs font-bold text-text-muted transition-all hover:bg-bg-main"
            >
              Batal
            </button>
            <button
              onClick={handleAdminLogout}
              className="flex-1 border-0 bg-danger py-2 text-xs font-black text-white transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ya, Keluar Akun</span>
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
