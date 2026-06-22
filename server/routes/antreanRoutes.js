import express from 'express';
import { 
  ambilAntreanBaru, 
  panggilAntrean, 
  batalAntrean,
  getAntreanMonitor,
  lewatiAntrean,
  panggilAntreanLewati
} from '../controllers/antreanController.js';

const router = express.Router();

router.post('/ambil', ambilAntreanBaru);
router.patch('/batal', batalAntrean);
router.get('/monitor', getAntreanMonitor);
router.patch('/panggil', panggilAntrean);
router.patch('/lewati', lewatiAntrean);
router.patch('/panggil-dilewati', panggilAntreanLewati);

export default router;