const prisma = require('../config/db');
const { logActivity } = require('../services/activityLog.service');

// GET dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalSuratMasuk = await prisma.suratMasuk.count();
    const menungguDisposisi = await prisma.suratMasuk.count({ where: { disposisi: { none: {} } } });
    const sedangProses = await prisma.disposisi.count({
      where: { tindakLanjut: { is: null } },
    });
    const selesai = await prisma.tindakLanjut.count({ where: { hasilVerifikasi: 'selesai' } });
    const belumDitindaklanjuti = await prisma.disposisi.count({
      where: { tindakLanjut: { is: null } },
    });

    res.json({ totalSuratMasuk, menungguDisposisi, sedangProses, selesai, belumDitindaklanjuti });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};

// GET semua surat (dengan filter status untuk Rekap Belum/Selesai)
exports.getAllSurat = async (req, res) => {
  try {
    const surat = await prisma.suratMasuk.findMany({
      include: {
        disposisi: {
          include: { delegasi: true, tindakLanjut: true },
        },
        createdBy: { select: { nama: true } },
      },
      orderBy: { tglTerima: 'desc' },
    });
    res.json(surat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data surat' });
  }
};

// GET detail 1 surat
exports.getSuratById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const surat = await prisma.suratMasuk.findUnique({
      where: { id },
      include: {
        lampiran: true,
        disposisi: {
          include: {
            delegasi: true,
            tindakLanjut: true,
            createdBy: { select: { nama: true } },
          },
        },
        createdBy: { select: { nama: true } },
      },
    });
    if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.json(surat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil detail surat' });
  }
};

// POST buat surat masuk baru
exports.createSurat = async (req, res) => {
  try {
    const {
      tglTerima, tglSurat, noSurat, hal, asalSurat, sifat,
      deadlineTindakLanjut, keteranganAdmin, status,
    } = req.body;

    const lastSurat = await prisma.suratMasuk.findFirst({ orderBy: { noUrut: 'desc' } });
    const noUrut = (lastSurat?.noUrut || 0) + 1;

    const fileUtama = req.file ? req.file.filename : null;

    const surat = await prisma.suratMasuk.create({
      data: {
        noUrut,
        tglTerima: new Date(tglTerima),
        tglSurat: new Date(tglSurat),
        noSurat: noSurat || null,
        hal,
        asalSurat,
        sifat: sifat || '(-) Tidak ada',
        fileUtama,
        deadlineTindakLanjut: deadlineTindakLanjut ? new Date(deadlineTindakLanjut) : null,
        keteranganAdmin: keteranganAdmin || null,
        status: status || 'submitted',
        createdById: req.user.id,
      },
    });

    await logActivity(req.user.nama, req.user.role, `menambahkan surat masuk: ${hal}`, req.user.id);

    res.status(201).json({ message: 'Surat masuk berhasil disimpan', surat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan surat masuk' });
  }
};

// POST buat disposisi untuk 1 surat
exports.createDisposisi = async (req, res) => {
  try {
    const suratId = parseInt(req.params.id);
    const { instruksi, instruksiTambahan, uraian, deadline, bidangTujuan } = req.body;

    if ((!instruksi || instruksi.length === 0) && !instruksiTambahan) {
      return res.status(400).json({ message: 'Pilih minimal 1 instruksi disposisi atau isi instruksi tambahan' });
    }
    if (!bidangTujuan || bidangTujuan.length === 0) {
      return res.status(400).json({ message: 'Pilih minimal 1 bidang tujuan' });
    }

    const disposisi = await prisma.disposisi.create({
      data: {
        suratId,
        instruksi: JSON.stringify(instruksi || []),
        instruksiTambahan: instruksiTambahan || null,
        uraian: uraian || null,
        deadline: deadline ? new Date(deadline) : null,
        bidangTujuan: JSON.stringify(bidangTujuan),
        createdById: req.user.id,
      },
    });

    await prisma.suratMasuk.update({
      where: { id: suratId },
      data: { status: 'proses' },
    });

    const surat = await prisma.suratMasuk.findUnique({ where: { id: suratId } });
    await logActivity(req.user.nama, req.user.role, `mendisposisikan surat: ${surat?.hal || ''}`, req.user.id);

    res.status(201).json({ message: 'Disposisi berhasil disimpan', disposisi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan disposisi' });
  }
};

// GET surat yang relevan untuk role/bidang user yang login
exports.getSuratUntukSaya = async (req, res) => {
  try {
    const { role, bidang } = req.user;

    const rolesLihatSemua = ['Admin', 'Kadis', 'Sekdis', 'Pengelola Surat'];

    if (rolesLihatSemua.includes(role)) {
      const surat = await prisma.suratMasuk.findMany({
        include: {
          disposisi: { include: { delegasi: true, tindakLanjut: true } },
        },
        orderBy: { tglTerima: 'desc' },
      });
      return res.json(surat);
    }

    const semuaSurat = await prisma.suratMasuk.findMany({
      include: {
        disposisi: { include: { delegasi: true, tindakLanjut: true } },
      },
      orderBy: { tglTerima: 'desc' },
    });

    const suratRelevan = semuaSurat.filter((surat) =>
      surat.disposisi.some((d) => {
        const bidangList = JSON.parse(d.bidangTujuan || '[]');
        return bidangList.includes(bidang);
      })
    );

    res.json(suratRelevan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data surat' });
  }
};