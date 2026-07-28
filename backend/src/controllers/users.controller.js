const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const { logActivity } = require('../services/activityLog.service');
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, nama: true, role: true, bidang: true, noWa: true },
      orderBy: { nama: 'asc' },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, nama, role, bidang, noWa } = req.body;

    if (!username || !password || !nama || !role) {
      return res.status(400).json({ message: 'Username, password, nama, dan role wajib diisi' });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, passwordHash, nama, role, bidang, noWa },
      select: { id: true, username: true, nama: true, role: true, bidang: true, noWa: true },
    });

await logActivity(req.user.nama,req.user.role, `Menambahkan peserta baru: ${nama}`, req.user.id);
res.status(201).json({ message: 'Peserta berhasil ditambahkan', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan peserta' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, nama, role, bidang, noWa } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username wajib diisi' });
    }

    // cek apakah username sudah dipakai user lain (selain dirinya sendiri)
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== id) {
      return res.status(400).json({ message: 'Username sudah digunakan oleh peserta lain' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { username, nama, role, bidang, noWa },
      select: { id: true, username: true, nama: true, role: true, bidang: true, noWa: true },
    });

    await logActivity(req.user.nama,req.user.role, `Memperbarui data peserta: ${nama}`, req.user.id);
res.json({ message: 'Peserta berhasil diperbarui', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui peserta' });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userLama = await prisma.user.findUnique({ where: { id } });
    await prisma.user.delete({ where: { id } });
    await logActivity(req.user.nama, `Menghapus peserta: ${userLama?.nama || '(tidak diketahui)'}`, req.user.id);
    res.json({ message: 'Peserta berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus peserta' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    await logActivity(req.user.nama,req.user.role, `Mereset password untuk: ${targetUser?.nama || '(tidak diketahui)'}`, req.user.id);
    res.json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mereset password' });
  }
};