-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `bidang` VARCHAR(191) NULL,
    `noWa` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgendaKegiatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NULL,
    `jamMulai` VARCHAR(191) NOT NULL,
    `jamSelesai` VARCHAR(191) NULL,
    `acara` TEXT NOT NULL,
    `tempat` VARCHAR(191) NOT NULL,
    `undanganDari` VARCHAR(191) NOT NULL,
    `fileUndangan` VARCHAR(191) NULL,
    `keterangan` TEXT NULL,
    `createdById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgendaPeserta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agendaId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuratMasuk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `noUrut` INTEGER NOT NULL,
    `tglTerima` DATETIME(3) NOT NULL,
    `tglSurat` DATETIME(3) NOT NULL,
    `noSurat` VARCHAR(191) NULL,
    `hal` TEXT NOT NULL,
    `asalSurat` VARCHAR(191) NOT NULL,
    `sifat` VARCHAR(191) NOT NULL DEFAULT '(-) Tidak ada',
    `fileUtama` VARCHAR(191) NULL,
    `deadlineTindakLanjut` DATETIME(3) NULL,
    `keteranganAdmin` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuratLampiran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `suratId` INTEGER NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disposisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `suratId` INTEGER NOT NULL,
    `instruksi` TEXT NOT NULL,
    `instruksiTambahan` TEXT NULL,
    `uraian` TEXT NULL,
    `deadline` DATETIME(3) NULL,
    `bidangTujuan` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delegasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `disposisiId` INTEGER NOT NULL,
    `pelaksanaIds` TEXT NOT NULL,
    `dikerjakanLangsung` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KegiatanInternal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `acara` VARCHAR(191) NOT NULL,
    `tempat` VARCHAR(191) NOT NULL,
    `peserta` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notulen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kegiatanId` INTEGER NOT NULL,
    `catatan` TEXT NOT NULL,
    `file` VARCHAR(191) NULL,
    `terkunci` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Notulen_kegiatanId_key`(`kegiatanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RencanaLanjutan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kegiatanId` INTEGER NOT NULL,
    `uraian` TEXT NOT NULL,
    `pic` VARCHAR(191) NULL,
    `deadline` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RencanaLanjutan_kegiatanId_key`(`kegiatanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AgendaKegiatan` ADD CONSTRAINT `AgendaKegiatan_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgendaPeserta` ADD CONSTRAINT `AgendaPeserta_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `AgendaKegiatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgendaPeserta` ADD CONSTRAINT `AgendaPeserta_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratLampiran` ADD CONSTRAINT `SuratLampiran_suratId_fkey` FOREIGN KEY (`suratId`) REFERENCES `SuratMasuk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Disposisi` ADD CONSTRAINT `Disposisi_suratId_fkey` FOREIGN KEY (`suratId`) REFERENCES `SuratMasuk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegasi` ADD CONSTRAINT `Delegasi_disposisiId_fkey` FOREIGN KEY (`disposisiId`) REFERENCES `Disposisi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notulen` ADD CONSTRAINT `Notulen_kegiatanId_fkey` FOREIGN KEY (`kegiatanId`) REFERENCES `KegiatanInternal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RencanaLanjutan` ADD CONSTRAINT `RencanaLanjutan_kegiatanId_fkey` FOREIGN KEY (`kegiatanId`) REFERENCES `KegiatanInternal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
