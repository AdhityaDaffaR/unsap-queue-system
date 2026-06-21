import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import layananRoutes from './routes/layananRoutes.js';
import antreanRoutes from './routes/antreanRoutes.js';
import authRoutes from './routes/authRoutes.js'; // <-- 1. Tambah import ini

dotenv.config();

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
app.use('/api/auth', authRoutes); // <-- 2. Tambah registrasi ini

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` SERVER MENYALA DI PORT: ${PORT}          `);
  console.log(` Link Lokal: http://localhost:${PORT}      `);
  console.log(`=========================================`);
});