import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'unsap_queue_system_jwt_secret_2026';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login terlebih dahulu.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Sesi Anda telah kadaluarsa. Silakan login ulang.' });
    }
    req.user = decoded;
    next();
  });
};

export const authorizeStaf = (req, res, next) => {
  if (!req.user || req.user.role !== 'staf') {
    return res.status(403).json({ success: false, message: 'Akses khusus petugas loket.' });
  }
  next();
};

export const authorizeMahasiswa = (req, res, next) => {
  if (!req.user || req.user.role !== 'mahasiswa') {
    return res.status(403).json({ success: false, message: 'Akses khusus mahasiswa.' });
  }
  next();
};
