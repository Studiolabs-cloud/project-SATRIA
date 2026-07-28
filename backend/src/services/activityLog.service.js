const prisma = require('../config/db');

async function logActivity(namaUser, role, aktivitas, userId = null) {
  try {
    await prisma.activityLog.create({
      data: { userId, namaUser, role, aktivitas },
    });
  } catch (error) {
    console.error('Gagal mencatat log aktivitas:', error);
  }
}

module.exports = { logActivity };