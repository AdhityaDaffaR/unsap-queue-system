import express from 'express';
import { getAllLoket, pilihLoket, updateStatusLoket, getLoketByStaf } from '../controllers/loketController.js';
import { authenticateToken, authorizeStaf } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllLoket);
router.get('/staf/:id_staf', getLoketByStaf);
router.patch('/pilih', authenticateToken, authorizeStaf, pilihLoket);
router.patch('/status', authenticateToken, authorizeStaf, updateStatusLoket);

export default router;
