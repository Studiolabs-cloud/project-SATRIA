/*
  Warnings:

  - You are about to drop the column `kegiatanId` on the `notulen` table. All the data in the column will be lost.
  - You are about to drop the column `kegiatanId` on the `rencanalanjutan` table. All the data in the column will be lost.
  - You are about to drop the `kegiataninternal` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[agendaId]` on the table `Notulen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[agendaId]` on the table `RencanaLanjutan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agendaId` to the `Notulen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agendaId` to the `RencanaLanjutan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notulen` DROP FOREIGN KEY `Notulen_kegiatanId_fkey`;

-- DropForeignKey
ALTER TABLE `rencanalanjutan` DROP FOREIGN KEY `RencanaLanjutan_kegiatanId_fkey`;

-- DropIndex
DROP INDEX `Notulen_kegiatanId_key` ON `notulen`;

-- DropIndex
DROP INDEX `RencanaLanjutan_kegiatanId_key` ON `rencanalanjutan`;

-- AlterTable
ALTER TABLE `notulen` DROP COLUMN `kegiatanId`,
    ADD COLUMN `agendaId` INTEGER NOT NULL,
    ADD COLUMN `alasanEdit` TEXT NULL,
    ADD COLUMN `requestEdit` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `rencanalanjutan` DROP COLUMN `kegiatanId`,
    ADD COLUMN `agendaId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `kegiataninternal`;

-- CreateIndex
CREATE UNIQUE INDEX `Notulen_agendaId_key` ON `Notulen`(`agendaId`);

-- CreateIndex
CREATE UNIQUE INDEX `RencanaLanjutan_agendaId_key` ON `RencanaLanjutan`(`agendaId`);

-- AddForeignKey
ALTER TABLE `Notulen` ADD CONSTRAINT `Notulen_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `AgendaKegiatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RencanaLanjutan` ADD CONSTRAINT `RencanaLanjutan_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `AgendaKegiatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
