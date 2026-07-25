const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'admin', password: 'admin123', nama: 'Budi Santoso', role: 'Admin', bidang: 'Sekretariat', noWa: '081234567001' },
    { username: 'kadis', password: 'kadis123', nama: 'Ir. Hendra Wijaya', role: 'Kadis', bidang: 'Pimpinan', noWa: '081234567002' },
    { username: 'sekdis', password: 'sekdis123', nama: 'Siti Aminah', role: 'Sekdis', bidang: 'Sekretariat', noWa: '081234567003' },
    { username: 'pengelola', password: 'pengelola123', nama: 'Rina Marlina', role: 'Pengelola Surat', bidang: 'Sekretariat', noWa: '081234567004' },
    { username: 'kabid', password: 'kabid123', nama: 'Rudi Hartono', role: 'Kepala Bidang', bidang: 'Pengadaan Tanah', noWa: '081234567005' },
    { username: 'pelaksana', password: 'pelaksana123', nama: 'Ahmad Fauzi', role: 'Pelaksana', bidang: 'Penatagunaan Tanah', noWa: '081234567006' },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        passwordHash,
        nama: u.nama,
        role: u.role,
        bidang: u.bidang,
        noWa: u.noWa,
      },
    });
    console.log(`✓ User dibuat: ${u.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });