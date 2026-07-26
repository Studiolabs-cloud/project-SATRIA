const prisma = require('../config/db');

// GET semua agenda (dengan jumlah peserta)
exports.getAllAgenda = async (req, res) => {
  try {
    const agenda = await prisma.agendaKegiatan.findMany({
      include: {
        peserta: { include: { user: true } },
        createdBy: { select: { nama: true } },
      },
      orderBy: { tanggalMulai: 'desc' },
    });
    res.json(agenda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data agenda' });
  }
};

// GET agenda hari ini
exports.getAgendaHariIni = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const agenda = await prisma.agendaKegiatan.findMany({
      where: {
        tanggalMulai: { gte: startOfDay, lte: endOfDay },
      },
      include: { peserta: { include: { user: true } } },
    });
    res.json(agenda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil agenda hari ini' });
  }
};

// GET statistik untuk dashboard
exports.getStats = async (req, res) => {
  try {
    const totalSemua = await prisma.agendaKegiatan.count();

    const now = new Date();
    const totalTerkini = await prisma.agendaKegiatan.count({
      where: { tanggalMulai: { gte: now } },
    });

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalBulanIni = await prisma.agendaKegiatan.count({
      where: { tanggalMulai: { gte: startOfMonth, lte: endOfMonth } },
    });

    res.json({ totalSemua, totalTerkini, totalBulanIni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};

// GET detail 1 agenda
exports.getAgendaById = async (req, res) => {
  try {
    const agenda = await prisma.agendaKegiatan.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { peserta: { include: { user: true } }, createdBy: { select: { nama: true } } },
    });
    if (!agenda) return res.status(404).json({ message: 'Agenda tidak ditemukan' });
    res.json(agenda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil detail agenda' });
  }
};

// POST buat agenda baru
exports.createAgenda = async (req, res) => {
  try {
    const {
      tanggalMulai, tanggalSelesai, jamMulai, jamSelesai,
      acara, tempat, undanganDari, keterangan, pesertaIds,
    } = req.body;

    const fileUndangan = req.file ? req.file.filename : null;

    // pesertaIds dikirim dari frontend sebagai JSON string array, misal: "[1,2,3]"
    const parsedPesertaIds = pesertaIds ? JSON.parse(pesertaIds) : [];

    const agenda = await prisma.agendaKegiatan.create({
      data: {
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : null,
        jamMulai,
        jamSelesai: jamSelesai || null,
        acara,
        tempat,
        undanganDari,
        fileUndangan,
        keterangan: keterangan || null,
        createdById: req.user.id,
        peserta: {
          create: parsedPesertaIds.map((userId) => ({ userId: parseInt(userId) })),
        },
      },
      include: { peserta: true },
    });

    res.status(201).json({ message: 'Agenda berhasil dibuat', agenda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membuat agenda' });
  }
};

// PUT update agenda
exports.updateAgenda = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      tanggalMulai, tanggalSelesai, jamMulai, jamSelesai,
      acara, tempat, undanganDari, keterangan,
    } = req.body;

    const dataUpdate = {
      tanggalMulai: new Date(tanggalMulai),
      tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : null,
      jamMulai,
      jamSelesai: jamSelesai || null,
      acara,
      tempat,
      undanganDari,
      keterangan: keterangan || null,
    };

    if (req.file) {
      dataUpdate.fileUndangan = req.file.filename;
    }

    const agenda = await prisma.agendaKegiatan.update({
      where: { id },
      data: dataUpdate,
    });

    res.json({ message: 'Agenda berhasil diperbarui', agenda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui agenda' });
  }
};

// DELETE agenda
exports.deleteAgenda = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // hapus dulu relasi peserta, baru agenda-nya (karena foreign key)
    await prisma.agendaPeserta.deleteMany({ where: { agendaId: id } });
    await prisma.agendaKegiatan.delete({ where: { id } });

    res.json({ message: 'Agenda berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus agenda' });
  }
};