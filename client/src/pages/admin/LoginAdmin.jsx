
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldAlert,
  User,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal"; 
import Badge from "../../components/ui/Badge";
import useLoginAdmin from "../../hooks/admin/useLoginAdmin";

export default function LoginAdmin() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleAdminLogin,
    showSelectLoketModal,
    setShowSelectLoketModal,
    listLoketTugas,
    handlePilihLoket,
    fetchError,
    fetchLoketList,
    isAdminLoggedIn,
    navigate,
  } = useLoginAdmin();

  // KEMBALI KE ALUR AWAL: Mengarahkan kembali ke Dashboard jika sudah login, atau ke Monitor Utama jika belum
  const handleBackNavigation = () => {
    if (isAdminLoggedIn) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* ORNAMEN BACKGROUND */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOMBOL KEMBALI ANTAR LAYAR */}
      <button
        onClick={handleBackNavigation}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-brand-primary transition-colors cursor-pointer bg-transparent border-0"
      >
        <ArrowLeft size={14} /> 
        <span>{isAdminLoggedIn ? "Kembali ke Dashboard Staff" : "Kembali ke Monitor Utama"}</span>
      </button>

      {/* KARTU UTAMA LOGIN ADMIN */}
      <div className="w-full max-w-md z-10">
        <Card className="p-8 border border-border-default bg-bg-surface shadow-xl rounded-2xl flex flex-col space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto shadow-sm">
              <ShieldAlert size={24} />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-tight text-text-main">
                Portal Log In Staf Pelayanan
              </h1>
              <p className="text-xs text-text-muted">
                Khusus untuk Petugas Loket, Administrator, dan Civitas Akademika internal.
              </p>
            </div>
          </div>

          {/* NOTIFIKASI ERROR */}
          {error && (
            <div className="p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* FORM INPUT UTAMA */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Username Staf
              </label>
              <Input
                type="text"
                icon={User}
                placeholder="Contoh: Admin123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Kata Sandi
              </label>
              <div className="relative flex items-center w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-text-muted hover:text-text-main transition-colors cursor-pointer bg-transparent border-0 p-0 z-10 flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Otorisasi Masuk →</span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* MODAL SELEKSI DINAMIS */}
      <Modal
        isOpen={showSelectLoketModal}
        onClose={() => setShowSelectLoketModal(false)}
        title="Penugasan Operasional Loket"
        showCloseButton={false}
      >
        <div className="space-y-3 py-1">
          <div className="text-center pb-2">
            <p className="text-[11px] text-text-muted leading-normal">
              Otorisasi berhasil. Silakan pilih meja loket tugas Anda hari ini untuk mulai mengendalikan antrean aktif.
            </p>
          </div>

          {fetchError && (
            <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              {fetchError}
              <button
                onClick={() => { fetchLoketList(); }}
                className="ml-2 underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 text-rose-600"
              >
                <RefreshCw size={12} /> Muat Ulang
              </button>
            </div>
          )}

          {listLoketTugas.length === 0 && !fetchError && (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-border-default flex items-center justify-center text-text-muted mx-auto">
                <RefreshCw size={20} className="animate-spin" />
              </div>
              <p className="text-xs text-text-muted mt-3">Memuat daftar loket...</p>
            </div>
          )}

          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
            {listLoketTugas.map((loket) => {
              const isDipakai = loket.id_staf_aktif !== null;
              return (
                <button
                  key={loket.id}
                  type="button"
                  onClick={() => !isDipakai && handlePilihLoket(loket)}
                  disabled={isDipakai}
                  className={`w-full flex items-center justify-between p-3.5 text-left rounded-xl border bg-bg-main/50 transition-all cursor-pointer text-text-main group select-none ${
                    isDipakai
                      ? "border-amber-500/20 opacity-60 cursor-not-allowed"
                      : "border-border-default hover:bg-brand-primary/5 hover:border-brand-primary/20 active:scale-[0.99]"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black shrink-0 ${
                      isDipakai
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                        : "bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
                    }`}>
                      {loket.kode_loket}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold truncate block">
                        {loket.nama_loket}
                      </span>
                      <span className="text-[9px] text-text-muted font-medium">
                        {loket.layanan?.nama_layanan || "—"}
                      </span>
                    </div>
                  </div>
                  {isDipakai ? (
                    <Badge variant="warning" className="shrink-0 scale-90">Dipakai</Badge>
                  ) : (
                    <ArrowRight
                      size={14}
                      className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-brand-primary transition-all shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}