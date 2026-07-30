/*
  Warnings:

  - Added the required column `createdById` to the `Delegasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Disposisi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `SuratMasuk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delegasi` ADD COLUMN `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `disposisi` ADD COLUMN `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `suratmasuk` ADD COLUMN `createdById` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `TindakLanjut` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `disposisiId` INTEGER NOT NULL,
    `uraianPekerjaan` TEXT NOT NULL,
    `buktiFiles` TEXT NULL,
    `sudahDisubmit` BOOLEAN NOT NULL DEFAULT false,
    `hasilVerifikasi` VARCHAR(191) NULL,
    `catatanVerifikasi` TEXT NULL,
    `createdById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TindakLanjut_disposisiId_key`(`disposisiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuratMasuk` ADD CONSTRAINT `SuratMasuk_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Disposisi` ADD CONSTRAINT `Disposisi_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegasi` ADD CONSTRAINT `Delegasi_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TindakLanjut` ADD CONSTRAINT `TindakLanjut_disposisiId_fkey` FOREIGN KEY (`disposisiId`) REFERENCES `Disposisi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TindakLanjut` ADD CONSTRAINT `TindakLanjut_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
