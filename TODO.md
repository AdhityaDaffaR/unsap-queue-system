TODO — PRIORITAS 4: IMPLEMENTASI DESIGN SYSTEM
Latar Belakang
Berdasarkan riset terhadap Linear, Vercel, Stripe, dan shadcn/ui, aplikasi kita perlu design system agar:
1. Tidak ada ukuran acak — saat ini ada text-[9px], text-[10px], text-[11px] campur aduk di 8+ file
2. Komponen punya variant — Button cuma 2 variant (primary/secondary), Card cuma wrapper tanpa struktur
3. Interaksi konsisten — active scale masih 0.95/0.97/0.98 campur aduk
4. Shadow & rounded punya sistem — saat ini shadow dan rounded dipakai tanpa aturan jelas
5. Kode lebih maintainable — ganti raw <button> dengan <Button variant="...">
FASE 1: index.css — Design Tokens
Lokasi: client/src/index.css
Tujuan: Semua nilai visual (ukuran font, shadow, rounded, animasi) jadi 1 sumber kebenaran.
Tambahkan setelah baris 32 (sebelum komentar "KONDISI DEFAULT"):
/* ───── TIPOGRAFI SCALE ───── */
/* 
  Mengapa?
  - text-[11px], text-[10px], text-[9px] dipakai 84+ kali di seluruh app
  - Tidak ada yang bisa bedain mana caption, mana body, mana tiny
  - Solusi: semantic classes → .text-h1 sampai .text-nano
  - Mulai dari 28px (h1) sampe 10px (nano), setiap level punya nama jelas
*/
@layer components {
  .text-h1 {
    font-size: 1.75rem;    /* 28px */
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  .text-h2 {
    font-size: 1.5rem;     /* 24px */
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.015em;
  }
  .text-h3 {
    font-size: 1.25rem;    /* 20px */
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }
  .text-h4 {
    font-size: 1.125rem;   /* 18px */
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: -0.005em;
  }
  .text-body {
    font-size: 0.875rem;   /* 14px */
    font-weight: 500;
    line-height: 1.5;
  }
  .text-caption {
    font-size: 0.8125rem;  /* 13px */  → menggantikan text-[11px] (11px terlalu kecil, 13px lebih terbaca)
    font-weight: 500;
    line-height: 1.4;
  }
  .text-tiny {
    font-size: 0.75rem;    /* 12px */  → menggantikan text-[10px]
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: 0.01em;
  }
  .text-micro {
    font-size: 0.6875rem;  /* 11px */  → menggantikan text-[9px]
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
  .text-nano {
    font-size: 0.625rem;   /* 10px */  → menggantikan text-[8px]
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.03em;
  }
}

/* ───── SHADOW ELEVATION ───── */
/*
  Mengapa?
  - shadow-sm/md/lg/xl/2xl/inner dipakai tanpa aturan
  - Solusi: 4 level semantics → card, dropdown, modal, inset
  - Nilai diambil dari Linear dan shadcn/ui
*/
:root {
  --shadow-card: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-dropdown: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-modal: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-inner: inset 0 1px 2px rgba(0,0,0,0.05);
}

/* ───── ROUNDED SEMANTICS ───── */
/*
  Mengapa?
  - rounded-md/lg/xl/2xl/3xl campur tanpa pola
  - Solusi: 4 nilai → sm untuk button/input, md untuk card, lg untuk modal, full untuk circle
  - Nilai: 8px, 12px, 16px (lebih premium dari tailwind default)
*/
:root {
  --radius-sm: 8px;    /* button, input, badge */
  --radius-md: 12px;   /* card */
  --radius-lg: 16px;   /* modal */
  --radius-full: 9999px; /* avatar, dot */
}

/* ───── ACTIVE SCALE ───── */
/*
  Mengapa?
  - active:scale 0.95/0.97/0.98 campur aduk
  - Solusi: 1 variabel → 0.97 (nilai paling nyaman, hasil riset UX)
*/
:root {
  --active-scale: 0.97;
}

/* ───── ANIMASI ───── */
/*
  Digunakan untuk fade-in konten, menambah kesan premium
*/
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ───── SCROLLBAR CUSTOM ───── */
/*
  Scrollbar tipis dan halus, cocok dengan tema modern
*/
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
FASE 2: Upgrade Komponen
2A: Button.jsx — Variant + Size
Lokasi: client/src/components/ui/Button.jsx
Mengapa:
- Button lama cuma punya primary dan secondary
- Tidak ada size variant → setiap halaman bikin ukuran sendiri pake raw <button>
- Tidak ada variant ghost → tombol navigasi di Navbar pake raw button manual
Tulis ulang jadi:
import { forwardRef } from 'react';

const variants = {
  default: 'bg-brand-primary text-white hover:brightness-110 border border-transparent',
  destructive: 'bg-danger text-white hover:brightness-110 border border-transparent',
  outline: 'bg-transparent text-text-main border border-border-default hover:bg-bg-muted-box',
  ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-bg-main border border-transparent',
};

const sizes = {
  sm: 'h-8 px-3 text-micro gap-1.5',
  default: 'h-10 px-4 text-tiny gap-2',
  lg: 'h-12 px-6 text-caption gap-2.5',
  icon: 'h-8 w-8 p-0',
};

const Button = forwardRef(function Button(
  { children, variant = 'default', size = 'default', type = 'button', disabled = false, className = '', ...props },
  ref
) {
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-[--radius-sm] select-none transition-all duration-150 active:scale-[--active-scale] cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
2B: Card.jsx — Composable
Lokasi: client/src/components/ui/Card.jsx
Mengapa:
- Card lama cuma wrapper <div> dengan styling
- Tidak konsisten: ada Card yang pake padding, ada yang tidak
- Solusi: Card jadi komposable dengan Header, Content, Footer + prop size
Tulis ulang jadi:
export function Card({ children, className = '', size = 'md', ...props }) {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div
      className={`bg-bg-surface border border-border-default rounded-[--radius-md] shadow-[--shadow-card] ${paddings[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`flex items-center gap-3 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-h4 text-text-main ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`flex items-center gap-3 mt-4 pt-4 border-t border-border-default ${className}`}>{children}</div>;
}
Update import di Modal.jsx: Ganti import Card from './Card' jadi:
import { Card } from './Card';
2C: Badge.jsx — Pakai CSS vars + text-nano
Lokasi: client/src/components/ui/Badge.jsx
Mengapa:
- Badge pake text-[10px] langsung, harusnya pake token tipografi
- Warna badge masih hardcoded, padahal di index.css sudah ada --color-badge-*
Ganti jadi:
export default function Badge({ variant = 'success', children, className = '' }) {
  const styles = {
    success: 'bg-badge-success-bg border-badge-success-border text-emerald-600 dark:text-emerald-400',
    danger: 'bg-badge-danger-bg border-badge-danger-border text-rose-600 dark:text-rose-400',
    warning: 'bg-badge-warning-bg border-badge-warning-border text-amber-600 dark:text-amber-400',
    info: 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[--radius-sm] text-nano font-black uppercase tracking-widest border h-6 select-none ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
2D: Input.jsx — Tambah variant prop
Lokasi: client/src/components/ui/Input.jsx
Mengapa:
- Input cuma 1 variant (default), padahal butuh state error
- Biar input merah otomatis kalau error, tanpa perlu className manual
Ganti jadi:
export default function Input({ icon: Icon, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'border-border-default focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
    error: 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20',
  };

  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <span className="absolute left-3.5 text-text-muted pointer-events-none z-10 flex items-center justify-center">
          <Icon size={16} />
        </span>
      )}
      <input 
        {...props}
        className={`w-full h-10 text-caption bg-bg-surface border rounded-[--radius-sm] transition-all duration-150 outline-none font-medium placeholder:text-text-muted/50 text-text-main ${
          Icon ? 'pl-10 pr-4' : 'px-3.5'
        } ${variants[variant]} ${className}`}
      />
    </div>
  );
}
2E: Modal.jsx — Pakai semantic tokens + Button component
Lokasi: client/src/components/ui/Modal.jsx
Mengapa:
- Modal pake shadow-2xl dan rounded-2xl langsung, harusnya pake token
- Tombol close di Modal pake raw <button> dengan styling manual, harusnya pake <Button variant="ghost" size="icon">
Ganti jadi:
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, showCloseButton = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const baseCardStyle = 'border border-border-default bg-bg-surface shadow-[--shadow-modal] rounded-[--radius-lg] relative flex flex-col';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={showCloseButton ? onClose : undefined}
          />
          
          <motion.div 
            className="w-full max-w-sm relative z-10"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          >
            <Card className={baseCardStyle} size="md">
              {title && (
                <div className="text-center pr-6 pl-6">
                  <h3 className="text-h4 text-text-main tracking-tight">{title}</h3>
                </div>
              )}

              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </Button>
              )}

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
FASE 3: Migrasi Tipografi
Mengapa:
- 84 kemunculan text-[*] tersebar di 9 file
- Setelah Fase 1 selesai, kita punya semantic classes: text-caption, text-tiny, text-micro, text-nano
- Ganti semua ukuran arbitrer dengan semantic classes
Mapping:
Sebelum	Sesudah	Penjelasan
text-[11px]	text-caption	(13px) Teks bantuan, label form, navbar links
text-[10px]	text-tiny	(12px) Badge, counter, info kecil
text-[9px]	text-micro	(11px) Label antrean, tag status
text-[8px]	text-nano	(10px) Status indicator kecil
File yang perlu diubah:
1. client/src/pages/user/HomeUser.jsx — 24 kemunculan
2. client/src/pages/admin/DashboardAdmin.jsx — 22 kemunculan
3. client/src/pages/user/DisplayMonitor.jsx — 15 kemunculan
4. client/src/components/shared/Navbar.jsx — 14 kemunculan
5. client/src/pages/user/StatusLoket.jsx — 8 kemunculan
6. client/src/pages/user/LoginUser.jsx — 7 kemunculan
7. client/src/pages/admin/LoginAdmin.jsx — 4 kemunculan
8. client/src/pages/user/Bantuan.jsx — 2 kemunculan
9. client/src/components/shared/Footer.jsx — 1 kemunculan
Cara: Cari text-[ lalu ganti sesuai mapping di atas.
FASE 4: Migrasi Button
Mengapa:
- 5 dari 7 halaman pakai raw <button> (bukan <Button> component)
- Setelah Fase 2A (Button upgrade), kita punya variant: default, destructive, outline, ghost
- Ganti semua raw button yang reusable dengan <Button>
4A: client/src/components/shared/Navbar.jsx — 11 raw button
Lokasi	Fungsi	Ganti jadi
baris 42	Nav "home"	<Button variant="ghost" size="sm">
baris 62	Nav "statusLoket"	<Button variant="ghost" size="sm">
baris 82	Nav "bantuan"	<Button variant="ghost" size="sm">
baris 111	Login/Profile	<Button variant="default" size="sm">
baris 130	Logout	<Button variant="ghost" size="sm">
baris 142	Hamburger menu	<Button variant="outline" size="icon">
baris 155-157	Mobile nav links	<Button variant="ghost" size="sm">
baris 161	Mobile login	<Button variant="default" size="sm">
baris 168	Mobile logout	<Button variant="ghost" size="sm">
Tambahkan import Button from '../ui/Button'; di atas file.
4B: client/src/pages/user/HomeUser.jsx — 7 raw button
Lokasi	Fungsi	Ganti jadi
baris 159	Batalkan antrean	<Button variant="destructive" size="sm">
baris 466	Logout cancel	<Button variant="outline" size="sm">
baris 473	Logout confirm	<Button variant="destructive" size="sm">
baris 503	Auth warning cancel	<Button variant="outline" size="sm">
baris 509	Auth warning login	<Button variant="default" size="sm">
baris 582	Cancel confirm back	<Button variant="outline" size="sm">
baris 588	Cancel confirm yes	<Button variant="destructive" size="sm">
Tambahkan import Button from '../components/ui/Button';.
4C: client/src/pages/admin/DashboardAdmin.jsx — 5 raw button
Lokasi	Fungsi	Ganti jadi
baris 93	Switch counter	<Button variant="outline" size="sm">
baris 351	Panggil dilewati	<Button variant="ghost" size="sm">
baris 519	Logout cancel	<Button variant="outline" size="sm">
baris 525	Logout confirm	<Button variant="destructive" size="sm">
Tambahkan import Button from '../components/ui/Button';.
4D: client/src/pages/admin/LoginAdmin.jsx — 3 raw button
Lokasi	Fungsi	Ganti jadi
baris 56	Back	<Button variant="ghost" size="sm">
baris 117	Password toggle	<Button variant="ghost" size="sm">
baris 162	Batal pilih loket	<Button variant="ghost" size="sm">
4E: client/src/pages/user/LoginUser.jsx — 3 raw button
Lokasi	Fungsi	Ganti jadi
baris 33	Back	<Button variant="ghost" size="sm">
baris 98	Password toggle	<Button variant="ghost" size="sm">
baris 137	Google login	<Button variant="outline" size="default">
FASE 5: Standarisasi Interaksi
Mengapa:
- active:scale masih 0.95, 0.97, 0.98 — harusnya 1 nilai konsisten
- transition-colors dipakai di beberapa tempat, harusnya transition-all duration-150
- hover:bg-brand-primary-hover harusnya hover:brightness-110 (lebih halus)
Cari dan ganti di SEMUA file:
1. active:scale-[0.95] → active:scale-[--active-scale]
2. active:scale-[0.98] → active:scale-[--active-scale]
3. transition-colors (di tombol) → transition-all duration-150
4. hover:bg-brand-primary-hover → hover:brightness-110
FASE 6: Audit Elevasi & Rounded
Mengapa:
- Shadow dan rounded masih campur, tidak ikut sistem yang sudah didefinisikan di Fase 1
Shadow — Cari dan ganti:
Sebelum	Sesudah
shadow-sm	shadow-[--shadow-card]
shadow-md	shadow-[--shadow-dropdown]
shadow-lg / shadow-xl / shadow-2xl (non-modal)	shadow-[--shadow-modal]
shadow-inner	shadow-[--shadow-inner]
Rounded — Cari dan ganti:
Sebelum	Sesudah
rounded-md	rounded-[--radius-sm]
rounded-lg	rounded-[--radius-sm] (sama karena radius-sm = 8px)
rounded-xl	rounded-[--radius-md]
rounded-2xl / rounded-3xl	rounded-[--radius-lg]
Ringkasan File yang Tersentuh
File	Fase
client/src/index.css	1 (+40 baris token)
client/src/components/ui/Button.jsx	2A (tulis ulang)
client/src/components/ui/Card.jsx	2B (tulis ulang)
client/src/components/ui/Badge.jsx	2C (edit)
client/src/components/ui/Input.jsx	2D (edit)
client/src/components/ui/Modal.jsx	2E (edit)
client/src/pages/user/HomeUser.jsx	3, 4B, 5, 6
client/src/pages/admin/DashboardAdmin.jsx	3, 4C, 5, 6
client/src/pages/user/DisplayMonitor.jsx	3, 5, 6
client/src/components/shared/Navbar.jsx	3, 4A, 5, 6
client/src/pages/user/StatusLoket.jsx	3, 5, 6
client/src/pages/user/LoginUser.jsx	3, 4E, 5, 6
client/src/pages/admin/LoginAdmin.jsx	3, 4D, 5, 6
client/src/pages/user/Bantuan.jsx	3
client/src/components/shared/Footer.jsx	3
Total: 15 file, ~300 baris perubahan.
Cara Eksekusi
1. Kerjakan Fase 1 dulu (index.css) — ini fondasi semua fase lain
2. Kerjakan Fase 2 (upgrade komponen) — Button, Card, Badge, Input, Modal
3. Kerjakan Fase 3 (migrasi tipografi) — ganti text-[*] di semua file
4. Kerjakan Fase 4 (migrasi button) — ganti raw <button> dengan <Button>
5. Kerjakan Fase 5 (standarisasi interaksi) — cari dan ganti active-scale, transition
6. Kerjakan Fase 6 (audit shadow & rounded) — ganti shadow/rounded ke token
Setiap selesai 1 fase, run npm run dev dan cek apakah halaman masih berfungsi. Jangan lanjut ke fase berikutnya kalau ada error.