import express from 'express';
import { 
  ambilAntreanBaru, 
  panggilAntrean, 
  batalAntrean,
  getAntreanMonitor,
  lewatiAntrean,
  panggilAntreanLewati
} from '../controllers/antreanController.js';
import { authenticateToken, authorizeStaf, authorizeMahasiswa } from '../middleware/auth.js';

const router = express.Router();

router.post('/ambil', authenticateToken, authorizeMahasiswa, ambilAntreanBaru);
router.patch('/batal', authenticateToken, batalAntrean);
router.get('/monitor', getAntreanMonitor);
router.patch('/panggil', authenticateToken, authorizeStaf, panggilAntrean);
router.patch('/lewati', authenticateToken, authorizeStaf, lewatiAntrean);
router.patch('/panggil-dilewati', authenticateToken, authorizeStaf, panggilAntreanLewati);

export default router;