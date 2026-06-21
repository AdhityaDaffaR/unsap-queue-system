import express from 'express';
import { getAllLayanan } from '../controllers/layananController.js';

const router = express.Router(); // <-- Gunakan ini saja, lebih aman

// Jalur URL: http://localhost:3000/api/layanan
router.get('/', getAllLayanan);

export default router;