import express from 'express';
import { 
  ambilAntreanBaru, 
  panggilAntrean, 
  batalAntrean,
  getAntreanMonitor // <-- 1. Import fungsi baru di sini
} from '../controllers/antreanController.js';

const router = express.Router();

// JALUR MAHASISWA / KIOS / MONITOR
router.post('/ambil', ambilAntreanBaru);
router.patch('/batal', batalAntrean);
router.get('/monitor', getAntreanMonitor); // <-- 2. Daftarkan rute GET ini

// JALUR ADMIN / STAF
router.patch('/panggil', panggilAntrean);

export default router;