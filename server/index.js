import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import layananRoutes from './routes/layananRoutes.js';
import antreanRoutes from './routes/antreanRoutes.js';
import authRoutes from './routes/authRoutes.js';
import loketRoutes from './routes/loketRoutes.js';
import { initBroadcast } from './config/broadcast.js';

dotenv.config();

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

initBroadcast();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rute Cek Kesehatan
app.get('/', (req, res) => {
  res.json({ message: 'Server Antrean UNSAP Berhasil Menyala! 🚀' });
});

// Pendaftaran Seluruh Jalur API Utama
app.use('/api/layanan', layananRoutes);
app.use('/api/antrean', antreanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loket', loketRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack || err.message || err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server.' });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` SERVER MENYALA DI PORT: ${PORT}          `);
  console.log(` Link Lokal: http://localhost:${PORT}      `);
  console.log(`=========================================`);
});