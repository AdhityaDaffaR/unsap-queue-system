import express from 'express';
import { loginStaf, loginMahasiswa } from '../controllers/authController.js';

const router = express.Router();

// Jalur URL POST Staf: http://localhost:3000/api/auth/login
router.post('/login', loginStaf);

// Jalur URL POST Mahasiswa: http://localhost:3000/api/auth/login-mahasiswa
router.post('/login-mahasiswa', loginMahasiswa);

export default router;