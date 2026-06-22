# TODO - Integrasi End-to-End Queue System (Frontend-Backend-Supabase)

## Step 0 — Baseline & pemetaan kebutuhan

- [x] Audit kode utama di client & server (status loket, transisi antrean, auth, keamanan)
- [ ] Verifikasi skema tabel di Supabase (kolom `antrean.nomor_loket`, tabel loket/status, tabel auth staf)

## Step 1 — Sinkronisasi status loket Buka/Tutup

- [ ] Tambah endpoint backend: `PATCH /api/loket/status` (atau sesuai struktur tabel Anda)
- [ ] Implementasi di controller untuk update status loket di Supabase
- [ ] Update `useDashboardAdmin.handleConfirmStatusToggle` supaya fetch ke endpoint baru
- [ ] Update monitor/user UI supaya membaca status loket dari backend/DB yang sama

## Step 2 — Konsistensi field `nomor_loket`

- [ ] Pastikan `ambilAntreanBaru` mengisi `nomor_loket` saat insert antrean
- [ ] Pastikan `panggilAntrean` / `panggilAntreanLewati` tidak bergantung pada kolom yang bisa null
- [ ] Kaji apakah kolom `nomor_loket` seharusnya diisi saat insert atau saat status dipanggil

## Step 3 — Proteksi endpoint admin

- [ ] Minimal: validasi server-side menggunakan token/secret admin sederhana (sementara untuk seminar)
  - (atau gunakan Supabase RLS jika sudah tersedia)
- [ ] Pastikan semua endpoint admin (`/antrean/monitor` jika sensitif, `/panggil`, `/lewati`, dll) terlindungi

## Step 4 — Keamanan password

- [ ] Implementasi hashing password staf & mahasiswa (bcrypt)
- [ ] Update proses login untuk membandingkan hash

## Step 5 — Pengujian end-to-end

- [ ] Jalur mahasiswa:
  - login → ambil antrean → batal antrean
- [ ] Jalur admin:
  - buka/tutup loket → panggil selanjutnya → lewati (hold) → panggil dilewati
- [ ] Jalur monitor:
  - sinkron angka aktif & daftar tunggu konsisten saat status loket berubah

## Step 6 — GitHub PR (tanpa `gh`)

- [ ] Buat branch `blackboxai/<timestamp>`
- [ ] Commit changes dengan message yang jelas
- [ ] Push branch
- [ ] Pandu pembuatan Pull Request melalui web GitHub
