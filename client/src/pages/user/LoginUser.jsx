import React from "react";
import { Eye, EyeOff, ArrowLeft, GraduationCap, Lock } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import useLoginUser from "../../hooks/user/useLoginUser";

export default function LoginUser() {
  const {
    nim,
    setNim,
    tanggalLahir,
    setTanggalLahir,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleLogin,
    showGoogleModal,
    setShowGoogleModal,
    selectGoogleAccount,
    navigate,
  } = useLoginUser();

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* ORNAMEN BACKGROUND */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOMBOL KEMBALI */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-brand-primary transition-colors cursor-pointer bg-transparent border-0"
      >
        <ArrowLeft size={14} /> Kembali ke Beranda
      </button>

      {/* KARTU UTAMA LOGIN */}
      <div className="w-full max-w-md z-10">
        <Card className="p-8 border border-border-default bg-bg-surface shadow-xl rounded-2xl flex flex-col space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto shadow-sm">
              <GraduationCap size={24} />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-tight text-text-main">
                Sistem Informasi Unsap Terintegrasi
              </h1>
              <p className="text-xs text-text-muted">
                Aplikasi layanan akademik untuk Civitas Akademika Universitas
                Sebelas April.
              </p>
            </div>
          </div>

          {/* NOTIFIKASI ERROR */}
          {error && (
            <div className="p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            {/* FORM INPUT MANUAL */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* INPUT NIM */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  NIM
                </label>
                <Input
                  type="text"
                  icon={GraduationCap}
                  placeholder="Contoh: 2341xxxx"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                />
              </div>

              {/* INPUT TANGGAL LAHIR (PERBAIKAN: Mengunci struktur tombol mata internal boks) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Tanggal Lahir (YYYYMMDD)
                </label>
                <div className="relative flex items-center w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="••••••••"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    maxLength={8}
                    className="pr-10" // Beri ruang napas di kanan agar teks sandi tidak menabrak ikon mata
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-text-muted hover:text-text-main transition-colors cursor-pointer bg-transparent border-0 p-0 z-10 flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-text-muted pl-1">
                  *Gunakan format TahunBulanTanggal lahir kamu.
                </p>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Masuk →</span>
                  )}
                </Button>
              </div>
            </form>

            {/* SEPARATOR */}
            <div className="relative flex items-center justify-center mt-5 mb-5">
              <div className="w-full border-b border-border-default" />
              <span className="absolute bg-bg-surface px-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Atau
              </span>
            </div>

            {/* OPSI LOGIN INSTITUSI */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border-default bg-transparent hover:bg-bg-main active:scale-[0.98] transition-all duration-200 cursor-pointer text-text-main text-sm font-semibold rounded-xl select-none"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.56 1.77 14.97 1 12 1 7.35 1 3.37 3.65 1.39 7.5l3.85 2.99c.92-2.75 3.49-4.75 6.76-4.75z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.48z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.79c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.39 7.28C.5 9.07 0 11.08 0 13s.5 3.93 1.39 5.72l3.85-2.93z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.9 1.08-3.27 0-5.84-2-6.76-4.75L.79 16.5C3.37 20.35 7.35 23 12 23z"
                  />
                </svg>
                <span>Masuk dengan Google</span>
              </button>
              <p className="text-center text-[10px] text-text-muted">
                Gunakan akun institusi resmi{" "}
                <span className="font-semibold text-brand-primary">
                  @unsap.ac.id
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* POP-UP MODAL SIMULASI GOOGLE */}
      <Modal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        title="Pilih akun untuk melanjutkan ke Queue System UNSAP"
      >
        <div className="space-y-2">
          <button
            onClick={() => selectGoogleAccount("daffa.rhamadhani@unsap.ac.id")}
            className="w-full flex items-center gap-3 p-3 text-left rounded-xl border border-border-default bg-transparent hover:bg-bg-main active:scale-[0.99] transition-all cursor-pointer text-text-main select-none"
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold shrink-0">
              A
            </div>
            <div className="truncate">
              <p className="text-xs font-bold leading-tight">
                Adhitya Daffa Rhamadhani
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                daffa.rhamadhani@unsap.ac.id
              </p>
            </div>
          </button>

          <button
            onClick={() => selectGoogleAccount("23410001@student.unsap.ac.id")}
            className="w-full flex items-center gap-3 p-3 text-left rounded-xl border border-border-default bg-transparent hover:bg-bg-main active:scale-[0.99] transition-all cursor-pointer text-text-main select-none"
          >
            <div className="w-8 h-8 rounded-full bg-slate-500/10 border border-border-default flex items-center justify-center text-text-muted text-xs font-bold shrink-0">
              M
            </div>
            <div className="truncate">
              <p className="text-xs font-bold leading-tight">
                Mahasiswa UNSAP (NIM)
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                23410001@student.unsap.ac.id
              </p>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
