const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { logActivity } = require('../services/activityLog.service');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
  { id: user.id, username: user.username, nama: user.nama, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);
    await logActivity(user.nama, user.role, 'login ke sistem', user.id);

    // Jangan kirim passwordHash ke frontend
    const { passwordHash, ...userData } = user;

    res.json({
      message: 'Login berhasil',
      token,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const { passwordHash, ...userData } = user;
    res.json({ user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};