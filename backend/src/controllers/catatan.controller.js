const prisma = require('../config/db');
const { logActivity } = require('../services/activityLog.service');

// GET semua kegiatan + status notulen, untuk Daftar Kegiatan & Dashboard
exports.getAllKegiatan = async (req, res) => {
  try {
    const kegiatan = await prisma.agendaKegiatan.findMany({
      include: { notulen: true, rencanaLanjutan: true },
      orderBy: { tanggalMulai: 'desc' },
    });
    res.json(kegiatan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data kegiatan' });
  }
};

// GET statistik dashboard
exports.getStats = async (req, res) => {
  try {
    const totalKegiatan = await prisma.agendaKegiatan.count();
    const denganNotulen = await prisma.notulen.count();
    const tanpaNotulen = totalKegiatan - denganNotulen;
    const denganLanjutan = await prisma.rencanaLanjutan.count();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const baru = await prisma.agendaKegiatan.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    res.json({ totalKegiatan, baru, denganNotulen, tanpaNotulen, denganLanjutan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};

// GET detail 1 kegiatan lengkap dengan notulen & rencana lanjutan
exports.getKegiatanById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const kegiatan = await prisma.agendaKegiatan.findUnique({
      where: { id },
      include: {
        peserta: { include: { user: true } },
        notulen: true,
        rencanaLanjutan: true,
      },
    });
    if (!kegiatan) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    res.json(kegiatan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil detail kegiatan' });
  }
};

// POST simpan notulen baru (otomatis terkunci setelah disimpan)
exports.simpanNotulen = async (req, res) => {
  try {
    const agendaId = parseInt(req.params.id);
    const { catatan } = req.body;
    const file = req.file ? req.file.filename : null;

    if (!catatan || !catatan.trim()) {
      return res.status(400).json({ message: 'Catatan kegiatan wajib diisi' });
    }

    const existing = await prisma.notulen.findUnique({ where: { agendaId } });
    if (existing) {
      return res.status(400).json({ message: 'Notulen untuk kegiatan ini sudah ada' });
    }

    const notulen = await prisma.notulen.create({
      data: { agendaId, catatan, file, terkunci: true },
    });

    const agenda = await prisma.agendaKegiatan.findUnique({ where: { id: agendaId } });
    await logActivity(req.user.nama, req.user.role, `mengisi notulen kegiatan: ${agenda?.acara || ''}`, req.user.id);

    res.status(201).json({ message: 'Notulen berhasil disimpan dan dikunci', notulen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan notulen' });
  }
};

// PUT minta edit notulen (set flag requestEdit, catat alasan)
exports.mintaEditNotulen = async (req, res) => {
  try {
    const agendaId = parseInt(req.params.id);
    const { alasan } = req.body;

    if (!alasan || !alasan.trim()) {
      return res.status(400).json({ message: 'Jelaskan bagian yang perlu diperbaiki' });
    }

    const notulen = await prisma.notulen.update({
      where: { agendaId },
      data: { requestEdit: true, alasanEdit: alasan },
    });

    await logActivity(req.user.nama, req.user.role, `meminta edit notulen (agenda ID: ${agendaId})`, req.user.id);

    res.json({ message: 'Permintaan edit telah dikirim', notulen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengirim permintaan edit' });
  }
};

// POST simpan rencana tindak lanjut
exports.simpanRencanaLanjutan = async (req, res) => {
  try {
    const agendaId = parseInt(req.params.id);
    const { uraian, pic, deadline } = req.body;

    if (!uraian || !uraian.trim()) {
      return res.status(400).json({ message: 'Uraian tindak lanjut wajib diisi' });
    }

    const existing = await prisma.rencanaLanjutan.findUnique({ where: { agendaId } });
    if (existing) {
      return res.status(400).json({ message: 'Rencana lanjutan untuk kegiatan ini sudah ada' });
    }

    const lanjutan = await prisma.rencanaLanjutan.create({
      data: { agendaId, uraian, pic: pic || null, deadline: deadline ? new Date(deadline) : null },
    });

    res.status(201).json({ message: 'Rencana tindak lanjut berhasil disimpan', lanjutan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan rencana lanjutan' });
  }
};