import express from 'express';
import { loginStaf, loginMahasiswa, logoutStaf } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Jalur URL POST Staf: http://localhost:3000/api/auth/login
router.post('/login', loginStaf);

// Jalur URL POST Mahasiswa: http://localhost:3000/api/auth/login-mahasiswa
router.post('/login-mahasiswa', loginMahasiswa);

// Jalur URL POST Logout: http://localhost:3000/api/auth/logout
router.post('/logout', authenticateToken, logoutStaf);

export default router;