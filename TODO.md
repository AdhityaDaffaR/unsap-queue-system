# ✅ INTEGRASI END-TO-END — STATUS: SELESAI

## Step 0 — Baseline & pemetaan kebutuhan

- [x] Audit kode utama di client & server
- [x] Skema tabel Supabase sudah diverifikasi:
  - `antrean`: id, nomor_urut, nomor_display, id_layanan, status, npm_mahasiswa, nomor_loket (null saat insert, diisi saat dipanggil), tanggal_antrean
  - `loket`: id, kode_loket, nama_loket, id_layanan, status
  - `staf`: id, username, password (bcrypt), nama, id_layanan, id_loket
  - `mahasiswa`: id, npm, password (bcrypt), nama
  - `layanan`: id, kode_layanan, nama_layanan

## Step 1 — Sinkronisasi status loket Buka/Tutup

- [x] Endpoint backend: `PATCH /api/loket/status` — sudah ada di `loketController.js`
- [x] Implementasi controller update status di Supabase
- [x] `useDashboardAdmin.handleConfirmStatusToggle` sudah fetch ke endpoint
- [x] Monitor/user UI baca status dari database via `GET /api/loket`

## Step 2 — Konsistensi field `nomor_loket`

- [x] `ambilAntreanBaru` → `nomor_loket = null` saat insert (belum ditugaskan)
- [x] `panggilAntrean` / `panggilAntreanLewati` → `nomor_loket` diisi saat status berubah jadi `dipanggil`
- [x] Kolom `nomor_loket` diisi saat dipanggil (sudah benar)

## Step 3 — Proteksi endpoint admin

- [x] JWT authentication di semua endpoint admin
- [x] `authorizeStaf` middleware di `/panggil`, `/lewati`, `/panggil-dilewati`, `/loket/status`, `/loket/pilih`
- [x] `authorizeMahasiswa` middleware di `/antrean/ambil`
- [x] Ownership check di `batalAntrean` — mahasiswa hanya bisa batal milik sendiri, staf bisa semua

## Step 4 — Keamanan password

- [x] bcrypt hashing untuk password staf & mahasiswa (di `authController.js`)
- [x] Login membandingkan hash

## Step 5 — Pengujian end-to-end

- [x] Jalur mahasiswa: login → ambil antrean → batal antrean (dengan ownership check)
- [x] Jalur admin: buka/tutup loket → panggil selanjutnya → lewati (hold) → panggil dilewati
- [x] Jalur monitor: sinkron angka aktif & daftar tunggu konsisten
- [x] Suara display monitor: broadcast via Realtime Channel + aktivasi user gesture

## ⚠️ Catatan tambahan

- `GET /api/layanan` dan `GET /api/loket/staf/:id_staf` — endpoint tersedia di backend tapi tidak dipakai frontend (tidak kritis, ID layanan di-hardcode di frontend hooks)
- Untuk production, disarankan konsumsi `GET /api/layanan` secara dinamis agar penambahan layanan baru tidak perlu deploy ulang frontend
