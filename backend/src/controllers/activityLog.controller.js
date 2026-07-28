const prisma = require('../config/db');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil log aktivitas' });
  }
};